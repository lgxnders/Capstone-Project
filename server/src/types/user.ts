import type { Conversation, ConversationList } from './chat';

export interface User {
    userId:         number;
    username:       string;
    email:          string;
    passwordHash:   string;
    firstName?:     string;
    lastName?:      string;
    role:           'user' | 'admin';
    createdAt:      Date;
    conversations:  Conversation[];
}

export interface NewUser {
    username:       string;
    email:          string;
    password:       string;
    firstName?:     string;
    lastName?:      string;
    role?:          'user' | 'admin';
}

// PublicUser has all the fields of a NewUser, except for the 'conversations' field.
export type PublicUser = Omit<User, 'conversations'> & {
    conversationIds: Array<Conversation['conversationId']>;
};