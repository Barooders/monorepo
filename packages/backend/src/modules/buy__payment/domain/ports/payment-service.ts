import { PaymentSolutionCode } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { OrderToStore } from '@modules/order/domain/order-creation.service';
import { PaymentSolutionConfigType } from '../config';

export abstract class IPaymentService {
  abstract updatePaymentStatusFromOrder(
    order: OrderToStore,
    checkoutStoreToken: string | null,
    checkoutPaymentLabel: string,
  ): Promise<string | null>;

  abstract linkCheckoutToOrder(
    orderId: UUID,
    checkoutId: string | null,
  ): Promise<void>;

  abstract getPaymentConfig({
    code,
    checkoutLabel,
  }: {
    code?: PaymentSolutionCode;
    checkoutLabel?: string;
  }): PaymentSolutionConfigType | null;
}
