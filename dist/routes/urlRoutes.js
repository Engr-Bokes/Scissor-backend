import { Router } from 'express';
import { shortenUrl, getUrlAnalytics, getUserUrls } from '../controllers/urlController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
const router = Router();
// Route to create a shortened URL with rate limiting
router.post('/shorten', authMiddleware, rateLimiter(50, 1), shortenUrl); // 50 requests per minute
// Route to get analytics for a shortened URL with rate limiting
router.get('/:code/analytics', authMiddleware, getUrlAnalytics); 
// Route to get all URLs created by a user with rate limiting
router.get('/user/urls', authMiddleware, getUserUrls);
export default router;
//# sourceMappingURL=urlRoutes.js.map