const pool = require('../config/db');
const crypto = require('crypto');
const { generateTrackingNumber } = require('../services/trackingNumber');
const {
    STATUSES,
    validateTransition
} = require('../services/statusMachine');

const MAX_DELIVERY_ATTEMPTS = 3;

// --------------------------------------------------
// 1. REGISTER A PARCEL
// --------------------------------------------------

async function createParcel(parcelData, createdBy) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Use a temporary unique value until the parcel ID is generated.
        const temporaryTrackingNumber =
            `TMP${crypto.randomBytes(10).toString('hex').toUpperCase()}`;

        const [result] = await connection.execute(
            `INSERT INTO parcels (
                tracking_number,
                sender_name,
                sender_contact,
                receiver_name,
                receiver_contact,
                pickup_address,
                delivery_address,
                weight_kg,
                distance_km,
                delivery_type,
                delivery_charge,
                current_status,
                created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                temporaryTrackingNumber,
                parcelData.sender_name,
                parcelData.sender_contact,
                parcelData.receiver_name,
                parcelData.receiver_contact,
                parcelData.pickup_address,
                parcelData.delivery_address,
                parcelData.weight,
                parcelData.distance,
                parcelData.delivery_type,
                parcelData.delivery_charge,
                STATUSES.BOOKED,
                createdBy
            ]
        );

        const parcelId = result.insertId;
        const trackingNumber = generateTrackingNumber(parcelId);

        await connection.execute(
            `UPDATE parcels
             SET tracking_number = ?
             WHERE parcel_id = ?`,
            [trackingNumber, parcelId]
        );

        await connection.execute(
            `INSERT INTO shipment_history
                (parcel_id, status, remarks, updated_by)
             VALUES (?, ?, ?, ?)`,
            [
                parcelId,
                STATUSES.BOOKED,
                'Parcel registered successfully.',
                createdBy
            ]
        );

        await connection.commit();

        return {
            parcelId,
            trackingNumber,
            currentStatus: STATUSES.BOOKED,
            deliveryCharge: parcelData.delivery_charge
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

// --------------------------------------------------
// 2. FIND PARCELS
// --------------------------------------------------

async function findByTrackingNumber(trackingNumber) {
    const [rows] = await pool.execute(
        `SELECT *
         FROM parcels
         WHERE tracking_number = ?
         LIMIT 1`,
        [trackingNumber]
    );

    return rows[0] || null;
}

async function findById(parcelId) {
    const [rows] = await pool.execute(
        `SELECT *
         FROM parcels
         WHERE parcel_id = ?
         LIMIT 1`,
        [parcelId]
    );

    return rows[0] || null;
}

async function getShipmentHistory(parcelId) {
    const [rows] = await pool.execute(
        `SELECT
            sh.history_id,
            sh.status,
            sh.remarks,
            sh.updated_at,
            u.full_name AS updated_by_name
         FROM shipment_history sh
         INNER JOIN users u ON u.user_id = sh.updated_by
         WHERE sh.parcel_id = ?
         ORDER BY sh.updated_at ASC, sh.history_id ASC`,
        [parcelId]
    );

    return rows;
}

// --------------------------------------------------
// 3. ASSIGN DELIVERY STAFF
// --------------------------------------------------

async function assignStaff(parcelId, staffId, updatedBy) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [parcels] = await connection.execute(
            `SELECT parcel_id, current_status
             FROM parcels
             WHERE parcel_id = ?
             FOR UPDATE`,
            [parcelId]
        );

        const parcel = parcels[0];

        if (!parcel) {
            throw new Error('Parcel not found.');
        }

        if (parcel.current_status !== STATUSES.BOOKED) {
            throw new Error('Only booked parcels can be assigned.');
        }

        const [staffRows] = await connection.execute(
            `SELECT ds.staff_id
             FROM delivery_staff ds
             INNER JOIN users u ON u.user_id = ds.user_id
             WHERE ds.staff_id = ?
               AND u.role = 'DELIVERY_STAFF'
               AND u.is_active = TRUE
               AND ds.availability = 'AVAILABLE'
             FOR UPDATE`,
            [staffId]
        );

        if (!staffRows[0]) {
            const error = new Error('Available delivery staff member not found.');
            error.status = 409;
            throw error;
        }

        const [availabilityUpdate] = await connection.execute(
            `UPDATE delivery_staff
             SET availability = 'BUSY'
             WHERE staff_id = ?
               AND availability = 'AVAILABLE'`,
            [staffId]
        );

        if (availabilityUpdate.affectedRows !== 1) {
            const error = new Error('Delivery staff member is no longer available.');
            error.status = 409;
            throw error;
        }

        await connection.execute(
            `UPDATE parcels
             SET assigned_staff_id = ?,
                 current_status = ?
             WHERE parcel_id = ?`,
            [staffId, STATUSES.ASSIGNED, parcelId]
        );

        await connection.execute(
            `INSERT INTO shipment_history
                (parcel_id, status, remarks, updated_by)
             VALUES (?, ?, ?, ?)`,
            [
                parcelId,
                STATUSES.ASSIGNED,
                `Parcel assigned to delivery staff ID ${staffId}.`,
                updatedBy
            ]
        );

        await connection.commit();

        return {
            parcelId,
            assignedStaffId: staffId,
            currentStatus: STATUSES.ASSIGNED
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

// --------------------------------------------------
// 4. UPDATE PARCEL STATUS
// --------------------------------------------------

async function updateStatus(
    parcelId,
    nextStatus,
    updatedBy,
    options = {}
) {
    if (nextStatus === STATUSES.RETURNED_TO_SENDER) {
        return completeReturn(parcelId, updatedBy);
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute(
            `SELECT
                parcel_id,
                current_status,
                assigned_staff_id,
                attempt_count
             FROM parcels
             WHERE parcel_id = ?
             FOR UPDATE`,
            [parcelId]
        );

        const parcel = rows[0];

        if (!parcel) {
            throw new Error('Parcel not found.');
        }

        validateTransition(parcel.current_status, nextStatus);

        const remarks = options.remarks || null;

        let newAttemptCount = parcel.attempt_count;

        if (nextStatus === STATUSES.DELIVERY_FAILED) {
            const failureReason =
                typeof options.failureReason === 'string'
                    ? options.failureReason.trim()
                    : '';

            if (!failureReason) {
                throw new Error(
                    'A failure reason is required for unsuccessful delivery.'
                );
            }

            if (!options.staffId ||
                Number(options.staffId) !== parcel.assigned_staff_id) {
                throw new Error(
                    'Only the assigned delivery staff can record this attempt.'
                );
            }

            newAttemptCount++;

            if (newAttemptCount > MAX_DELIVERY_ATTEMPTS) {
                throw new Error(
                    'Maximum delivery attempts reached. Initiate a parcel return.'
                );
            }

            await connection.execute(
                `INSERT INTO delivery_attempts (
                    parcel_id,
                    staff_id,
                    attempt_no,
                    failure_reason
                ) VALUES (?, ?, ?, ?)`,
                [
                    parcelId,
                    options.staffId,
                    newAttemptCount,
                    failureReason
                ]
            );
        }

        if (
            options.staffId &&
            Number(options.staffId) !== parcel.assigned_staff_id
        ) {
            throw new Error(
                'This parcel is not assigned to the specified staff member.'
            );
        }

        await connection.execute(
            `UPDATE parcels
             SET current_status = ?,
                 attempt_count = ?
             WHERE parcel_id = ?`,
            [nextStatus, newAttemptCount, parcelId]
        );

        await connection.execute(
            `INSERT INTO shipment_history
                (parcel_id, status, remarks, updated_by)
             VALUES (?, ?, ?, ?)`,
            [
                parcelId,
                nextStatus,
                nextStatus === STATUSES.DELIVERY_FAILED
                    ? options.failureReason.trim()
                    : remarks,
                updatedBy
            ]
        );

        const shouldReleaseStaff = Boolean(parcel.assigned_staff_id) && (
            nextStatus === STATUSES.DELIVERED ||
            (
                parcel.current_status === STATUSES.ASSIGNED &&
                nextStatus === STATUSES.BOOKED
            )
        );

        if (shouldReleaseStaff) {
            await connection.execute(
                `UPDATE delivery_staff
                 SET availability = 'AVAILABLE'
                 WHERE staff_id = ?
                   AND availability = 'BUSY'`,
                [parcel.assigned_staff_id]
            );
        }

        await connection.commit();

        return {
            parcelId,
            previousStatus: parcel.current_status,
            currentStatus: nextStatus,
            attemptCount: newAttemptCount
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

// --------------------------------------------------
// 5. GET DELIVERY ATTEMPTS
// --------------------------------------------------

async function getDeliveryAttempts(parcelId) {
    const [rows] = await pool.execute(
        `SELECT
            da.attempt_id,
            da.attempt_no,
            da.attempt_time,
            da.failure_reason,
            u.full_name AS staff_name
         FROM delivery_attempts da
         INNER JOIN delivery_staff ds ON ds.staff_id = da.staff_id
         INNER JOIN users u ON u.user_id = ds.user_id
         WHERE da.parcel_id = ?
         ORDER BY da.attempt_no ASC`,
        [parcelId]
    );

    return rows;
}

// --------------------------------------------------
// 6. INITIATE PARCEL RETURN
// --------------------------------------------------

async function initiateReturn(
    parcelId,
    reason,
    initiatedBy
) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute(
            `SELECT parcel_id, current_status
             FROM parcels
             WHERE parcel_id = ?
             FOR UPDATE`,
            [parcelId]
        );

        const parcel = rows[0];

        if (!parcel) {
            throw new Error('Parcel not found.');
        }

        validateTransition(
            parcel.current_status,
            STATUSES.RETURN_INITIATED
        );

        if (typeof reason !== 'string' || !reason.trim()) {
            throw new Error('A return reason is required.');
        }

        await connection.execute(
            `INSERT INTO parcel_returns
                (parcel_id, initiated_by, reason)
             VALUES (?, ?, ?)`,
            [parcelId, initiatedBy, reason.trim()]
        );

        await connection.execute(
            `UPDATE parcels
             SET current_status = ?
             WHERE parcel_id = ?`,
            [STATUSES.RETURN_INITIATED, parcelId]
        );

        await connection.execute(
            `INSERT INTO shipment_history
                (parcel_id, status, remarks, updated_by)
             VALUES (?, ?, ?, ?)`,
            [
                parcelId,
                STATUSES.RETURN_INITIATED,
                reason.trim(),
                initiatedBy
            ]
        );

        await connection.commit();

        return {
            parcelId,
            currentStatus: STATUSES.RETURN_INITIATED
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

// --------------------------------------------------
// 7. COMPLETE PARCEL RETURN
// --------------------------------------------------

async function completeReturn(parcelId, updatedBy) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute(
            `SELECT parcel_id, current_status, assigned_staff_id
             FROM parcels
             WHERE parcel_id = ?
             FOR UPDATE`,
            [parcelId]
        );

        const parcel = rows[0];

        if (!parcel) {
            throw new Error('Parcel not found.');
        }

        validateTransition(
            parcel.current_status,
            STATUSES.RETURNED_TO_SENDER
        );

        await connection.execute(
            `UPDATE parcel_returns
             SET completed_at = CURRENT_TIMESTAMP
             WHERE parcel_id = ?
               AND completed_at IS NULL`,
            [parcelId]
        );

        const [returnRows] = await connection.execute(
            `SELECT return_id
             FROM parcel_returns
             WHERE parcel_id = ?
               AND completed_at IS NOT NULL`,
            [parcelId]
        );

        if (!returnRows[0]) {
            throw new Error('Parcel return record not found.');
        }

        await connection.execute(
            `UPDATE parcels
             SET current_status = ?
             WHERE parcel_id = ?`,
            [STATUSES.RETURNED_TO_SENDER, parcelId]
        );

        await connection.execute(
            `INSERT INTO shipment_history
                (parcel_id, status, remarks, updated_by)
             VALUES (?, ?, ?, ?)`,
            [
                parcelId,
                STATUSES.RETURNED_TO_SENDER,
                'Parcel successfully returned to sender.',
                updatedBy
            ]
        );

        if (parcel.assigned_staff_id) {
            await connection.execute(
                `UPDATE delivery_staff
                 SET availability = 'AVAILABLE'
                 WHERE staff_id = ?
                   AND availability = 'BUSY'`,
                [parcel.assigned_staff_id]
            );
        }

        await connection.commit();

        return {
            parcelId,
            currentStatus: STATUSES.RETURNED_TO_SENDER
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

module.exports = {
    createParcel,
    findByTrackingNumber,
    findById,
    getShipmentHistory,
    assignStaff,
    updateStatus,
    getDeliveryAttempts,
    initiateReturn,
    completeReturn
};