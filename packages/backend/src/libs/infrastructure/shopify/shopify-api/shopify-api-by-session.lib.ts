import { shopifyConfig } from '@config/shopify.config';
import { GraphQLException } from '@libs/domain/exceptions';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable } from '@nestjs/common';
import {
  ApiVersion,
  GraphqlParams,
  LATEST_API_VERSION,
  RequestReturn,
  Shopify,
  shopifyApi,
} from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/node';
import {
  restResources,
  RestResources,
} from '@shopify/shopify-api/rest/admin/2023-01';
import { PostgreSQLSessionStorage } from '../session-storage/postgresql-session-storage/postgresql-session-storage.lib';

@Injectable()
export class ShopifyApiBySession {
  private readonly shopify: Shopify<RestResources>;

  constructor(private shopifySessionStorage: PostgreSQLSessionStorage) {
    const { apiKey, apiSecret, scopes, hostname } = shopifyConfig.customApp;

    this.shopify = shopifyApi({
      apiKey,
      apiSecretKey: apiSecret,
      scopes,
      hostName: hostname,
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: false,
      restResources,
    });
  }

  getInstance() {
    return this.shopify;
  }
  async getSession() {
    const session = await this.shopifySessionStorage.loadSession(
      `offline_${shopifyConfig.shop}`,
    );

    if (!session) throw new Error('Session not found');
    return session;
  }

  async getGraphqlClient() {
    const client = new this.shopify.clients.Graphql({
      session: await this.getSession(),
      apiVersion: ApiVersion.January23,
    });

    return {
      query: async <ResponseType>(params: GraphqlParams) => {
        try {
          const result = await client.query<any>(params);
          return result as RequestReturn<ResponseType>;
        } catch (e) {
          const graphqlError = e as {
            response: { errors: { message: string }[] | undefined };
          };
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (graphqlError.response) {
            const errors = graphqlError.response.errors;
            throw new GraphQLException(
              errors
                ? errors.map((error) => error.message).join('\n')
                : jsonStringify(graphqlError.response),
            );
          }

          throw e;
        }
      },
    };
  }
}
