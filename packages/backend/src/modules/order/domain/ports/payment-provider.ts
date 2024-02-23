import { PaymentProvider } from '@libs/domain/prisma.main.client';

export abstract class IPaymentProvider {
  abstract readonly type: PaymentProvider;

  abstract executePayment(
    vendorPaymentProviderId: string,
    amountInCents: number,
    description: string,
  ): Promise<void>;
}
