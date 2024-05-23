import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChrisBikesClient {
  private readonly logger = new Logger(ChrisBikesClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!vendorConfig.chris_bikes.accessToken) {
      throw new Error('Missing access token for Chris Bikes');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.chris_bikes.apiUrl,
      accessToken: vendorConfig.chris_bikes.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
