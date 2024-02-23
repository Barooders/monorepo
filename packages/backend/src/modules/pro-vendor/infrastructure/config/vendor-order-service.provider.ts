import { FullVendorConfig, VendorType } from '@config/vendor/types';
import { vendorConfig } from '@config/vendor/vendor.config';
import { OrderSyncServiceStrategy } from '@modules/pro-vendor/domain/ports/order-sync-service.strategy';
import { IVendorOrderServiceProvider } from '@modules/pro-vendor/domain/ports/vendor-order-service.provider';
import { Injectable } from '@nestjs/common';
import { PrestashopOrderService } from '../api/prestashop/prestashop-order.service';
import { ShopifyOrderService } from '../api/shopify/shopify-order.service';

@Injectable()
export class VendorOrderServiceProvider implements IVendorOrderServiceProvider {
  private vendorConfig?: FullVendorConfig;

  constructor(
    private prestashopOrderService: PrestashopOrderService,
    private shopifyOrderService: ShopifyOrderService,
  ) {}

  setVendorConfigFromVendorId(vendorId: string) {
    const matchedConfig = Object.values(vendorConfig).find(
      ({ vendorId: configVendorId, order }) =>
        configVendorId === vendorId && !!order,
    );

    if (!matchedConfig) {
      throw new Error(`Vendor ${vendorId} is not configured.`);
    }

    this.vendorConfig = matchedConfig;
  }

  getService(): OrderSyncServiceStrategy {
    switch (this.getVendorConfig().type) {
      case VendorType.PRESTASHOP:
        return this.prestashopOrderService;
      case VendorType.SHOPIFY:
        return this.shopifyOrderService;
      default:
        throw new Error(
          `Vendor type ${
            this.getVendorConfig().type
          } is not supported for order sync.`,
        );
    }
  }

  private getVendorConfig(): FullVendorConfig {
    if (!this.vendorConfig) {
      throw new Error('Vendor config is not set.');
    }

    return this.vendorConfig;
  }
}
