import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { disconnectRedis, connectRedis } from '../utils/redisClient';
import jwt from 'jsonwebtoken';
import { UrlModel } from '../models/urlModel';
import { UserModel } from '../models/userModel';
// Set timeout for Jest
jest.setTimeout(60000); // 60 seconds timeout
// Function to generate JWT token for authenticated requests
const generateAuthToken = (userId) => {
    const payload = { id: userId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
// Run before all tests - setup Redis and MongoDB connections
beforeAll(async () => {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI); // Ensure MongoDB is connected
    }
    await connectRedis(); // Ensure Redis is connected
    // Clean up the database before starting the tests
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
// Run after all tests - clean up and close connections
afterAll(async () => {
    // Clean up the database after tests
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
    await mongoose.connection.close();
    await disconnectRedis(); // Gracefully close Redis connection
});
describe('URL Shortening API', () => {
    let testUserId;
    let authToken;
    beforeAll(async () => {
        const testUser = new UserModel({
            username: 'testuser',
            email: `test+${Date.now()}@example.com`, // Use a unique email for each test run
            password: 'password'
        });
        await testUser.save();
        testUserId = testUser._id.toString(); // Convert ObjectId to string
        authToken = generateAuthToken(testUserId);
    });
    it('should shorten a URL and return a QR code', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ originalUrl: 'https://example.com' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('shortUrl');
        expect(response.body).toHaveProperty('qrCode');
        const urlInDb = await UrlModel.findOne({ shortUrl: response.body.shortUrl });
        expect(urlInDb).not.toBeNull();
        expect(urlInDb?.originalUrl).toBe('https://example.com');
        expect(urlInDb?.user.toString()).toBe(testUserId);
    });
    it('should return 400 for an invalid URL', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ originalUrl: 'invalid-url' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid URL');
    });
    it('should return 401 for unauthorized access', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .send({ originalUrl: 'https://example.com' });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('No token provided, authorization denied');
    });
    it('should fetch URL analytics for a valid code', async () => {
        const url = new UrlModel({
            originalUrl: 'https://example.com',
            shortUrl: 'http://localhost:8000/testcode',
            urlCode: 'testcode',
            user: testUserId,
        });
        await url.save();
        const response = await request(app)
            .get(`/api/testcode/analytics`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('originalUrl', 'https://example.com');
        expect(response.body).toHaveProperty('shortUrl', 'http://localhost:8000/testcode');
        expect(response.body).toHaveProperty('clicks', 0);
    });
});
//# sourceMappingURL=urlController.test.js.map