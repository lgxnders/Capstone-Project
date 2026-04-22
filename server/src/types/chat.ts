export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
    messageId:      number;
    conversationId: string;
    role:           MessageRole;
    content:        string;
    timestamp:      Date;
    flagged?:       boolean;  // true if psychologist agent raised a red flag
    flagCategory?:  string;   // the category returned by the psychologist agent
}

export interface Conversation {
    conversationId: string;
    userId:         number;
    messages:       ChatMessage[];
    createdAt:      Date;
    updatedAt:      Date;
}

export type ConversationList = Conversation[];