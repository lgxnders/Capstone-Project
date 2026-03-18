export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
    messageId:      number;
    conversationId: string;
    role:           MessageRole;
    content:        string;
    timestamp:      Date;
}

export interface Conversation {
    conversationId: string;
    userId:         number;
    messages:       ChatMessage[];
    createdAt:      Date;
    updatedAt:      Date;
}

export type ConversationList = Conversation[];