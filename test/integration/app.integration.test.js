const request = require('supertest');
const app = require('../../src/app');

describe('Application route integration', () => {
  test('IT-001 renders the staff login page', async () => {
    const response = await request(app).get('/login');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Staff Login');
  });

  test('IT-002 renders the public tracking page without authentication', async () => {
    const response = await request(app).get('/track');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Track Your Parcel');
  });

  test('IT-003 rejects a malformed tracking number before database lookup', async () => {
    const response = await request(app)
      .get('/track')
      .query({ trackingNumber: 'NOT-A-TRACKING-NUMBER' });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Please enter a valid tracking number.');
  });

  test.each([
    ['/admin/dashboard', 'administrator dashboard'],
    ['/parcels', 'parcel management'],
    ['/staff', 'delivery staff area'],
  ])('IT-004 redirects unauthenticated access to %s (%s)', async (path) => {
    const response = await request(app).get(path);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  test('IT-005 redirects unauthenticated logout to login', async () => {
    const response = await request(app).post('/logout');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });
});
