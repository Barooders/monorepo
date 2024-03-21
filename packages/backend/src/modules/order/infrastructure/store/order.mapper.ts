import envConfig from '@config/env/env.config';
import { shopifyConfig } from '@config/shopify.config';
import { CustomerRepository } from '@libs/domain/customer.repository';
import { getOrderShippingSolution } from '@libs/domain/order.interface';
import {
  Currency,
  Customer,
  OrderStatus,
  Order as PersistedOrder,
  PrismaMainClient,
  Product,
  ShippingSolution,
  ShippingType,
  users,
} from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { BIKES_COLLECTION_HANDLE } from '@libs/domain/types';
import {
  Amount,
  Email,
  ShopifyID,
  Stock,
  URL,
  UUID,
  ValueDate,
} from '@libs/domain/value-objects';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import {
  findMetafield,
  getSingleProductInOrder,
  isHandDeliveryOrder,
  shopifyApiByToken,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { getPimDynamicAttribute } from '@libs/infrastructure/strapi/strapi.helper';
import { PRODUCT_TYPE } from '@modules/order/domain/constants/commission-product.constants';
import { HandDeliveryService } from '@modules/order/domain/hand-delivery.service';
import {
  Order,
  OrderLine,
  OrderPaidData,
} from '@modules/order/domain/ports/types';
import { Injectable, Logger } from '@nestjs/common';
import get from 'lodash/get';
import head from 'lodash/head';
import isMatch from 'lodash/isMatch';
import Shopify, { IOrder } from 'shopify-api-node';

@Injectable()
export class OrderMapper {
  private readonly logger = new Logger(OrderMapper.name);

  constructor(
    private customerRepository: CustomerRepository,
    private mainPrisma: PrismaMainClient,
    private storePrisma: PrismaStoreClient,
    private handDeliveryService: HandDeliveryService,
  ) {}

  async mapOrder(orderData: IOrder): Promise<Order> {
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

    const paymentMethodName = orderData.payment_gateway_names[0];

    const fulfillmentOrders =
      await shopifyApiByToken.order.fulfillmentOrders(id);

    if (fulfillmentOrders.length === 0) {
      throw new Error(`No fulfillment order found yet for order ${id}`);
    }

    const soldProduct = getSingleProductInOrder(orderData);

    if (!soldProduct?.product_id) {
      throw new Error(`No shippable product found in order ${orderData.id}`);
    }

    if (!orderData.customer) {
      throw new Error(
        `Cannot map order because no customer found for order ${orderData.id}`,
      );
    }

    if (!paymentMethodName) {
      throw new Error(
        `No payment method found for order ${orderData.id}, received: ${orderData.payment_gateway_names}`,
      );
    }

    const orderLines = await Promise.all(
      shippableOrderLines.map((orderLine) =>
        this.mapOrderLine(orderLine, orderData, fulfillmentOrders),
      ),
    );

    return {
      storeId: new ShopifyID({ id }),
      name: orderData.name,
      status: OrderStatus.CREATED,
      customer: {
        email: new Email({
          email: orderData.customer?.email,
        }),
        id: customerId ? new UUID({ uuid: customerId }) : null,
        firstName: orderData.customer.first_name,
        fullName: `${orderData.customer.first_name} ${orderData.customer.last_name}`,
      },
      totalPrice: new Amount({
        amountInCents: Math.round(Number(orderData.total_price) * 100),
        currency: Currency.EUR,
      }),
      shippingAddress: {
        address1: orderData.shipping_address.address1,
        address2: orderData.shipping_address.address2 ?? null,
        company: orderData.shipping_address.company ?? null,
        city: orderData.shipping_address.city,
        country: orderData.shipping_address.country,
        firstName: orderData.shipping_address.first_name,
        lastName: orderData.shipping_address.last_name,
        phone: orderData.shipping_address.phone,
        zip: orderData.shipping_address.zip,
      },
      adminUrl: new URL({ url: this.getOrderAdminUrl(orderData.id) }),
      paymentCheckoutLabel: paymentMethodName,
      orderLines,
      fulfillmentOrders: orderLines.flatMap(({ fulfillmentOrderShopifyId }) =>
        fulfillmentOrderShopifyId
          ? [{ shopifyId: fulfillmentOrderShopifyId }]
          : [],
      ),
    };
  }

  async mapOrderPaid(orderData: IOrder): Promise<OrderPaidData> {
    const { id, name } = orderData;

    const soldProduct = getSingleProductInOrder(orderData);

    if (!soldProduct?.product_id) {
      throw new Error(`No shippable product found in order ${id}`);
    }

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
      String(soldProduct.product_id),
      String(orderData.customer.id),
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

  private async mapOrderLine(
    soldProduct: Shopify.IOrderLineItem,
    orderData: IOrder,
    fulfillmentOrders: Shopify.IFulfillmentOrder[],
  ): Promise<OrderLine> {
    if (!soldProduct?.product_id) {
      throw new Error(`No shippable product found in order ${orderData.id}`);
    }

    const { vendor, sourceUrl } = await this.getVendorFromProductShopifyId(
      soldProduct.product_id,
    );

    const product = await shopifyApiByToken.product.get(soldProduct.product_id);

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

    const orderLineDiscountInCents = soldProduct.discount_allocations.reduce(
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
      storeId: new ShopifyID({ id: soldProduct.id }),
      shippingSolution: await this.getOrderShippingSolution(
        orderData,
        vendor?.usedShipping,
      ),
      price: new Amount({
        amountInCents: Math.round(Number(soldProduct.price) * 100),
        currency: Currency.EUR,
      }),
      isPhysicalProduct: product_type !== PRODUCT_TYPE,
      discountInCents: Math.round(orderLineDiscountInCents),
      product: {
        referenceUrl: sourceUrl ? new URL({ url: sourceUrl }) : undefined,
        createdAt: new ValueDate({ date: new Date(product.created_at) }),
        name: soldProduct.name,
        vendorId: vendor?.user.id,
        handle: handle,
        image:
          get(
            images.sort((a, b) => a.position - b.position),
            '[0].src',
          ) ?? null,
        modelYear: head(tagsObject['année']),
        gender: head(tagsObject['genre']),
        brand: head(tagsObject['marque']),
        size: getDisplayedSize(sizeArray),
        variantId: productVariant?.id,
        productType: product_type,
        variantCondition: productVariant?.condition,
      },
      quantity: new Stock({ stock: soldProduct.quantity }),
      fulfillmentOrderShopifyId: fulfillmentOrders.find((fulfillmentOrder) =>
        fulfillmentOrder.line_items.find(
          (lineItem) => lineItem.variant_id === soldProduct.variant_id,
        ),
      )?.id,
    };
  }

  toPersistence(order: Order): Partial<PersistedOrder> {
    const shippingAddress = order.shippingAddress
      ? {
          shippingAddressAddress1: order.shippingAddress.address1,
          shippingAddressAddress2: order.shippingAddress.address2,
          shippingAddressCity: order.shippingAddress.city,
          shippingAddressCountry: order.shippingAddress.country,
          shippingAddressLastName: order.shippingAddress.lastName,
          shippingAddressZip: order.shippingAddress.zip,
          shippingAddressCompany: order.shippingAddress.company,
          shippingAddressFirstName: order.shippingAddress.firstName,
          shippingAddressPhone: order.shippingAddress.phone ?? '',
        }
      : {};

    const customer = order.customer
      ? {
          customerEmail: order.customer.email.address,
          customerId: order.customer.id?.uuid,
        }
      : {};

    return {
      ...shippingAddress,
      ...customer,
      id: order.id?.uuid ?? '',
      createdAt: order.createdAt?.date ?? new Date(),
      name: order.name,
      shopifyId: order.storeId.id.toString(),
      status: order.status,
      totalPriceCurrency: order.totalPrice.currency as 'EUR',
      totalPriceInCents: order.totalPrice.amountInCents,
      paidAt: order?.paidAt?.date ?? null,
      checkoutId: null,
    };
  }

  fromPersistence(order: PersistedOrder): Order {
    const shopifyId = parseInt(order.shopifyId);
    return {
      adminUrl: new URL({
        url: this.getOrderAdminUrl(shopifyId),
      }),
      name: order.name,
      status: order.status,
      storeId: new ShopifyID({ id: shopifyId }),
      totalPrice: new Amount({
        amountInCents: order.totalPriceInCents,
        currency: order.totalPriceCurrency,
      }),
    };
  }

  private async getChatConversationLink(
    productId: string,
    customerShopifyId: string,
  ) {
    const frontendChatPage = `https://${envConfig.externalServices.shopify.shopDns}/pages/chat`;

    try {
      const conversationId =
        await this.handDeliveryService.updateChatConversationAndGetConversationId(
          productId,
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

    return getOrderShippingSolution(
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
