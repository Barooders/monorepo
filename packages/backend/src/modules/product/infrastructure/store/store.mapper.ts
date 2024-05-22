import {
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import {
  Condition,
  PrismaStoreClient,
  ProductStatus,
  StoreB2BProductVariant,
  StoreB2CProductVariant,
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
import { BundleType } from 'shared-types';

const getBundleType = (variantsCount: number): BundleType => {
  if (variantsCount === 0) return BundleType.NO_PRODUCT;
  if (variantsCount === 1) return BundleType.SINGLE_PRODUCT;
  if (variantsCount < 10) return BundleType.TWO_TO_NINE;

  return BundleType.TEN_PLUS;
};

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
            storeB2CProductVariant: true,
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
      storeProductForAnalytics,
      shopifyId,
      storeB2BProduct,
      exposedProduct,
      exposedProductTags,
      vendorId,
    } = await this.prismaStoreClient.storeBaseProduct.findUniqueOrThrow({
      where: {
        id: productId.uuid,
      },
      include: {
        exposedProduct: true,
        storeB2BProduct: true,
        exposedProductTags: true,
        storeProductForAnalytics: true,
        baseProductVariants: {
          include: {
            exposedProductVariant: true,
            storeB2BProductVariant: true,
          },
        },
      },
    });

    if (!exposedProduct) {
      this.logger.warn(
        `Could not find detailed B2B product with id ${productId.uuid}`,
      );
      return [];
    }

    const { sellerName } =
      await this.prismaMainClient.customer.findUniqueOrThrow({
        where: {
          authUserId: vendorId,
        },
      });

    const variants = this.mapB2BVariants(baseProductVariants);

    const product = {
      shopifyId: new ShopifyID({ id: Number(shopifyId) }),
      id: productId,
      vendorId: new UUID({ uuid: vendorId }),
      isActive:
        exposedProduct.status === ProductStatus.ACTIVE &&
        !!exposedProduct.publishedAt,
      imageSrc: exposedProduct.firstImage
        ? new URL({ url: exposedProduct.firstImage })
        : undefined,
      title: exposedProduct.title,
      vendor: sellerName ?? '',
      handle: exposedProduct.handle,
      publishedAt: new ValueDate({
        date: exposedProduct.publishedAt ?? new Date(),
      }),
      productType: new ProductType({
        productType: exposedProduct.productType,
      }),
      tags: new Tags({
        tags: getTagsObject(exposedProductTags.map(({ fullTag }) => fullTag)),
      }),
      bundleType: getBundleType(Number(exposedProduct.totalQuantity)),
      totalQuantity: new Stock({
        stock: Number(exposedProduct.totalQuantity),
      }),
      largestBundlePrice: storeB2BProduct?.largestBundlePriceInCents
        ? new Amount({
            amountInCents: Number(storeB2BProduct.largestBundlePriceInCents),
          })
        : undefined,
      calculatedScoring: storeProductForAnalytics?.calculatedB2BScoring ?? 0,
    };

    return variants.map((variant) => ({
      product,
      variant,
    }));
  }

  private mapPublicVariants(
    baseProductVariants: (StoreBaseProductVariant & {
      exposedProductVariant: StoreExposedProductVariant | null;
      storeB2CProductVariant: StoreB2CProductVariant | null;
    })[],
  ): PublicVariantToIndex['variant'][] {
    return baseProductVariants
      .map(
        ({
          createdAt,
          shopifyId,
          id,
          exposedProductVariant,
          storeB2CProductVariant,
        }) => {
          if (!exposedProductVariant) {
            this.logger.warn(
              `Could not find exposed product variant with id ${id}`,
            );
            return undefined;
          }

          if (!storeB2CProductVariant) {
            this.logger.warn(
              `Could not find store public product variant with id ${id}`,
            );
            return undefined;
          }

          try {
            return {
              shopifyId: new ShopifyID({
                id: Number(shopifyId),
              }),
              id: id ? new UUID({ uuid: id }) : undefined,
              title: exposedProductVariant.title,
              updatedAt: new ValueDate({
                date: exposedProductVariant.updatedAt,
              }),
              createdAt: new ValueDate({
                date: createdAt,
              }),
              quantityAvailable: exposedProductVariant.inventoryQuantity
                ? new Stock({
                    stock: Number(exposedProductVariant.inventoryQuantity),
                  })
                : undefined,
              price: new Amount({
                amountInCents: Math.floor(storeB2CProductVariant.price * 100),
              }),
              condition: exposedProductVariant.condition ?? Condition.GOOD,
              isRefurbished: exposedProductVariant.isRefurbished ?? false,
              compareAtPrice: new Amount({
                amountInCents: Math.floor(
                  (storeB2CProductVariant.compareAtPrice ??
                    storeB2CProductVariant.price) * 100,
                ),
              }),
            };
          } catch (error: any) {
            this.logger.error(
              `Could not map public variant with id ${id} to index: ${error.message}`,
              error,
            );

            return undefined;
          }
        },
      )
      .flatMap((vendorId) => (vendorId ? [vendorId] : []));
  }

  private mapB2BVariants(
    baseProductVariants: (StoreBaseProductVariant & {
      exposedProductVariant: StoreExposedProductVariant | null;
      storeB2BProductVariant: StoreB2BProductVariant | null;
    })[],
  ): B2BVariantToIndex['variant'][] {
    return baseProductVariants
      .map(
        ({
          createdAt,
          id,
          shopifyId,
          storeB2BProductVariant,
          exposedProductVariant,
        }) => {
          if (!storeB2BProductVariant) {
            this.logger.warn(
              `Could not find exposed product variant with id ${id}`,
            );
            return undefined;
          }

          if (!exposedProductVariant) {
            this.logger.warn(
              `Could not find B2B product variant with id ${id}`,
            );
            return undefined;
          }

          try {
            return {
              shopifyId: new ShopifyID({
                id: Number(shopifyId),
              }),
              id: id ? new UUID({ uuid: id }) : undefined,
              updatedAt: new ValueDate({
                date: exposedProductVariant.updatedAt,
              }),
              createdAt: new ValueDate({
                date: createdAt,
              }),
              quantityAvailable: exposedProductVariant.inventoryQuantity
                ? new Stock({
                    stock: Number(exposedProductVariant.inventoryQuantity),
                  })
                : undefined,
              price: new Amount({
                amountInCents: Math.floor(storeB2BProductVariant.price * 100),
              }),
              compareAtPrice: new Amount({
                amountInCents: Math.floor(
                  (storeB2BProductVariant.compareAtPrice ??
                    storeB2BProductVariant.price) * 100,
                ),
              }),
              condition: exposedProductVariant.condition ?? Condition.GOOD,
            };
          } catch (error: any) {
            this.logger.error(
              `Could not map B2B variant with id ${id} to index: ${error.message}`,
              error,
            );

            return undefined;
          }
        },
      )
      .flatMap((vendorId) => (vendorId ? [vendorId] : []));
  }
}
