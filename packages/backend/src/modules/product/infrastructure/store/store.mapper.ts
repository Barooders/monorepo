import {
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import {
  Condition,
  PrismaStoreClient,
  ProductStatus,
  StoreB2BProductVariant,
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
import {
  B2BVariantToIndex,
  PublicVariantToIndex,
  VariantToIndexWithTarget,
} from '@modules/product/domain/ports/variant-to-index.type';
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
    const salesChannels =
      await this.prismaMainClient.productSalesChannel.findMany({
        where: {
          productId: productId.uuid,
        },
        select: {
          salesChannelName: true,
        },
      });

    const variantsToIndexPromises = salesChannels.map(
      async ({ salesChannelName }) => {
        switch (salesChannelName) {
          case SalesChannelName.PUBLIC:
            const publicVariants =
              await this.mapPublicVariantsToIndex(productId);
            return publicVariants.map((variant) => ({
              target: salesChannelName,
              data: variant,
            }));
          case SalesChannelName.B2B:
            const b2bVariants = await this.mapB2BVariantsToIndex(productId);
            return b2bVariants.map((variant) => ({
              target: salesChannelName,
              data: variant,
            }));
          default:
            throw new Error(`Unknown sales channel: ${salesChannelName}`);
        }
      },
    );

    return (await Promise.all(variantsToIndexPromises)).flat();
  }

  private async mapPublicVariantsToIndex(
    productId: UUID,
  ): Promise<PublicVariantToIndex[]> {
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
        `Could not find detailed public product with id ${productId.uuid}`,
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

    const variants = this.mapPublicVariants(baseProductVariants);

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
    }));
  }

  private async mapB2BVariantsToIndex(
    productId: UUID,
  ): Promise<B2BVariantToIndex[]> {
    const {
      baseProductVariants,
      shopifyId,
      storeB2BProduct,
      exposedProductTags,
      vendorId,
    } = await this.prismaStoreClient.storeBaseProduct.findUniqueOrThrow({
      where: {
        id: productId.uuid,
      },
      include: {
        storeB2BProduct: true,
        exposedProductTags: true,
        baseProductVariants: {
          include: {
            storeB2BProductVariant: true,
          },
        },
      },
    });

    if (!storeB2BProduct) {
      this.logger.warn(
        `Could not find detailed B2B product with id ${productId.uuid}`,
      );
      return [];
    }

    const variants = this.mapB2BVariants(baseProductVariants);

    const product = {
      shopifyId: new ShopifyID({ id: Number(shopifyId) }),
      id: productId,
      vendorId: new UUID({ uuid: vendorId }),
      isActive:
        storeB2BProduct.status === ProductStatus.ACTIVE &&
        !!storeB2BProduct.publishedAt,
      imageSrc: storeB2BProduct.firstImage
        ? new URL({ url: storeB2BProduct.firstImage })
        : undefined,
      title: storeB2BProduct.title,
      handle: storeB2BProduct.handle,
      publishedAt: new ValueDate({
        date: storeB2BProduct.publishedAt ?? new Date(),
      }),
      productType: new ProductType({
        productType: storeB2BProduct.productType,
      }),
      tags: new Tags({
        tags: getTagsObject(exposedProductTags.map(({ fullTag }) => fullTag)),
      }),
    };

    return variants.map((variant) => ({
      product,
      variant,
    }));
  }

  private mapPublicVariants(
    baseProductVariants: (StoreBaseProductVariant & {
      exposedProductVariant: StoreExposedProductVariant | null;
    })[],
  ): PublicVariantToIndex['variant'][] {
    return baseProductVariants
      .map((baseProductVariant) => {
        const variant = baseProductVariant.exposedProductVariant;
        if (!variant) {
          this.logger.warn(
            `Could not find detailed public product variant with id ${baseProductVariant.id}`,
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
            `Could not map public variant with id ${baseProductVariant.id} to index: ${error.message}`,
            error,
          );

          return undefined;
        }
      })
      .flatMap((vendorId) => (vendorId ? [vendorId] : []));
  }

  private mapB2BVariants(
    baseProductVariants: (StoreBaseProductVariant & {
      storeB2BProductVariant: StoreB2BProductVariant | null;
    })[],
  ): B2BVariantToIndex['variant'][] {
    return baseProductVariants
      .map((baseProductVariant) => {
        const variant = baseProductVariant.storeB2BProductVariant;
        if (!variant) {
          this.logger.warn(
            `Could not find detailed B2B product variant with id ${baseProductVariant.id}`,
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
          };
        } catch (error: any) {
          this.logger.error(
            `Could not map B2B variant with id ${baseProductVariant.id} to index: ${error.message}`,
            error,
          );

          return undefined;
        }
      })
      .flatMap((vendorId) => (vendorId ? [vendorId] : []));
  }
}
