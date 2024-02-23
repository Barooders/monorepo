import { createGraphQLClient } from './base/graphql';

export const fetchHasura = createGraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_BASE_URL,
);
