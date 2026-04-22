import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';

const parseId = (raw: string | string[] | undefined): number | null => {
    const n = parseInt(String(raw ?? ''), 10);
    return isNaN(n) ? null : n;
};

export const getUser = async (req: AuthRequest, res: Response) => {
    const numericId = parseId(req.params.id);
    if (numericId === null) return res.status(400).json({ error: 'Invalid user ID' });

    if (req.user?.userId !== numericId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const user = await UserModel.findOne({ userId: numericId }).select('-passwordHash -__v');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('getUser error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    const numericId = parseId(req.params.id);
    if (numericId === null) return res.status(400).json({ error: 'Invalid user ID' });

    if (req.user?.userId !== numericId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { username, firstName, lastName } = req.body;
    const updates: Record<string, string> = {};
    if (username  !== undefined) updates.username  = username;
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName  !== undefined) updates.lastName  = lastName;

    try {
        const user = await UserModel.findOneAndUpdate(
            { userId: numericId },
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-passwordHash -__v');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Username already taken' });
        }
        console.error('updateUser error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
    const numericId = parseId(req.params.id);
    if (numericId === null) return res.status(400).json({ error: 'Invalid user ID' });

    const { role } = req.body;

    if (role !== 'user' && role !== 'admin') {
        return res.status(400).json({ error: 'role must be "user" or "admin"' });
    }

    try {
        const user = await UserModel.findOneAndUpdate(
            { userId: numericId },
            { $set: { role } },
            { new: true }
        ).select('-passwordHash -__v');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('updateUserRole error:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    const numericId = parseId(req.params.id);
    if (numericId === null) return res.status(400).json({ error: 'Invalid user ID' });

    try {
        const result = await UserModel.findOneAndDelete({ userId: numericId });

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(204).send();

    } catch (error) {
        console.error('deleteUser error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
