import {
  AggregateName,
  EventName,
  OrderStatus,
  PrismaMainClient,
  ProductStatus,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { jsonStringify } from '@libs/helpers/json';
import { IPaymentService } from '@modules/buy__payment/domain/ports/payment-service';
import { IPriceOfferService } from '@modules/price-offer/domain/ports/price-offer';
import { Injectable, Logger } from '@nestjs/common';

import { CommissionService } from './commission.service';
import { OrderStatusHandlerService } from './order-status-handler.service';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { OrderToStore } from './ports/types';

@Injectable()
export class OrderCreationService {
  private readonly logger = new Logger(OrderCreationService.name);

  constructor(
    private prisma: PrismaMainClient,
    private orderStatusHandler: OrderStatusHandlerService,
    private priceOfferService: IPriceOfferService,
    private paymentService: IPaymentService,
    private internalNotificationClient: IInternalNotificationClient,
    private commissionService: CommissionService,
  ) {}

  async storeOrder(orderToStore: OrderToStore, author: Author): Promise<void> {
    const {
      order: { customerId, shopifyId, name },
      priceOfferIds,
    } = orderToStore;

    try {
      this.logger.debug(
        `Storing order ${shopifyId} for customer ${customerId}`,
      );

      await this.validateOrder(orderToStore);

      const createdOrderId = await this.storeOrderInDatabase(
        orderToStore,
        author,
      );

      await this.priceOfferService.updatePriceOfferStatusFromOrder(
        priceOfferIds,
        createdOrderId,
        author,
      );

      const checkoutUuid =
        await this.paymentService.updatePaymentStatusFromOrder(orderToStore);

      await this.paymentService.linkCheckoutToOrder(
        new UUID({ uuid: createdOrderId }),
        checkoutUuid,
      );
    } catch (error: any) {
      await this.internalNotificationClient.sendErrorNotification(
        `🚨 La commande ${name} n'a pas été créée en base de données car: ${error.message}`,
      );

      throw error;
    }
  }

  private async validateOrder({ orderLines }: OrderToStore): Promise<void> {
    const dbVariants = await this.prisma.productVariant.findMany({
      where: {
        id: {
          in: orderLines.map(({ productVariantId }) => productVariantId),
        },
        product: {
          status: ProductStatus.ACTIVE,
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    if (
      orderLines.some(({ quantity, productVariantId }) => {
        const dbVariant = dbVariants.find(({ id }) => id === productVariantId);

        return !dbVariant || dbVariant.quantity < quantity;
      })
    ) {
      this.logger.error(
        `Some product variants are out of stock in order: ${jsonStringify({ orderLines, dbVariants })}`,
      );
      throw new Error('Some product variants are out of stock');
    }
  }

  private async storeOrderInDatabase(
    orderToStore: OrderToStore,
    author: Author,
  ): Promise<string> {
    const {
      orderLines,
      fulfillmentOrders,
      order: { shippingAddressPhone, ...order },
    } = orderToStore;

    const existingOrder = await this.prisma.order.findUnique({
      where: {
        shopifyId: order.shopifyId,
      },
    });

    if (existingOrder) {
      this.logger.warn(
        `Order ${order.shopifyId} already exists in database. Skipping creation...`,
      );
      return existingOrder.id;
    }

    if (!shippingAddressPhone) {
      throw new Error(
        `Can't create an order without a phone number: ${order.shopifyId}`,
      );
    }

    const orderLinesWithCommission = await Promise.all(
      orderLines.map(async (orderLine) => {
        const {
          productType,
          priceInCents,
          discountInCents,
          quantity,
          vendorId,
          shippingSolution,
          buyerCommissionInCents: forcedBuyerCommission,
        } = orderLine;

        const { vendorCommission, vendorShipping, buyerCommission } =
          await this.commissionService.getCommission({
            productType,
            price: priceInCents / 100,
            discount: discountInCents / 100,
            quantity,
            vendorId,
            shippingSolution,
            forcedBuyerCommission,
          });

        return {
          ...orderLine,
          vendorCommission,
          vendorShipping,
          buyerCommission,
        };
      }),
    );

    const createdOrderId = await this.prisma.$transaction(
      async (wrappedPrisma) => {
        this.logger.warn(
          `Will create order ${
            order.shopifyId
          } with fulfillment orders: ${jsonStringify(fulfillmentOrders)}`,
        );
        const { id } = await wrappedPrisma.order.create({
          data: {
            ...order,
            shippingAddressPhone,
            fulfillmentOrders: {
              createMany: {
                data: fulfillmentOrders,
              },
            },
            orderLines: {
              createMany: {
                data: orderLinesWithCommission.map(
                  ({ fulfillmentOrder, ...orderLine }) => ({
                    ...orderLine,
                    fulfillmentOrderId: fulfillmentOrder?.id,
                  }),
                ),
              },
            },
          },
        });

        await wrappedPrisma.event.create({
          data: {
            aggregateName: AggregateName.ORDER,
            aggregateId: id,
            name: EventName.ORDER_CREATED,
            payload: { order, orderLines },
            metadata: {
              orderName: order.name,
              author,
            },
          },
        });

        return id;
      },
      {
        maxWait: 1_000,
        timeout: 1_000,
      },
    );

    await this.orderStatusHandler.handleNewOrderStatus(
      createdOrderId,
      OrderStatus.CREATED,
      null,
      author,
    );

    return createdOrderId;
  }
}
