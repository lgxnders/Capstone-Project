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

export const getResourceById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const resource = await ResourceModel.findById(id).select('-embedding');

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.json({ resource });
    } catch (error: any) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid resource ID' });
        }
        console.error('getResourceById error:', error);
        res.status(500).json({ error: 'Failed to fetch resource' });
    }
};

export const createResource = async (req: Request, res: Response) => {
    try {
        console.log('req.body:', req.body);
        const resourceData = {
            ...req.body,
            url: String(req.body.url || '').trim(),
        };

        console.log('Attempting to create resource with URL:', resourceData.url);

        if (!resourceData.url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const existing = await ResourceModel.findOne({ url: resourceData.url });
        console.log('Existing resource found:', existing ? existing.title : 'none');
        if (existing) {
            return res.status(400).json({ error: `Resource with this URL already exists: ${existing.title}` });
        }

        const resource = new ResourceModel(resourceData);
        await resource.save();
        res.status(201).json({ resource });
    } catch (error: any) {
        console.log('Save error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Resource with this URL already exists.' });
        }
        console.error('createResource error:', error);
        res.status(500).json({ error: 'Failed to create resource' });
    }
};

export const updateResource = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const resource = await ResourceModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-embedding');
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found.' });
        }
        res.json({ resource });
    } catch (error: any) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid resource ID.' });
        }
        console.error('updateResource error:', error);
        res.status(500).json({ error: 'Failed to update resource.' });
    }
};

export const deleteResource = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const resource = await ResourceModel.findByIdAndDelete(id);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error: any) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid resource ID' });
        }
        console.error('deleteResource error:', error);
        res.status(500).json({ error: 'Failed to delete resource' });
    }
};
