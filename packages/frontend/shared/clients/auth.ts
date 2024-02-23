import { createRestClient } from './base/rest';

export const fetchAuth = createRestClient(
  process.env.NEXT_PUBLIC_HASURA_AUTH_BASE_URL,
);
