import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import urlRoutes from './routes/urlRoutes';
import authRoutes from './routes/authRoutes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectRedis } from './utils/redisClient';
import { limiter, configureApp, rateLimiter } from './middleware/rateLimiter';
import { redirectToOriginalUrl } from './controllers/urlController'; // Import the redirect controller

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

configureApp(app);

await connectRedis();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'https://scissorurl.hostless.app',
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

app.use('/api', urlRoutes); // Keep the API routes under /api
app.use('/auth', authRoutes);

// Apply rate limiter and handle the shortened URL redirection without the /api prefix
app.get('/:code', rateLimiter(50, 1), redirectToOriginalUrl); // 50 requests per minute

// Enhanced error handling middleware for 500 errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('An error occurred:', err.stack);
    res.status(500).redirect(`/error.html?status=500&message=${encodeURIComponent(err.message)}`);
});

// 404 Handling - Ensure this is after all routes
app.use((req, res) => {
    res.status(404).redirect('/error.html?status=404&message=Route%20not%20found');
});

export default app;
