import { PaymentProvider } from '@libs/domain/prisma.main.client';
import { Amount } from '@libs/domain/value-objects';

export abstract class IPaymentProvider {
  abstract readonly type: PaymentProvider;

  abstract executePayment(
    vendorPaymentProviderId: string,
    amount: Amount,
    description: string,
  ): Promise<void>;
}
