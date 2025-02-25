const request = require('supertest');
const app = require('./app');
const { closePool } = require('./db');

describe('Poll API', () => {
  afterAll(async () => {
    await closePool();
  });

  it('should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
