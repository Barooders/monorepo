import {
  addFormattedBikeSizeToTags,
  getDiscountRange,
} from '@libs/domain/types';
import { jsonParse, jsonStringify } from '@libs/helpers/json';
import {
  TypesenseB2BVariantDocument,
  TypesenseCollectionDocument,
  TypesensePublicVariantDocument,
  typesenseB2BVariantClient,
  typesenseCollectionClient,
  typesensePublicVariantClient,
} from '@libs/infrastructure/typesense/typesense.base.client';
import { CollectionToIndex } from '@modules/product/domain/ports/collection-to-index.type';
import {
  DocumentToIndex,
  DocumentType,
  ExistingEntity,
  ISearchClient,
} from '@modules/product/domain/ports/search-client';
import {
  B2BVariantToIndex,
  PublicVariantToIndex,
} from '@modules/product/domain/ports/variant-to-index.type';
import { Logger } from '@nestjs/common';
import { TypesenseError } from 'typesense/lib/Typesense/Errors';

const isTypesenseNotFoundError = (error: any) =>
  error instanceof TypesenseError && error.name === 'ObjectNotFound';

const DOCUMENT_CONFIG = {
  [DocumentType.PUBLIC_VARIANT]: {
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
  [DocumentType.B2B_VARIANT]: {
    client: typesenseB2BVariantClient,
    map: ({
      variant,
      product,
    }: B2BVariantToIndex): TypesenseB2BVariantDocument => ({
      id: variant.shopifyId.id.toString(),
      variant_shopify_id: variant.shopifyId.id,
      vendor_id: product.vendorId.uuid,
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
  [DocumentType.COLLECTION]: {
    client: typesenseCollectionClient,
    map: ({
      id,
      title,
      handle,
      productCount,
      updatedAt,
      imageSrc,
    }: CollectionToIndex): TypesenseCollectionDocument => ({
      id: id.id.toString(),
      collectionId: id.id.toString(),
      title: title,
      handle: handle,
      product_count: productCount.stock,
      updatedat_timestamp: updatedAt.timestamp,
      image: imageSrc?.url,
    }),
  },
};

export class SearchClient implements ISearchClient {
  private readonly logger = new Logger(SearchClient.name);

  async indexDocument({ documentType, data }: DocumentToIndex): Promise<void> {
    try {
      switch (documentType) {
        case DocumentType.PUBLIC_VARIANT:
          const publicConfig = DOCUMENT_CONFIG[documentType];
          await publicConfig.client.documents().upsert(publicConfig.map(data));
          break;
        case DocumentType.B2B_VARIANT:
          const b2bConfig = DOCUMENT_CONFIG[documentType];
          await b2bConfig.client.documents().upsert(b2bConfig.map(data));
          break;
        case DocumentType.COLLECTION:
          const collectionConfig = DOCUMENT_CONFIG[documentType];
          await collectionConfig.client
            .documents()
            .upsert(collectionConfig.map(data));
          break;
        default:
          throw new Error(
            `Unknown document type: ${jsonStringify({ documentType, data })}`,
          );
      }
    } catch (e: any) {
      this.logger.error(
        `Error while indexing: ${jsonStringify({ documentType, data })}`,
        e,
      );
    }
  }

  async deleteDocument(
    documentId: string,
    documentType: DocumentType,
  ): Promise<void> {
    try {
      await DOCUMENT_CONFIG[documentType].client.documents().delete(documentId);
    } catch (e: any) {
      if (isTypesenseNotFoundError(e)) {
        this.logger.debug(
          `Document ${documentId} is already not part of index`,
        );
        return;
      }
      this.logger.error(`Error while deleting document ${documentId}`, e);
    }
  }

  async pruneVariantDocuments(
    existingEntities: ExistingEntity[],
    shouldDeleteDocuments: boolean,
  ): Promise<void> {
    await this.pruneDocumentsByType(
      existingEntities,
      DocumentType.PUBLIC_VARIANT,
      shouldDeleteDocuments,
    );

    await this.pruneDocumentsByType(
      existingEntities,
      DocumentType.B2B_VARIANT,
      shouldDeleteDocuments,
    );
  }

  async pruneCollectionDocuments(
    existingEntities: ExistingEntity[],
    shouldDeleteDocuments: boolean,
  ): Promise<void> {
    await this.pruneDocumentsByType(
      existingEntities,
      DocumentType.COLLECTION,
      shouldDeleteDocuments,
    );
  }

  private async pruneDocumentsByType(
    existingEntities: ExistingEntity[],
    documentType: DocumentType,
    shouldDeleteDocuments: boolean,
  ): Promise<void> {
    const filteredExistingEntities = existingEntities
      .filter(
        ({ documentType: existingItemType }) =>
          existingItemType === documentType,
      )
      .map(({ id }) => id);

    this.logger.warn(
      `Found ${filteredExistingEntities.length} existing ${documentType} entities`,
    );

    const indexedDocumentIds = await this.listVariantDocumentIds(documentType);

    this.logger.warn(
      `Found ${indexedDocumentIds.length} indexed ${documentType} documents`,
    );
    const documentsToPrune = indexedDocumentIds.filter(
      (documentId) => !filteredExistingEntities.includes(documentId),
    );

    this.logger.warn(
      `Found ${documentsToPrune.length} ${documentType} documents to delete`,
    );

    if (!shouldDeleteDocuments) {
      this.logger.warn(`No documents were deleted, use --apply to delete them`);
      return;
    }
    await Promise.allSettled(
      documentsToPrune.map((documentId) =>
        this.deleteDocument(documentId, documentType),
      ),
    );
  }

  private async listVariantDocumentIds(
    documentType: DocumentType,
  ): Promise<string[]> {
    const documentsJsonL = await DOCUMENT_CONFIG[documentType].client
      .documents()
      .export({
        include_fields: 'id',
      });
    const parsedDocumentIds = jsonParse(
      `[${documentsJsonL.replace(/\n/g, ',')}]`,
    ) as { id: string }[];

    return parsedDocumentIds.map(({ id }) => id);
  }
}
