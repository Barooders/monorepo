import { PRODUCT_NAME as COMMISSION_NAME } from '@libs/domain/constants/commission-product.constants';
import { NotFoundException } from '@libs/domain/exceptions';
import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { EntityId } from '@libs/domain/product.interface';
import { BIKES_COLLECTION_HANDLE } from '@libs/domain/types';
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';
import {
  getSingleProductInOrder,
  isHandDeliveryOrder,
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
    private shopifyApiBySession: ShopifyApiBySession,
  ) {}

  async getOrderPriceItems(orderShopifyId: string) {
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
        amountInCents: Math.round(Number(order.total_price) * 100),
        currency: CurrencyCode.EUR,
      },
    };
  }

  async fulfillFulfillmentOrder(
    fulfillmentOrderId: string,
    { trackingId, trackingUrl }: TrackingInfo,
  ): Promise<StoreFulfilledFulfillmentOrder> {
    const { shopifyId } =
      await this.mainPrisma.fulfillmentOrder.findUniqueOrThrow({
        where: {
          id: fulfillmentOrderId,
        },
      });

    const existingFulfillments =
      await shopifyApiByToken.fulfillmentOrder.fulfillments(Number(shopifyId));

    if (existingFulfillments.length > 0) {
      this.logger.warn(
        `Fulfillment order ${shopifyId} was already fulfilled in store`,
      );
      return await this.mapFulfilledFulfillmentOrder(existingFulfillments[0]);
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

    return await this.mapFulfilledFulfillmentOrder(newFulfillment);
  }

  async getAppliedDiscounts(
    orderStoreId: string,
  ): Promise<DiscountApplication[]> {
    try {
      const order = await shopifyApiByToken.order.get(Number(orderStoreId));

      return order.discount_applications.map(({ code, ...details }) => ({
        code,
        details,
      }));
    } catch (error: unknown) {
      throw new Error(
        `Could not fetch or map order with id ${orderStoreId} because: ${error}`,
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
          .map(async ({ id, variant_id }) => {
            const { id: productVariantId } =
              await this.mainPrisma.productVariant.findUniqueOrThrow({
                where: {
                  shopifyId: variant_id,
                },
              });

            return {
              fulfillmentItemShopifyId: id,
              productVariantId,
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

    return bikeVariantIdsFromOrders.flatMap(({ id }) => (id ? [id] : []));
  }

  async getFulfillmentOrderId(
    orderShopifyId: string,
    orderLineShopifyId: string,
  ): Promise<number | undefined> {
    const fulfillmentOrders = await shopifyApiByToken.order.fulfillmentOrders(
      Number(orderShopifyId),
    );

    const fulfillmentOrder = fulfillmentOrders.find(({ line_items }) => {
      return line_items.some(
        ({ line_item_id }) => line_item_id === Number(orderLineShopifyId),
      );
    });

    return fulfillmentOrder?.id;
  }

  async isHandDeliveryOrder(orderShopifyId: string): Promise<boolean> {
    try {
      const order = await shopifyApiByToken.order.get(Number(orderShopifyId));

      return isHandDeliveryOrder(order);
    } catch (error: unknown) {
      throw new NotFoundException(
        `Could not fetch or map order with id ${orderShopifyId} because: ${error}`,
      );
    }
  }

  async refundOrder(
    orderId: EntityId,
    { amountInCents, currency }: RefundOptions,
  ): Promise<void> {
    try {
      const orderShopifyId = getValidShopifyId(orderId.storeId);
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
