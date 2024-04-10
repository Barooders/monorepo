import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AllCyclesClient {
  private readonly logger = new Logger(AllCyclesClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    if (!vendorConfig.all_cycles.accessToken) {
      throw new Error('Missing access token for All Cycles');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.all_cycles.apiUrl,
      accessToken: vendorConfig.all_cycles.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
