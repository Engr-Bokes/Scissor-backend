import { Router } from 'express';
import { shortenUrl, getUrlAnalytics, getUserUrls, redirectToOriginalUrl } from '../controllers/urlController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = Router();
// Route to create a shortened URL
router.post('/shorten', authMiddleware, shortenUrl);
// Route to get analytics for a shortened URL
router.get('/:code/analytics', authMiddleware, getUrlAnalytics);
// Route to get all URLs created by a user
router.get('/user/urls', authMiddleware, getUserUrls);
// Route to handle redirection to the original URL
router.get('/:code', redirectToOriginalUrl);
export default router;
//# sourceMappingURL=urlRoutes.js.map