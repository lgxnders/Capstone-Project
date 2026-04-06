import type { Request, Response } from 'express';
import { ResourceModel } from '../models/Resource';

export const getAllResources = async (_req: Request, res: Response) => {
    try {
        const resources = await ResourceModel.find({}, { embedding: 0 });
        res.json({ resources });
    } catch (error) {
        console.error('getAllResources error:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
};

export const getRandomResource = async (_req: Request, res: Response) => {
    try {
        const [resource] = await ResourceModel.aggregate([
            { $sample: { size: 1 } },
            { $project: { embedding: 0 } },
        ]);

        if (!resource) return res.status(404).json({ error: 'No resources found' });

        res.json({ resource });
    } catch (error) {
        console.error('getRandomResource error:', error);
        res.status(500).json({ error: 'Failed to fetch random resource' });
    }
};
