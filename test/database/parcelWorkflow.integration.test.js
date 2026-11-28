const crypto = require('crypto');
const { performance } = require('perf_hooks');
const bcrypt = require('bcryptjs');
const request = require('supertest');

const runDatabaseTests = process.env.RUN_DB_TESTS === 'true';
const databaseDescribe = runDatabaseTests ? describe : describe.skip;

const pool = require('../../src/config/db');
const app = require('../../src/app');
const userRepository = require('../../src/repositories/userRepository');
const parcelRepository = require('../../src/repositories/parcelRepository');
const pricingRepository = require('../../src/repositories/pricingRepository');
const { calculateCharge } = require('../../src/services/chargeCalculator');
const { STATUSES } = require('../../src/services/statusMachine');

const TEST_PASSWORD = process.env.TEST_LOGIN_PASSWORD || 'TestPass123!';

databaseDescribe('ParcelTrack database-backed system workflows', () => {
  let admin;
  let adminAgent;

  beforeAll(async () => {
    if (!/^parcel_db_test(?:_[a-z0-9_]+)?$/i.test(process.env.DB_NAME || '')) {
      throw new Error('Refusing database tests unless DB_NAME starts with parcel_db_test.');
    }

    const [databaseRows] = await pool.query('SELECT DATABASE() AS databaseName');
    expect(databaseRows[0].databaseName).toMatch(/^parcel_db_test/i);

    admin = await userRepository.findByUsername('testadmin');
    expect(admin).toBeTruthy();

    adminAgent = request.agent(app);
    await adminAgent
      .post('/login')
      .send({ identifier: 'testadmin', password: TEST_PASSWORD })
      .expect(302)
      .expect('Location', '/admin/dashboard');
  });

  afterAll(async () => {
    await pool.end();
  });

  async function createStaff(availability = 'AVAILABLE', isActive = true) {
    const suffix = crypto.randomBytes(4).toString('hex');
    const username = `db_rider_${suffix}`;
    const email = `${username}@parcel.test`;

    const [userResult] = await pool.execute(
      `INSERT INTO users
        (full_name, username, email, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, 'DELIVERY_STAFF', ?)`,
      [`Database Test Rider ${suffix}`, username, email, admin.password_hash, isActive]
    );

    const [staffResult] = await pool.execute(
      `INSERT INTO delivery_staff (user_id, phone, availability)
       VALUES (?, ?, ?)`,
      [userResult.insertId, '03000000003', availability]
    );

    return {
      userId: userResult.insertId,
      staffId: staffResult.insertId,
      username,
      email,
    };
  }

  async function registerParcel() {
    const suffix = crypto.randomBytes(4).toString('hex');
    const pricingRule = await pricingRepository.findByDeliveryType('STANDARD');
    const data = {
      senderName: `DB Sender ${suffix}`,
      senderContact: `0300${suffix.replace(/[^0-9]/g, '').padEnd(7, '1').slice(0, 7)}`,
      receiverName: `DB Receiver ${suffix}`,
      receiverContact: '03000000999',
      pickupAddress: 'Synthetic Test Pickup, Sukkur',
      deliveryAddress: 'Synthetic Test Delivery, Karachi',
      weight: '2',
      distance: '5',
      deliveryType: 'STANDARD',
    };

    const quote = calculateCharge({
      weight: data.weight,
      distance: data.distance,
      pricingRule,
    });

    const response = await adminAgent
      .post('/parcels')
      .type('form')
      .send(data)
      .expect(302);

    const match = response.headers.location.match(/^\/parcels\/(\d+)\?success=registered$/);
    expect(match).toBeTruthy();

    const parcelId = Number(match[1]);
    const parcel = await parcelRepository.findById(parcelId);

    expect(parcel.delivery_charge).toBe(quote);
    expect(parcel.current_status).toBe(STATUSES.BOOKED);

    return { parcelId, trackingNumber: parcel.tracking_number, data };
  }

  async function loginStaff(staff) {
    const agent = request.agent(app);
    await agent
      .post('/login')
      .send({ identifier: staff.username, password: TEST_PASSWORD })
      .expect(302)
      .expect('Location', '/staff');
    return agent;
  }

  async function advanceToOutForDelivery(staffAgent, parcelId) {
    await staffAgent
      .post(`/staff/parcels/${parcelId}/status`)
      .send({ status: STATUSES.DISPATCHED })
      .expect(200);
    await staffAgent
      .post(`/staff/parcels/${parcelId}/status`)
      .send({ status: STATUSES.OUT_FOR_DELIVERY })
      .expect(200);
  }

  test('SYS-01 to SYS-05 and SYS-08: roles, quote, registration, assignment, delivery, public tracking', async () => {
    const staff = await createStaff();
    const riderAgent = await loginStaff(staff);

    await adminAgent.get('/admin/dashboard').expect(200);
    await adminAgent.get('/staff').expect(403);
    await riderAgent.get('/staff').expect(200);
    await riderAgent.get('/admin/dashboard').expect(403);

    const pricingCases = [
      ['STANDARD', 135],
      ['EXPRESS', 205],
      ['SAME_DAY', 280],
    ];

    for (const [deliveryType, expectedCharge] of pricingCases) {
      const quoteResponse = await adminAgent
        .post('/parcels/quote')
        .send({ weight: '2', distance: '5', deliveryType })
        .expect(200);
      expect(quoteResponse.body.success).toBe(true);
      expect(quoteResponse.body.data.deliveryCharge).toBe(expectedCharge);
    }

    await pool.execute(
      "DELETE FROM pricing_rules WHERE delivery_type = 'SAME_DAY'"
    );
    const missingPricingResponse = await adminAgent
      .post('/parcels/quote')
      .send({ weight: '2', distance: '5', deliveryType: 'SAME_DAY' })
      .expect(400);
    expect(missingPricingResponse.body.success).toBe(false);
    await pool.execute(
      'INSERT INTO pricing_rules (delivery_type, base_charge, per_kg_rate, per_km_rate) VALUES (?, ?, ?, ?)',
      ['SAME_DAY', 200, 20, 8]
    );

    const created = await registerParcel();
    const secondCreated = await registerParcel();
    expect(created.trackingNumber).toMatch(/^PT-\d{6}$/);
    expect(secondCreated.trackingNumber).toMatch(/^PT-\d{6}$/);
    expect(secondCreated.trackingNumber).not.toBe(created.trackingNumber);

    const bookingHistory = await parcelRepository.getShipmentHistory(created.parcelId);
    expect(bookingHistory.map((entry) => entry.status)).toEqual(['Booked']);
    expect(bookingHistory[0].updated_at).toBeTruthy();

    // Dispatch must be rejected while the parcel is still unassigned.
    const prematureDispatch = await adminAgent
      .post(`/parcels/${created.parcelId}/status`)
      .send({ status: STATUSES.DISPATCHED });
    expect(prematureDispatch.status).not.toBe(200);
    const stillBooked = await parcelRepository.findById(created.parcelId);
    expect(stillBooked.current_status).toBe(STATUSES.BOOKED);
    expect(stillBooked.assigned_staff_id).toBeNull();

    await adminAgent
      .post(`/parcels/${created.parcelId}/assign`)
      .send({ staffId: staff.staffId })
      .expect(200);

    const [busyRows] = await pool.execute(
      'SELECT availability FROM delivery_staff WHERE staff_id = ?',
      [staff.staffId]
    );
    expect(busyRows[0].availability).toBe('BUSY');

    await riderAgent.get(`/staff/parcels/${created.parcelId}`).expect(200);
    await advanceToOutForDelivery(riderAgent, created.parcelId);

    await riderAgent
      .post(`/staff/parcels/${created.parcelId}/status`)
      .send({ status: STATUSES.DELIVERED })
      .expect(200);

    const parcel = await parcelRepository.findById(created.parcelId);
    expect(parcel.current_status).toBe(STATUSES.DELIVERED);

    const [availableRows] = await pool.execute(
      'SELECT availability FROM delivery_staff WHERE staff_id = ?',
      [staff.staffId]
    );
    expect(availableRows[0].availability).toBe('AVAILABLE');

    const history = await parcelRepository.getShipmentHistory(created.parcelId);
    expect(history.map((entry) => entry.status)).toEqual([
      'Booked', 'Assigned', 'Dispatched', 'Out for Delivery', 'Delivered',
    ]);
    expect(history.every((entry) => Boolean(entry.updated_at))).toBe(true);

    const publicTracking = await request(app)
      .get('/track')
      .query({ trackingNumber: created.trackingNumber })
      .expect(200);

    expect(publicTracking.text).toContain(created.trackingNumber);
    expect(publicTracking.text).not.toContain(created.data.senderContact);
    expect(publicTracking.text).not.toContain(created.data.receiverContact);
    expect(publicTracking.text).not.toContain(created.data.senderName);
    expect(publicTracking.text).not.toContain(created.data.receiverName);
    expect(publicTracking.text).not.toContain(created.data.pickupAddress);
    expect(publicTracking.text).not.toContain(created.data.deliveryAddress);
    expect(publicTracking.text).not.toContain('Rs.');

    // Public customers must not be able to mutate a parcel.
    const publicMutation = await request(app)
      .post(`/parcels/${created.parcelId}/status`)
      .send({ status: STATUSES.DELIVERED });
    expect(publicMutation.status).toBe(302);
    expect(publicMutation.headers.location).toBe('/login');

    const afterPublicMutation = await parcelRepository.findById(created.parcelId);
    expect(afterPublicMutation.current_status).toBe(STATUSES.DELIVERED);
  });

  test.each(['BUSY', 'OFF_DUTY'])(
    'SYS-04 / TC-024: rejects a %s staff member during assignment',
    async (availability) => {
      const unavailableStaff = await createStaff(availability);
      const created = await registerParcel();

      const result = await adminAgent
        .post(`/parcels/${created.parcelId}/assign`)
        .send({ staffId: unavailableStaff.staffId });

      expect(result.status).toBe(409);
      expect(result.body.success).toBe(false);

      const parcel = await parcelRepository.findById(created.parcelId);
      expect(parcel.current_status).toBe(STATUSES.BOOKED);
      expect(parcel.assigned_staff_id).toBeNull();
    },
  );

  test('SYS-04: rejects inactive or unknown staff profiles', async () => {
    const inactiveStaff = await createStaff('AVAILABLE', false);
    const created = await registerParcel();

    const inactiveResult = await adminAgent
      .post(`/parcels/${created.parcelId}/assign`)
      .send({ staffId: inactiveStaff.staffId });
    expect(inactiveResult.status).toBe(409);

    const unknownResult = await adminAgent
      .post(`/parcels/${created.parcelId}/assign`)
      .send({ staffId: 99999999 });
    expect(unknownResult.status).toBe(409);

    const parcel = await parcelRepository.findById(created.parcelId);
    expect(parcel.current_status).toBe(STATUSES.BOOKED);
    expect(parcel.assigned_staff_id).toBeNull();
  });

  test('SYS-06: failed-delivery reasons are recorded and the fourth attempt is rejected', async () => {
    const staff = await createStaff();
    const riderAgent = await loginStaff(staff);
    const created = await registerParcel();

    await adminAgent
      .post(`/parcels/${created.parcelId}/assign`)
      .send({ staffId: staff.staffId })
      .expect(200);
    await advanceToOutForDelivery(riderAgent, created.parcelId);

    const emptyReason = await riderAgent
      .post(`/staff/parcels/${created.parcelId}/status`)
      .send({
        status: STATUSES.DELIVERY_FAILED,
        failureReason: '   ',
      });
    expect(emptyReason.status).toBe(400);

    const [attemptsBeforeValidFailure] = await pool.execute(
      'SELECT attempt_id FROM delivery_attempts WHERE parcel_id = ?',
      [created.parcelId]
    );
    expect(attemptsBeforeValidFailure).toHaveLength(0);

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await riderAgent
        .post(`/staff/parcels/${created.parcelId}/status`)
        .send({
          status: STATUSES.DELIVERY_FAILED,
          failureReason: `Synthetic failed attempt ${attempt}`,
        })
        .expect(200);

      if (attempt < 3) {
        await riderAgent
          .post(`/staff/parcels/${created.parcelId}/status`)
          .send({ status: STATUSES.OUT_FOR_DELIVERY })
          .expect(200);
      }
    }

    const attempts = await parcelRepository.getDeliveryAttempts(created.parcelId);
    expect(attempts).toHaveLength(3);
    expect(attempts.map((entry) => entry.attempt_no)).toEqual([1, 2, 3]);

    await riderAgent
      .post(`/staff/parcels/${created.parcelId}/status`)
      .send({ status: STATUSES.OUT_FOR_DELIVERY })
      .expect(200);

    const fourthAttempt = await riderAgent
      .post(`/staff/parcels/${created.parcelId}/status`)
      .send({
        status: STATUSES.DELIVERY_FAILED,
        failureReason: 'Synthetic fourth failed attempt',
      });

    expect(fourthAttempt.status).toBe(400);
    const parcel = await parcelRepository.findById(created.parcelId);
    expect(parcel.attempt_count).toBe(3);
    expect(parcel.current_status).toBe(STATUSES.OUT_FOR_DELIVERY);
  });

  test('SYS-07: return workflow stores completed_at through the normal status endpoint', async () => {
    const staff = await createStaff();
    const riderAgent = await loginStaff(staff);
    const created = await registerParcel();

    await adminAgent
      .post(`/parcels/${created.parcelId}/assign`)
      .send({ staffId: staff.staffId })
      .expect(200);
    await advanceToOutForDelivery(riderAgent, created.parcelId);

    await riderAgent
      .post(`/staff/parcels/${created.parcelId}/status`)
      .send({
        status: STATUSES.DELIVERY_FAILED,
        failureReason: 'Synthetic return workflow failure',
      })
      .expect(200);

    await adminAgent
      .post(`/parcels/${created.parcelId}/return`)
      .send({ reason: 'Synthetic return workflow test' })
      .expect(200);

    await riderAgent
      .post(`/staff/parcels/${created.parcelId}/status`)
      .send({ status: STATUSES.RETURN_IN_TRANSIT })
      .expect(200);

    await riderAgent
      .post(`/staff/parcels/${created.parcelId}/status`)
      .send({ status: STATUSES.RETURNED_TO_SENDER })
      .expect(200);

    const [returnRows] = await pool.execute(
      'SELECT completed_at FROM parcel_returns WHERE parcel_id = ?',
      [created.parcelId]
    );
    expect(returnRows).toHaveLength(1);
    expect(returnRows[0].completed_at).not.toBeNull();

    const parcel = await parcelRepository.findById(created.parcelId);
    expect(parcel.current_status).toBe(STATUSES.RETURNED_TO_SENDER);
  });

  test('SYS-09: concurrent assignments reserve one AVAILABLE staff member only once', async () => {
    const staff = await createStaff();
    const firstParcel = await registerParcel();
    const secondParcel = await registerParcel();

    const assignmentResults = await Promise.all([
      adminAgent
        .post(`/parcels/${firstParcel.parcelId}/assign`)
        .send({ staffId: staff.staffId }),
      adminAgent
        .post(`/parcels/${secondParcel.parcelId}/assign`)
        .send({ staffId: staff.staffId }),
    ]);

    const statuses = assignmentResults.map((result) => result.status).sort();
    expect(statuses).toEqual([200, 409]);

    const firstSaved = await parcelRepository.findById(firstParcel.parcelId);
    const secondSaved = await parcelRepository.findById(secondParcel.parcelId);
    const assignedParcels = [firstSaved, secondSaved].filter(
      (parcel) => parcel.assigned_staff_id === staff.staffId
    );
    expect(assignedParcels).toHaveLength(1);

    const [staffRows] = await pool.execute(
      'SELECT availability FROM delivery_staff WHERE staff_id = ?',
      [staff.staffId]
    );
    expect(staffRows[0].availability).toBe('BUSY');
  });

  test('SYS-09: measures a low-load public tracking response-time baseline', async () => {
    const created = await registerParcel();
    const timings = [];

    for (let sample = 0; sample < 20; sample += 1) {
      const startedAt = performance.now();
      await request(app)
        .get('/track')
        .query({ trackingNumber: created.trackingNumber })
        .expect(200);
      timings.push(performance.now() - startedAt);
    }

    timings.sort((a, b) => a - b);
    const p95Index = Math.ceil(timings.length * 0.95) - 1;
    const p95Milliseconds = Number(timings[p95Index].toFixed(2));
    console.log(`SYS-09 low-load tracking p95: ${p95Milliseconds} ms (20 sequential requests)`);

    expect(p95Milliseconds).toBeLessThan(2000);
  });

  test('SYS-08: public tracking rejects malformed and unknown tracking numbers', async () => {
    const testUser = await userRepository.findByUsername('testadmin');
    expect(testUser.password_hash).not.toBe(TEST_PASSWORD);
    expect(await bcrypt.compare(TEST_PASSWORD, testUser.password_hash)).toBe(true);

    await request(app)
      .get('/track')
      .query({ trackingNumber: 'INVALID-NUMBER' })
      .expect(400);

    await request(app)
      .get('/track')
      .query({ trackingNumber: 'PT-999999' })
      .expect(404);
  });
});
