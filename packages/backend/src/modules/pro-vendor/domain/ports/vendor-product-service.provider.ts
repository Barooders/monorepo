import { SynchronizedProVendor } from '@config/vendor/types';
import { ProVendorStrategy } from './pro-vendor.strategy';

export abstract class IVendorProductServiceProvider {
  abstract setVendorConfigFromSlug(vendorSlug: SynchronizedProVendor): void;
  abstract getService(): ProVendorStrategy;
}
