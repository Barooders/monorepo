import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TechniCyclesClient {
  private readonly logger = new Logger(TechniCyclesClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    if (!vendorConfig.techni_cycles.accessToken) {
      throw new Error('Missing access token for Techni Cycles');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.techni_cycles.apiUrl,
      accessToken: vendorConfig.techni_cycles.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
