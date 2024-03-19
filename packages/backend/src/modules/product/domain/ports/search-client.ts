import { CollectionToIndex } from './collection-to-index.type';
import { VariantToIndexWithTarget } from './variant-to-index.type';

export abstract class ISearchClient {
  abstract indexVariantDocument(
    variantToIndex: VariantToIndexWithTarget,
  ): Promise<void>;
  abstract deleteVariantDocument(
    variantToIndex: VariantToIndexWithTarget,
  ): Promise<void>;

  abstract deleteB2BVariantDocument(documentId: string): Promise<void>;
  abstract deletePublicVariantDocument(documentId: string): Promise<void>;

  abstract listPublicVariantDocumentIds(): Promise<string[]>;
  abstract listB2BVariantDocumentIds(): Promise<string[]>;
  abstract listCollectionDocumentIds(): Promise<string[]>;
  abstract indexCollectionDocument(
    collection: CollectionToIndex,
  ): Promise<void>;
  abstract deleteCollectionDocument(documentId: string): Promise<void>;
}
