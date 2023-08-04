import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { getSession } from 'next-auth/react';

// Allow us to send http request
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

// Allows us to send web socket requests
const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: 'ws://localhost:4000/graphql/subscriptions',
          connectionParams: async () => ({ session: await getSession() }),
        })
      )
    : null;

// If we are not on server, then set it to wsLink, else set to httpLink
const link =
  typeof window !== 'undefined' && wsLink != null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === 'OperationDefinition' &&
            def.operation === 'subscription'
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

// Apollo client has built in caching
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
