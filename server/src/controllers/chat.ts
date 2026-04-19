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

        // Step 1: psychologist agent screens the message for red flags.
        const psychResult = await psychologistAgent(message);

        // Step 2: run the resource DAG to determine resources + short reply.
        const { resources, internalResources, suggestedPrompts, resourceIntro } = await runResourceDag({
            userMessage:         message,
            patientReply:        '',
            conversationHistory: formattedHistory,
            psychologistResult:  psychResult,
        });

        // Step 3: pick the reply:
        //   - flagged         → crisis response (patient agent never called)
        //   - resources found → short templated line from the DAG (patient agent skipped)
        //   - no resources    → patient agent generates a freeform reply
        let replyContent: string;
        if (psychResult.flagged) {
            replyContent = CRISIS_RESPONSE;
        } else if (resourceIntro) {
            replyContent = resourceIntro;
        } else {
            replyContent = await patientAgent(formattedHistory, message);
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

        res.json({
            reply:             replyContent,
            conversationId:    conversation._id,
            resourceIntro,
            resources,
            internalResources,
            suggestedPrompts,
        });
        
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