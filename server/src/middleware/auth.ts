import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set.');
}

export interface AuthPayload extends JwtPayload {
    userId: number;
    email: string;
    role: 'user' | 'admin';
}

export interface AuthRequest extends Request {
    user?: AuthPayload;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided.' });
        return;
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
        res.status(401).json({ error: 'No token provided.' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(401).json({ error: 'Invalid or expired token.' });
            return;
        }

        req.user = decoded as AuthPayload;
        next();
    });
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
    }

    try {
        const user = await UserModel.findOne({ userId: req.user.userId });
        if (!user || user.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required.' });
            return;
        }
        next();
    } catch (error) {
        console.error('requireAdmin error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};