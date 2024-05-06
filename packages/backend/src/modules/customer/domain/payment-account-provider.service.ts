import { ExceptionBase } from '@libs/domain/exceptions';
import {
  PaymentAccounts,
  PaymentAccountType,
  PaymentProvider,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { CurrencyCode } from '@libs/types/common/money.types';
import { Injectable, Logger } from '@nestjs/common';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { IPaymentProvider } from './ports/payment-provider';

export interface UncompleteVendorForPayout {
  email: string;
  vendorPaymentProviderId?: string;
}

export interface Wallet {
  balance: {
    amountInCents: number;
    currency: CurrencyCode;
  };
  links: {
    onboardingLink?: string;
    accountLoginLink?: string;
  };
}

export class NoCompletePaymentAccountException extends ExceptionBase {
  public allAccountIds: string[];
  public email: string;

  constructor(
    email: string,
    paymentProvider: PaymentProvider,
    allAccountIds: string[],
  ) {
    super(
      `Cannot find complete payment account for ${email} on ${paymentProvider}`,
    );
    this.allAccountIds = allAccountIds;
    this.email = email;
  }

  readonly code = 'CUSTOMER.NO_PAYMENT_ACCOUNT';
}

@Injectable()
export class PaymentAccountProviderService {
  private readonly logger: Logger = new Logger(
    PaymentAccountProviderService.name,
  );

  constructor(
    private prisma: PrismaMainClient,
    private paymentProvider: IPaymentProvider,
    private internalNotificationClient: IInternalNotificationClient,
  ) {}

  async getPaymentAccount(vendorId: string): Promise<PaymentAccounts> {
    const provider = this.paymentProvider.type;

    const existingPaymentAccount = await this.getExistingPaymentAccount(
      vendorId,
      provider,
    );

    if (existingPaymentAccount) return existingPaymentAccount;

    const { email } = await this.prisma.users.findFirstOrThrow({
      where: {
        id: vendorId,
      },
    });

    if (!email) throw new Error(`No email found for vendor ${vendorId}`);

    const { completeAccountIds, allAccountIds } =
      await this.paymentProvider.getPaymentAccountsFromEmail(email);

    if (completeAccountIds.length === 0)
      throw new NoCompletePaymentAccountException(
        email,
        this.paymentProvider.type,
        allAccountIds,
      );

    const fetchedPaymentAccountId = completeAccountIds[0];

    if (completeAccountIds.length > 1) {
      this.logger.warn(
        `Found multiple payment accounts for ${email} on ${provider}`,
      );
      await this.internalNotificationClient.sendErrorNotification(`
          ⚠️ Plusieurs comptes ${provider} valides (complets) ont été trouvés pour l'utilisateur ${email}
          🔗 Le plus récent a été sélectionné: ${fetchedPaymentAccountId}
      `);
    }

    const createdPaymentAccount = await this.prisma.paymentAccounts.create({
      data: {
        customer: { connect: { authUserId: vendorId } },
        accountId: fetchedPaymentAccountId,
        type: PaymentAccountType.VENDOR,
        provider,
      },
    });
    this.logger.debug(
      `Created payment account ${fetchedPaymentAccountId} in DB for vendor ${vendorId}`,
    );

    return createdPaymentAccount;
  }

  async getWallet(vendorId: string): Promise<Wallet> {
    try {
      const { accountId } = await this.getPaymentAccount(vendorId);

      const { balance, accountLoginLink } =
        await this.paymentProvider.getDetailedPaymentAccount(accountId);

      return {
        balance,
        links: {
          accountLoginLink,
        },
      };
    } catch (error) {
      if (error instanceof NoCompletePaymentAccountException) {
        this.logger.debug(error.message);
        const onboardingLink = await this.createOnboardingLink(
          error.allAccountIds,
          error.email,
        );
        return {
          balance: {
            amountInCents: 0,
            currency: CurrencyCode.EUR,
          },
          links: {
            onboardingLink,
          },
        };
      }

      throw error;
    }
  }

  private async getExistingPaymentAccount(
    vendorId: string,
    provider: PaymentProvider,
  ): Promise<PaymentAccounts | null> {
    const paymentAccounts = await this.prisma.paymentAccounts.findMany({
      where: {
        customer: {
          authUserId: vendorId,
        },
        provider,
      },
    });

    if (paymentAccounts.length > 1) {
      throw new Error(
        `Multiple payment accounts found in DB for vendor ${vendorId} and provider ${provider}`,
      );
    }

    if (paymentAccounts.length === 1) {
      return paymentAccounts[0];
    }

    return null;
  }

  private async createOnboardingLink(
    allAccountIds: string[],
    email: string,
  ): Promise<string> {
    if (allAccountIds.length === 0) {
      this.logger.debug(`No account found for ${email}, will create one`);
      return await this.createNewAccountOnboardingLink(email);
    }

    try {
      return await this.paymentProvider.getOnboardingLink(allAccountIds[0]);
    } catch (error: any) {
      this.logger.debug(`allAccountIds: ${allAccountIds}`);
      this.logger.error(
        `Will create a new account because: ${error.message}`,
        error,
      );
      return await this.createNewAccountOnboardingLink(email);
    }
  }

  private async createNewAccountOnboardingLink(email: string): Promise<string> {
    const newAccountId = await this.paymentProvider.createNewAccount(email);
    this.logger.debug(`Created new account ${newAccountId} for ${email}`);
    return await this.paymentProvider.getOnboardingLink(newAccountId);
  }
}
