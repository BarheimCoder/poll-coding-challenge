process.env.PORT = '5001'; // Use a different port for testing
const request = require('supertest');
const app = require('./index'); // Adjust the import based on your app's entry point

describe('Poll API', () => {
  // Simple health check test
  it('should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

