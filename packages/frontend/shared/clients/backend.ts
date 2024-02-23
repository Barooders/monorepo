import { createRestClient } from './base/rest';

export const fetchBackend = createRestClient(
  process.env.NEXT_PUBLIC_BACKEND_API_URL,
);
