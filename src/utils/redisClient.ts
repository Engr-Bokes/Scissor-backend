import { createClient, RedisClientType } from 'redis'; // Import RedisClientType
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://default:CntNvqNcCJwiSFHFIXcIXVOArPpapUVG@junction.proxy.rlwy.net:59640';
console.log(`Connecting to Redis URL: ${redisUrl}`);

let redisClient: RedisClientType | undefined;

const createRedisClient = (): RedisClientType => {
    if (!redisClient) {
        redisClient = createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
            },
        });

        redisClient.on('connect', () => console.log('Connected to Redis'));
        redisClient.on('error', (err) => console.error('Redis Client Error', err));
    }

    return redisClient;
};

const connectRedis = async () => {
    if (!redisClient || !redisClient.isOpen) {
        try {
            redisClient = createRedisClient();
            await redisClient.connect();
        } catch (err) {
            console.error('Failed to connect to Redis', err);
        }
    } else {
        console.log('Redis connection already established');
    }
};

const disconnectRedis = async () => {
    if (redisClient && redisClient.isOpen) {
        try {
            await redisClient.quit();
            console.log('Disconnected from Redis');
        } catch (err) {
            console.error('Failed to disconnect from Redis', err);
        }
    } else {
        console.log('Redis connection is not open or already closed');
    }
};

export { redisClient, connectRedis, disconnectRedis };
