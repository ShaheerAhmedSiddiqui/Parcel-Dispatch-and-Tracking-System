
const pool = require('../config/db');

async function findByDeliveryType(deliveryType) {
    const [rows] = await pool.execute(
        `SELECT
            rule_id,
            delivery_type,
            base_charge,
            per_kg_rate,
            per_km_rate,
            updated_at
         FROM pricing_rules
         WHERE delivery_type = ?
         LIMIT 1`,
        [deliveryType]
    );

    return rows[0] || null;
}

async function getAll() {
    const [rows] = await pool.execute(
        `SELECT
            rule_id,
            delivery_type,
            base_charge,
            per_kg_rate,
            per_km_rate,
            updated_at
         FROM pricing_rules
         ORDER BY rule_id ASC`
    );

    return rows;
}

module.exports = {
    findByDeliveryType,
    getAll
};
