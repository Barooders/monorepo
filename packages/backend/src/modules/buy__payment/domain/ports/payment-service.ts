import { UUID } from '@libs/domain/value-objects';

export abstract class IPaymentService {
  abstract updatePaymentStatusFromOrder(
    orderId: UUID,
    checkoutStoreToken: string | null,
  ): Promise<string | null>;

  abstract linkCheckoutToOrder(
    orderId: UUID,
    checkoutId: string | null,
  ): Promise<void>;
}
