import mongoose, { Schema, Document } from 'mongoose';
import type { Conversation } from '../types/chat';

export type ConversationDocument = Conversation & Document;

const ConversationSchema = new Schema<ConversationDocument>({
    userId:     { type: Number, required: true },
    messages:  [{ type: Schema.Types.ObjectId, ref: 'ChatMessage'}],
    createdAt:  { type: Date, default: Date.now },
    updatedAt:  { type: Date, default: Date.now },
});

export const ConversationModel = mongoose.model<ConversationDocument>('Conversation', ConversationSchema);