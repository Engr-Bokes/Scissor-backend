import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient, connectRedis } from '../utils/redisClient';

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
    sendCommand: (...args: any[]) => redisClient.sendCommand(args),
  }) as any, // Type assertion to 'any' since express-rate-limit and rate-limit-redis typings may conflict
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default limiter;
