import { Router } from 'express';
import { shortenUrl, getUrlAnalytics, getUserUrls } from '../controllers/urlController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/shorten', authMiddleware, shortenUrl);
router.get('/:code/analytics', authMiddleware, getUrlAnalytics);
router.get('/user/urls', authMiddleware, getUserUrls);

export default router;
