import envConfig from '@config/env/env.config';
import Medusa from '@medusajs/medusa-js';

export const medusaClient = new Medusa({
  baseUrl: envConfig.externalServices.medusa.baseUrl,
  maxRetries: 3,
  apiKey: envConfig.externalServices.medusa.apiKey,
});
