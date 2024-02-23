import { CollectionDocument, SearchVariantDocument } from '@libs/domain/types';

export abstract class ISearchClient {
  abstract indexVariantDocument(document: SearchVariantDocument): Promise<void>;
  abstract deleteVariantDocument(documentId: string): Promise<void>;
  abstract listVariantDocumentIds(): Promise<string[]>;
  abstract listCollectionDocumentIds(): Promise<string[]>;

  abstract indexCollectionDocument(document: CollectionDocument): Promise<void>;
  abstract deleteCollectionDocument(documentId: string): Promise<void>;
}
