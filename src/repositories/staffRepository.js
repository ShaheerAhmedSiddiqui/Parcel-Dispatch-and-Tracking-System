const pool = require('../config/db');

async function findStaffIdByUserId(userId) {
    const [rows] = await pool.execute(
        `SELECT staff_id
         FROM delivery_staff
         WHERE user_id = ?
         LIMIT 1`,
        [userId]
    );

    return rows[0]?.staff_id || null;
}

async function getDashboardStats(staffId) {
    const [rows] = await pool.execute(
        `SELECT
            COUNT(*) AS assignedParcels,
            SUM(CASE
                WHEN current_status = 'Out for Delivery' THEN 1
                ELSE 0
            END) AS outForDelivery,
            SUM(CASE
                WHEN current_status = 'Delivered' THEN 1
                ELSE 0
            END) AS deliveredParcels,
            SUM(CASE
                WHEN current_status = 'Delivery Failed' THEN 1
                ELSE 0
            END) AS failedDeliveries
         FROM parcels
         WHERE assigned_staff_id = ?`,
        [staffId]
    );

    const stats = rows[0];

    return {
        assignedParcels: Number(stats.assignedParcels || 0),
        outForDelivery: Number(stats.outForDelivery || 0),
        deliveredParcels: Number(stats.deliveredParcels || 0),
        failedDeliveries: Number(stats.failedDeliveries || 0)
    };
}

async function getStaffParcels(staffId, filters = {}) {
    const conditions = ['p.assigned_staff_id = ?'];
    const params = [staffId];

    if (filters.search) {
        conditions.push(`(
            p.tracking_number LIKE ?
            OR p.receiver_name LIKE ?
            OR p.delivery_address LIKE ?
        )`);

        const search = `%${filters.search.trim()}%`;
        params.push(search, search, search);
    }

    if (filters.status) {
        conditions.push('p.current_status = ?');
        params.push(filters.status);
    }

    const [rows] = await pool.execute(
        `SELECT
            p.parcel_id AS id,
            p.tracking_number AS trackingNumber,
            p.receiver_name AS receiverName,
            p.receiver_contact AS receiverContact,
            p.delivery_address AS deliveryAddress,
            p.delivery_type AS deliveryType,
            p.current_status AS currentStatus,
            p.created_at AS registeredAt,
            p.updated_at AS updatedAt
         FROM parcels p
         WHERE ${conditions.join(' AND ')}
         ORDER BY p.updated_at DESC, p.parcel_id DESC`,
        params
    );

    return rows;
}

async function findAssignedParcel(parcelId, staffId) {
    const [rows] = await pool.execute(
        `SELECT
            p.parcel_id AS id,
            p.tracking_number AS trackingNumber,
            p.sender_name AS senderName,
            p.sender_contact AS senderContact,
            p.receiver_name AS receiverName,
            p.receiver_contact AS receiverContact,
            p.pickup_address AS pickupAddress,
            p.delivery_address AS deliveryAddress,
            p.weight_kg AS weight,
            p.distance_km AS distance,
            p.delivery_type AS deliveryType,
            p.delivery_charge AS deliveryCharge,
            p.current_status AS currentStatus,
            p.attempt_count AS attemptCount,
            p.created_at AS registeredAt,
            p.updated_at AS updatedAt
         FROM parcels p
         WHERE p.parcel_id = ?
           AND p.assigned_staff_id = ?
         LIMIT 1`,
        [parcelId, staffId]
    );

    return rows[0] || null;
}

module.exports = {
    findStaffIdByUserId,
    getDashboardStats,
    getStaffParcels,
    findAssignedParcel
};