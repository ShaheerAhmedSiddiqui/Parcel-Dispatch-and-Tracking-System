
require('dotenv').config();

const pool = require('../src/config/db');

async function testConnection() {
    try {
        const connection = await pool.getConnection();

        console.log('MySQL connection successful!');

        const [rows] = await connection.query(
            'SELECT DATABASE() AS databaseName'
        );

        console.log('Connected database:', rows[0].databaseName);

        const [tables] = await connection.query('SHOW TABLES');

        console.log('Tables found:');
        tables.forEach(table => {
            console.log(Object.values(table)[0]);
        });

        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

testConnection();
