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
import { IShippingClient } from './ports/shipping.client';
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
    private shippingService: IShippingClient,
  ) {}

  async storeOrder(orderToStore: OrderToStore, author: Author): Promise<void> {
    const {
      order: { customerId, name },
      priceOfferIds,
    } = orderToStore;

    try {
      this.logger.debug(`Storing order ${name} for customer ${customerId}`);

      await this.validateOrder(orderToStore);

      const createdOrderId = await this.storeOrderInDatabase(
        orderToStore,
        author,
      );

      await this.shippingService.createShipmentFromOrder(orderToStore);

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
        name: order.name,
      },
    });

    if (existingOrder) {
      this.logger.warn(
        `Order ${order.name} already exists in database. Skipping creation...`,
      );
      return existingOrder.id;
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!shippingAddressPhone) {
      throw new Error(
        `Can't create an order without a phone number: ${order.name}`,
      );
    }

    const orderLinesWithCommission = await Promise.all(
      orderLines.map(
        async ({
          buyerCommissionInCents: forcedBuyerCommissionInCents,
          ...orderLine
        }) => {
          const { vendorCommission, vendorShipping, buyerCommission } =
            await this.commissionService.getCommission({
              productType: orderLine.productType,
              priceInCents: orderLine.priceInCents,
              discountInCents: orderLine.discountInCents,
              quantity: orderLine.quantity,
              vendorId: orderLine.vendorId,
              shippingSolution: orderLine.shippingSolution,
              forcedBuyerCommissionInCents,
              salesChannelName: order.salesChannelName,
            });

          return {
            ...orderLine,
            vendorCommission,
            vendorShipping,
            buyerCommission,
          };
        },
      ),
    );

    const { storeId: orderStoreId, ...orderWithoutStoreId } = order;

    const createdOrderId = await this.prisma.$transaction(
      async (wrappedPrisma) => {
        this.logger.warn(
          `Will create order ${
            order.name
          } with fulfillment orders: ${jsonStringify(fulfillmentOrders)}`,
        );
        const { id } = await wrappedPrisma.order.create({
          data: {
            ...orderWithoutStoreId,
            shopifyId:
              orderStoreId?.shopifyIdIfExists !== undefined
                ? String(orderStoreId?.shopifyIdIfExists)
                : undefined,
            medusaId: orderStoreId?.medusaIdIfExists,
            shippingAddressPhone,
            fulfillmentOrders: {
              createMany: {
                data: fulfillmentOrders.map(
                  ({ storeId, ...fulfillmentOrder }) => ({
                    ...fulfillmentOrder,
                    shopifyId: storeId?.shopifyIdIfExists,
                    medusaId: storeId?.medusaIdIfExists,
                  }),
                ),
              },
            },
            orderLines: {
              createMany: {
                data: orderLinesWithCommission.map(
                  ({ fulfillmentOrder, storeId, ...orderLine }) => ({
                    ...orderLine,
                    shopifyId:
                      storeId?.shopifyIdIfExists !== undefined
                        ? String(storeId?.shopifyIdIfExists)
                        : undefined,
                    medusaId: storeId?.medusaIdIfExists,
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
            payload: {
              order: {
                ...order,
                medusaId: order.storeId?.medusaIdIfExists,
                shopifyId: order.storeId?.shopifyIdIfExists,
                storeId: undefined,
              },
              orderLines: orderLines.map(({ storeId, ...orderLine }) => ({
                ...orderLine,
                fulfillmentOrder: {
                  ...orderLine.fulfillmentOrder,
                  medusaId:
                    orderLine.fulfillmentOrder?.storeId?.medusaIdIfExists,
                  shopifyId:
                    orderLine.fulfillmentOrder?.storeId?.shopifyIdIfExists,
                  storeId: undefined,
                },
                medusaId: storeId?.medusaIdIfExists,
                shopifyId: storeId?.shopifyIdIfExists,
              })),
            },
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
