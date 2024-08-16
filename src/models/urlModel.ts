import mongoose, { Schema, Document } from 'mongoose';

export interface IUrl extends Document {
    originalUrl: string;
    shortUrl: string;
    urlCode: string;
    user: mongoose.Types.ObjectId;
    clicks: number;
    lastAccessed: Date;
}

const urlSchema: Schema = new Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    urlCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    clicks: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now },
});

export const UrlModel = mongoose.model<IUrl>('Url', urlSchema);
