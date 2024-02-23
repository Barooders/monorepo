import { OrderSyncServiceStrategy } from './order-sync-service.strategy';

export abstract class IVendorOrderServiceProvider {
  abstract setVendorConfigFromVendorId(vendorId: string): void;
  abstract getService(): OrderSyncServiceStrategy;
}
