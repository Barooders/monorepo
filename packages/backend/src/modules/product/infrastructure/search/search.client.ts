import {
  addFormattedBikeSizeToTags,
  getDiscountRange,
} from '@libs/domain/types';
import { jsonParse, jsonStringify } from '@libs/helpers/json';
import {
  typesenseB2BVariantClient,
  typesenseCollectionClient,
  typesensePublicVariantClient,
} from '@libs/infrastructure/typesense/typesense.base.client';
import { CollectionToIndex } from '@modules/product/domain/ports/collection-to-index.type';
import { ISearchClient } from '@modules/product/domain/ports/search-client';
import {
  B2BVariantToIndex,
  PublicVariantToIndex,
} from '@modules/product/domain/ports/variant-to-index.type';
import { Logger } from '@nestjs/common';
import { TypesenseError } from 'typesense/lib/Typesense/Errors';

const isTypesenseNotFoundError = (error: any) =>
  error instanceof TypesenseError && error.name === 'ObjectNotFound';

export class SearchClient implements ISearchClient {
  private readonly logger = new Logger(SearchClient.name);

  async indexPublicVariantDocument({
    variant,
    product,
    vendor,
  }: PublicVariantToIndex): Promise<void> {
    const variantDocument = {
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
    };

    try {
      await typesensePublicVariantClient.documents().upsert(variantDocument);
    } catch (e: any) {
      this.logger.error(
        `Error while indexing public variant: ${jsonStringify(variantDocument)}`,
        e,
      );
    }
  }

  async indexB2BVariantDocument({
    variant,
    product,
  }: B2BVariantToIndex): Promise<void> {
    const variantDocument = {
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
    };

    try {
      await typesenseB2BVariantClient.documents().upsert(variantDocument);
    } catch (e: any) {
      this.logger.error(
        `Error while indexing b2b variant: ${jsonStringify(variantDocument)}`,
        e,
      );
    }
  }

  async deletePublicVariantDocument(documentId: string): Promise<void> {
    try {
      await typesensePublicVariantClient.documents().delete(documentId);
    } catch (e: any) {
      if (isTypesenseNotFoundError(e)) {
        this.logger.debug(
          `Public Variant ${documentId} is already not part of index`,
        );
        return;
      }
      this.logger.error(`Error while deleting public variant ${documentId}`, e);
    }
  }

  async deleteB2BVariantDocument(documentId: string): Promise<void> {
    try {
      await typesenseB2BVariantClient.documents().delete(documentId);
    } catch (e: any) {
      if (isTypesenseNotFoundError(e)) {
        this.logger.debug(
          `B2B Variant ${documentId} is already not part of index`,
        );
        return;
      }
      this.logger.error(`Error while deleting b2b variant ${documentId}`, e);
    }
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

  async listPublicVariantDocumentIds(): Promise<string[]> {
    const documentsJsonL = await typesensePublicVariantClient
      .documents()
      .export({
        include_fields: 'id',
      });
    const parsedDocumentIds = jsonParse(
      `[${documentsJsonL.replace(/\n/g, ',')}]`,
    ) as { id: string }[];

    return parsedDocumentIds.map(({ id }) => id);
  }

  async listB2BVariantDocumentIds(): Promise<string[]> {
    const documentsJsonL = await typesenseB2BVariantClient.documents().export({
      include_fields: 'id',
    });
    const parsedDocumentIds = jsonParse(
      `[${documentsJsonL.replace(/\n/g, ',')}]`,
    ) as { id: string }[];

    return parsedDocumentIds.map(({ id }) => id);
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
