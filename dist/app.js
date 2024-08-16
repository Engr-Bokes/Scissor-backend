import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import urlRoutes from './routes/urlRoutes.js';
import authRoutes from './routes/authRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimiter from './middleware/rateLimiter.js';
import { connectRedis } from './utils/redisClient.js'; // Import the connectRedis function
dotenv.config();
const app = express();
// Connect to Redis
connectRedis();
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Use env variable for frontend URL
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(rateLimiter); // Apply rate limiter middleware globally
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://Chibuokem:BokesCrush1@firstcluster.mfzoh4u.mongodb.net/scissor?retryWrites=true&w=majority&appName=FirstCluster';
mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds socket timeout
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// API Routes
app.use('/api', urlRoutes);
app.use('/auth', authRoutes);
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error('An error occurred:', err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});
// 404 Handling
app.use((_req, res, _next) => {
    res.status(404).json({ message: 'Route not found' });
});
export default app;
//# sourceMappingURL=app.js.map