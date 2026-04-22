import { ConversationModel } from '../models/Conversation';

export const getConversationHistory = async (conversationId: string) => {
    const conversation = await ConversationModel
        .findById(conversationId)
        .populate('messages');

    return conversation?.messages ?? [];
};

export const formatMessagesForAI = (messages: any[]) => {
    return messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
    }));
};