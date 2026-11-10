const request = require('supertest');
const app = require('../../src/app');

describe('App basics', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET / renders the home page', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Parcel Dispatch and Tracking System');
  });

  test('unknown route returns 404 page', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.text).toContain('does not exist');
  });

  test('unknown route returns 404 page for JSON clients too', async () => {
    const res = await request(app).get('/nope').set('Accept', 'text/html');
    expect(res.status).toBe(404);
  });
});