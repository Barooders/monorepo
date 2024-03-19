import { CollectionToIndex } from './collection-to-index.type';
import {
  B2BVariantToIndex,
  PublicVariantToIndex,
} from './variant-to-index.type';

export abstract class ISearchClient {
  abstract indexPublicVariantDocument(
    variant: PublicVariantToIndex,
  ): Promise<void>;
  abstract deletePublicVariantDocument(documentId: string): Promise<void>;
  abstract listPublicVariantDocumentIds(): Promise<string[]>;
  abstract indexB2BVariantDocument(variant: B2BVariantToIndex): Promise<void>;
  abstract deleteB2BVariantDocument(documentId: string): Promise<void>;
  abstract listB2BVariantDocumentIds(): Promise<string[]>;
  abstract listCollectionDocumentIds(): Promise<string[]>;
  abstract indexCollectionDocument(
    collection: CollectionToIndex,
  ): Promise<void>;
  abstract deleteCollectionDocument(documentId: string): Promise<void>;
}
