import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url'; // Import these to define __dirname in ES module
import urlRoutes from './routes/urlRoutes.js';
import authRoutes from './routes/authRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectRedis } from './utils/redisClient.js';
import { limiter, configureApp } from './middleware/rateLimiter.js';
dotenv.config();
// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
configureApp(app);
await connectRedis();
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(limiter);
app.use(express.static(path.join(__dirname, 'views')));
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://Chibuokem:BokesCrush1@firstcluster.mfzoh4u.mongodb.net/scissor?retryWrites=true&w=majority&appName=FirstCluster';
mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use('/api', urlRoutes);
app.use('/auth', authRoutes);
// Enhanced error handling middleware
app.use((err, req, res, next) => {
    console.error('An error occurred:', err.stack);
    res.status(500).redirect(`/error.html?status=500&message=${encodeURIComponent(err.message)}`);
});
app.use((req, res) => {
    res.status(404).redirect('/error.html?status=404&message=Route%20not%20found');
});
export default app;
//# sourceMappingURL=app.js.map