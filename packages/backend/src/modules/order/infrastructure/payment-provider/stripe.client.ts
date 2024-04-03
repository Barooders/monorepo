import envConfig from '@config/env/env.config';
import { PaymentProvider } from '@libs/domain/prisma.main.client';
import { Amount } from '@libs/domain/value-objects';
import { base64_encode } from '@libs/helpers/base64';
import { IPaymentProvider } from '@modules/order/domain/ports/payment-provider';
import { Injectable } from '@nestjs/common';

const STRIPE_BASE_URL = 'https://api.stripe.com/v1';
const BASE_64_TOKEN = base64_encode(
  `${envConfig.externalServices.stripe.secretKey}:`,
);
const DEFAULT_OPTIONS = {
  method: 'GET',
  headers: {
    Authorization: `Basic ${BASE_64_TOKEN}`,
  },
};

@Injectable()
export class StripeClient implements IPaymentProvider {
  public readonly type = PaymentProvider.STRIPE;

  async executePayment(
    vendorPaymentProviderId: string,
    amount: Amount,
    description: string,
  ): Promise<void> {
    const endpoint = new URL(`${STRIPE_BASE_URL}/transfers`);
    endpoint.search = new URLSearchParams({
      amount: amount.amountInCents.toString(),
      currency: 'eur',
      destination: vendorPaymentProviderId,
      description,
    }).toString();

    const response = await fetch(endpoint.href, {
      ...DEFAULT_OPTIONS,
      method: 'POST',
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(
        `Cannot send ${amount.formattedAmount}€ to ${vendorPaymentProviderId} because of: [${error.code}] ${error.message}`,
      );
    }
  }
}
