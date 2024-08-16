import mongoose, { Schema } from 'mongoose';
const urlSchema = new Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    urlCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    clicks: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now },
});
export const UrlModel = mongoose.model('Url', urlSchema);
//# sourceMappingURL=urlModel.js.map