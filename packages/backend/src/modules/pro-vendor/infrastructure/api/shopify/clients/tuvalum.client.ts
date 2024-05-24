import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TuvalumClient {
  private readonly logger = new Logger(TuvalumClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!vendorConfig.tuvalum_v2.accessToken) {
      throw new Error('Missing access token for Tuvalum');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.tuvalum_v2.apiUrl,
      accessToken: vendorConfig.tuvalum_v2.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
