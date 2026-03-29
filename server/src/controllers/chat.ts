import type { Request, Response } from 'express';

export const sendMessage = async (req: Request, res: Response) => {
    const { message, conversationId } = req.body;

    // call ai api

    const reply = `DEBUG: The user is currently logged in.`;

    res.json({ reply, conversationId });
};

export const getHistory = async (req: Request, res: Response) => {
    const { conversationId } = req.query;

    // fetch from db here

    res.json({ messages: [] });
};