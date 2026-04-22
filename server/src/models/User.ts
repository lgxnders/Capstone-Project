import mongoose, { Schema, Document } from 'mongoose';
import type { User } from '../types/user';

export type UserDocument = User & Document;

const UserSchema = new Schema<UserDocument>({
    userId:         { type: Number, required: true, unique: true },
    username:       { type: String, required: true, unique: true },
    email:          { type: String, required: true, unique: true },
    passwordHash:   { type: String, required: true },
    firstName:      { type: String },
    lastName:       { type: String },
    role:           { type: String, enum: ['user', 'admin'], default: 'user' },
    conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
    createdAt:      { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);