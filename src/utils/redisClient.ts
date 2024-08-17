import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://default:CntNvqNcCJwiSFHFIXcIXVOArPpapUVG@junction.proxy.rlwy.net:59640';
console.log(`Connecting to Redis URL: ${redisUrl}`);

const redisClient = createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: retries => Math.min(retries * 50, 2000),
    },
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Failed to connect to Redis', err);
    }
};

const disconnectRedis = async () => {
    try {
        await redisClient.quit();
        console.log('Disconnected from Redis');
    } catch (err) {
        console.error('Failed to disconnect from Redis', err);
    }
};

export { redisClient, connectRedis, disconnectRedis };
