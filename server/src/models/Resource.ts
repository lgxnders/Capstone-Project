import mongoose, { Schema, Document } from 'mongoose';
import type { Resource } from '../types/resource';

export type ResourceDocument = Resource & Document;

const ResourceSchema = new Schema<ResourceDocument>({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["article", "video", "tool", "exercise", "course", "community"] as const,
    },
    topics: {
        type: [String],
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    targetStates: {
        type: [String],
        required: true,
    },
    timeEstimate: {
        type: Number,
    },
    accessLevel: {
        type: String,
        required: true,
        enum: ["low", "med", "high"] as const,
    },
    credibilityLevel: {
        type: String,
        enum: ["low", "med", "high"] as const,
    },
    embedding: {
        type: [Number],
        required: true,
    },
}, {
    timestamps: true,
});

export const ResourceModel = mongoose.model<ResourceDocument>('Resource', ResourceSchema);