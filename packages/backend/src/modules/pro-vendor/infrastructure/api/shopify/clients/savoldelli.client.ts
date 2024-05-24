import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SavoldelliClient {
  private readonly logger = new Logger(SavoldelliClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!vendorConfig.savoldelli.accessToken) {
      throw new Error('Missing access token for Savoldelli');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.savoldelli.apiUrl,
      accessToken: vendorConfig.savoldelli.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
