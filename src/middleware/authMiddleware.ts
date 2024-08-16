import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import { UserModel } from '../models/userModel';
import { JwtPayload } from 'jsonwebtoken';

// Extending Express's Request interface to include the `user` property
interface AuthenticatedRequest extends Request {
    user?: typeof UserModel.prototype;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = verifyToken(token) as JwtPayload & { id: string };

        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};
