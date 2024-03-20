import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { Injectable } from '@nestjs/common';
import { CollectionToIndex } from './ports/collection-to-index.type';
import { DocumentType, ISearchClient } from './ports/search-client';

@Injectable()
export class CollectionIndexationService {
  constructor(
    private searchClient: ISearchClient,
    private storePrisma: PrismaStoreClient,
  ) {}

  async indexCollection(collectionToIndex: CollectionToIndex): Promise<void> {
    await this.searchClient.indexDocument({
      documentType: DocumentType.COLLECTION,
      data: collectionToIndex,
    });
  }

  async pruneCollections(shouldDeleteDocuments: boolean): Promise<void> {
    const existingCollections = await this.storePrisma.storeCollection.findMany(
      {
        select: {
          shopifyId: true,
        },
      },
    );

    await this.searchClient.pruneCollectionDocuments(
      existingCollections.map(({ shopifyId }) => ({
        documentType: DocumentType.COLLECTION,
        id: shopifyId.toString(),
      })),
      shouldDeleteDocuments,
    );
  }
}
