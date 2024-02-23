import { OrderVendorInput, ShippingDetails } from './types';

export interface OrderSyncServiceStrategy {
  createOrder(order: OrderVendorInput): Promise<string>;
  getShippingDetails(externalOrderId: string): Promise<ShippingDetails | null>;
}
