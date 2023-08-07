import { gql } from '@apollo/client';
import { MessageFields } from './message';

const ConversationFields = `
      id
      updatedAt
      latestMessage {
        ${MessageFields}
      }
      participants {
        user {
          id
          username
        }
        hasSeenLatestMessage
      }
  `;

// Structure:
// query string name

const ConversationOperations = {
  Queries: {
    // Name of query string similar to the backend resolver
    conversations: gql`
    # Name of Query
      query Conversations {
        # Backend resolver name and params
        conversations {
          # Return type
          ${ConversationFields}
        }
      }
    `,
  },
  Mutations: {
    // Name of mutation string
    createConversation: gql`
      # Name of Mutation
      mutation CreateConversation($participantIds: [String]!) {
        # Backend resolver name and params
        createConversation(participantIds: $participantIds) {
          # Return type
          conversationId
        }
      }
    `,
    // Name of mutation string
    deleteConversation: gql`
      # Name of Mutation
      mutation DeleteConversation($conversationId: String!) {
        # Backend resolver name and params
        deleteConversation(conversationId: $conversationId)
      }
    `,
    markConversationAsRead: gql`
      mutation MarkConversationAsRead(
        $userId: String!
        $conversationId: String!
      ) {
        markConversationAsRead(userId: $userId, conversationId: $conversationId)
      }
    `,
  },
  Subscriptions: {
    // Name of subscription string
    conversationCreated: gql`
    # Name of subscription
      subscription ConversationCreated {
        # Backend resolver
        conversationCreated { 
          # Return type
          ${ConversationFields}
        }
      }
    `,
    // Name of subscription string
    conversationUpdated: gql`
    # Name of subscription
      subscription ConversationUpdated {
        # Backend resolver
        conversationUpdated { 
          # Return type
          conversation {
          ${ConversationFields}
          }
        }
      }
    `,
    // Name of subscription string
    conversationDeleted: gql`
      # Name of subscription
      subscription ConversationDeleted {
        # Backend resolver
        conversationDeleted {
          # Return type
          id
        }
      }
    `,
  },
};

export default ConversationOperations;
