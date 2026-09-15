import { app } from './app';
import { pool } from './config/db';
import request from 'supertest';

describe('GET /health', function() {
    it('responds with json', function() {
        return request(app)
            .get('/health')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body.status).toEqual('ok');
            })
    });
});

// Coupe les connections en pooling avec les DB Neon
afterAll(async () => {
    await pool.end();
});