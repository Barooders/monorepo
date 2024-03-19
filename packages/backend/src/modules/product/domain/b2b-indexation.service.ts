import { Injectable, Logger } from '@nestjs/common';
import { IndexationStrategy } from './ports/indexation.strategy';
import { ISearchClient } from './ports/search-client';
import { B2BVariantToIndex } from './ports/variant-to-index.type';

@Injectable()
export class B2BIndexationService implements IndexationStrategy {
  private readonly logger = new Logger(B2BIndexationService.name);

  constructor(private searchClient: ISearchClient) {}

  async indexVariant(_variant: B2BVariantToIndex): Promise<void> {
    // try {
    //   if (!product.isActive) {
    //     this.logger.debug(
    //       `Product ${product.id.uuid} is not active, deleting variant ${variant.shopifyId.id} from index`,
    //     );
    //     await this.searchClient.deletePublicVariantDocument(
    //       variant.shopifyId.id.toString(),
    //     );
    //     return;
    //   }
    //   await this.searchClient.indexPublicVariantDocument({
    //     variant_shopify_id: variant.shopifyId.id,
    //     variant_internal_id: variant.id?.uuid,
    //     title: product.title,
    //     vendor: vendor.name,
    //     vendor_informations: {
    //       reviews: {
    //         count: vendor.reviews.count,
    //         average_rating: vendor.reviews?.averageRating,
    //       },
    //     },
    //     meta: {
    //       barooders: {
    //         owner: vendor.isPro ? 'b2c' : 'c2c',
    //         product_discount_range: getDiscountRange(
    //           product.highestDiscount.percentageOn100,
    //         ),
    //       },
    //     },
    //     product_type: product.productType.productType,
    //     variant_title: variant.title,
    //     computed_scoring: product.calculatedScoring,
    //     is_refurbished: variant.isRefurbished ? 'true' : 'false',
    //     condition: variant.condition.toString(),
    //     handle: product.handle,
    //     inventory_quantity: variant.quantityAvailable?.stock ?? 0,
    //     array_tags: this.addFormattedBikeSizeToTags(
    //       product.tags.tagsObjectWithArrays,
    //       product.collections,
    //     ),
    //     price: variant.price.amount,
    //     discount:
    //       variant.compareAtPrice.amount === 0
    //         ? 0
    //         : (variant.compareAtPrice.amount - variant.price.amount) /
    //           variant.compareAtPrice.amount,
    //     product_internal_id: product.id.uuid,
    //     product_shopify_id: product.shopifyId.id,
    //     product_image: product.imageSrc?.url,
    //     compare_at_price: variant.compareAtPrice.amount,
    //     collection_internal_ids: product.collections.map(
    //       (collection) => collection.id.uuid,
    //     ),
    //     collection_handles: product.collections.map(({ handle }) => handle),
    //     publishedat_timestamp: product.publishedAt.timestamp,
    //     updatedat_timestamp: variant.updatedAt.timestamp,
    //     createdat_timestamp: variant.createdAt.timestamp,
    //   });
    // } catch (error: any) {
    //   this.logger.error(error.message, error);
    // }
  }

  async pruneVariants(
    _existingVariantIds: string[],
    _shouldDeleteDocuments?: boolean,
  ): Promise<void> {
    // this.logger.warn(`Found ${existingVariantIds.length} stored variants`);
    // const variantDocumentsIds =
    //   await this.searchClient.listPublicVariantDocumentIds();
    // this.logger.warn(`Found ${variantDocumentsIds.length} indexed variants`);
    // const variantIdsToDelete = variantDocumentsIds.filter(
    //   (variantId) => !existingVariantIds.includes(variantId),
    // );
    // this.logger.warn(`Found ${variantIdsToDelete.length} variants to delete`);
    // if (!shouldDeleteDocuments) {
    //   this.logger.warn(`No documents were deleted, use --apply to delete them`);
    //   return;
    // }
    // await Promise.allSettled(
    //   variantIdsToDelete.map((variantId) =>
    //     this.searchClient.deletePublicVariantDocument(variantId),
    //   ),
    // );
  }
}
