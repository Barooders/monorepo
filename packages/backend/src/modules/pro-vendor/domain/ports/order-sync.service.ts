import { FulfillmentOrderToSyncOnVendor, ShippingDetails } from './types';

export abstract class IOrderSyncService {
  abstract createOrder(
    fulfillmentOrderToSync: FulfillmentOrderToSyncOnVendor,
  ): Promise<string | null>;

  abstract getShippingDetails(
    vendorId: string,
    externalOrderId: string,
  ): Promise<ShippingDetails | null>;
}
