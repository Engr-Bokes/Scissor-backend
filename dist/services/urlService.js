import { UrlModel } from '../models/urlModel.js';
import { nanoid } from 'nanoid';
import { redisClient } from '../utils/redisClient.js';
import axios from 'axios';
export const createShortUrl = async (originalUrl, userId, customUrl) => {
    const urlCode = customUrl || nanoid(7);
    const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
    const shortUrl = `${baseUrl}/${urlCode}`;
    const urlData = new UrlModel({ originalUrl, shortUrl, urlCode, user: userId });
    await urlData.save();
    await redisClient.set(urlCode, originalUrl);
    const qrCode = await generateQrCode(shortUrl);
    return { shortUrl, qrCode };
};
export const getAnalytics = async (code) => {
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
const generateQrCode = async (url) => {
    try {
        const response = await axios.get('https://api.qrserver.com/v1/create-qr-code/', {
            params: {
                data: encodeURIComponent(url),
                size: '150x150',
            },
            responseType: 'arraybuffer',
        });
        return response.config.url;
    }
    catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
};
//# sourceMappingURL=urlService.js.map