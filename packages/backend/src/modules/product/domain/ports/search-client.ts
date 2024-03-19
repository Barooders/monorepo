import { CollectionToIndex } from './collection-to-index.type';
import {
  ExistingVariant,
  VariantToIndexWithTarget,
} from './variant-to-index.type';

export abstract class ISearchClient {
  abstract indexVariantDocument(
    variantToIndex: VariantToIndexWithTarget,
  ): Promise<void>;
  abstract deleteVariantDocument(
    variantToIndex: VariantToIndexWithTarget,
  ): Promise<void>;
  abstract pruneVariantDocuments(
    existingVariants: ExistingVariant[],
    shouldDeleteDocuments: boolean,
  ): Promise<void>;

  abstract listCollectionDocumentIds(): Promise<string[]>;
  abstract indexCollectionDocument(
    collection: CollectionToIndex,
  ): Promise<void>;
  abstract deleteCollectionDocument(documentId: string): Promise<void>;
}
