import mongoose from 'mongoose';
import { connectRedis, disconnectRedis } from './src/utils/redisClient';
import dotenv from 'dotenv';
import { beforeAll, afterAll } from '@jest/globals';


dotenv.config();

beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/scissor-test';
    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
    });
    await connectRedis();
});

afterAll(async () => {
    await mongoose.connection.close();
    await disconnectRedis();
});
