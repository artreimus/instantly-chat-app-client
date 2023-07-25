import { gql } from '@apollo/client';

const UserOperations = {
  Queries: {},
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
