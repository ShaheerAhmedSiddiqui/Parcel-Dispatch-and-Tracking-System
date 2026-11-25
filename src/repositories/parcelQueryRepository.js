
const pool = require('../config/db');

async function getParcelList(filters = {}) {
    const page = Math.max(1, Number.parseInt(filters.page, 10) || 1);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    const params = [];

    if (filters.search) {
        conditions.push(`(
            p.tracking_number LIKE ?
            OR p.sender_name LIKE ?
            OR p.receiver_name LIKE ?
        )`);

        const search = `%${filters.search.trim()}%`;
        params.push(search, search, search);
    }

    if (filters.status) {
        conditions.push('p.current_status = ?');
        params.push(filters.status);
    }

    if (filters.deliveryType) {
        conditions.push('p.delivery_type = ?');
        params.push(filters.deliveryType);
    }

    if (filters.staffId) {
        conditions.push('p.assigned_staff_id = ?');
        params.push(filters.staffId);
    }

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const [countRows] = await pool.execute(
        `SELECT COUNT(*) AS total
         FROM parcels p
         ${whereClause}`,
        params
    );

    const totalRecords = Number(countRows[0].total);
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    const [rows] = await pool.execute(
        `SELECT
            p.parcel_id AS id,
            p.tracking_number AS trackingNumber,
            p.receiver_name AS receiverName,
            p.delivery_type AS deliveryType,
            p.delivery_charge AS deliveryCharge,
            p.current_status AS currentStatus,
            p.created_at AS registeredAt,
            p.assigned_staff_id AS assignedStaffId,
            u.full_name AS assignedStaffName
         FROM parcels p
         LEFT JOIN delivery_staff ds
            ON ds.staff_id = p.assigned_staff_id
         LEFT JOIN users u
            ON u.user_id = ds.user_id
         ${whereClause}
         ORDER BY p.created_at DESC, p.parcel_id DESC
         LIMIT ? OFFSET ?`,
        [...params, pageSize, offset]
    );

    return {
        parcels: rows,
        pagination: {
            currentPage: page,
            totalPages,
            totalRecords,
            pageSize
        }
    };
}

async function getAssignedStaff(parcelId) {
    const [rows] = await pool.execute(
        `SELECT
            ds.staff_id AS staffId,
            u.user_id AS userId,
            u.full_name AS fullName,
            u.email,
            ds.phone,
            ds.availability
         FROM parcels p
         INNER JOIN delivery_staff ds
            ON ds.staff_id = p.assigned_staff_id
         INNER JOIN users u
            ON u.user_id = ds.user_id
         WHERE p.parcel_id = ?
         LIMIT 1`,
        [parcelId]
    );

    return rows[0] || null;
}

// Admin dashboard statistics
async function getAdminDashboardStats() {
    const [rows] = await pool.execute(
        `SELECT
            COUNT(*) AS totalParcels,

            SUM(
                CASE WHEN current_status = 'Booked'
                THEN 1 ELSE 0 END
            ) AS bookedParcels,

            SUM(
                CASE WHEN current_status IN (
                    'Dispatched',
                    'Out for Delivery',
                    'Return Initiated',
                    'Return in Transit'
                )
                THEN 1 ELSE 0 END
            ) AS inTransitParcels,

            SUM(
                CASE WHEN current_status = 'Delivered'
                THEN 1 ELSE 0 END
            ) AS deliveredParcels

         FROM parcels`
    );

    const result = rows[0];

    return {
        totalParcels: Number(result.totalParcels || 0),
        bookedParcels: Number(result.bookedParcels || 0),
        inTransitParcels: Number(result.inTransitParcels || 0),
        deliveredParcels: Number(result.deliveredParcels || 0)
    };
}

// Latest five registered parcels
async function getRecentParcels() {
    const [rows] = await pool.execute(
        `SELECT
            p.parcel_id AS id,
            p.tracking_number AS trackingNumber,
            p.receiver_name AS receiverName,
            p.delivery_type AS deliveryType,
            p.created_at AS registeredAt,
            p.current_status AS currentStatus

         FROM parcels p
         ORDER BY p.created_at DESC, p.parcel_id DESC
         LIMIT 5`
    );

    return rows;
}

module.exports = {
    getParcelList,
    getAssignedStaff,
    getAdminDashboardStats,
    getRecentParcels
};
