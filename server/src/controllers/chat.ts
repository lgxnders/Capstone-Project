import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { ConversationModel } from '../models/Conversation';
import { ChatMessageModel } from '../models/ChatMessage';
import { getConversationHistory, formatMessagesForAI } from '../services/conversation';
import { UserModel } from '../models/User';
import mongoose from 'mongoose';
import { psychologistAgent, CRISIS_RESPONSE } from '../agents/psychologistAgent';
import { patientAgent, ApiError } from '../agents/patientAgent';
import { runResourceDag } from '../agents/resourceDag';

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
            return res.status(500).json({ error: 'Failed to create conversation' });
        }


        const formattedHistory = formatMessagesForAI(conversation.messages as any[]);

        // --- Agent orchestration ---

        // Step 1: psychologist agent screens the message for red flags.
        const psychResult = await psychologistAgent(message);

        // Step 2: if flagged, use the crisis response and skip the patient agent.
        // Step 3: if clear, patient agent generates the empathetic reply.
        let replyContent: string;
        if (psychResult.flagged) {
            replyContent = CRISIS_RESPONSE;
        } else {
            replyContent = await patientAgent(formattedHistory, message);
        }

        // Step 4: resource DAG runs on both paths to select resources + suggested prompts.
        const { resources, internalResources, suggestedPrompts } = await runResourceDag({
            userMessage:         message,
            patientReply:        psychResult.flagged ? '' : replyContent,
            conversationHistory: formattedHistory,
            psychologistResult:  psychResult,
        });

        // Append resource URLs to the reply for the frontend to display inline.
        if (internalResources.length > 0) {
            const resourceLines = internalResources
                .map((r) => `${r.title}: ${r.url}`)
                .join(' | ');
            replyContent += ` Here are some resources that may help: ${resourceLines}`;
        } else if (resources.length > 0) {
            const resourceLines = resources
                .map((r) => `${r.label}: ${r.url}`)
                .join(' | ');
            replyContent += ` Here are some resources that may help: ${resourceLines}`;
        }

        const flagged      = psychResult.flagged;
        const flagCategory = psychResult.category;


        // construct user message
        const userMessage = await ChatMessageModel.create({
            conversationId: conversation._id,
            role: 'user',
            content: message,
            flagged,
            ...(flagCategory !== undefined && { flagCategory }),
        });

        // construct chatbot reply
        const assistantMessage = await ChatMessageModel.create({
            conversationId: conversation._id,
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

        res.json({ reply: replyContent, conversationId: conversation._id, resources, suggestedPrompts });
        
    } catch (error) {
        console.error('sendMessage error:', error);
        if (error instanceof ApiError) {
            return res.status(503).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
    const { conversationId } = req.query;

    if (!conversationId) return res.status(400).json({ error: 'conversationId is required' });

    try {
        const conversation = await ConversationModel
            .findById(conversationId)
            .populate('messages');

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        if (conversation.userId !== req.user?.userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.json({ messages: conversation.messages });

    } catch (error) {
        console.error('getHistory error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};