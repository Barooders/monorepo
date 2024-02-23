import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_AUTO_LIMIT_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class MintBikesClient {
  private readonly logger = new Logger(MintBikesClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.mint_bikes.accessToken) {
      throw new Error('Missing access token for Mint Bikes');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.mint_bikes.apiUrl,
      accessToken: vendorConfig.mint_bikes.accessToken,
      autoLimit: DEFAULT_PLAN_AUTO_LIMIT_CONFIG,
      apiVersion: '2024-01',
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
