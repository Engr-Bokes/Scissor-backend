import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient, connectRedis } from '../utils/redisClient.js';
// Helper function to ensure redisClient is connected and initialized
const ensureRedisClient = async () => {
    if (!redisClient) {
        await connectRedis();
    }
    // After attempting to connect, check again
    if (!redisClient) {
        throw new Error('Redis client is not initialized');
    }
    return redisClient;
};
// Global rate limiter
const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: async (...args) => {
            const client = await ensureRedisClient();
            return client.sendCommand(args);
        },
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip || ''; // Ensure a string is always returned
    },
});
// Custom rate limiter for specific routes
const rateLimiter = (max, minutes) => {
    return rateLimit({
        store: new RedisStore({
            sendCommand: async (...args) => {
                const client = await ensureRedisClient();
                return client.sendCommand(args);
            },
        }),
        windowMs: minutes * 60 * 1000, // custom window in minutes
        max, // limit each IP to `max` requests per windowMs
        message: 'Too many requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            return req.ip || ''; // Ensure a string is always returned
        },
    });
};
// Function to configure the global rate limiter on the app
const configureApp = (app) => {
    app.set('trust proxy', true); // Ensure the trust proxy setting is enabled
    app.use(limiter); // Apply the global rate limiter middleware
};
export { limiter, configureApp, rateLimiter };
//# sourceMappingURL=rateLimiter.js.map