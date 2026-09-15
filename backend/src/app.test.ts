import { app } from './app';
import { pool } from './config/db';
import request from 'supertest';

describe('GET /health', function() {
    it('responds with json', function() {
        return request(app)
            .get('/health')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.status).toEqual('ok');
            });
    });
});

// Coupe les connections en pooling avec les DB Neon
// pour éviter une erreur console Jest à la fin des tests
afterAll(async () => {
    await pool.end();
});