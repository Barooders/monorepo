import {
  FulfillmentOrder,
  Order,
  OrderLines,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { IOrderSyncService } from '@modules/pro-vendor/domain/ports/order-sync.service';
import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { IInternalNotificationClient } from './ports/internal-notification.client';

@Injectable()
export class ExternalOrderService {
  private readonly logger = new Logger(ExternalOrderService.name);

  constructor(
    private prisma: PrismaMainClient,
    private orderSyncService: IOrderSyncService,
    private internalNotificationClient: IInternalNotificationClient,
  ) {}

  async createExternalOrders(order: { id: string }): Promise<void> {
    const fulfillmentOrders = await this.prisma.fulfillmentOrder.findMany({
      where: {
        orderId: order.id,
        externalOrderId: null,
      },
      include: {
        orderLines: true,
        order: true,
      },
    });

    const vendorIdsInFulfillmentOrders = fulfillmentOrders
      .map(({ orderLines }) => orderLines.map(({ vendorId }) => vendorId))
      .flat()
      .flatMap((vendorId) => (vendorId ? [vendorId] : []));
    const hasMultipleFullfillmentOrdersForSameVendor =
      vendorIdsInFulfillmentOrders.length !==
      new Set(vendorIdsInFulfillmentOrders).size;

    if (hasMultipleFullfillmentOrdersForSameVendor) {
      this.logger.error(
        `Will create multiple orders for same vendor for order ${order.id}. This should not happen`,
      );
    }

    await Promise.allSettled(
      fulfillmentOrders.map(async (fulfillmentOrder) => {
        try {
          await this.createExternalOrderForFulfillmentOrder(fulfillmentOrder);
        } catch (error: any) {
          this.logger.error(error.message, error);
          Sentry.captureException(error);
        }
      }),
    );
  }

  private async createExternalOrderForFulfillmentOrder({
    order,
    orderLines,
    ...fulfillmentOrder
  }: FulfillmentOrder & {
    order: Order;
    orderLines: OrderLines[];
  }): Promise<void> {
    try {
      this.logger.debug(`Handling fulfillment order ${fulfillmentOrder.id}`);

      if (!orderLines.length) {
        this.logger.debug(
          `Fulfillment order ${fulfillmentOrder.id} has no order lines. Skipping...`,
        );
        return;
      }

      const firstVendorId = orderLines[0].vendorId;

      if (!firstVendorId) {
        this.logger.debug(
          `First order line of fulfillment order ${fulfillmentOrder.id} has no vendor id. Skipping...`,
        );
        return;
      }

      const productVariants = orderLines.map(
        ({
          vendorId,
          id: orderLineId,
          priceInCents,
          discountInCents,
          quantity,
          productVariantId,
          productType,
        }) => {
          if (vendorId !== firstVendorId) {
            throw new Error(
              `Order line ${orderLineId} of fulfillment order (${fulfillmentOrder.id}) has a different vendor id than the first order line. This should not happen`,
            );
          }

          return {
            variantId: productVariantId,
            quantity,
            price: priceInCents / 100,
            discount: discountInCents / 100,
            productType,
          };
        },
      );

      if (!productVariants.length) {
        this.logger.debug(
          `No product variants found for fulfillment order ${fulfillmentOrder.id}. Skipping...`,
        );
        return;
      }

      this.logger.debug(`Calling order sync service to create order`);

      const externalOrderId = await this.orderSyncService.createOrder({
        vendorId: firstVendorId,
        orderId: order.id,
        name: orderLines.map(({ name }) => name).join('-'),
        orderName: order.name,
        content: {
          customer: {
            firstName: order.shippingAddressFirstName ?? '',
            lastName: order.shippingAddressLastName,
            company: order.shippingAddressCompany ?? '',
            address1: order.shippingAddressAddress1,
            address2: order.shippingAddressAddress2 ?? '',
            zipCode: order.shippingAddressZip,
            city: order.shippingAddressCity,
            phone: order.shippingAddressPhone,
            country: order.shippingAddressCountry,
            realEmail: order.customerEmail,
          },
          products: productVariants,
        },
      });

      if (!externalOrderId) {
        this.logger.debug(
          `No order was created for fulfillment order ${fulfillmentOrder.id} from order (${order.name})`,
        );
        return;
      }

      await this.prisma.fulfillmentOrder.update({
        where: {
          id: fulfillmentOrder.id,
        },
        data: {
          externalOrderId,
        },
      });
    } catch (error: unknown) {
      this.logger.error(
        `Cannot create external order for fulfillment order ${fulfillmentOrder.id} from order (${order.name}) because ${error}`,
        error,
      );
      await this.internalNotificationClient.sendErrorNotification(`
          🚨 La commande ${order.name} n'a pas été créée chez le(s) vendeur(s).`);

      Sentry.captureException(error);
    }
  }
}
