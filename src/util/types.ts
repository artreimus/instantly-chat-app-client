// USER TYPES
// Typescript interfaces for GraphQL mutation return type
import {
  ConversationPopulated as ConversationPopulatedBE,
  MessagePopulated as MessagePopulatedBE,
  SendMessageArguments as SendMessageArgumentsBE,
} from '../../../server/src/util/types';
import { ParticipantPopulated as ParticipantPopulatedBE } from '../../../server/src/util/types';

// USER TYPES

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

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
export type ParticipantPopulated = ParticipantPopulatedBE;

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationInput {
  participantIds: Array<string>;
}

// MESSAGE TYPES
export type MessagePopulated = MessagePopulatedBE;

export interface MessagesData {
  messages: Array<MessagePopulated>;
}

export interface MessagesVariables {
  conversationId: string;
}

export interface ConversationCreatedSubscriptionData {
  subscriptionData: {
    data: { conversationCreated: ConversationPopulated };
  };
}

export type SendMessageArguments = SendMessageArgumentsBE;

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      // name of subscription
      messageSent: MessagePopulated;
    };
  };
}
