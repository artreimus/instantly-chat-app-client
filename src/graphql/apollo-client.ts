import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Allow us to send http request
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

// Apollo client has built in caching
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
