import { Injectable, Logger } from '@nestjs/common';
import { IndexationStrategy } from './ports/indexation.strategy';
import { ISearchClient } from './ports/search-client';
import { B2BVariantToIndex } from './ports/variant-to-index.type';

@Injectable()
export class B2BIndexationService implements IndexationStrategy {
  private readonly logger = new Logger(B2BIndexationService.name);

  constructor(private searchClient: ISearchClient) {}

  async indexVariant({ variant, product }: B2BVariantToIndex): Promise<void> {
    try {
      if (!product.isActive) {
        this.logger.debug(
          `B2B Product ${product.id.uuid} is not active, deleting variant ${variant.shopifyId.id} from index`,
        );
        await this.searchClient.deleteB2BVariantDocument(
          variant.shopifyId.id.toString(),
        );
        return;
      }
      await this.searchClient.indexB2BVariantDocument({
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
      });
    } catch (error: any) {
      this.logger.error(error.message, error);
    }
  }

  async pruneVariants(
    existingVariantIds: string[],
    shouldDeleteDocuments?: boolean,
  ): Promise<void> {
    this.logger.warn(`Found ${existingVariantIds.length} stored B2B variants`);
    const variantDocumentsIds =
      await this.searchClient.listB2BVariantDocumentIds();
    this.logger.warn(
      `Found ${variantDocumentsIds.length} indexed B2B variants`,
    );
    const variantIdsToDelete = variantDocumentsIds.filter(
      (variantId) => !existingVariantIds.includes(variantId),
    );
    this.logger.warn(
      `Found ${variantIdsToDelete.length} B2B variants to delete`,
    );
    if (!shouldDeleteDocuments) {
      this.logger.warn(`No documents were deleted, use --apply to delete them`);
      return;
    }
    await Promise.allSettled(
      variantIdsToDelete.map((variantId) =>
        this.searchClient.deleteB2BVariantDocument(variantId),
      ),
    );
  }
}
