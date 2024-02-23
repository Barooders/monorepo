import { jsonStringify } from '@libs/helpers/json';
import envConfig from '@config/env/env.config';
import { DocumentNode, print } from 'graphql';

const shopifyConfig = envConfig.externalServices.shopify;

export const fetchShopifyGraphQL = async <
  ResponseType,
  VariablesType = Record<string, unknown>,
>(
  query: DocumentNode,
  { variables }: { variables?: VariablesType },
): Promise<ResponseType> => {
  const result = await fetch(
    `https://${shopifyConfig.shop}/admin/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopifyConfig.accessToken,
      },
      body: jsonStringify({ query: print(query), variables }),
    },
  );

  const response = await result.json();
  const hasUserErrors = Object.values(response.data ?? {})
    .filter((result) => !!result)
    // @ts-expect-error implicit-any
    .map((result: Record<string, unknown>) => result.userErrors)
    .some((userErrors) => Array.isArray(userErrors) && userErrors.length > 0);

  if (response.errors || hasUserErrors) {
    throw Error(jsonStringify(response.errors));
  }

  return response.data as ResponseType;
};
