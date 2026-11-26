
require('dotenv').config();

const pool = require('../src/config/db');
const parcelRepository = require('../src/repositories/parcelRepository');
const userRepository = require('../src/repositories/userRepository');

async function testParcelRepository() {
    try {
        const admin = await userRepository.findByEmail(
            'admin@parcel.test'
        );

        if (!admin) {
            throw new Error('Admin account not found.');
        }

        const parcel = await parcelRepository.createParcel(
            {
                sender_name: 'Test Sender',
                sender_contact: '03001234567',
                receiver_name: 'Test Receiver',
                receiver_contact: '03007654321',
                pickup_address: 'Sukkur, Pakistan',
                delivery_address: 'Karachi, Pakistan',
                weight: 2,
                distance: 450,
                delivery_type: 'STANDARD',
                delivery_charge: 4750
            },
            admin.user_id
        );

        console.log('\nParcel registered successfully!');
        console.log('Parcel ID:', parcel.parcelId);
        console.log('Tracking Number:', parcel.trackingNumber);
        console.log('Status:', parcel.currentStatus);
        console.log('Charge:', parcel.deliveryCharge);

        const foundParcel = await parcelRepository.findByTrackingNumber(
            parcel.trackingNumber
        );

        console.log('\nParcel retrieval test:',
            foundParcel ? 'PASSED' : 'FAILED'
        );

        const history = await parcelRepository.getShipmentHistory(
            parcel.parcelId
        );

        console.log('Initial history records:', history.length);

    } catch (error) {
        console.error('Test failed:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

testParcelRepository();
