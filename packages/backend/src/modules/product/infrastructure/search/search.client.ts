import { SalesChannelName } from '@libs/domain/prisma.main.client';
import {
  addFormattedBikeSizeToTags,
  getDiscountRange,
} from '@libs/domain/types';
import { jsonParse, jsonStringify } from '@libs/helpers/json';
import {
  TypesenseB2BVariantDocument,
  TypesensePublicVariantDocument,
  typesenseB2BVariantClient,
  typesenseCollectionClient,
  typesensePublicVariantClient,
} from '@libs/infrastructure/typesense/typesense.base.client';
import { CollectionToIndex } from '@modules/product/domain/ports/collection-to-index.type';
import { ISearchClient } from '@modules/product/domain/ports/search-client';
import {
  B2BVariantToIndex,
  ExistingVariant,
  PublicVariantToIndex,
  VariantToIndexWithTarget,
} from '@modules/product/domain/ports/variant-to-index.type';
import { Logger } from '@nestjs/common';
import { TypesenseError } from 'typesense/lib/Typesense/Errors';

const isTypesenseNotFoundError = (error: any) =>
  error instanceof TypesenseError && error.name === 'ObjectNotFound';

const VARIANT_MAPPING = {
  [SalesChannelName.PUBLIC]: {
    client: typesensePublicVariantClient,
    map: ({
      variant,
      product,
      vendor,
    }: PublicVariantToIndex): TypesensePublicVariantDocument => ({
      id: variant.shopifyId.id.toString(),
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
      array_tags: addFormattedBikeSizeToTags(
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
    }),
  },
  [SalesChannelName.B2B]: {
    client: typesenseB2BVariantClient,
    map: ({
      variant,
      product,
    }: B2BVariantToIndex): TypesenseB2BVariantDocument => ({
      id: variant.shopifyId.id.toString(),
      variant_shopify_id: variant.shopifyId.id,
      variant_internal_id: variant.id?.uuid,
      title: product.title,
      product_type: product.productType.productType,
      condition: variant.condition.toString(),
      handle: product.handle,
      inventory_quantity: variant.quantityAvailable?.stock ?? 0,
      array_tags: product.tags.tagsObjectWithArrays,
      price: variant.price.amount,
      product_internal_id: product.id.uuid,
      product_shopify_id: product.shopifyId.id,
      product_image: product.imageSrc?.url,
      publishedat_timestamp: product.publishedAt.timestamp,
      updatedat_timestamp: variant.updatedAt.timestamp,
      createdat_timestamp: variant.createdAt.timestamp,
    }),
  },
};

export class SearchClient implements ISearchClient {
  private readonly logger = new Logger(SearchClient.name);

  async indexVariantDocument({
    target,
    data,
  }: VariantToIndexWithTarget): Promise<void> {
    try {
      switch (target) {
        case SalesChannelName.PUBLIC:
          const publicMapping = VARIANT_MAPPING[target];
          await publicMapping.client
            .documents()
            .upsert(publicMapping.map(data));
          break;
        case SalesChannelName.B2B:
          const b2bMapping = VARIANT_MAPPING[target];
          await b2bMapping.client.documents().upsert(b2bMapping.map(data));
          break;
        default:
          throw new Error(`Unknown target: ${jsonStringify({ target, data })}`);
      }
    } catch (e: any) {
      this.logger.error(
        `Error while indexing variant: ${jsonStringify({ target, data })}`,
        e,
      );
    }
  }

  async deleteVariantDocument({
    target,
    data,
  }: VariantToIndexWithTarget): Promise<void> {
    await this.deleteVariantDocumentByTarget(
      data.variant.shopifyId.id.toString(),
      target,
    );
  }

  async pruneVariantDocuments(
    existingVariants: ExistingVariant[],
    shouldDeleteDocuments: boolean,
  ): Promise<void> {
    await this.pruneVariantDocumentsByTarget(
      existingVariants,
      SalesChannelName.PUBLIC,
      shouldDeleteDocuments,
    );

    await this.pruneVariantDocumentsByTarget(
      existingVariants,
      SalesChannelName.B2B,
      shouldDeleteDocuments,
    );
  }

  private async pruneVariantDocumentsByTarget(
    existingVariants: ExistingVariant[],
    target: SalesChannelName,
    shouldDeleteDocuments: boolean,
  ): Promise<void> {
    const filteredExistingVariants = existingVariants
      .filter(({ target: variantTarget }) => variantTarget === target)
      .map(({ shopifyId }) => shopifyId.id.toString());

    this.logger.warn(
      `Found ${filteredExistingVariants.length} stored variants`,
    );

    const variantDocumentsIds = await this.listVariantDocumentIds(target);

    this.logger.warn(`Found ${variantDocumentsIds.length} indexed variants`);
    const variantIdsToDelete = variantDocumentsIds.filter(
      (variantId) => !filteredExistingVariants.includes(variantId),
    );

    this.logger.warn(`Found ${variantIdsToDelete.length} variants to delete`);

    if (!shouldDeleteDocuments) {
      this.logger.warn(`No documents were deleted, use --apply to delete them`);
      return;
    }
    await Promise.allSettled(
      variantIdsToDelete.map((variantId) =>
        this.deleteVariantDocumentByTarget(variantId, target),
      ),
    );
  }

  private async deleteVariantDocumentByTarget(
    documentId: string,
    target: SalesChannelName,
  ): Promise<void> {
    try {
      await VARIANT_MAPPING[target].client.documents().delete(documentId);
    } catch (e: any) {
      if (isTypesenseNotFoundError(e)) {
        this.logger.debug(
          `Public Variant ${documentId} is already not part of index`,
        );
        return;
      }
      this.logger.error(`Error while deleting variant ${documentId}`, e);
    }
  }

  private async listVariantDocumentIds(
    target: SalesChannelName,
  ): Promise<string[]> {
    const documentsJsonL = await VARIANT_MAPPING[target].client
      .documents()
      .export({
        include_fields: 'id',
      });
    const parsedDocumentIds = jsonParse(
      `[${documentsJsonL.replace(/\n/g, ',')}]`,
    ) as { id: string }[];

    return parsedDocumentIds.map(({ id }) => id);
  }

  async indexCollectionDocument({
    id,
    title,
    handle,
    productCount,
    updatedAt,
    imageSrc,
  }: CollectionToIndex): Promise<void> {
    const collectionDocument = {
      id: id.id.toString(),
      collectionId: id.id.toString(),
      title: title,
      handle: handle,
      product_count: productCount.stock,
      updatedat_timestamp: updatedAt.timestamp,
      image: imageSrc?.url,
    };

    try {
      await typesenseCollectionClient.documents().upsert(collectionDocument);
    } catch (e: any) {
      this.logger.error(
        `Error while indexing collection: ${jsonStringify(collectionDocument)}`,
        e,
      );
    }
  }

  async deleteCollectionDocument(documentId: string): Promise<void> {
    try {
      await typesenseCollectionClient.documents().delete(documentId);
    } catch (e: any) {
      if (isTypesenseNotFoundError(e)) {
        this.logger.debug(
          `Collection ${documentId} is already not part of index`,
        );
        return;
      }
      this.logger.error(`Error while deleting collection ${documentId}`, e);
    }
  }

  async listCollectionDocumentIds(): Promise<string[]> {
    const documentsJsonL = await typesenseCollectionClient.documents().export({
      include_fields: 'id',
    });
    const parsedDocumentIds = jsonParse(
      `[${documentsJsonL.replace(/\n/g, ',')}]`,
    ) as { id: string }[];

    return parsedDocumentIds.map(({ id }) => id);
  }
}
