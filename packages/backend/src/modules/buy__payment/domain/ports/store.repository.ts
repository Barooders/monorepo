import { CheckoutDetailsType } from '../types';

export abstract class IStore {
  abstract validateCart: (cartId: string) => Promise<void>;
  abstract getCheckoutUrl: (cartId: string) => Promise<string | undefined>;
  abstract getCheckoutDetails: (cartId: string) => Promise<CheckoutDetailsType>;
}
