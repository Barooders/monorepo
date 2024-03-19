import { ShopifyID } from '@libs/domain/value-objects';
import { Injectable, Logger } from '@nestjs/common';
import { CollectionToIndex } from './ports/collection-to-index.type';
import { IndexationStrategy } from './ports/indexation.strategy';
import { ISearchClient } from './ports/search-client';

@Injectable()
export class PublicIndexationService implements IndexationStrategy {
  private readonly logger = new Logger(PublicIndexationService.name);

  constructor(private searchClient: ISearchClient) {}

  async indexCollection(collectionToIndex: CollectionToIndex): Promise<void> {
    await this.searchClient.indexCollectionDocument(collectionToIndex);
  }

  async deleteCollection({ id }: ShopifyID): Promise<void> {
    this.logger.warn(`Collection ${id} has been deleted from index`);
    await this.searchClient.deleteCollectionDocument(id.toString());
  }

  async pruneVariants(
    existingVariantIds: string[],
    shouldDeleteDocuments?: boolean,
  ): Promise<void> {
    this.logger.warn(
      `Found ${existingVariantIds.length} stored public variants`,
    );
    const variantDocumentsIds =
      await this.searchClient.listPublicVariantDocumentIds();

    this.logger.warn(
      `Found ${variantDocumentsIds.length} indexed public variants`,
    );

    const variantIdsToDelete = variantDocumentsIds.filter(
      (variantId) => !existingVariantIds.includes(variantId),
    );

    this.logger.warn(
      `Found ${variantIdsToDelete.length} public variants to delete`,
    );

    if (!shouldDeleteDocuments) {
      this.logger.warn(`No documents were deleted, use --apply to delete them`);
      return;
    }

    await Promise.allSettled(
      variantIdsToDelete.map((variantId) =>
        this.searchClient.deletePublicVariantDocument(variantId),
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
}
