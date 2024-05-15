import envConfig from '@config/env/env.config';
import { shopifyConfig } from '@config/shopify.config';
import { CustomerRepository } from '@libs/domain/customer.repository';
import { getOrderShippingSolution } from '@libs/domain/order.interface';
import {
  Currency,
  Customer,
  OrderStatus,
  PrismaMainClient,
  Product,
  SalesChannelName,
  ShippingSolution,
  ShippingType,
  users,
} from '@libs/domain/prisma.main.client';
import { Condition, PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { BIKES_COLLECTION_HANDLE } from '@libs/domain/types';
import { toCents } from '@libs/helpers/currency';
import { readableCode } from '@libs/helpers/safe-id';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import {
  findMetafield,
  getSingleProductInOrder,
  isHandDeliveryOrder,
  shopifyApiByToken,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { getPimDynamicAttribute } from '@libs/infrastructure/strapi/strapi.helper';
import { HandDeliveryService } from '@modules/order/domain/hand-delivery.service';
import {
  OrderCreatedData,
  OrderPaidData,
  OrderToStore,
  OrderToStoreFromAdminInput,
} from '@modules/order/domain/ports/types';
import { Injectable, Logger } from '@nestjs/common';
import { get, head, isMatch, last, reduce } from 'lodash';
import { IOrder } from 'shopify-api-node';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderMapper {
  private readonly logger = new Logger(OrderMapper.name);

  constructor(
    private customerRepository: CustomerRepository,
    private mainPrisma: PrismaMainClient,
    private storePrisma: PrismaStoreClient,
    private handDeliveryService: HandDeliveryService,
  ) {}

  async mapOrderToStore(orderData: IOrder): Promise<OrderToStore> {
    const { id } = orderData;

    if (!orderData.customer?.email) {
      throw new Error(`No customer email found for order ${id}`);
    }

    const customerId = await this.getCustomerId(orderData);

    const shippableOrderLines = orderData.line_items.filter(
      ({ requires_shipping }) => requires_shipping,
    );

    if (shippableOrderLines.length === 0) {
      throw new Error(`No shippable product found in order ${id}`);
    }

    const fulfillmentOrders =
      await shopifyApiByToken.order.fulfillmentOrders(id);

    if (fulfillmentOrders.length === 0) {
      throw new Error(`No fulfillment order found yet for order ${id}`);
    }

    const mappedFulfillmentOrders = fulfillmentOrders.map(
      ({ id, line_items }) => ({
        shopifyId: id,
        lineItems: line_items,
        id: uuidv4(),
      }),
    );

    const orderLines = await Promise.all(
      shippableOrderLines.map(async (soldProduct) => {
        if (!soldProduct?.product_id) {
          throw new Error(`No shippable product found in order ${id}`);
        }

        const { vendor } = await this.getVendorFromProductShopifyId(
          soldProduct.product_id,
        );

        const product = await shopifyApiByToken.product.get(
          soldProduct.product_id,
        );

        const { tags, product_type, handle, images } = product;
        const tagsObject = getTagsObject(tags);
        const sizeArray = await getPimDynamicAttribute('size', tagsObject);

        const getDisplayedSize = (sizeArray: string[] | null) => {
          if (!sizeArray) return null;

          if (sizeArray.length === 1) return head(sizeArray);

          return sizeArray.find((size) =>
            (soldProduct.variant_title ?? soldProduct.name).includes(size),
          );
        };

        const productVariant = soldProduct.variant_id
          ? await this.mainPrisma.productVariant.findUnique({
              where: { shopifyId: soldProduct.variant_id },
            })
          : null;

        if (!productVariant) {
          throw new Error(
            `Cannot map order because variant ${soldProduct.variant_id} not found in database.`,
          );
        }

        const orderLineDiscountInCents =
          soldProduct.discount_allocations.reduce(
            (
              totalDiscount: number,
              {
                amount_set: {
                  shop_money: { amount },
                },
                discount_application_index,
              },
            ) => {
              const appliedDiscount =
                orderData.discount_applications[discount_application_index];

              if (
                isMatch(appliedDiscount, {
                  target_type: 'line_item',
                  target_selection: 'entitled',
                })
              )
                return totalDiscount + Number(amount) * 100;

              return totalDiscount;
            },
            0,
          );

        return {
          shopifyId: String(soldProduct.id),
          vendorId: vendor?.user.id,
          shippingSolution: await this.getOrderShippingSolution(
            orderData,
            vendor?.usedShipping,
          ),
          name: soldProduct.name,
          priceInCents: toCents(soldProduct.price),
          discountInCents: Math.round(orderLineDiscountInCents),
          priceCurrency: Currency.EUR,
          productType: product_type,
          variantCondition: productVariant.condition,
          productHandle: handle,
          productImage:
            get(
              images.sort((a, b) => a.position - b.position),
              '[0].src',
            ) ?? null,
          productModelYear: head(tagsObject['année']),
          productGender: head(tagsObject['genre']),
          productBrand: head(tagsObject['marque']),
          productSize: getDisplayedSize(sizeArray),
          quantity: soldProduct.quantity,
          productVariantId: productVariant.id,
          fulfillmentOrder: mappedFulfillmentOrders.find(({ lineItems }) =>
            lineItems.find(
              (lineItem) => lineItem.variant_id === soldProduct.variant_id,
            ),
          ),
        };
      }),
    );

    const relatedPriceOffers = await this.mainPrisma.priceOffer.findMany({
      where: {
        discountCode: {
          in: orderData.discount_applications.map((discount) => discount.code),
        },
      },
      select: { id: true },
    });

    return {
      order: {
        shopifyId: String(id),
        name: orderData.name,
        status: OrderStatus.CREATED,
        customerEmail: orderData.customer?.email,
        customerId,
        totalPriceInCents: toCents(orderData.total_price),
        totalPriceCurrency: Currency.EUR,
        shippingAddressAddress1: orderData.shipping_address.address1,
        shippingAddressAddress2: orderData.shipping_address.address2 ?? null,
        shippingAddressCompany: orderData.shipping_address.company ?? null,
        shippingAddressCity: orderData.shipping_address.city,
        shippingAddressCountry: orderData.shipping_address.country,
        shippingAddressFirstName: orderData.shipping_address.first_name,
        shippingAddressLastName: orderData.shipping_address.last_name,
        shippingAddressPhone: orderData.shipping_address.phone,
        shippingAddressZip: orderData.shipping_address.zip,
        salesChannelName: SalesChannelName.PUBLIC,
      },
      orderLines,
      fulfillmentOrders: orderLines.flatMap(({ fulfillmentOrder }) =>
        fulfillmentOrder
          ? [{ id: fulfillmentOrder.id, shopifyId: fulfillmentOrder.shopifyId }]
          : [],
      ),
      payment: {
        methodName: this.getOrderPaymentName(orderData),
        checkoutToken: orderData.checkout_token,
      },
      priceOfferIds: relatedPriceOffers.map(({ id }) => ({ id })),
    };
  }

  async mapOrderToStoreFromUserInput(
    orderInput: OrderToStoreFromAdminInput,
  ): Promise<OrderToStore> {
    const {
      customerId,
      lineItems,
      shippingAddress,
      salesChannelName,
      priceOfferIds: inputPriceOfferIds,
    } = orderInput;
    const { email: customerEmail } =
      await this.mainPrisma.users.findFirstOrThrow({
        where: { id: customerId },
      });

    const storeVariants = await this.getStoreVariants(lineItems);

    const priceOfferIds = await this.mainPrisma.priceOffer.findMany({
      where: {
        id: {
          in: inputPriceOfferIds,
        },
        buyerId: customerId,
        salesChannelName,
        productId: {
          in: storeVariants.map(
            ({
              variant: {
                product: { id },
              },
            }) => id,
          ),
        },
      },
      select: {
        id: true,
      },
    });

    //TODO: Update input to create multiple fulfillment orders
    const singleFulfillmentOrderId = uuidv4();

    return {
      order: {
        salesChannelName,
        name: `#${readableCode()}`,
        status: OrderStatus.CREATED,
        customerEmail: customerEmail ?? '',
        customerId,
        totalPriceInCents: reduce(
          lineItems,
          (
            total,
            { quantity, unitPriceInCents, unitBuyerCommissionInCents },
          ) => {
            return (
              total + quantity * (unitPriceInCents + unitBuyerCommissionInCents) //TODO: Add discount & shipping
            );
          },
          0,
        ),
        totalPriceCurrency: Currency.EUR,
        shippingAddressAddress1: shippingAddress.address1,
        shippingAddressAddress2: shippingAddress.address2 ?? null,
        shippingAddressCompany: shippingAddress.company ?? null,
        shippingAddressCity: shippingAddress.city,
        shippingAddressCountry: shippingAddress.country,
        shippingAddressPhone: shippingAddress.phone,
        shippingAddressZip: shippingAddress.zip,
        shippingAddressFirstName: shippingAddress.firstName,
        shippingAddressLastName: shippingAddress.lastName,
      },
      orderLines: lineItems.map(
        ({
          variantId,
          quantity,
          unitPriceInCents,
          unitBuyerCommissionInCents,
          shippingSolution,
        }) => {
          const storeVariant = storeVariants.find(({ id }) => variantId === id);

          if (!storeVariant) {
            throw new Error(
              `Order cannot be processed for variant ${variantId}: product might be inactive or not found in store.`,
            );
          }

          const exposedProduct = storeVariant.variant.product.exposedProduct;

          return {
            name: storeVariant.title,
            vendorId: storeVariant.variant.product.vendorId,
            priceInCents: unitPriceInCents,
            buyerCommissionInCents: quantity * unitBuyerCommissionInCents,
            discountInCents: 0,
            shippingSolution,
            priceCurrency: Currency.EUR,
            productType: exposedProduct?.productType ?? '',
            productHandle: exposedProduct?.handle ?? '',
            productImage: exposedProduct?.firstImage ?? '',
            variantCondition:
              storeVariant.condition === Condition.REFURBISHED_AS_NEW
                ? Condition.AS_NEW
                : storeVariant.condition,
            productModelYear: exposedProduct?.modelYear,
            productGender: exposedProduct?.gender,
            productBrand: exposedProduct?.brand,
            quantity,
            productVariantId: variantId,
            fulfillmentOrder: {
              id: singleFulfillmentOrderId,
            },
          };
        },
      ),
      fulfillmentOrders: [{ id: singleFulfillmentOrderId }],
      priceOfferIds,
    };
  }

  async mapOrderPaid(orderData: IOrder): Promise<OrderPaidData> {
    const { id, name } = orderData;

    const soldProduct = getSingleProductInOrder(orderData);

    if (!soldProduct?.product_id) {
      throw new Error(`No shippable product found in order ${id}`);
    }

    const { id: productInternalId } =
      await this.mainPrisma.product.findUniqueOrThrow({
        where: {
          shopifyId: soldProduct.product_id,
        },
      });

    const productMetafields = await shopifyApiByToken.metafield.list({
      metafield: {
        owner_resource: 'product',
        owner_id: soldProduct.product_id,
      },
      limit: 250,
    });
    const productVariantMetafields = await shopifyApiByToken.metafield.list({
      metafield: {
        owner_resource: 'variant',
        owner_id: soldProduct.variant_id,
      },
      limit: 250,
    });

    const {
      vendor: {
        shopifyId: vendorShopifyId,
        firstName,
        lastName,
        sellerName,
        usedShipping: vendorUsedShipping,
        user: { email },
        authUserId,
        isPro,
      },
      sourceUrl,
      createdAt,
      handle,
    } = await this.getVendorFromProductShopifyId(soldProduct.product_id);

    if (!email) {
      throw new Error(
        `Cannot map order paid because no vendor email found for order ${id}`,
      );
    }

    if (!orderData.customer) {
      throw new Error(
        `Cannot map order because no customer found for order ${id}`,
      );
    }

    const chatConversationLink = await this.getChatConversationLink(
      productInternalId,
      String(orderData.customer.id),
      orderData,
    );

    const previousOrderLines = await this.mainPrisma.orderLines.findMany({
      where: {
        vendor: {
          authUserId,
        },
        order: {
          shopifyId: {
            not: String(id),
          },
        },
      },
      select: {
        shippingSolution: true,
        productType: true,
      },
    });

    const soldProductType = await this.mainPrisma.product.findUnique({
      where: {
        shopifyId: soldProduct.product_id,
      },
      select: {
        productType: true,
      },
    });

    return {
      order: {
        shopifyId: String(id),
        name,
        shipmentEmail: `notifications+${id}@barooders.com`,
        createdAt: new Date(orderData.created_at).toLocaleDateString('fr-FR'),
        totalPrice: orderData.total_price,
      },
      product: {
        shippingSolution: await this.getOrderShippingSolution(
          orderData,
          vendorUsedShipping,
        ),
        name: soldProduct.name,
        price: soldProduct.price,
        referenceId: [
          findMetafield(productMetafields, 'reference_id')?.value,
          findMetafield(productVariantMetafields, 'reference_id')?.value,
        ]
          .filter(Boolean)
          .join(' '),
        referenceUrl: sourceUrl ?? '',
        variantTitle: soldProduct.name,
        createdAt,
        handle: handle ?? '',
        chatConversationLink,
        productType: soldProductType?.productType ?? '',
      },
      customer: {
        email: orderData.customer.email,
        address: [
          orderData.shipping_address?.address1,
          orderData.shipping_address?.address2,
          orderData.shipping_address?.city,
          orderData.shipping_address?.zip,
          orderData.shipping_address?.country,
        ]
          .filter(Boolean)
          .join(' '),
        phone: orderData.shipping_address?.phone ?? '',
        fullName: [orderData.customer.first_name, orderData.customer.last_name]
          .filter(Boolean)
          .join(' '),
      },
      vendor: {
        shopifyId: String(vendorShopifyId),
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

  async mapOrderCreated(orderData: IOrder): Promise<OrderCreatedData> {
    const soldProduct = getSingleProductInOrder(orderData);

    if (!soldProduct?.product_id) {
      throw new Error(`No shippable product found in order ${orderData.id}`);
    }

    if (!orderData.customer) {
      throw new Error(
        `Cannot map order because no customer found for order ${orderData.id}`,
      );
    }

    const { sourceUrl, createdAt } =
      await this.mainPrisma.product.findUniqueOrThrow({
        where: {
          shopifyId: soldProduct.product_id,
        },
      });

    return {
      order: {
        name: orderData.name,
        adminUrl: this.getOrderAdminUrl(orderData.id),
        paymentMethod: this.getOrderPaymentName(orderData),
        totalPrice: orderData.total_price,
      },
      product: {
        name: soldProduct.name,
        referenceUrl: sourceUrl ?? '',
        createdAt,
      },
      customer: {
        email: orderData.customer.email,
        firstName: orderData.customer.first_name,
        fullName: [orderData.customer.first_name, orderData.customer.last_name]
          .filter(Boolean)
          .join(' '),
      },
    };
  }

  private async getStoreVariants(lineItems: { variantId: string }[]) {
    return await this.storePrisma.storeExposedProductVariant.findMany({
      where: {
        id: {
          in: lineItems.map(({ variantId }) => variantId),
        },
      },
      select: {
        id: true,
        title: true,
        condition: true,
        variant: {
          include: {
            product: {
              include: {
                exposedProduct: true,
              },
            },
          },
        },
      },
    });
  }

  private getOrderPaymentName(orderData: IOrder): string {
    const paymentMethodName = last(orderData.payment_gateway_names);

    if (!paymentMethodName) {
      throw new Error(
        `No payment method found for order ${orderData.id}, received: ${orderData.payment_gateway_names}`,
      );
    }

    return paymentMethodName;
  }

  private async getChatConversationLink(
    productInternalId: string,
    customerShopifyId: string,
    orderData: IOrder,
  ) {
    const frontendChatPage = `https://${envConfig.externalServices.shopify.shopDns}/pages/chat`;

    if (!isHandDeliveryOrder(orderData)) return frontendChatPage;

    const isUnknownCustomer = (await this.getCustomerId(orderData)) === null;
    if (isUnknownCustomer) return frontendChatPage;

    try {
      const conversationId =
        await this.handDeliveryService.updateChatConversationAndGetConversationId(
          productInternalId,
          customerShopifyId,
        );

      return `${frontendChatPage}?conversationId=${conversationId}`;
    } catch (error: any) {
      this.logger.error(error.message, error);
      return frontendChatPage;
    }
  }

  private async getOrderShippingSolution(
    orderData: IOrder,
    vendorUsedShipping?: ShippingType,
  ): Promise<ShippingSolution> {
    const isHandDelivery = isHandDeliveryOrder(orderData);
    const hasBikesInOrder = await this.hasBikeInVariantsArray(
      orderData.line_items
        .map(({ variant_id }) => variant_id)
        .flatMap((v) => (v ? [v] : [])),
    );

    return await getOrderShippingSolution(
      isHandDelivery,
      hasBikesInOrder,
      vendorUsedShipping,
    );
  }

  private async hasBikeInVariantsArray(
    variantStoreIds: number[],
  ): Promise<boolean> {
    const bikesCount = await this.storePrisma.storeBaseProductVariant.count({
      where: {
        shopifyId: {
          in: variantStoreIds,
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
    });

    return bikesCount > 0;
  }

  private async getCustomerId({ customer }: IOrder): Promise<string | null> {
    const shopifyId = customer?.id;

    if (!shopifyId) return null;

    const storedCustomer =
      await this.customerRepository.getCustomerFromShopifyId(shopifyId);

    if (!storedCustomer) {
      this.logger.debug(`Customer ${shopifyId} not found in database`);
      return null;
    }

    return storedCustomer.user.id;
  }

  private getOrderAdminUrl(orderId: number): string {
    return `https://${shopifyConfig.shop}/admin/orders/${orderId}`;
  }

  private async getVendorFromProductShopifyId(
    productShopifyId: number,
  ): Promise<Product & { vendor: Customer & { user: users } }> {
    return await this.mainPrisma.product.findUniqueOrThrow({
      where: {
        shopifyId: productShopifyId,
      },
      include: {
        vendor: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
