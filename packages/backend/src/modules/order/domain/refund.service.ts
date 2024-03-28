import envConfig from '@config/env/env.config';
import {
  Customer,
  Order,
  OrderLines,
  OrderStatus,
  PaymentStatusType,
  PrismaMainClient,
  ShippingSolution,
  users,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { paymentSolutionConfig } from '@modules/buy__payment/domain/config';
import { Injectable, Logger } from '@nestjs/common';
import dayjs from 'dayjs';
import { OrderNotificationService } from './order-notification.service';
import { OrderUpdateService } from './order-update.service';
import { UserNotOrderLineVendorException } from './ports/exceptions';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { IStoreClient } from './ports/store.client';
import { OrderCancelledData } from './ports/types';

const MANUAL_PAYMENT_CODES = Object.values(paymentSolutionConfig)
  .filter((paymentSolution) => paymentSolution.needManualRefund)
  .map((paymentSolution) => paymentSolution.code);

const mapOrderToRefund = (
  productName: string,
  order: Order & { customer: Customer | null },
  vendor: (Customer & { user: users }) | null,
) => ({
  customer: {
    email: order.customerEmail,
    firstName: order.customer?.firstName ?? '',
    fullName: order.customer
      ? `${order.customer.firstName} ${order.customer.lastName}`
      : '',
  },
  vendor: vendor?.user.email
    ? {
        email: vendor.user.email,
        firstName: vendor.firstName ?? '',
        fullName: `${vendor.firstName} ${vendor.lastName}`,
      }
    : null,
  productName,
  order,
});

const getOrderLinkMrkdwn = (order: Order) => {
  const orderAdminUrl = `https://${envConfig.externalServices.shopify.shopDns}/admin/orders/${order.shopifyId}`;
  return `<${orderAdminUrl}|${order.name}>`;
};

const REFUND_ORDERS_PAID_X_DAYS_AGO = {
  b2c: 15,
  c2c: 10,
};

@Injectable()
export class RefundService {
  private readonly logger = new Logger(RefundService.name);

  constructor(
    private mainPrisma: PrismaMainClient,
    private orderUpdateService: OrderUpdateService,
    private internalNotificationClient: IInternalNotificationClient,
    private storeClient: IStoreClient,
    private orderNotificationService: OrderNotificationService,
  ) {}

  async cancelOrderLineByUser(
    orderLineId: string,
    author: Author,
  ): Promise<void> {
    const { vendorId, order, vendor, name } =
      await this.mainPrisma.orderLines.findFirstOrThrow({
        where: {
          id: orderLineId,
        },
        include: {
          order: {
            include: {
              customer: true,
            },
          },
          vendor: {
            include: {
              user: true,
            },
          },
        },
      });

    if (vendorId !== author.id)
      throw new UserNotOrderLineVendorException(orderLineId, author.id);

    if (
      order.status !== OrderStatus.LABELED &&
      order.status !== OrderStatus.PAID
    ) {
      throw new Error(
        `Cannot cancel order line ${orderLineId} because order ${order.id} is not in LABELED or PAID status, is ${order.status}`,
      );
    }

    await this.processCancel(mapOrderToRefund(name, order, vendor), author);

    await this.internalNotificationClient.sendOrderCanceledNotification(`
    🚨 La commande ${getOrderLinkMrkdwn(
      order,
    )} vient d'être annulée par le vendeur :
		${this.getNotificationDetails(order, {
      isPro: !!vendor?.isPro,
      sellerName: vendor?.sellerName ?? '',
    })}`);
  }

  async refundUnfulfilledOrders(): Promise<void> {
    const ordersToRefund = await this.getOrderToRefund();

    this.logger.warn(`Will refund ${ordersToRefund.length} orders`);

    await Promise.allSettled(
      ordersToRefund.map(async (order) => {
        const orderLink = getOrderLinkMrkdwn(order);
        try {
          const firstOrderLine = order.orderLines[0];
          await this.processCancel(
            mapOrderToRefund(firstOrderLine.name, order, firstOrderLine.vendor),
            {
              type: 'backend',
            },
          );

          await this.internalNotificationClient.sendOrderCanceledNotification(`
        🤖 La commande ${orderLink} vient d'être annulée automatiquement:
				${this.getNotificationDetails(order, {
          isPro: !!firstOrderLine.vendor?.isPro,
          sellerName: firstOrderLine.vendor?.sellerName ?? '',
        })}`);
        } catch (error: any) {
          this.logger.error(
            `Error while refunding order ${order.id}: ${error.message}`,
            error,
          );
          await this.internalNotificationClient.sendOrderCanceledNotification(`
            ❌ La commande ${orderLink} n'a pas pu être annulée automatiquement. Erreur: ${error.message}`);
        }
      }),
    );
  }

  async cancelOrder(orderId: string, author: Author): Promise<void> {
    const { order, disputes, vendor, name } =
      await this.mainPrisma.orderLines.findFirstOrThrow({
        where: {
          order: {
            id: orderId,
          },
        },
        include: {
          order: {
            include: {
              customer: true,
            },
          },
          vendor: {
            include: {
              user: true,
            },
          },
          disputes: true,
        },
      });

    const isCancellable =
      order.status === OrderStatus.CREATED ||
      order.status === OrderStatus.PAID ||
      order.status === OrderStatus.LABELED;
    const hasDispute = disputes.length > 0;

    if (!isCancellable && !hasDispute) {
      throw new Error(
        `Cannot cancel order ${orderId}: ${jsonStringify({
          isCancellable,
          hasDispute,
        })}`,
      );
    }

    await this.processCancel(mapOrderToRefund(name, order, vendor), author);
  }

  private async getOrderToRefund(): Promise<
    (Order & {
      orderLines: (OrderLines & {
        vendor: (Customer & { user: users }) | null;
      })[];
      customer: Customer | null;
    })[]
  > {
    const limitDateB2C = dayjs()
      .subtract(REFUND_ORDERS_PAID_X_DAYS_AGO.b2c, 'day')
      .format();
    const limitDateC2C = dayjs()
      .subtract(REFUND_ORDERS_PAID_X_DAYS_AGO.c2c, 'day')
      .format();

    const orders = await this.mainPrisma.order.findMany({
      where: {
        AND: {
          status: {
            in: [OrderStatus.PAID, OrderStatus.LABELED],
          },
          orderLines: {
            every: {
              shippingSolution: {
                notIn: [
                  ShippingSolution.VENDOR,
                  ShippingSolution.HAND_DELIVERY,
                ],
              },
            },
          },
          createdAt: {
            gte: new Date('2023-11-01'),
          },
          OR: [
            {
              paidAt: { lte: limitDateC2C },
              orderLines: { every: { vendor: { isPro: false } } },
            },
            { paidAt: { lte: limitDateB2C } },
          ],
        },
      },
      include: {
        orderLines: {
          include: {
            vendor: {
              include: {
                user: true,
              },
            },
          },
        },
        customer: true,
      },
    });

    const bikeVariantIdsFromOrders =
      await this.storeClient.filterBikesVariantIdsFromVariantIdList(
        orders.flatMap((o) =>
          o.orderLines.flatMap((ol) =>
            ol.productVariantId ? [ol.productVariantId] : [],
          ),
        ),
      );

    return orders.filter((order) => {
      const orderVariantIds = order.orderLines.flatMap((ol) =>
        ol.productVariantId ? [ol.productVariantId] : [],
      );
      return !orderVariantIds.some((variantId) =>
        bikeVariantIdsFromOrders.includes(variantId),
      );
    });
  }

  private async processCancel(
    orderCancelledData: OrderCancelledData,
    author: Author,
  ) {
    //TODO: This update should not be handled at order level but at order line level
    // For now we refund the full order to refund commission + shipping
    await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
      orderCancelledData.order.id,
      OrderStatus.CANCELED,
      author,
      new Date(),
      orderCancelledData.order.status !== OrderStatus.CREATED
        ? async () => this.refundOrder(orderCancelledData)
        : undefined,
    );
  }

  private async refundOrder(orderCancelledData: OrderCancelledData) {
    const { id, name, shopifyId, totalPriceCurrency, totalPriceInCents } =
      orderCancelledData.order;

    const { email } = orderCancelledData.customer;

    await this.storeClient.refundOrder(
      {
        id,
        storeId: shopifyId,
      },
      {
        amountInCents: totalPriceInCents,
        currency: totalPriceCurrency,
      },
    );

    this.logger.warn(`Refunded order ${id}`);

    await this.orderNotificationService.sendRefundedOrderEmails(
      orderCancelledData,
    );

    await this.sendInternalNotificationIfManualPayment(id, name, email);
  }

  private getNotificationDetails(
    order: Order,
    vendor: { isPro: boolean; sellerName: string },
  ) {
    return `
	⚓️ Order: ${getOrderLinkMrkdwn(order)}
	💰 Price: ${order.totalPriceInCents / 100} €
	📅 Date: ${order.paidAt?.toLocaleDateString('fr-FR')}
	🙋 Vendor: ${vendor.sellerName} (${vendor.isPro ? 'pro' : 'particulier'})
		`;
  }

  private async sendInternalNotificationIfManualPayment(
    orderId: string,
    orderName: string,
    customerEmail: string,
  ) {
    const orderCheckoutWithManualPayment =
      await this.mainPrisma.checkout.findFirst({
        where: {
          order: {
            id: orderId,
          },
          payments: {
            some: {
              paymentSolutionCode: { in: MANUAL_PAYMENT_CODES },
              status: PaymentStatusType.ORDER_CREATED,
            },
          },
        },
      });

    if (!orderCheckoutWithManualPayment) return;

    await this.internalNotificationClient.sendErrorNotification(`
        ⚠️ La commande ${orderName} vient d'être annulée et nécessite un remboursement manuel.
        🔗 Client: ${customerEmail}
    `);
  }
}
