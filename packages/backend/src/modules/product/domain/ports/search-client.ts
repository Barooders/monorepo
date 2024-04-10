import { CollectionToIndex } from './collection-to-index.type';
import { ProductModelToIndex } from './product-model-to-index.type';
import {
  B2BVariantToIndex,
  PublicVariantToIndex,
} from './variant-to-index.type';

export enum DocumentType {
  PUBLIC_VARIANT = 'public_variant',
  B2B_VARIANT = 'b2b_variant',
  COLLECTION = 'collection',
  PRODUCT_MODEL = 'product_model',
}

export type DocumentToIndex =
  | {
      documentType: typeof DocumentType.PUBLIC_VARIANT;
      data: PublicVariantToIndex;
    }
  | {
      documentType: typeof DocumentType.B2B_VARIANT;
      data: B2BVariantToIndex;
    }
  | {
      documentType: typeof DocumentType.COLLECTION;
      data: CollectionToIndex;
    }
  | {
      documentType: typeof DocumentType.PRODUCT_MODEL;
      data: ProductModelToIndex;
    };

export type ExistingEntity = {
  documentType: DocumentType;
  id: string;
};

export abstract class ISearchClient {
  abstract indexDocument(documentToIndex: DocumentToIndex): Promise<void>;
  abstract deleteDocument(
    id: string,
    documentType: DocumentType,
  ): Promise<void>;
  abstract pruneVariantDocuments(
    existingVariants: ExistingEntity[],
    shouldDeleteDocuments: boolean,
  ): Promise<void>;

  abstract pruneCollectionDocuments(
    existingCollections: ExistingEntity[],
    shouldDeleteDocuments: boolean,
  ): Promise<void>;
}
