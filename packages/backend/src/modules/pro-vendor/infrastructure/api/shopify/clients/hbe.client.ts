import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HbeClient {
  private readonly logger = new Logger(HbeClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    if (!vendorConfig.hbe_shopify.accessToken) {
      throw new Error('Missing access token for HBE');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.hbe_shopify.apiUrl,
      accessToken: vendorConfig.hbe_shopify.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
