import { Request, Response } from 'express';
import { createShortUrl, getAnalytics } from '../services/urlService';
import { UrlModel } from '../models/urlModel';

export const shortenUrl = async (req: Request, res: Response) => {
    const { originalUrl, customUrl } = req.body;

    // Ensure req.user is defined and has a valid id
    const userId = req.user?.id;

    // Check if userId is a string, otherwise return an error
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID in token' });
    }

    try {
        const { shortUrl, qrCode } = await createShortUrl(originalUrl, userId, customUrl);
        res.status(201).json({ shortUrl, qrCode });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const getUrlAnalytics = async (req: Request, res: Response) => {
    const { code } = req.params;

    try {
        const analytics = await getAnalytics(code);
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const getUserUrls = async (req: Request, res: Response) => {
    // Ensure req.user is defined and has a valid id
    const userId = req.user?.id;

    // Check if userId is a string, otherwise return an error
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID in token' });
    }

    try {
        const urls = await UrlModel.find({ user: userId });
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
