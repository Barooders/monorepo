import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_AUTO_LIMIT_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class ChrisBikesClient {
  private readonly logger = new Logger(ChrisBikesClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.chris_bikes.accessToken) {
      throw new Error('Missing access token for Chris Bikes');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.chris_bikes.apiUrl,
      accessToken: vendorConfig.chris_bikes.accessToken,
      autoLimit: DEFAULT_PLAN_AUTO_LIMIT_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
