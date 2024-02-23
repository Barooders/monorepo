import { createRestClient } from './base/rest';

export const fetchStrapi = createRestClient(process.env.NEXT_PUBLIC_STRAPI_URL);
