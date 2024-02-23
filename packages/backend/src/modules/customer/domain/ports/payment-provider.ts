import { PaymentProvider } from '@libs/domain/prisma.main.client';
import { CurrencyCode } from '@libs/types/common/money.types';

export interface Balance {
  amountInCents: number;
  currency: CurrencyCode;
}

export interface PaymentAccount {
  balance: Balance;
  accountLoginLink?: string;
}

export interface PaymentAccountSearchResult {
  completeAccountIds: string[];
  allAccountIds: string[];
}
export abstract class IPaymentProvider {
  abstract readonly type: PaymentProvider;

  abstract getPaymentAccountsFromEmail(
    email: string,
  ): Promise<PaymentAccountSearchResult>;
  abstract getDetailedPaymentAccount(
    paymentAccountId: string,
  ): Promise<PaymentAccount>;
  abstract getOnboardingLink(paymentAccountId: string): Promise<string>;
  abstract createNewAccount(email: string): Promise<string>;
}
