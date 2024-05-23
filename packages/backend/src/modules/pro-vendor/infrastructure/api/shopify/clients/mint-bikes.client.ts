import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MintBikesClient {
  private readonly logger = new Logger(MintBikesClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!vendorConfig.mint_bikes.accessToken) {
      throw new Error('Missing access token for Mint Bikes');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.mint_bikes.apiUrl,
      accessToken: vendorConfig.mint_bikes.accessToken,
      ...DEFAULT_PLAN_CONFIG,
      apiVersion: '2024-01',
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
