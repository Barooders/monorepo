import {
  CollectionDocument,
  SearchB2BVariantDocument,
  SearchPublicVariantDocument,
} from '@libs/domain/types';

export abstract class ISearchClient {
  abstract indexPublicVariantDocument(
    document: SearchPublicVariantDocument,
  ): Promise<void>;
  abstract deletePublicVariantDocument(documentId: string): Promise<void>;
  abstract listPublicVariantDocumentIds(): Promise<string[]>;
  abstract indexB2BVariantDocument(
    document: SearchB2BVariantDocument,
  ): Promise<void>;
  abstract deleteB2BVariantDocument(documentId: string): Promise<void>;
  abstract listB2BVariantDocumentIds(): Promise<string[]>;
  abstract listCollectionDocumentIds(): Promise<string[]>;

  abstract indexCollectionDocument(document: CollectionDocument): Promise<void>;
  abstract deleteCollectionDocument(documentId: string): Promise<void>;
}
