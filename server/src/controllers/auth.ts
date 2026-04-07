import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserModel } from '../models/User';
import type { AuthRequest } from '../middleware/auth';

const JWT_SECRET = (process.env.JWT_SECRET || 'dev_secret') as string; // infer to string
const SALT_ROUNDS = 8;

export const register = async (req: Request, res: Response) => {
    const { username, email, password, firstName, lastName } = req.body;

    try {
        // see if the email already exists
        const emailDoesExist = await UserModel.findOne({ email });
        if (emailDoesExist) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // see if the username already exists
        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const userCount = await UserModel.countDocuments();

        const newUser = new UserModel({
            userId: userCount + 1,
            username,
            email,
            passwordHash,
            firstName,
            lastName,
            role: 'user',
            conversations: [],
        });

        await newUser.save();

        res.status(200).json({ message: 'User created', userId: newUser.userId });
    
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordDoesMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordDoesMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.userId, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

export const me = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role,
    });
};