import { gql } from '@apollo/client';

export const MessageFields = `
    id 
    sender {
      id 
      username
    }
    body 
    createdAt`;

const MessageOperations = {
  Query: {
    // Name of query similar to the backend resolver
    messages: gql`
    # Name of query
     query Messages($conversationId: String!) {
        # Backend resolver name and params
      messages(conversationId: $conversationId) {
        # Return type
        ${MessageFields}
      }
     }
    `,
  },
  Mutation: {
    // Name of mutation similar to the backend resolver
    sendMessage: gql`
      # Name of mutation
      mutation SendMessage(
        $id: String!
        $conversationId: String!
        $senderId: String!
        $body: String!
      ) {
        # Backend resolver name and params

        sendMessage(
          id: $id
          conversationId: $conversationId
          senderId: $senderId
          body: $body
        )
      }
    `,
  },
  Subscription: {
    messageSent: gql`
      subscription MessageSent($conversationId: String!) {
        messageSent(conversationId: $conversationId) {
          ${MessageFields}
        }
      }
    `,
  },
};

export default MessageOperations;
