import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Amount, UUID, ValueDate } from '@libs/domain/value-objects';
import { readableCode } from '@libs/helpers/safe-id';
import { fetchShopifyGraphQL } from '@libs/infrastructure/shopify/shopify-api/shopify-graphql-client.lib';
import { toStorefrontId } from '@libs/infrastructure/shopify/shopify-id';
import { IStoreClient } from '@modules/price-offer/domain/ports/store.client';
import { Injectable } from '@nestjs/common';
import { gql } from 'graphql-tag';

@Injectable()
export class ShopifyClient implements IStoreClient {
  constructor(protected readonly prisma: PrismaMainClient) {}

  async createDiscountCode(
    userId: UUID,
    limitDate: ValueDate,
    amountOffProduct: Amount,
    productId: UUID,
    productVariantId?: UUID,
  ): Promise<{ discountCode: string }> {
    const entitled_variant_ids = [];
    const entitled_product_ids = [];

    if (productVariantId) {
      const variant = await this.prisma.productVariant.findUniqueOrThrow({
        where: { id: productVariantId.uuid },
        select: { shopifyId: true },
      });

      entitled_variant_ids.push(variant.shopifyId);
    } else {
      const product = await this.prisma.product.findUniqueOrThrow({
        where: { id: productId.uuid },
        select: { shopifyId: true },
      });

      entitled_product_ids.push(product.shopifyId);
    }

    const buyer = await this.prisma.customer.findUniqueOrThrow({
      where: { authUserId: userId.uuid },
      select: { shopifyId: true },
    });

    const code = readableCode();

    if (buyer.shopifyId === null)
      throw new Error(
        'Trying to create a discount code for a customer that does not exist in Shopify',
      );

    await fetchShopifyGraphQL(
      gql`
        mutation discountCodeBasicCreate(
          $codeDiscount: DiscountCodeBasicInput!
        ) {
          discountCodeBasicCreate(basicCodeDiscount: $codeDiscount) {
            codeDiscountNode {
              codeDiscount {
                ... on DiscountCodeBasic {
                  title
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
      {
        variables: {
          codeDiscount: {
            appliesOncePerCustomer: false,
            code,
            combinesWith: {
              orderDiscounts: true,
              productDiscounts: true,
              shippingDiscounts: true,
            },
            customerGets: {
              items: {
                products: {
                  productVariantsToAdd: entitled_variant_ids.map((id) => {
                    if (id === null)
                      throw new Error(
                        'Trying to create a discount code for a product variant that does not exist in Shopify',
                      );
                    return toStorefrontId(id.toString(), 'ProductVariant');
                  }),
                  productsToAdd: entitled_product_ids.map((id) => {
                    if (id === null)
                      throw new Error(
                        'Trying to create a discount code for a product that does not exist in Shopify',
                      );
                    return toStorefrontId(id.toString(), 'Product');
                  }),
                },
              },
              value: {
                discountAmount: {
                  amount: amountOffProduct.amount,
                  appliesOnEachItem: true,
                },
              },
            },
            customerSelection: {
              customers: {
                add: [toStorefrontId(buyer.shopifyId.toString(), 'Customer')],
              },
            },
            endsAt: limitDate.date.toISOString(),
            title: code,
            usageLimit: 10,
            startsAt: new Date().toISOString(),
          },
        },
      },
    );

    return { discountCode: code };
  }
}
