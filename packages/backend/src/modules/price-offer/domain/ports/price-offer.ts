import { IOrder } from 'shopify-api-node';

export abstract class IPriceOfferService {
  abstract updatePriceOfferStatusFromOrder(order: IOrder): Promise<void>;
}
