import type { Request, Response } from 'express';
import type { AuthRequest} from '../middleware/auth';
import { ConversationModel } from '../models/Conversation';
import { ChatMessageModel } from '../models/ChatMessage';
import { getConversationHistory, formatMessagesForAI } from '../services/conversation';
import { UserModel } from '../models/User';
import mongoose from 'mongoose';

export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { message, conversationId } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try { // try to find an existing chat conversation or create a new one.
        let conversation = null;

        if (conversationId) {
            try {
                conversation = await ConversationModel.findById(conversationId).populate('messages')
            } catch {
                throw new Error("Invalid ObjectId format. No conversation could be found.");
            }
        }

        if (!conversation) {
            conversation = await ConversationModel.create({ userId, messages: [] });
        }

        if (!conversation) {
            return res.status(500).json({ error: 'Failed to create conversation/' });
        }


        const formattedHistory = formatMessagesForAI(conversation.messages as any[]);

        const replyContent = "reply DEBUG";
        // CALL AI HERE TO DEFINE replyContent.
        // use formattedHistory.


        // construct user message
        const userMessage = await ChatMessageModel.create({
            conversationId: conversation._id.toString(),
            role: 'user',
            content: message,
        });

        // construct chatbot reply
        const assistantMessage = await ChatMessageModel.create({
            conversationId: conversation._id.toString(),
            role: 'assistant',
            content: replyContent,
        });

        // push all of our constructed messages to the conversation array.
        conversation.messages.push(userMessage._id as mongoose.Types.ObjectId);
        conversation.messages.push(assistantMessage._id as mongoose.Types.ObjectId);
        conversation.updatedAt = new Date();
        await conversation.save();

        await UserModel.findOneAndUpdate(
            { userId },
            { $addToSet: { conversations: conversation._id } }
        );

        //DEBUG TO SERVER CONSOLE
        ConversationModel.findById(conversation._id)
            .populate('messages')
            .then(doc => console.log(JSON.stringify(doc, null, 2)));


        res.json({ reply: replyContent, conversationId: conversation._id });
        
    } catch (error) {
        console.error('sendMessage error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    const { conversationId } = req.query;

    if (!conversationId) return res.status(400).json({ error: 'conversationId is required' });

    try {
        const conversation = await ConversationModel
            .findById(conversationId)
            .populate('messages');

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json({ messages: conversation.messages });

    } catch (error) {
        console.error('getHistory error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};