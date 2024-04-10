import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PilatClient {
  private readonly logger = new Logger(PilatClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    if (!vendorConfig.pilat.accessToken) {
      throw new Error('Missing access token for Cycles Pilat');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.pilat.apiUrl,
      accessToken: vendorConfig.pilat.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
