/* eslint-disable no-console */
import { DEBUG, envConfig, EnvType } from '../config';

export const graphQLClient = async <Payload>(
  env: EnvType,
  body: Record<string, unknown>,
) => {
  const config = envConfig[env];

  const result = await fetch(config.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': config.apiToken,
    },
    body: JSON.stringify(body),
  });

  const response = await result.json();
  const hasUserErrors = Object.values(response.data ?? {})
    .filter((result) => !!result)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .map((result: Record<string, unknown>) => result.userErrors)
    .some((userErrors) => Array.isArray(userErrors) && userErrors.length > 0);

  if (DEBUG || response.errors || hasUserErrors) {
    console.log(`\n============\nCALL on ${config.baseUrl}:`);
    console.log('>> BODY:', JSON.stringify(body, null, 2));
    console.log('>> RESPONSE', JSON.stringify(response, null, 2));
  }

  if (response.errors || hasUserErrors) {
    throw Error(JSON.stringify(response.errors, null, 2));
  }

  return response as { data: Payload };
};
