import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { BIKES_COLLECTION_HANDLE } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { medusaClient } from '@libs/infrastructure/medusa/client';
import {
  parseShopifyError,
  shopifyApiByToken,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { RefundReason } from '@medusajs/medusa';
import {
  IStoreClient,
  RefundOptions,
  StoreFulfilledFulfillmentOrder,
} from '@modules/order/domain/ports/store.client';
import {
  Amount,
  BuyerPriceLines,
  DiscountApplication,
} from '@modules/order/domain/ports/types';
import { Injectable, Logger } from '@nestjs/common';
import { first } from 'lodash';

@Injectable()
export class MedusaClient implements IStoreClient {
  private readonly logger = new Logger(MedusaClient.name);

  constructor(
    private mainPrisma: PrismaMainClient,
    private storePrisma: PrismaStoreClient,
  ) {}

  async getOrderPriceItems(orderId: UUID): Promise<{
    lines: {
      type: BuyerPriceLines;
      amount: Amount;
    }[];
    total: Amount;
  }> {
    throw new Error(
      `Method getOrderPriceItems is not implemented for Medusa (for order ${orderId})`,
    );
  }

  async fulfillFulfillmentOrder(
    fulfillmentOrderId: string,
  ): Promise<StoreFulfilledFulfillmentOrder> {
    throw new Error(
      `Method fulfillFulfillmentOrder is not implemented for Medusa (for order ${fulfillmentOrderId})`,
    );
  }

  async getAppliedDiscounts(orderId: UUID): Promise<DiscountApplication[]> {
    try {
      const dbOrder = await this.mainPrisma.order.findUniqueOrThrow({
        where: {
          id: orderId.uuid,
        },
      });

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!dbOrder.shopifyId) return [];

      const orderStoreId = Number(dbOrder.shopifyId);
      const order = await shopifyApiByToken.order.get(orderStoreId);

      return order.discount_applications.map(({ code, ...details }) => ({
        code,
        details,
      }));
    } catch (error: unknown) {
      throw new Error(
        `Could not fetch discounts from store for order ${orderId} because: ${error}`,
      );
    }
  }

  async filterBikesVariantIdsFromVariantIdList(
    variantIds: string[],
  ): Promise<string[]> {
    const bikeVariantIdsFromOrders =
      await this.storePrisma.storeBaseProductVariant.findMany({
        where: {
          id: {
            in: variantIds,
          },
          product: {
            collections: {
              some: {
                collection: {
                  handle: BIKES_COLLECTION_HANDLE,
                },
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return bikeVariantIdsFromOrders.flatMap(({ id }) => (id ? [id] : []));
  }

  async refundOrder(
    orderId: UUID,
    { amountInCents }: RefundOptions,
  ): Promise<void> {
    try {
      const dbOrder = await this.mainPrisma.order.findUniqueOrThrow({
        where: {
          id: orderId.uuid,
        },
      });

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!dbOrder.medusaId) {
        throw new Error(
          `Cannot refund order ${orderId.uuid} because it has no Medusa ID`,
        );
      }
      const { order: medusaOrder } = await medusaClient.admin.orders.retrieve(
        dbOrder.medusaId,
      );
      const payment = first(medusaOrder.payments);

      if (!payment || medusaOrder.payments.length > 1) {
        throw new Error(`Unprocessable payment for order ${medusaOrder.id}`);
      }

      await medusaClient.admin.payments.refundPayment(payment.id, {
        amount: amountInCents ?? payment.amount,
        reason: RefundReason.RETURN,
        note: 'Refunded from Retool',
      });
    } catch (error: any) {
      const errorMessage = parseShopifyError(error);
      this.logger.error(errorMessage, error);
      throw new Error(
        `Cannot refund order: ${error.message} because ${errorMessage}`,
      );
    }
  }
}
