// USER TYPES
// Typescript interfaces for GraphQL mutation return type
import { ConversationPopulated as ConversationPopulatedBE } from '../../../server/src/util/types';

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

// Typescript interfaces for GraphQL mutation paramter variable type
export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchedUser {
  id: string;
  username: string;
}

// CONVERSATION TYPES

export interface ConversationsData {
  conversations: Array<ConversationPopulatedBE>;
}

export type ConversationPopulated = ConversationPopulatedBE;

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationInput {
  participantIds: Array<string>;
}
