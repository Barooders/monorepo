import { shopifyConfig } from '@config/shopify.config';
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
import {
  fromStorefrontId,
  toStorefrontId,
} from '@libs/infrastructure/shopify/shopify-id';
import { getValidShopifyId } from '@libs/infrastructure/shopify/validators';
import { CurrencyCode } from '@libs/types/common/money.types';
import {
  PRODUCT_NAME as COMMISSION_NAME,
  PRODUCT_TYPE as COMMISSION_TYPE,
} from '@modules/order/domain/constants/commission-product.constants';
import {
  IStoreClient,
  ProductCreationInput,
  RefundOptions,
  StoreFulfilledFulfillmentOrder,
} from '@modules/order/domain/ports/store.client';
import { TrackingInfo } from '@modules/order/domain/ports/types';
import { Injectable, Logger } from '@nestjs/common';
import { MutationProductCreateArgs } from '@quasarwork/shopify-api-types/api/admin/2023-01';
import {
  MediaContentType,
  Mutation,
  MutationPublishablePublishArgs,
  ProductStatus,
  ProductVariantInventoryPolicy,
} from '@quasarwork/shopify-api-types/api/admin/2023-04';
import { RequestReturn } from '@quasarwork/shopify-api-types/utils/shopify-api';
import dayjs from 'dayjs';
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

  async cleanOldCommissions(): Promise<void> {
    const [firstProduct, ...commissionProducts] =
      await shopifyApiByToken.product.list({
        created_at_max: dayjs().subtract(7, 'days').toISOString(),
        product_type: COMMISSION_TYPE,
        limit: 250,
      });

    this.logger.debug(dayjs().subtract(7, 'days').toISOString());

    if (!firstProduct) {
      this.logger.debug(`No commission products to delete`);
      return;
    }

    this.logger.debug(
      `Starting to delete ${commissionProducts.length + 1} commission products`,
    );

    // Wait for one to see an eventual error, then do the rest without waiting response
    await shopifyApiByToken.product.delete(firstProduct.id);

    commissionProducts.forEach(
      (product) => void shopifyApiByToken.product.delete(product.id),
    );
  }

  async createProduct(
    product: ProductCreationInput,
  ): Promise<{ id: string; variants: { id: string }[] }> {
    const variables: MutationProductCreateArgs = {
      input: {
        title: product.title,
        descriptionHtml: product.description,
        vendor: product.vendor,
        productType: product.productType,
        status: ProductStatus.Active,
        variants: product.variants.map((variant) => ({
          inventoryItem: {
            tracked: true,
          },
          inventoryPolicy: ProductVariantInventoryPolicy.Continue,
          price: variant.price.amount,
          requiresShipping: false,
          taxable: true,
        })),
      },
      media: [
        {
          alt: product.title,
          mediaContentType: MediaContentType.Image,
          originalSource: product.featuredImgSrc.url,
        },
      ],
    };

    const response: RequestReturn<Pick<Mutation, 'productCreate'>> = await (
      await this.shopifyApiBySession.getGraphqlClient()
    ).query({
      data: {
        query: `
						mutation productCreate($input: ProductInput!, $media: [CreateMediaInput!]) {
							productCreate(input: $input, media: $media) {
								product {
									id
									legacyResourceId
									variants(first: 1) {
										nodes {
											id
										}
									}
								}
								userErrors {
									field
									message
								}
							}
						}
					`,
        variables,
      },
    });

    const createdProduct = response.body.data.productCreate;

    if (!createdProduct || !createdProduct.product)
      throw new Error('Product not created');

    this.logger.log(
      `Created product { legacyResourceId: "${createdProduct?.product?.legacyResourceId}" }`,
    );

    return {
      id: fromStorefrontId(createdProduct.product.id, 'Product'),
      variants: createdProduct.product.variants.nodes.map((variant) => ({
        id: fromStorefrontId(variant.id, 'ProductVariant'),
      })),
    };
  }

  async publishProduct(productId: string): Promise<void> {
    const { shopOnlineStorePublicationId, mobileAppPublicationId } =
      shopifyConfig;

    try {
      const variables: MutationPublishablePublishArgs = {
        id: toStorefrontId(productId, 'Product'),
        input: [
          {
            publicationId: shopOnlineStorePublicationId,
          },
          {
            publicationId: mobileAppPublicationId,
          },
        ],
      };

      await (
        await this.shopifyApiBySession.getGraphqlClient()
      ).query({
        data: {
          query: `
							mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
								publishablePublish(id: $id, input: $input) {
									publishable {
										availablePublicationCount
										publicationCount
									}
									userErrors {
										field
										message
									}
								}
							}
						`,
          variables,
        },
      });

      this.logger.log(
        `Published product { id: "${productId}" } to Online Store.`,
      );
    } catch (err) {
      this.logger.error((err as Error)?.message, err);
    }
  }
}
