import { Router } from 'express';
import { shortenUrl, getUrlAnalytics, getUserUrls, redirectToOriginalUrl } from '../controllers/urlController';
import { authMiddleware } from '../middleware/authMiddleware';
import { rateLimiter } from '../middleware/rateLimiter'; // Import the custom rate limiter

const router = Router();

// Route to create a shortened URL
router.post('/shorten', authMiddleware, shortenUrl);

// Route to get analytics for a shortened URL
router.get('/:code/analytics', authMiddleware, getUrlAnalytics);

// Route to get all URLs created by a user
router.get('/user/urls', authMiddleware, getUserUrls);

// Route to handle redirection to the original URL with custom rate limiting
router.get('/:code', rateLimiter(10, 1), redirectToOriginalUrl); // 10 requests per minute

export default router;
