import { createGraphQLClient } from './base/graphql';
import { createRestClient } from './base/rest';

export const fetchStrapi = createRestClient(process.env.NEXT_PUBLIC_STRAPI_URL);

export const fetchStrapiGraphQL = createGraphQLClient(
  process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL,
);
