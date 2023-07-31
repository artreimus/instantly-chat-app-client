import { gql } from '@apollo/client';

const ConversationFields = `
    conversations {
      id
      updatedAt
      latestMessage {
        id
        body
        createdAt
        sender {
          id
          username
        }
      }
      participants {
        user {
          id
          username
        }
        hasSeenLatestMessage
      }
    }
  `;

const UserOperations = {
  Queries: {
    conversations: gql`
      query Conversations {
        ${ConversationFields}
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String]!) {
        # must be similar to the backend resolver name and params
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
  },
  Subscriptions: {},
};

export default UserOperations;
