import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient, connectRedis } from '../utils/redisClient.js';
// Ensure Redis is connected before creating the rate limiter
const ensureRedisConnected = async () => {
    if (!redisClient.isOpen) {
        await connectRedis();
    }
};
// Immediately ensure Redis connection
(async () => {
    await ensureRedisConnected();
})();
const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip || ''; // Ensure a string is always returned
    },
});
const configureApp = (app) => {
    app.set('trust proxy', true); // Ensure the trust proxy setting is enabled
    app.use(limiter); // Apply the rate limiter middleware
};
export { limiter, configureApp };
//# sourceMappingURL=rateLimiter.js.map