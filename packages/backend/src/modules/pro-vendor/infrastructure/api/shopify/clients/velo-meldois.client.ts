import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VeloMeldoisClient {
  private readonly logger = new Logger(VeloMeldoisClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!vendorConfig.velo_meldois.accessToken) {
      throw new Error('Missing access token for VeloMeldois');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.velo_meldois.apiUrl,
      accessToken: vendorConfig.velo_meldois.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
