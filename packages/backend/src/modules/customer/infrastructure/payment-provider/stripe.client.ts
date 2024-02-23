import envConfig from '@config/env/env.config';
import { PaymentProvider } from '@libs/domain/prisma.main.client';
import { base64_encode } from '@libs/helpers/base64';
import { CurrencyCode } from '@libs/types/common/money.types';
import {
  Balance,
  IPaymentProvider,
  PaymentAccount,
  PaymentAccountSearchResult,
} from '@modules/customer/domain/ports/payment-provider';
import { Injectable, Logger } from '@nestjs/common';

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

const frontendAccountPage = `https://${envConfig.externalServices.shopify.shopDns}/account`;

interface StripeListDataItem {
  id: string;
  object: string;
  payouts_enabled: boolean;
  created: number;
}

interface StripeBalance {
  available: { amount: number; currency: string }[];
}

interface StripeLink {
  url: string;
}

@Injectable()
export class StripeClient implements IPaymentProvider {
  public readonly type = PaymentProvider.STRIPE;

  private readonly logger: Logger = new Logger(StripeClient.name);

  async getPaymentAccountsFromEmail(
    email: string,
  ): Promise<PaymentAccountSearchResult> {
    const endpoint = new URL(`${STRIPE_BASE_URL}/search`);
    endpoint.search = new URLSearchParams({
      query: email,
    }).toString();

    const response = await fetch(endpoint.href, DEFAULT_OPTIONS);

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(
        `Cannot search ${email} on String because of: [${error.code}] ${error.message}`,
      );
    }

    const { data } = (await response.json()) as { data: StripeListDataItem[] };

    const sortedAccounts = data
      .filter(({ object }) => object === 'account')
      .sort((a, b) => b.created - a.created);

    return {
      completeAccountIds: sortedAccounts
        .filter(({ payouts_enabled }) => payouts_enabled)
        .map(({ id }) => id),
      allAccountIds: sortedAccounts.map(({ id }) => id),
    };
  }

  async getDetailedPaymentAccount(
    paymentAccountId: string,
  ): Promise<PaymentAccount> {
    const balance = await this.getBalance(paymentAccountId);
    const accountLoginLink = await this.getAccountLoginLink(paymentAccountId);

    return {
      balance,
      accountLoginLink,
    };
  }

  async getOnboardingLink(paymentAccountId: string): Promise<string> {
    const response = await fetch(`${STRIPE_BASE_URL}/account_links`, {
      ...DEFAULT_OPTIONS,
      method: 'POST',
      headers: {
        ...DEFAULT_OPTIONS.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        type: 'account_onboarding',
        account: paymentAccountId,
        return_url: frontendAccountPage,
        refresh_url: frontendAccountPage,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(
        `Cannot get onboarding link for ${paymentAccountId} because of: [${error.code}] ${error.message}`,
      );
    }

    const { url } = (await response.json()) as StripeLink;

    return url;
  }

  async createNewAccount(email: string): Promise<string> {
    const response = await fetch(`${STRIPE_BASE_URL}/accounts`, {
      ...DEFAULT_OPTIONS,
      method: 'POST',
      headers: {
        ...DEFAULT_OPTIONS.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        type: 'express',
        country: 'FR',
        email,
        business_type: 'individual',
        'business_profile[url]': 'https://barooders.com',
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(
        `Cannot create a new account for (${email}) because of: [${error.code}] ${error.message}`,
      );
    }

    const { id } = (await response.json()) as StripeListDataItem;

    return id;
  }

  private async getAccountLoginLink(paymentAccountId: string): Promise<string> {
    const response = await fetch(
      `${STRIPE_BASE_URL}/accounts/${paymentAccountId}/login_links`,
      {
        ...DEFAULT_OPTIONS,
        method: 'POST',
      },
    );

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(
        `Cannot get account login link for ${paymentAccountId} because of: [${error.code}] ${error.message}`,
      );
    }

    const { url } = (await response.json()) as StripeLink;

    return url;
  }

  private async getBalance(paymentAccountId: string): Promise<Balance> {
    const response = await fetch(`${STRIPE_BASE_URL}/balance`, {
      ...DEFAULT_OPTIONS,
      headers: {
        ...DEFAULT_OPTIONS.headers,
        'Stripe-account': paymentAccountId,
      },
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(
        `Cannot get account balance for ${paymentAccountId} because of: [${error.code}] ${error.message}`,
      );
    }

    const { available } = (await response.json()) as StripeBalance;

    return {
      amountInCents:
        available.find((balance) => balance.currency === 'eur')?.amount ?? 0,
      currency: CurrencyCode.EUR,
    };
  }
}
