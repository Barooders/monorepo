import {
  BIKES_COLLECTION_HANDLE,
  BIKE_SIZE_TAG_KEY,
  MOUNTAIN_BIKES_COLLECTION_HANDLES,
  getDiscountRange,
} from '@libs/domain/types';
import { ShopifyID, UUID } from '@libs/domain/value-objects';
import { Injectable, Logger } from '@nestjs/common';
import { CollectionToIndex } from './ports/collection-to-index.type';
import { IndexationStrategy } from './ports/indexation.strategy';
import { ISearchClient } from './ports/search-client';
import { VariantToIndex } from './ports/variant-to-index.type';

const mapBikeSize = (size: string) => {
  const matchOneOf = (values: string[]) =>
    values.some((v) => size.toLowerCase().replaceAll('/', '').includes(v));

  if (matchOneOf(['unique', 'universelle'])) return 'UNIQUE';
  if (matchOneOf(['enfant'])) return 'CHILD';

  if (
    matchOneOf([
      'xxl',
      '23 pouces',
      '24 pouces',
      '23',
      '24',
      '61',
      '62',
      '63',
      '64',
      '65',
    ])
  )
    return 'XXL';
  if (matchOneOf(['xl', '22 pouces', '22', '58', '59', '60'])) return 'XL';
  if (matchOneOf(['ml'])) return 'M/L';
  if (matchOneOf(['xxs', '42', '43', '44', '45'])) return 'XXS';
  if (
    matchOneOf(['xs', '16 pouces', '17 pouces', '16', '17', '46', '47', '48'])
  )
    return 'XS';

  if (matchOneOf(['l', '21 pouces', '21', '55', '56', '57'])) return 'L';
  if (matchOneOf(['m', '20 pouces', '20', '52', '53', '54'])) return 'M';
  if (matchOneOf(['s', '18 pouces', '18', '19 pouces', '19', '49', '50', '51']))
    return 'S';

  return null;
};

const mapMountainBikeSize = (size: string) => {
  const matchOneOf = (values: string[]) =>
    values.some((v) => size.toLowerCase().replaceAll('/', '').includes(v));

  if (matchOneOf(['unique', 'universelle'])) return 'UNIQUE';
  if (matchOneOf(['enfant'])) return 'CHILD';

  if (
    matchOneOf([
      'xxl',
      '23 pouces',
      '24 pouces',
      '23',
      '24',
      '57',
      '58',
      '59',
      '60',
      '61',
      '62',
      '63',
      '64',
    ])
  )
    return 'XXL';
  if (
    matchOneOf([
      'xl',
      '21 pouces',
      '22 pouces',
      '21',
      '22',
      '52',
      '53',
      '54',
      '55',
      '56',
    ])
  )
    return 'XL';
  if (matchOneOf(['ml', '18 pouces', '18', '46', '47'])) return 'M/L';
  if (matchOneOf(['xxs'])) return 'XXS';
  if (
    matchOneOf([
      'xs',
      '13 pouces',
      '14 pouces',
      '13',
      '14',
      '33',
      '34',
      '35',
      '36',
    ])
  )
    return 'XS';

  if (
    matchOneOf([
      'l',
      '19 pouces',
      '20 pouces',
      '19',
      '20',
      '48',
      '49',
      '50',
      '51',
    ])
  )
    return 'L';
  if (matchOneOf(['m', '17 pouces', '17', '43', '44', '45'])) return 'M';
  if (
    matchOneOf([
      's',
      '15 pouces',
      '16 pources',
      '15',
      '16',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
    ])
  )
    return 'S';

  return null;
};

@Injectable()
export class IndexationService implements IndexationStrategy {
  private readonly logger = new Logger(IndexationService.name);

  constructor(private searchClient: ISearchClient) {}

  async indexVariants(variantsToIndex: VariantToIndex[]): Promise<void> {
    const indexationPromises = variantsToIndex.map((variantToIndex) =>
      this.indexVariant(variantToIndex),
    );
    await Promise.allSettled(indexationPromises);
  }

  async indexVariant({
    variant,
    product,
    vendor,
  }: VariantToIndex): Promise<void> {
    try {
      if (!product.isActive) {
        this.logger.debug(
          `Product ${product.id.uuid} is not active, deleting variant ${variant.shopifyId.id} from index`,
        );
        await this.searchClient.deleteVariantDocument(
          variant.shopifyId.id.toString(),
        );
        return;
      }
      await this.searchClient.indexVariantDocument({
        variant_shopify_id: variant.shopifyId.id,
        variant_internal_id: variant.id?.uuid,
        title: product.title,
        vendor: vendor.name,
        vendor_informations: {
          reviews: {
            count: vendor.reviews.count,
            average_rating: vendor.reviews?.averageRating,
          },
        },
        meta: {
          barooders: {
            owner: vendor.isPro ? 'b2c' : 'c2c',
            product_discount_range: getDiscountRange(
              product.highestDiscount.percentageOn100,
            ),
          },
        },
        product_type: product.productType.productType,
        variant_title: variant.title,
        computed_scoring: product.calculatedScoring,
        is_refurbished: variant.isRefurbished ? 'true' : 'false',
        condition: variant.condition.toString(),
        handle: product.handle,
        inventory_quantity: variant.quantityAvailable?.stock ?? 0,
        array_tags: this.addFormattedBikeSizeToTags(
          product.tags.tagsObjectWithArrays,
          product.collections,
        ),
        price: variant.price.amount,
        discount:
          variant.compareAtPrice.amount === 0
            ? 0
            : (variant.compareAtPrice.amount - variant.price.amount) /
              variant.compareAtPrice.amount,
        product_internal_id: product.id.uuid,
        product_shopify_id: product.shopifyId.id,
        product_image: product.imageSrc?.url,
        compare_at_price: variant.compareAtPrice.amount,
        collection_internal_ids: product.collections.map(
          (collection) => collection.id.uuid,
        ),
        collection_handles: product.collections.map(({ handle }) => handle),
        publishedat_timestamp: product.publishedAt.timestamp,
        updatedat_timestamp: variant.updatedAt.timestamp,
        createdat_timestamp: variant.createdAt.timestamp,
      });
    } catch (error: any) {
      this.logger.error(error.message, error);
    }
  }

  async indexCollection({
    id,
    title,
    handle,
    productCount,
    updatedAt,
    imageSrc,
  }: CollectionToIndex): Promise<void> {
    await this.searchClient.indexCollectionDocument({
      collectionId: id.id.toString(),
      title: title,
      handle: handle,
      product_count: productCount.stock,
      updatedat_timestamp: updatedAt.timestamp,
      image: imageSrc?.url,
    });
  }

  async deleteCollection({ id }: ShopifyID): Promise<void> {
    this.logger.warn(`Collection ${id} has been deleted from index`);
    await this.searchClient.deleteCollectionDocument(id.toString());
  }

  async pruneVariants(
    existingVariantIds: string[],
    shouldDeleteDocuments?: boolean,
  ): Promise<void> {
    this.logger.warn(`Found ${existingVariantIds.length} stored variants`);
    const variantDocumentsIds =
      await this.searchClient.listVariantDocumentIds();

    this.logger.warn(`Found ${variantDocumentsIds.length} indexed variants`);

    const variantIdsToDelete = variantDocumentsIds.filter(
      (variantId) => !existingVariantIds.includes(variantId),
    );

    this.logger.warn(`Found ${variantIdsToDelete.length} variants to delete`);

    if (!shouldDeleteDocuments) {
      this.logger.warn(`No documents were deleted, use --apply to delete them`);
      return;
    }

    await Promise.allSettled(
      variantIdsToDelete.map((variantId) =>
        this.searchClient.deleteVariantDocument(variantId),
      ),
    );
  }

  async pruneCollections(
    existingCollectionIds: string[],
    shouldDeleteDocuments?: boolean,
  ): Promise<void> {
    this.logger.warn(
      `Found ${existingCollectionIds.length} stored collections`,
    );
    const collectionDocumentsIds =
      await this.searchClient.listCollectionDocumentIds();

    this.logger.warn(
      `Found ${collectionDocumentsIds.length} indexed collections`,
    );

    const collectionIdsToDelete = collectionDocumentsIds.filter(
      (collectionId) => !existingCollectionIds.includes(collectionId),
    );

    this.logger.warn(
      `Found ${collectionIdsToDelete.length} collections to delete`,
    );

    if (!shouldDeleteDocuments) {
      this.logger.warn(`No documents were deleted, use --apply to delete them`);
      return;
    }

    await Promise.allSettled(
      collectionIdsToDelete.map((collectionId) =>
        this.searchClient.deleteCollectionDocument(collectionId),
      ),
    );
  }

  private addFormattedBikeSizeToTags(
    tags: Record<string, string[]>,
    collections: {
      id: UUID;
      handle: string;
    }[],
  ): Record<string, string[]> {
    const isBike = collections.some(
      ({ handle }) => handle === BIKES_COLLECTION_HANDLE,
    );
    const isMountainBike = collections.some(({ handle }) =>
      MOUNTAIN_BIKES_COLLECTION_HANDLES.includes(handle),
    );
    const existingSizeTags = tags[BIKE_SIZE_TAG_KEY] ?? [];

    if (existingSizeTags.length === 0 || !isBike) return tags;

    return {
      ...tags,
      'formatted-bike-size': existingSizeTags
        .map(isMountainBike ? mapMountainBikeSize : mapBikeSize)
        .flatMap((size) => (size ? [size] : [])),
    };
  }
}
