import {
  CustomerType,
  FulfillmentOrderStatus,
  NotificationName,
  NotificationType,
  OrderStatus,
  PrismaMainClient,
  SalesChannelName,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { fromCents } from '@libs/helpers/currency';
import { jsonStringify } from '@libs/helpers/json';
import { IPIMClient } from '@modules/product/domain/ports/pim.client';
import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { IEmailClient } from './ports/email.client';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import {
  FeedBackRequest,
  OrderCancelledData,
  OrderCreatedData,
  OrderPaidData,
} from './ports/types';

const MANUAL_PAYMENT_CLIENT_NOTIFICATION = [
  'Paiement 10x - Younited Pay',
  'Paiement 24x - Younited Pay',
];

const MANUAL_PAYMENT_INTERNAL_NOTIFICATION = [
  'Paiement 10x - Younited Pay',
  'Paiement 24x - Younited Pay',
  'Paiement 3x - Floa Pay',
  'Paiement 4x - Floa Pay',
  'Paiement 10x - Floa Pay',
  'Virement bancaire',
];

const OMS_URL =
  'https://barooders.retool.com/apps/f0b9cd78-71a8-11ee-a016-9f973c01a6b6/Order%20Management%20System';

@Injectable()
export class OrderNotificationService {
  private readonly logger = new Logger(OrderNotificationService.name);

  constructor(
    private prisma: PrismaMainClient,
    private emailClient: IEmailClient,
    private internalNotificationClient: IInternalNotificationClient,
    private pimClient: IPIMClient,
  ) {}

  async sendAskFeedbackEmail({
    customer: { email, fullName, id },
    orderName,
  }: FeedBackRequest) {
    const customerMetadata = {
      email,
      orderName,
    };

    await this.sendNotificationIfNotAlreadySent(
      NotificationType.EMAIL,
      NotificationName.FEEDBACK_ASKED,
      CustomerType.buyer,
      customerMetadata,
      {
        metadata: customerMetadata,
      },
      async () => {
        await this.emailClient.sendAskFeedbackEmail(email, fullName);
      },
      id,
    );
  }

  async notifyOrderCreated({ order, product, customer }: OrderCreatedData) {
    if (MANUAL_PAYMENT_CLIENT_NOTIFICATION.includes(order.paymentMethod)) {
      const metadata = {
        email: customer.email,
        orderName: order.name,
      };
      await this.sendNotificationIfNotAlreadySent(
        NotificationType.EMAIL,
        NotificationName.MANUAL_PAYMENT_PROCEDURE,
        CustomerType.buyer,
        metadata,
        { metadata },
        async () => {
          this.logger.warn(
            `Order ${order.name} was created, will send manual payment procedure to customer`,
          );
          await this.emailClient.sendEmailWithManualPaymentProcedure(
            customer.email,
            customer.fullName,
            {
              firstName: customer.firstName,
              productName: product.name,
              paymentMethod: order.paymentMethod,
            },
          );
        },
      );
    }

    if (MANUAL_PAYMENT_INTERNAL_NOTIFICATION.includes(order.paymentMethod)) {
      this.logger.warn(
        `Order ${order.name} was created, will send manual payment notification to internal team`,
      );
      await this.internalNotificationClient
        .sendOrderCreatedWithBaroodersSplitPaymentNotification(`
          📦 *Nouvelle commande créée avec paiement ${order.paymentMethod}! (${
            order.name
          })*
          🛒 Lien admin: ${order.adminUrl}

          🚲 Produit: ${product.name}
          💶 Prix : ${order.totalPrice}

          📬 Email client : ${customer.email}

          🔗 Reference URL : ${product.referenceUrl}
          📆 Date d'ajout: ${product.createdAt.toLocaleDateString('fr-FR')}
        `);
    }
  }

  async notifyOrderPaid(orderInternalId: UUID) {
    const mappedOrder = await this.mapOrderPaidData(orderInternalId);

    this.logger.warn(
      `Order ${mappedOrder.order.name} was paid, will send notifications to vendor and customer`,
    );
    await this.triggerOrderPaidActions(mappedOrder);
    await this.triggerNonBlockingNotifications(mappedOrder);
  }

  async sendUnfulfilledOrderLinesEmails(numberOfDaysSinceOrderPaid: number) {
    this.logger.debug(
      `Looking for unfufilled order lines since ${numberOfDaysSinceOrderPaid} days`,
    );

    const currentDate = new Date();
    const xDaysAgo = new Date(currentDate);
    xDaysAgo.setDate(currentDate.getDate() - numberOfDaysSinceOrderPaid);

    this.logger.debug(
      `Looking for unfufilled order lines paid before ${xDaysAgo}`,
    );

    const orderLines = await this.prisma.orderLines.findMany({
      where: {
        order: {
          status: {
            in: [OrderStatus.PAID, OrderStatus.LABELED],
          },
          salesChannelName: SalesChannelName.PUBLIC,
          paidAt: {
            lte: xDaysAgo,
          },
        },
        vendor: {
          authUserId: {
            notIn: [
              '6dcd1d90-b7b3-4ef9-bc44-f8b7cb545fef', // OCC
              '88f91cd6-e845-447b-9056-857fac581807', // SkiAv
            ],
          },
        },
        fulfillmentOrder: {
          status: FulfillmentOrderStatus.OPEN,
        },
      },
      include: {
        vendor: { include: { user: true } },
        order: {
          include: {
            customer: { include: { user: true } },
          },
        },
      },
    });

    this.logger.debug(`Found ${orderLines.length} order lines`);

    await Promise.allSettled(
      orderLines
        .map(
          ({
            id,
            name: productName,
            vendor,
            order: { customer, customerEmail, paidAt, name: orderName },
          }) => {
            if (!paidAt) {
              throw new Error(
                `Cannot send unfulfilled emails for order line ${id} without paidAt`,
              );
            }

            return [
              {
                recipient: {
                  id: vendor?.user.id ?? null,
                  email: vendor?.user.email ?? null,
                  firstName: vendor?.firstName ?? vendor?.sellerName ?? '',
                },
                orderLineId: id,
                type: CustomerType.seller,
                paidAt,
                productName,
                orderName,
                numberOfDaysSinceOrderPaid,
              },
              {
                recipient: {
                  id: customer?.user.id ?? null,
                  email: customerEmail,
                  firstName: customer?.firstName ?? customer?.sellerName ?? '',
                },
                orderLineId: id,
                type: CustomerType.buyer,
                paidAt,
                productName,
                orderName,
                numberOfDaysSinceOrderPaid,
              },
            ];
          },
        )
        .flat()
        .map(async (recipient) => {
          try {
            await this.triggerUnfulfilledOrderLineEmail(recipient);
          } catch (error: any) {
            this.logger.error(error.message, error);
            Sentry.captureException(error);
          }
        }),
    );
  }

  async sendRefundedOrderEmails({
    customer,
    order,
    vendor,
    productName,
  }: OrderCancelledData) {
    const customerMetadata = {
      email: customer.email,
      orderName: order.name,
    };

    await this.sendNotificationIfNotAlreadySent(
      NotificationType.EMAIL,
      NotificationName.ORDER_REFUNDED,
      CustomerType.buyer,
      customerMetadata,
      {
        metadata: customerMetadata,
      },
      async () => {
        await this.emailClient.sendRefundedOrderCustomerEmail(
          customer.email,
          customer.fullName,
          {
            firstName: customer.firstName,
            orderAmountInCents: order.totalPriceInCents,
            orderName: order.name,
          },
        );
      },
    );

    if (!vendor) {
      this.logger.warn(`Not sending email to vendor because it was not found`);
      return;
    }

    const vendorMetadata = {
      email: vendor.email,
      orderName: order.name,
    };

    await this.sendNotificationIfNotAlreadySent(
      NotificationType.EMAIL,
      NotificationName.ORDER_REFUNDED,
      CustomerType.seller,
      vendorMetadata,
      {
        metadata: vendorMetadata,
      },
      async () => {
        await this.emailClient.sendRefundedOrderVendorEmail(
          vendor.email,
          vendor.fullName,
          {
            firstName: vendor.firstName,
            productName,
            orderName: order.name,
            paidAt: order.paidAt?.toLocaleDateString('fr-FR') ?? '',
          },
        );
      },
    );
  }

  private async triggerUnfulfilledOrderLineEmail({
    recipient: { id, email, firstName },
    orderLineId,
    type,
    paidAt,
    productName,
    orderName,
    numberOfDaysSinceOrderPaid,
  }: {
    recipient: { id: string | null; email: string | null; firstName: string };
    orderLineId: string;
    type: CustomerType;
    paidAt: Date;
    numberOfDaysSinceOrderPaid: number;
    productName: string;
    orderName: string;
  }) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!email) {
      this.logger.debug(
        `${type} has no email for order line ${orderLineId}, skipping unfulfilled order line email`,
      );
      return;
    }

    const currentDate = new Date();
    const startDate = new Date(paidAt);
    startDate.setDate(startDate.getDate() + numberOfDaysSinceOrderPaid);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    if (currentDate < startDate || currentDate > endDate) {
      this.logger.debug(
        `Current date is not between ${startDate} and ${endDate}, skipping unfulfilled order line email`,
      );
      return;
    }

    await this.sendNotificationIfNotAlreadySent(
      NotificationType.EMAIL,
      NotificationName.ORDER_LINE_NOT_SHIPPED,
      type,
      {
        email,
        orderLineId,
        orderName,
        paidAt: paidAt.toISOString(),
        numberOfDaysSinceOrderPaid,
      },
      {
        metadata: {
          email,
          orderLineId,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      async () => {
        this.logger.debug(`Sending unfulfilled order line email to ${email}`);
        await this.emailClient.sendUnfulfilledOrderLineEmail(
          type,
          email,
          firstName,
          numberOfDaysSinceOrderPaid,
          {
            firstName,
            productName,
            orderName,
            paidAt: paidAt.toLocaleDateString('fr-FR'),
          },
        );
      },
      id,
    );
  }

  private async triggerNonBlockingNotifications({
    vendor,
    product,
    order,
  }: OrderPaidData) {
    try {
      const metadata = {
        orderName: order.name,
      };

      const isFirstSale = vendor.previousOrderLines.length === 0;
      const isImportantFirstSale = vendor.isPro && isFirstSale;

      await this.sendNotificationIfNotAlreadySent(
        NotificationType.INTERNAL,
        NotificationName.NEW_ORDER_PAID,
        CustomerType.admin,
        metadata,
        {
          metadata,
        },
        async () => {
          await this.internalNotificationClient.sendOrderPaidNotification(`
            📦 *<${OMS_URL}?order_name=${order.name.replace('#', '')}|${
              order.name
            }>${isImportantFirstSale ? ' - Première vente 🥇' : ''}*

            🚲 Produit: ${product.variantTitle}
            💶 Prix : ${Math.round(Number(order.totalPrice))} €

            👤 Vendeur : ${vendor.sellerName} (${
              vendor.isPro ? 'pro' : 'particulier'
            })
          `);

          if (!isImportantFirstSale) return;

          await this.internalNotificationClient.sendFirstSaleNotification(`
          🥇 *Première vente pour: ${vendor.sellerName}🥇*

          🚲 Produit: ${product.variantTitle}
          💶 Prix : ${Math.round(Number(order.totalPrice))} €
          `);
        },
      );
    } catch (error: any) {
      this.logger.error(
        `Cannot send paid order notifications for order (${order.name}) because ${error.message}`,
        error,
      );
      Sentry.captureException(error);
    }
  }

  private async triggerOrderPaidActions({
    vendor,
    order,
    customer,
    product,
  }: OrderPaidData) {
    const vendorMetadata = {
      email: vendor.email,
      orderName: order.name,
    };

    switch (product.shippingSolution) {
      case ShippingSolution.GEODIS:
        await this.triggerGeodisOrderPaidActions({
          vendor,
          order,
          customer,
          product,
          vendorMetadata,
        });
        break;
      case ShippingSolution.SENDCLOUD:
        await this.sendNotificationIfNotAlreadySent(
          NotificationType.EMAIL,
          NotificationName.NEW_ORDER_FOR_VENDOR_WITH_BAROODERS_SHIPPING,
          CustomerType.seller,
          vendorMetadata,
          {
            metadata: vendorMetadata,
          },
          async () => {
            await this.emailClient.sendNewOrderEmailToVendor(
              vendor.email,
              vendor.fullName,
              {
                product,
                vendor,
              },
            );
          },
        );

        break;
      case ShippingSolution.VENDOR:
        await this.sendNotificationIfNotAlreadySent(
          NotificationType.EMAIL,
          NotificationName.NEW_ORDER_FOR_VENDOR_WITH_OWN_SHIPPING,
          CustomerType.seller,
          vendorMetadata,
          {
            metadata: vendorMetadata,
          },
          async () => {
            await this.emailClient.sendNewOrderEmailToVendorWithOwnShipping(
              vendor.email,
              vendor.fullName,
              {
                product,
                customer,
                vendor,
                order,
              },
            );
          },
        );
        break;
      default:
        throw new Error(
          `Cannot send email to vendor because shipping type ${product.shippingSolution} is unknown`,
        );
    }
  }

  private async triggerGeodisOrderPaidActions({
    order,
    product,
    vendor,
    customer,
    vendorMetadata,
  }: OrderPaidData & { vendorMetadata: Record<string, string> }) {
    const isBike = await this.pimClient.isBike(product.productType);
    const isBikeSentWithGeodis =
      isBike && product.shippingSolution === ShippingSolution.GEODIS;

    await this.sendNotificationIfNotAlreadySent(
      NotificationType.EMAIL,
      NotificationName.NEW_ORDER_FOR_VENDOR_WITH_BAROODERS_SHIPPING,
      CustomerType.seller,
      vendorMetadata,
      {
        metadata: vendorMetadata,
      },
      async () => {
        if (isBikeSentWithGeodis) {
          await this.emailClient.sendNewOrderEmailToVendorWithGeodisShipping(
            vendor.email,
            vendor.fullName,
            {
              product,
              vendor,
              customer,
              order,
              hasPreviousBikeOrderWithGeodisShipping:
                await this.hasVendorAlreadyHadAnOrderWithGeodisShipping(
                  vendor.previousOrderLines,
                ),
            },
          );
        } else {
          await this.emailClient.sendNewOrderEmailToVendor(
            vendor.email,
            vendor.fullName,
            {
              product,
              vendor,
            },
          );
        }
      },
    );
  }

  private async mapOrderPaidData(orderId: UUID): Promise<OrderPaidData> {
    const orderData = await this.prisma.order.findUniqueOrThrow({
      where: {
        id: orderId.uuid,
      },
      include: {
        customer: true,
        orderLines: {
          include: {
            vendor: {
              include: { user: true },
            },
          },
        },
      },
    });

    const [mainOrderLine] = orderData.orderLines;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!mainOrderLine?.productVariantId) {
      throw new Error(`No shippable product found in order ${orderId.uuid}`);
    }

    const {
      product: {
        vendor: {
          firstName,
          lastName,
          sellerName,
          user: { email },
          authUserId,
          isPro,
        },
        productType,
        sourceUrl,
        createdAt,
        handle,
      },
    } = await this.prisma.productVariant.findUniqueOrThrow({
      where: {
        id: mainOrderLine.productVariantId,
      },
      select: {
        product: {
          include: {
            vendor: { include: { user: true } },
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!email) {
      throw new Error(
        `Cannot map order paid because no vendor email found for order ${orderId.uuid}`,
      );
    }

    const previousOrderLines = await this.prisma.orderLines.findMany({
      where: {
        vendor: {
          authUserId,
        },
        order: {
          id: {
            not: orderId.uuid,
          },
        },
      },
      select: {
        shippingSolution: true,
        productType: true,
      },
    });

    return {
      order: {
        name: orderData.name,
        shipmentEmail: `notifications+${orderId.uuid}@barooders.com`,
        createdAt: new Date(orderData.createdAt).toLocaleDateString('fr-FR'),
        totalPrice: fromCents(orderData.totalPriceInCents).toString(),
      },
      product: {
        shippingSolution: mainOrderLine.shippingSolution,
        name: mainOrderLine.name,
        price: fromCents(mainOrderLine.priceInCents).toString(),
        referenceId: '', //TODO: fix this?
        referenceUrl: sourceUrl ?? '',
        variantTitle: mainOrderLine.name,
        createdAt,
        handle: handle ?? '',
        productType: productType ?? '',
      },
      customer: {
        email: orderData.customerEmail,
        address: [
          orderData.shippingAddressAddress1,
          orderData.shippingAddressAddress2,
          orderData.shippingAddressCity,
          orderData.shippingAddressZip,
          orderData.shippingAddressCountry,
        ]
          .filter(Boolean)
          .join(' '),
        phone: orderData.shippingAddressPhone ?? '',
        fullName: [orderData.customer?.firstName, orderData.customer?.lastName]
          .filter(Boolean)
          .join(' '),
      },
      vendor: {
        firstName: firstName ?? '',
        sellerName: sellerName ?? 'seller-name-not-found',
        fullName: [firstName, lastName].filter(Boolean).join(' '),
        email,
        isPro,
        previousOrderLines: previousOrderLines.map(
          ({ shippingSolution, productType }) => ({
            shippingSolution: shippingSolution,
            productType,
          }),
        ),
      },
    };
  }

  private async hasVendorAlreadyHadAnOrderWithGeodisShipping(
    previousOrderLines: OrderPaidData['vendor']['previousOrderLines'],
  ): Promise<boolean> {
    for (const orderLine of previousOrderLines) {
      try {
        if (await this.pimClient.isBike(orderLine.productType)) return true;
      } catch (error: any) {
        this.logger.error(error.message, error);
        Sentry.captureException(error);
      }
    }
    return false;
  }

  private async sendNotificationIfNotAlreadySent(
    type: NotificationType,
    name: NotificationName,
    recipientType: CustomerType,
    metadata: Record<string, string | number | boolean>,
    conditions: {
      metadata: Record<string, string | boolean>;
      createdAt?: { gte: Date; lte: Date };
    },
    callback: () => Promise<void>,
    recipientId?: string | null,
  ) {
    const sentNotification = await this.prisma.notification.findFirst({
      where: {
        type,
        name,
        AND: Object.entries(conditions.metadata).map(([path, value]) => ({
          metadata: {
            path: [path],
            equals: value,
          },
        })),
        createdAt: conditions.createdAt,
      },
    });

    if (sentNotification) {
      this.logger.debug(
        `Notification ${name} already sent for ${jsonStringify(
          metadata,
        )}, skipping...`,
      );
      return;
    }

    await callback();

    await this.prisma.notification.create({
      data: {
        type,
        name,
        recipientId,
        recipientType,
        metadata,
      },
    });
  }
}
