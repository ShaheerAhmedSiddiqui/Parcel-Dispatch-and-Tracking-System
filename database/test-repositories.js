
require('dotenv').config();

const pool = require('../src/config/db');
const userRepository = require('../src/repositories/userRepository');
const pricingRepository = require('../src/repositories/pricingRepository');

async function testRepositories() {
    try {
        console.log('\n--- Testing User Repository ---');

        const admin = await userRepository.findByEmail(
            'admin@parcel.test'
        );

        console.log('Admin found:', admin ? admin.full_name : 'Not found');

        const staff = await userRepository.getAllStaff();

        console.log('Active staff profiles:', staff.length);

        console.log('\n--- Testing Pricing Repository ---');

        const standard = await pricingRepository.findByDeliveryType(
            'STANDARD'
        );

        console.log('Standard pricing:', standard);

        const allRules = await pricingRepository.getAll();

        console.log('Total pricing rules:', allRules.length);

    } catch (error) {
        console.error('Repository test failed:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

testRepositories();
