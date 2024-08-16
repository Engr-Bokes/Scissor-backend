import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient, connectRedis } from '../utils/redisClient.js';

// Ensure Redis is connected before creating the rate limiter
const ensureRedisConnected = async () => {
    if (!redisClient.isOpen) {
        await connectRedis();
    }
};

(async () => {
    await ensureRedisConnected();
})();

const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }), // Type assertion to 'any' since express-rate-limit and rate-limit-redis typings may conflict
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => {
        return req.ip; // Use the client's IP address, considering the 'X-Forwarded-For' header
    },
});

// Ensure Express trusts the proxy to correctly interpret 'X-Forwarded-For' header
const configureApp = (app) => {
    app.set('trust proxy', true); // <--- Ensure the trust proxy setting is enabled
    app.use(limiter); // Apply the rate limiter middleware
};

export { limiter, configureApp };
