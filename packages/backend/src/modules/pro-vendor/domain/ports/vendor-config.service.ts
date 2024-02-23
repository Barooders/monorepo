import { SynchronizedProVendor, VendorConfig } from '@config/vendor/types';

export abstract class IVendorConfigService {
  abstract setVendorConfigFromSlug(
    vendorSlug: SynchronizedProVendor,
  ): Promise<void>;
  abstract setVendorConfigForOrderSyncFromVendorId(
    vendorId: string,
  ): Promise<void>;
  abstract getVendorConfig(): VendorConfig;
}
