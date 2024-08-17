import { createShortUrl, getAnalytics, getUrlByShortId } from '../services/urlService.js';
import { UrlModel } from '../models/urlModel.js';
export const shortenUrl = async (req, res) => {
    const { originalUrl, customUrl } = req.body;
    const userId = req.user?.id;
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID in token' });
    }
    try {
        const { shortUrl, qrCode } = await createShortUrl(originalUrl, userId, customUrl);
        res.status(201).json({ shortUrl, qrCode });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
export const getUrlAnalytics = async (req, res) => {
    const { code } = req.params;
    try {
        const analytics = await getAnalytics(code);
        res.status(200).json(analytics);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
export const getUserUrls = async (req, res) => {
    const userId = req.user?.id;
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID in token' });
    }
    try {
        const urls = await UrlModel.find({ user: userId });
        res.status(200).json(urls);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
// Add the redirectToOriginalUrl function
export const redirectToOriginalUrl = async (req, res) => {
    const { code } = req.params;
    try {
        const originalUrl = await getUrlByShortId(code);
        if (originalUrl) {
            res.redirect(originalUrl);
        }
        else {
            res.status(404).send('URL not found');
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
//# sourceMappingURL=urlController.js.map