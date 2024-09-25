import { OrderToStore } from './types';

export abstract class IShippingClient {
  abstract getOrcreateShippingLabelStreamFromOrderName(
    orderName: string,
  ): Promise<Buffer>;

  abstract createShipmentFromOrder(orderName: OrderToStore): Promise<void>;
}
