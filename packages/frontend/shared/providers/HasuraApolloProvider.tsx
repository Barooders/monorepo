'use client';

import { useHasuraToken } from '@/hooks/useHasuraToken';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  disableFragmentWarnings,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import React, { PropsWithChildren } from 'react';
import { HASURA_ROLES } from 'shared-types';

disableFragmentWarnings();

const HasuraApolloProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { getUpToDateHasuraToken } = useHasuraToken();

  const getAuthorizationHeaders = async () => {
    const hasuraToken = await getUpToDateHasuraToken();

    return hasuraToken?.accessToken
      ? {
          Authorization: `Bearer ${hasuraToken.accessToken}`,
          'X-Hasura-role': HASURA_ROLES.REGISTERED_USER,
        }
      : {};
  };

  const AuthenticationLink = setContext(async (_, { headers }) => {
    const authorizationHeaders = await getAuthorizationHeaders();

    return {
      headers: {
        ...headers,
        ...authorizationHeaders,
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        console.error(
          `Received GraphQL error: ${error.name} - ${error.message}`,
        );
      });
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const httpGraphqlEndpoint = process.env.NEXT_PUBLIC_HASURA_BASE_URL ?? '';

  const httpLink = new HttpLink({
    uri: httpGraphqlEndpoint,
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: httpGraphqlEndpoint.replace(/^http/, 'ws'),
      connectionParams: async () => {
        const authorizationHeaders = await getAuthorizationHeaders();

        return { headers: authorizationHeaders };
      },
    }),
  );

  const ConnectionLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, AuthenticationLink, ConnectionLink]),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default HasuraApolloProvider;
