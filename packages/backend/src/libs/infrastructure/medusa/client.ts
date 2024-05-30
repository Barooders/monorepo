import envConfig from '@config/env/env.config';
import Medusa, { ResponsePromise } from '@medusajs/medusa-js';
import { Logger } from '@nestjs/common';

export const medusaClient = new Medusa({
  baseUrl: envConfig.externalServices.medusa.baseUrl,
  maxRetries: 3,
  apiKey: envConfig.externalServices.medusa.apiKey,
});

export const handleMedusaResponse = async <T>(
  call: ResponsePromise<T>,
  logger: Logger,
) => {
  const { response, ...data } = await call;

  if (response.status >= 300) {
    logger.error('Failed to process Medusa request', response);

    throw new Error('Failed to process Medusa request');
  }

  return data as T;
};
