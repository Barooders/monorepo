import envConfig from '@config/env/env.config';
import {
  Customer,
  Order,
  OrderLines,
  OrderStatus,
  PaymentProvider,
  PaymentStatusType,
  PrismaMainClient,
  ShippingSolution,
  users,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable, Logger } from '@nestjs/common';
import dayjs from 'dayjs';
import { OrderNotificationService } from './order-notification.service';
import { OrderUpdateService } from './order-update.service';
import { UserNotOrderLineVendorException } from './ports/exceptions';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { IStoreClient } from './ports/store.client';
import { OrderRefundedData } from './ports/types';

const MANUAL_REFUND_PAYMENT_PROVIDERS = [PaymentProvider.FLOA];

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

    await this.processRefund(mapOrderToRefund(name, order, vendor), author);

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
          await this.processRefund(
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

  async refundOrder(orderId: string, author: Author): Promise<void> {
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

    const isPaidOrLabeled =
      order.status === OrderStatus.PAID || order.status === OrderStatus.LABELED;
    const hasDispute = disputes.length > 0;

    if (!isPaidOrLabeled && !hasDispute) {
      throw new Error(
        `Cannot refund order ${orderId}: ${jsonStringify({
          isPaidOrLabeled,
          hasDispute,
        })}`,
      );
    }

    await this.processRefund(mapOrderToRefund(name, order, vendor), author);
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

  private async processRefund(
    orderRefundedData: OrderRefundedData,
    author: Author,
  ) {
    const {
      order: { id, shopifyId, name, totalPriceCurrency, totalPriceInCents },
      customer: { email },
    } = orderRefundedData;
    //TODO: This update should not be handled at order level but at order line level
    // For now we refund the full order to refund commission + shipping
    await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
      id,
      OrderStatus.CANCELED,
      author,
      new Date(),
      async () => {
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
          orderRefundedData,
        );

        await this.sendInternalNotificationIfManualPayment(id, name, email);
      },
    );
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
              paymentAccount: {
                provider: {
                  in: MANUAL_REFUND_PAYMENT_PROVIDERS,
                },
              },
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
