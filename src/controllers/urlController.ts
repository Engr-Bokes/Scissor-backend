import { Request, Response } from 'express';
import { createShortUrl, getAnalytics, getUrlByShortId } from '../services/urlService';
import { UrlModel } from '../models/urlModel';

export const shortenUrl = async (req: Request, res: Response) => {
    const { originalUrl, customUrl } = req.body;
    const userId = req.user?.id;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID in token' });
    }

    try {
        const { shortUrl, qrCode } = await createShortUrl(originalUrl, userId, customUrl);
        console.log(`URL shortened: ${originalUrl} -> ${shortUrl}`); // Logging the shortened URL
        res.status(201).json({ shortUrl, qrCode });
    } catch (error) {
        console.error('Error in shortenUrl:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const getUrlAnalytics = async (req: Request, res: Response) => {
    const { code } = req.params;

    try {
        const analytics = await getAnalytics(code);
        console.log(`Analytics retrieved for URL code: ${code}`); // Logging analytics retrieval
        res.status(200).json(analytics);
    } catch (error) {
        console.error('Error in getUrlAnalytics:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const getUserUrls = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID in token' });
    }

    try {
        const urls = await UrlModel.find({ user: userId });
        console.log(`URLs retrieved for user: ${userId}`); // Logging user URL retrieval
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const redirectToOriginalUrl = async (req: Request, res: Response) => {
    const { code } = req.params;

    try {
        const originalUrl = await getUrlByShortId(code);

        if (originalUrl) {
            await UrlModel.findOneAndUpdate(
                { urlCode: code },
                { $inc: { clicks: 1 }, lastAccessed: new Date() }
            );
            console.log(`Redirecting to original URL: ${originalUrl}`); // Logging redirection
            res.redirect(originalUrl);
        } else {
            console.warn(`URL not found for code: ${code}`); // Logging not found URL
            res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error('Error in redirectToOriginalUrl:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};
