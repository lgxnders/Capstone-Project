import mongoose, { Schema, Document } from 'mongoose';
import type { ChatMessage, MessageRole } from '../types/chat';

export type ChatMessageDocument = Omit<ChatMessage, 'conversationId'> & Document & {
    conversationId: mongoose.Types.ObjectId;
};

const ChatMessageSchema = new Schema<ChatMessageDocument>({
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    role:           { type: String, required: true,
                      enum: ['user', 'assistant'] satisfies MessageRole[] },
    content:        { type: String, required: true },
    timestamp:      { type: Date,   default: Date.now },
});

export const ChatMessageModel = mongoose.model<ChatMessageDocument>('ChatMessage', ChatMessageSchema);
