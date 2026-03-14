import { generateResponse } from '../services/chatbot.js';

export const handleChat = async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const reply = await generateResponse(message);
    res.json({ reply });
};