require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const TEST_DB_NAME = process.env.TEST_DB_NAME || 'parcel_db_test';
const TEST_PASSWORD = process.env.TEST_LOGIN_PASSWORD || 'TestPass123!';

function validateConfiguration() {
    if (!/^parcel_db_test(?:_[a-z0-9_]+)?$/i.test(TEST_DB_NAME)) {
        throw new Error(
            'Safety check failed: TEST_DB_NAME must start with parcel_db_test.'
        );
    }

    if (
        process.env.DB_NAME &&
        process.env.DB_NAME.toLowerCase() === TEST_DB_NAME.toLowerCase()
    ) {
        throw new Error(
            'Safety check failed: TEST_DB_NAME must be different from DB_NAME.'
        );
    }

    if (!process.env.DB_USER) {
        throw new Error('Set DB_USER in .env before running database tests.');
    }
}

async function prepareTestDatabase() {
    validateConfiguration();

    const connectionOptions = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3307),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true,
    };

    const adminConnection = await mysql.createConnection(connectionOptions);

    try {
        // TEST_DB_NAME is restricted to letters, numbers, and underscores above.
        const createDatabaseSql =
            'CREATE DATABASE IF NOT EXISTS ' + TEST_DB_NAME +
            ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
        await adminConnection.query(createDatabaseSql);
    } finally {
        await adminConnection.end();
    }

    const testConnection = await mysql.createConnection({
        ...connectionOptions,
        database: TEST_DB_NAME,
    });

    try {
        const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
        let schema = fs.readFileSync(schemaPath, 'utf8');

        // Apply the schema's table definitions to parcel_db_test rather than
        // following the default CREATE DATABASE / USE parcel_db directives.
        schema = schema
            .replace(/CREATE DATABASE IF NOT EXISTS parcel_db[\s\S]*?;\s*/i, '')
            .replace(/USE parcel_db;\s*/i, '');

        await testConnection.query(schema);

        const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
        const seedUsers = [
            {
                fullName: 'ParcelTrack Test Administrator',
                username: 'testadmin',
                email: 'testadmin@parcel.test',
                role: 'ADMIN',
            },
            {
                fullName: 'ParcelTrack Test Rider',
                username: 'testrider',
                email: 'testrider@parcel.test',
                role: 'DELIVERY_STAFF',
            },
        ];

        for (const user of seedUsers) {
            await testConnection.execute(
                'INSERT INTO users ' +
                '(full_name, username, email, password_hash, role, is_active) ' +
                'VALUES (?, ?, ?, ?, ?, TRUE) ' +
                'ON DUPLICATE KEY UPDATE ' +
                'full_name = VALUES(full_name), ' +
                'password_hash = VALUES(password_hash), ' +
                'role = VALUES(role), ' +
                'is_active = TRUE',
                [
                    user.fullName,
                    user.username,
                    user.email,
                    passwordHash,
                    user.role,
                ]
            );
        }

        const [riderRows] = await testConnection.execute(
            'SELECT user_id FROM users WHERE username = ? LIMIT 1',
            ['testrider']
        );

        await testConnection.execute(
            'INSERT INTO delivery_staff (user_id, phone, availability) ' +
            'VALUES (?, ?, "AVAILABLE") ' +
            'ON DUPLICATE KEY UPDATE ' +
            'phone = VALUES(phone), availability = "AVAILABLE"',
            [riderRows[0].user_id, '03000000002']
        );

        // Synthetic rates for the isolated test database only.
        const testPricing = [
            ['STANDARD', 100, 10, 3],
            ['EXPRESS', 150, 15, 5],
            ['SAME_DAY', 200, 20, 8],
        ];

        for (const [type, base, perKg, perKm] of testPricing) {
            await testConnection.execute(
                'INSERT INTO pricing_rules ' +
                '(delivery_type, base_charge, per_kg_rate, per_km_rate) ' +
                'VALUES (?, ?, ?, ?) ' +
                'ON DUPLICATE KEY UPDATE ' +
                'base_charge = VALUES(base_charge), ' +
                'per_kg_rate = VALUES(per_kg_rate), ' +
                'per_km_rate = VALUES(per_km_rate)',
                [type, base, perKg, perKm]
            );
        }

        console.log('Prepared isolated database: ' + TEST_DB_NAME);
        console.log('Seeded test-only accounts and synthetic pricing rules.');
    } finally {
        await testConnection.end();
    }
}

async function main() {
    try {
        await prepareTestDatabase();
    } catch (error) {
        console.error('Database test setup failed:', error.message);
        process.exitCode = 1;
        return;
    }

    const jestEntry = path.resolve(
        process.cwd(),
        'node_modules',
        'jest',
        'bin',
        'jest.js'
    );

    const result = spawnSync(
        process.execPath,
        [
            jestEntry,
            'test/database/parcelWorkflow.integration.test.js',
            '--runInBand',
            '--coverage=false',
        ],
        {
            stdio: 'inherit',
            env: {
                ...process.env,
                DB_NAME: TEST_DB_NAME,
                RUN_DB_TESTS: 'true',
                TEST_LOGIN_PASSWORD: TEST_PASSWORD,
                SESSION_SECRET: process.env.SESSION_SECRET || 'parceltrack-test-only-secret',
                NODE_ENV: 'test',
            },
        }
    );

    if (result.error) {
        console.error('Could not start database tests:', result.error.message);
        process.exitCode = 1;
    } else {
        process.exitCode = result.status === null ? 1 : result.status;
    }
}

main();
