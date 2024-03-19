import { ShopifyID } from '@libs/domain/value-objects';
import { Injectable, Logger } from '@nestjs/common';
import { CollectionToIndex } from './ports/collection-to-index.type';
import { ISearchClient } from './ports/search-client';

@Injectable()
export class CollectionIndexationService {
  private readonly logger = new Logger(CollectionIndexationService.name);

  constructor(private searchClient: ISearchClient) {}

  async indexCollection(collectionToIndex: CollectionToIndex): Promise<void> {
    await this.searchClient.indexCollectionDocument(collectionToIndex);
  }

  async deleteCollection({ id }: ShopifyID): Promise<void> {
    this.logger.warn(`Collection ${id} has been deleted from index`);
    await this.searchClient.deleteCollectionDocument(id.toString());
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
