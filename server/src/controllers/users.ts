import type { Request, Response } from 'express';

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.json({ id, email: 'placeholder@email.com' });
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    res.json({ id, ...updates });
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(204).send();
};