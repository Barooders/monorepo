import {
  FullVendorConfig,
  SynchronizedProVendor,
  UNUSED_VENDOR_ID,
  VendorConfig,
} from '@config/vendor/types';
import { vendorConfig } from '@config/vendor/vendor.config';
import { CustomerRepository } from '@libs/domain/customer.repository';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VendorConfigService implements IVendorConfigService {
  private vendorConfig?: VendorConfig;

  constructor(private customerRepository: CustomerRepository) {}

  async setVendorConfigFromSlug(vendorSlug: SynchronizedProVendor) {
    if (!vendorConfig[vendorSlug]) {
      throw new Error(`Vendor slug ${vendorSlug} is not configured.`);
    }

    this.vendorConfig = await this.getVendorConfigWithVendorName(
      vendorConfig[vendorSlug],
    );
  }

  async setVendorConfigForOrderSyncFromVendorId(vendorId: string) {
    const matchedConfig = Object.values(vendorConfig).find(
      ({ vendorId: configVendorId, order }) =>
        configVendorId === vendorId && !!order,
    );

    if (!matchedConfig) {
      throw new Error(`Vendor ${vendorId} is not configured.`);
    }

    this.vendorConfig = await this.getVendorConfigWithVendorName(matchedConfig);
  }

  getVendorConfig() {
    if (!this.vendorConfig) {
      throw new Error('Vendor config is not set.');
    }

    return this.vendorConfig;
  }

  private async getVendorConfigWithVendorName(vendorConfig: FullVendorConfig) {
    if (vendorConfig.vendorId === UNUSED_VENDOR_ID)
      return {
        ...vendorConfig,
        vendorName: '',
      };

    const vendorName = (
      await this.customerRepository.getCustomerFromVendorId(
        vendorConfig.vendorId,
      )
    )?.sellerName;

    if (!vendorName)
      throw new Error(
        `Cannot find vendor name for id: ${vendorConfig.vendorId}`,
      );

    return {
      ...vendorConfig,
      vendorName,
    };
  }
}
