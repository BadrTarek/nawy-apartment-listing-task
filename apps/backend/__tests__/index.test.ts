import request from 'supertest';
import express from 'express';
// Import or define the Express app
const app = express();
app.get('/', (req, res) => {
    res.send('Hello from Node.js Backend!');
});

describe('Backend API', () => {
    it('GET / should return a greeting', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello from Node.js Backend!');
    });
});