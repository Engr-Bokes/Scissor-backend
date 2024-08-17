import { UrlModel } from '../models/urlModel';
import { nanoid } from 'nanoid';
import { redisClient } from '../utils/redisClient';
import axios from 'axios';

// Function to create a short URL
export const createShortUrl = async (originalUrl: string, userId: string, customUrl?: string) => {
    const urlCode = customUrl || nanoid(7);
    const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
    const shortUrl = `${baseUrl}/${urlCode}`;

    const urlData = new UrlModel({ originalUrl, shortUrl, urlCode, user: userId });
    await urlData.save();

    await redisClient.set(urlCode, originalUrl);

    const qrCode = await generateQrCode(shortUrl);

    return { shortUrl, qrCode };
};

// Function to get analytics for a short URL
export const getAnalytics = async (code: string) => {
    const url = await UrlModel.findOne({ urlCode: code });

    if (url) {
        return {
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            clicks: url.clicks,
            lastAccessed: url.lastAccessed,
        };
    }

    throw new Error('URL not found');
};

// Function to retrieve the original URL by short ID (urlCode)
export const getUrlByShortId = async (urlCode: string): Promise<string | null> => {
    // Check if the URL is cached in Redis
    const cachedUrl = await redisClient.get(urlCode);
    if (cachedUrl) {
        return cachedUrl;
    }

    // If not found in Redis, check the database
    const urlRecord = await UrlModel.findOne({ urlCode });
    if (urlRecord) {
        // Cache the original URL in Redis for future requests
        await redisClient.set(urlCode, urlRecord.originalUrl);
        return urlRecord.originalUrl;
    }

    return null;
};

// Function to generate a QR code for the short URL
const generateQrCode = async (url: string): Promise<string> => {
    try {
        const response = await axios.get('https://api.qrserver.com/v1/create-qr-code/', {
            params: {
                data: encodeURIComponent(url),
                size: '150x150',
            },
            responseType: 'arraybuffer',
        });
        return response.config.url as string;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
};
