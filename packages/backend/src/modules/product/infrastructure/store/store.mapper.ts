import {
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import {
  Condition,
  PrismaStoreClient,
  ProductStatus,
  StoreBaseProductVariant,
  StoreExposedProductVariant,
} from '@libs/domain/prisma.store.client';
import {
  Amount,
  Percentage,
  ShopifyID,
  Stock,
  Tags,
  URL,
  UUID,
  ValueDate,
} from '@libs/domain/value-objects';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import { VariantToIndexWithTarget } from '@modules/product/domain/indexation.service';
import { PublicVariantToIndex } from '@modules/product/domain/ports/variant-to-index.type';
import { ProductType } from '@modules/product/domain/value-objects/product-type.value-object';
import { Injectable, Logger } from '@nestjs/common';
import { meanBy } from 'lodash';

const getHighestDiscount = (
  variants: PublicVariantToIndex['variant'][],
): number => {
  return variants.reduce((acc: number, { compareAtPrice, price }) => {
    if (!compareAtPrice || !price || compareAtPrice.amount < price.amount) {
      return acc;
    }

    const discount: number =
      (compareAtPrice.amount - price.amount) / compareAtPrice.amount;

    return discount > acc ? discount : acc;
  }, 0);
};

@Injectable()
export class StoreMapper {
  private readonly logger = new Logger(StoreMapper.name);

  constructor(
    private prismaMainClient: PrismaMainClient,
    private prismaStoreClient: PrismaStoreClient,
  ) {}

  async mapVariantsToIndexFromProductId(
    productId: UUID,
  ): Promise<VariantToIndexWithTarget[]> {
    const {
      baseProductVariants,
      exposedProduct,
      storeProductForAnalytics,
      exposedProductTags,
      collections,
      shopifyId,
      vendorId,
    } = await this.prismaStoreClient.storeBaseProduct.findUniqueOrThrow({
      where: {
        id: productId.uuid,
      },
      include: {
        exposedProduct: true,
        storeProductForAnalytics: true,
        exposedProductTags: true,
        collections: {
          include: {
            collection: true,
          },
        },
        baseProductVariants: {
          include: {
            exposedProductVariant: true,
          },
        },
      },
    });

    if (!exposedProduct) {
      this.logger.warn(
        `Could not find detailed product with id ${productId.uuid}`,
      );
      return [];
    }

    const { isPro, sellerName, vendorReviews } =
      await this.prismaMainClient.customer.findUniqueOrThrow({
        where: {
          authUserId: vendorId,
        },
        include: {
          vendorReviews: { include: { review: true } },
        },
      });

    const variants = this.mapVariants(baseProductVariants);

    const highestDiscount = getHighestDiscount(variants);

    const product = {
      shopifyId: new ShopifyID({ id: Number(shopifyId) }),
      id: productId,
      isActive:
        exposedProduct.status === ProductStatus.ACTIVE &&
        !!exposedProduct.publishedAt,
      imageSrc: exposedProduct.firstImage
        ? new URL({ url: exposedProduct.firstImage })
        : undefined,
      title: exposedProduct.title,
      handle: exposedProduct.handle,
      highestDiscount: new Percentage({
        percentage: highestDiscount > 0 ? highestDiscount : 0,
      }),
      publishedAt: new ValueDate({
        date: exposedProduct.publishedAt ?? new Date(),
      }),
      productType: new ProductType({
        productType: exposedProduct.productType,
      }),
      calculatedScoring: storeProductForAnalytics?.calculatedScoring ?? 0,
      tags: new Tags({
        tags: getTagsObject(exposedProductTags.map(({ fullTag }) => fullTag)),
      }),
      collections: collections
        .filter(({ collection }) => !collection.handle.includes('admin'))
        .map(({ collection }) => ({
          id: new UUID({ uuid: collection.id }),
          handle: collection.handle,
        })),
    };

    const reviews = vendorReviews.map(({ review }) => review);

    return variants.map((variant) => ({
      target: SalesChannelName.PUBLIC,
      data: {
        product,
        vendor: {
          name: sellerName ?? '',
          isPro,
          reviews: {
            count: reviews.length,
            averageRating: meanBy(reviews, 'rating'),
          },
        },
        variant,
      },
    }));
  }

  private mapVariants(
    baseProductVariants: (StoreBaseProductVariant & {
      exposedProductVariant: StoreExposedProductVariant | null;
    })[],
  ): PublicVariantToIndex['variant'][] {
    return baseProductVariants
      .map((baseProductVariant) => {
        const variant = baseProductVariant.exposedProductVariant;
        if (!variant) {
          this.logger.warn(
            `Could not find detailed product variant with id ${baseProductVariant.id}`,
          );
          return undefined;
        }

        try {
          return {
            shopifyId: new ShopifyID({
              id: Number(baseProductVariant.shopifyId),
            }),
            id: baseProductVariant.id
              ? new UUID({ uuid: baseProductVariant.id })
              : undefined,
            title: variant.title,
            updatedAt: new ValueDate({
              date: variant.updatedAt,
            }),
            createdAt: new ValueDate({
              date: baseProductVariant.createdAt,
            }),
            quantityAvailable: variant.inventoryQuantity
              ? new Stock({ stock: Number(variant.inventoryQuantity) })
              : undefined,
            price: new Amount({
              amountInCents: Math.floor(variant.price * 100),
            }),
            condition: variant.condition ?? Condition.GOOD,
            isRefurbished: variant.isRefurbished ?? false,
            compareAtPrice: new Amount({
              amountInCents: Math.floor(
                (variant.compareAtPrice ?? variant.price) * 100,
              ),
            }),
          };
        } catch (error: any) {
          this.logger.error(
            `Could not map variant with id ${baseProductVariant.id} to index: ${error.message}`,
            error,
          );

          return undefined;
        }
      })
      .flatMap((vendorId) => (vendorId ? [vendorId] : []));
  }
}
