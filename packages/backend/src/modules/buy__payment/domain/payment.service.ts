import envConfig from '@config/env/env.config';
import {
  AggregateName,
  Checkout,
  EventName,
  PaymentAccountType,
  PaymentProvider,
  PaymentStatusType,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { Amount, UUID } from '@libs/domain/value-objects';
import { isOlderThan } from '@libs/helpers/dates';
import { jsonStringify } from '@libs/helpers/json';
import safeId from '@libs/helpers/safe-id';
import { Injectable, Logger } from '@nestjs/common';
import { first, last } from 'lodash';
import { PaymentSolution } from './config';
import { IInternalNotificationProvider } from './ports/internal-notification.repository';
import { IPaymentProvider } from './ports/payment-provider.repository';
import { IPaymentService } from './ports/payment-service';
import { IStore } from './ports/store.repository';
import {
  CartInfoType,
  CheckoutDetailsType,
  CustomerInfoType,
  EligibilityResponse,
} from './types';

@Injectable()
export class PaymentService implements IPaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    protected readonly paymentProviderRepository: IPaymentProvider,
    protected readonly storeRepository: IStore,
    protected readonly internalNotification: IInternalNotificationProvider,
    protected readonly prisma: PrismaMainClient,
  ) {}

  getOrCreateCheckout = async (cartInfo: CartInfoType): Promise<Checkout> => {
    const cart = await this.prisma.cart.upsert({
      where: { storeId: cartInfo.storeId },
      create: {
        storeId: cartInfo.storeId,
      },
      update: {},
    });

    const existingCheckout = await this.prisma.checkout.findFirst({
      where: {
        AND: {
          cartId: cart.id,
          checkoutLineItems: {
            some: {
              productId: cartInfo.products.find(
                (product) => product.productType !== 'Commission',
              )?.id,
            },
          },
        },
      },
    });

    if (existingCheckout) return existingCheckout;

    if (!cart.storeId) throw new Error(`Missing store id for cart ${cart.id}`);

    const checkout = await this.prisma.checkout.create({
      data: {
        id: safeId(),
        cartId: cart.id,
        status: 'ACTIVE',
      },
    });

    for (const lineItem of cartInfo.products) {
      await this.prisma.checkoutLineItem.create({
        data: {
          checkoutId: checkout.id,
          productId: lineItem.id,
        },
      });
    }

    return checkout;
  };

  async checkEligibility(
    customerInfo: Omit<CustomerInfoType, 'id'>,
    cartInfo: CartInfoType,
    checkoutId: string,
    paymentSolutionCode: PaymentSolution,
  ): Promise<EligibilityResponse[]> {
    const { notifyUrl, returnUrl } = this.getReturnUrls();

    const existingUser = await this.prisma.users.findFirst({
      where: { email: customerInfo.email },
    });

    const paymentAccount =
      (await this.prisma.paymentAccounts.findFirst({
        where: existingUser
          ? { customerId: existingUser?.id }
          : { email: customerInfo.email },
      })) ??
      (await this.prisma.paymentAccounts.create({
        data: {
          accountId: safeId(),
          provider: PaymentProvider.FLOA,
          type: PaymentAccountType.VENDOR,
          customerId: existingUser?.id,
          email: existingUser?.id ? null : customerInfo.email,
        },
      }));

    const orderDates = await this.prisma.order.findMany({
      where: {
        AND: {
          customerId: existingUser?.id,
          status: {
            notIn: ['CANCELED', 'RETURNED'],
          },
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const orderHistory = {
      firstOrderDate: first(orderDates)?.createdAt?.toISOString() ?? null,
      lastOrderDate: last(orderDates)?.createdAt?.toISOString() ?? null,
    };

    const totalAmount = new Amount(cartInfo.totalAmount);

    const payment = await this.prisma.payment.create({
      data: {
        id: safeId(),
        amountInCents: totalAmount.amountInCents,
        currency: totalAmount.currency,
        checkoutId,
        status: PaymentStatusType.CREATED,
        paymentSolutionCode,
        token: null,
        paymentUrl: null,
        paymentAccountId: paymentAccount.id,
      },
      select: {
        id: true,
        paymentSolutionCode: true,
      },
    });

    const eligibilities = await this.paymentProviderRepository.checkEligibility(
      {
        ...customerInfo,
        id: paymentAccount.accountId,
      },
      orderHistory,
      cartInfo,
      payment,
      returnUrl,
      notifyUrl,
    );

    for (const eligibility of eligibilities) {
      await this.prisma.payment.update({
        where: {
          id: eligibility.paymentId,
        },
        data: {
          status: eligibility.isEligible
            ? PaymentStatusType.ELIGIBLE
            : PaymentStatusType.NOT_ELIGIBLE,
          token: eligibility.token,
          paymentUrl: eligibility.paymentUrl,
        },
      });
    }

    return eligibilities;
  }

  async startPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUniqueOrThrow({
      where: { id: paymentId },
    });

    const paymentLink =
      payment.paymentUrl ?? (await this.createPaymentLink(paymentId));

    await this.prisma.event.create({
      data: {
        aggregateName: AggregateName.CART,
        aggregateId: payment.checkoutId,
        name: EventName.PAYMENT_STARTED,
        payload: {
          paymentId,
          amount: payment.amountInCents,
        },
      },
    });

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatusType.STARTED },
    });

    return paymentLink;
  }

  async updatePaymentStatusFromOrder(
    orderId: UUID,
    checkoutStoreToken: string | null,
  ): Promise<string | null> {
    const dbCheckout = await this.prisma.checkout.findFirst({
      where: {
        cart: {
          storeId: checkoutStoreToken,
        },
      },
    });

    if (!dbCheckout) {
      this.logger.debug(
        `No checkout found for ${jsonStringify({
          orderId,
          checkoutStoreToken,
        })}`,
      );
      return null;
    }

    const { id: checkoutId } = dbCheckout;

    const relatedPayments = await this.prisma.payment.findMany({
      where: {
        AND: {
          checkoutId,
          status: PaymentStatusType.VALIDATED,
        },
      },
    });

    await Promise.all(
      relatedPayments.map((payment) =>
        this.updatePaymentStatus(payment.id, PaymentStatusType.ORDER_CREATED),
      ),
    );

    return checkoutId;
  }

  async linkCheckoutToOrder(
    orderId: UUID,
    checkoutId: string | null,
  ): Promise<void> {
    if (!checkoutId) {
      this.logger.debug(`No checkout id to link to order ${orderId.uuid}`);
      return;
    }

    await this.prisma.order.update({
      where: {
        id: orderId.uuid,
      },
      data: {
        checkoutId,
      },
    });
  }

  async updatePaymentStatus(
    paymentId: string,
    newStatus: PaymentStatusType,
    reason?: string,
    fullPayload?: string,
  ) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id: paymentId,
      },
    });

    if (!payment) {
      throw new Error(`Could not find payment for payment ${paymentId}`);
    }

    if (!payment.paymentAccountId) {
      throw new Error(`No account linked to payment ${paymentId}`);
    }

    const checkout = await this.prisma.checkout.findUnique({
      where: { id: payment.checkoutId },
      include: { cart: true, checkoutLineItems: true },
    });

    if (payment.updatedAt && isOlderThan(payment.updatedAt, 2)) {
      const customer = await this.prisma.paymentAccounts.findFirst({
        where: { accountId: payment.paymentAccountId },
        select: {
          email: true,
          customer: { select: { user: { select: { email: true } } } },
        },
      });

      const customerEmail =
        customer?.email ?? customer?.customer?.user.email ?? '';
      const notification = `
🔔 *New status for Floa Payment:*

📜 Status: ${newStatus.toString()}
💰 Amount: ${payment.amountInCents / 100}
🚴 Customer: ${customerEmail}
🚲 Product Link: ${envConfig.frontendBaseUrl}/admin/products/${
        first(checkout?.checkoutLineItems)?.productId ?? ''
      }
💬 Reason: ${reason}
`;

      await this.internalNotification.notifyStatusChangeOnFloaPayment(
        notification,
      );
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: newStatus },
    });

    await this.prisma.event.create({
      data: {
        aggregateName: AggregateName.CART,
        aggregateId: payment.checkoutId,
        name: EventName.PAYMENT_STATUS_UPDATED,
        payload: {
          paymentId: payment.id,
          amount: payment.amountInCents,
          newStatus,
        },
        metadata: {
          reason,
          fullPayload,
        },
      },
    });

    let checkoutUrl;
    try {
      checkoutUrl = await this.storeRepository.getCheckoutUrl(
        checkout?.cart.storeId ?? '',
      );
      if (newStatus === PaymentStatusType.VALIDATED) {
        await this.storeRepository.validateCart(payment.checkoutId);
      }
    } catch (e) {
      this.logger.warn(
        `Could not find checkout url for cart: ${payment.checkoutId}`,
        e,
      );
    }

    return checkoutUrl;
  }

  private async createPaymentLink(paymentId: string) {
    const { notifyUrl, returnUrl } = this.getReturnUrls();
    const payment = await this.prisma.payment.findUniqueOrThrow({
      where: { id: paymentId },
      include: {
        checkout: { include: { cart: true } },
      },
    });

    let checkoutDetails: CheckoutDetailsType | null = null;
    try {
      if (!payment.checkout.cart.storeId)
        throw new Error('No store id for this cart');
      checkoutDetails = await this.storeRepository.getCheckoutDetails(
        payment.checkout.cart.storeId,
      );
    } catch (e) {
      this.logger.warn(
        `Could not fetch checkout details with checkout ${payment.checkout.id}`,
      );
      this.logger.warn(e);
    }

    if (!payment.token)
      throw new Error(`No token found for payment ${paymentId}`);

    const paymentLink = await this.paymentProviderRepository.createPaymentLink(
      payment.token,
      returnUrl,
      notifyUrl,
      payment.paymentSolutionCode as PaymentSolution,
      payment.id,
      checkoutDetails,
    );

    return paymentLink;
  }

  private getReturnUrls = () => {
    const notifyUrl = `${envConfig.backendBaseUrl}/v1/buy/payment/notify`;
    const returnUrl = notifyUrl;

    return { returnUrl, notifyUrl };
  };
}
