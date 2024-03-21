import { PaymentSolutionCode } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { PaymentSolutionConfigType } from '../config';

export abstract class IPaymentService {
  abstract updatePaymentStatusFromOrder(
    orderId: UUID,
    checkoutStoreToken: string | null,
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
