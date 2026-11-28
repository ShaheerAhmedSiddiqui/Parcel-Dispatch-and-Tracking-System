
const pool = require('../config/db');

async function findByEmail(email) {
    const [rows] = await pool.execute(
        `SELECT
            user_id,
            full_name,
            username,
            email,
            password_hash,
            role,
            is_active
         FROM users
         WHERE email = ?
         LIMIT 1`,
        [email]
    );

    return rows[0] || null;
}

async function findByUsername(username) {
    const [rows] = await pool.execute(
        `SELECT
            user_id,
            full_name,
            username,
            email,
            password_hash,
            role,
            is_active
         FROM users
         WHERE username = ?
         LIMIT 1`,
        [username]
    );

    return rows[0] || null;
}

async function findById(userId) {
    const [rows] = await pool.execute(
        `SELECT
            user_id,
            full_name,
            username,
            email,
            role,
            is_active
         FROM users
         WHERE user_id = ?
         LIMIT 1`,
        [userId]
    );

    return rows[0] || null;
}

async function getAllStaff() {
    const [rows] = await pool.execute(
        `SELECT
            ds.staff_id,
            ds.user_id,
            u.full_name,
            u.email,
            ds.phone,
            ds.availability
         FROM delivery_staff ds
         INNER JOIN users u ON u.user_id = ds.user_id
         WHERE u.role = 'DELIVERY_STAFF'
           AND u.is_active = TRUE
         ORDER BY u.full_name ASC`
    );

    return rows;
}

async function getAvailableStaff() {
    const [rows] = await pool.execute(
        `SELECT
            ds.staff_id,
            ds.user_id,
            u.full_name,
            u.email,
            ds.phone,
            ds.availability
         FROM delivery_staff ds
         INNER JOIN users u ON u.user_id = ds.user_id
         WHERE u.role = 'DELIVERY_STAFF'
           AND u.is_active = TRUE
           AND ds.availability = 'AVAILABLE'
         ORDER BY u.full_name ASC`
    );

    return rows;
}

module.exports = {
    findByEmail,
    findByUsername,
    findById,
    getAllStaff,
    getAvailableStaff
};
