import { COMMISSION_NAME } from '@libs/domain/constants/commission-product.constants';
import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { BIKES_COLLECTION_HANDLE } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { toCents } from '@libs/helpers/currency';
import {
  getSingleProductInOrder,
  parseShopifyError,
  shopifyApiByToken,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { getValidShopifyId } from '@libs/infrastructure/shopify/validators';
import { CurrencyCode } from '@libs/types/common/money.types';
import {
  IStoreClient,
  RefundOptions,
  StoreFulfilledFulfillmentOrder,
} from '@modules/order/domain/ports/store.client';
import {
  DiscountApplication,
  TrackingInfo,
} from '@modules/order/domain/ports/types';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class ShopifyClient implements IStoreClient {
  private readonly logger = new Logger(ShopifyClient.name);

  constructor(
    private mainPrisma: PrismaMainClient,
    private storePrisma: PrismaStoreClient,
  ) {}

  async getOrderPriceItems(orderId: UUID) {
    const dbOrder = await this.mainPrisma.order.findUniqueOrThrow({
      where: {
        id: orderId.uuid,
      },
    });

    const orderShopifyId = dbOrder.shopifyId;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!orderShopifyId) {
      throw new Error(`Not implemented yet, we should loop on DB order lines`);
    }

    const order = await shopifyApiByToken.order.get(Number(orderShopifyId));

    const soldProduct = getSingleProductInOrder(order);
    const commission = order.line_items.find(
      ({ title }) => title === COMMISSION_NAME,
    );

    if (!soldProduct) {
      throw new Error(
        `Could not find sold product in order ${orderShopifyId}}`,
      );
    }

    return {
      lines: [
        {
          type: 'PRODUCT_PRICE',
          amount: {
            amountInCents: Math.round(
              Number(soldProduct.price_set.shop_money.amount) * 100,
            ),
            currency: CurrencyCode.EUR,
          },
        },
        {
          type: 'BUYER_DISCOUNT',
          amount: {
            amountInCents:
              -1 *
              Math.round(
                Number(order.total_discounts_set.shop_money.amount) * 100,
              ),
            currency: CurrencyCode.EUR,
          },
        },
        {
          type: 'BUYER_SHIPPING',
          amount: {
            amountInCents: Math.round(
              Number(order.total_shipping_price_set.shop_money.amount) * 100,
            ),
            currency: CurrencyCode.EUR,
          },
        },
        ...(commission
          ? [
              {
                type: 'BUYER_COMMISSION',
                amount: {
                  amountInCents: Math.round(
                    Number(commission.price_set.shop_money.amount) * 100,
                  ),
                  currency: CurrencyCode.EUR,
                },
              },
            ]
          : []),
      ].filter((line) => !isNaN(line.amount.amountInCents)),
      total: {
        amountInCents: toCents(order.total_price),
        currency: CurrencyCode.EUR,
      },
    };
  }

  async fulfillFulfillmentOrder(
    fulfillmentOrderId: string,
    itemsToBeFulfilled: { productVariantId: string; quantity: number }[],
    { trackingId, trackingUrl }: TrackingInfo,
  ): Promise<StoreFulfilledFulfillmentOrder> {
    const { shopifyId } =
      await this.mainPrisma.fulfillmentOrder.findUniqueOrThrow({
        where: {
          id: fulfillmentOrderId,
        },
      });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!shopifyId) {
      return {
        fulfilledItems: itemsToBeFulfilled,
      };
    }

    const existingFulfillments =
      await shopifyApiByToken.fulfillmentOrder.fulfillments(Number(shopifyId));

    if (existingFulfillments.length > 0) {
      this.logger.warn(
        `Fulfillment order ${shopifyId} was already fulfilled in store`,
      );
      const fulfillment = existingFulfillments[0];
      if (fulfillment.line_items.length !== itemsToBeFulfilled.length)
        throw new Error('Fulfillment items mismatch');

      return await this.mapFulfilledFulfillmentOrder(fulfillment);
    }

    const newFulfillment = await shopifyApiByToken.fulfillment.createV2({
      line_items_by_fulfillment_order: [
        { fulfillment_order_id: Number(shopifyId) },
      ],
      notify_customer: true,
      tracking_info: {
        number: trackingId,
        url: trackingUrl,
      },
    });

    if (newFulfillment.line_items.length !== itemsToBeFulfilled.length)
      throw new Error('Fulfillment items mismatch');

    return await this.mapFulfilledFulfillmentOrder(newFulfillment);
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

  private async mapFulfilledFulfillmentOrder({
    id,
    line_items,
  }: Shopify.IFulfillment): Promise<StoreFulfilledFulfillmentOrder> {
    return {
      shopifyId: id,
      fulfilledItems: await Promise.all(
        line_items
          .filter(({ requires_shipping }) => requires_shipping)
          .map(async ({ id, variant_id, quantity }) => {
            const { id: productVariantId } =
              await this.mainPrisma.productVariant.findUniqueOrThrow({
                where: {
                  shopifyId: variant_id,
                },
              });

            return {
              shopifyId: id,
              productVariantId,
              quantity,
            };
          }),
      ),
    };
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
    { amountInCents, currency }: RefundOptions,
  ): Promise<void> {
    try {
      const dbOrder = await this.mainPrisma.order.findUniqueOrThrow({
        where: {
          id: orderId.uuid,
        },
      });

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!dbOrder.shopifyId) {
        throw new Error(
          `Not implemented yet: cannot refund order ${orderId.uuid} because it has no Shopify ID`,
        );
      }
      const orderShopifyId = getValidShopifyId(dbOrder.shopifyId);
      const amount = (amountInCents / 100).toFixed(2);

      await shopifyApiByToken.transaction.create(orderShopifyId, {
        currency,
        amount,
        kind: 'refund',
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
