import {
  CollectionDocument,
  SearchB2BVariantDocument,
  SearchPublicVariantDocument,
} from '@libs/domain/types';
import { jsonParse, jsonStringify } from '@libs/helpers/json';
import {
  typesenseB2BVariantClient,
  typesenseCollectionClient,
  typesensePublicVariantClient,
} from '@libs/infrastructure/typesense/typesense.base.client';
import { ISearchClient } from '@modules/product/domain/ports/search-client';
import { Logger } from '@nestjs/common';
import { TypesenseError } from 'typesense/lib/Typesense/Errors';

const isTypesenseNotFoundError = (error: any) =>
  error instanceof TypesenseError && error.name === 'ObjectNotFound';

export class SearchClient implements ISearchClient {
  private readonly logger = new Logger(SearchClient.name);

  async indexPublicVariantDocument(
    document: SearchPublicVariantDocument,
  ): Promise<void> {
    const variantDocument = {
      id: document.variant_shopify_id.toString(),
      ...document,
    };

    try {
      await typesensePublicVariantClient.documents().upsert(variantDocument);
    } catch (e: any) {
      this.logger.error(
        `Error while indexing public variant: ${jsonStringify(variantDocument)}`,
        e,
      );
    }
  }

  async indexB2BVariantDocument(
    document: SearchB2BVariantDocument,
  ): Promise<void> {
    const variantDocument = {
      id: document.variant_shopify_id.toString(),
      ...document,
    };

    try {
      await typesenseB2BVariantClient.documents().upsert(variantDocument);
    } catch (e: any) {
      this.logger.error(
        `Error while indexing b2b variant: ${jsonStringify(variantDocument)}`,
        e,
      );
    }
  }

  async deletePublicVariantDocument(documentId: string): Promise<void> {
    try {
      await typesensePublicVariantClient.documents().delete(documentId);
    } catch (e: any) {
      if (isTypesenseNotFoundError(e)) {
        this.logger.debug(
          `Public Variant ${documentId} is already not part of index`,
        );
        return;
      }
      this.logger.error(`Error while deleting public variant ${documentId}`, e);
    }
  }

  async deleteB2BVariantDocument(documentId: string): Promise<void> {
    try {
      await typesenseB2BVariantClient.documents().delete(documentId);
    } catch (e: any) {
      if (isTypesenseNotFoundError(e)) {
        this.logger.debug(
          `B2B Variant ${documentId} is already not part of index`,
        );
        return;
      }
      this.logger.error(`Error while deleting b2b variant ${documentId}`, e);
    }
  }

  async indexCollectionDocument(document: CollectionDocument): Promise<void> {
    const collectionDocument = {
      id: document.collectionId,
      ...document,
    };

    try {
      await typesenseCollectionClient.documents().upsert(collectionDocument);
    } catch (e: any) {
      this.logger.error(
        `Error while indexing collection: ${jsonStringify(collectionDocument)}`,
        e,
      );
    }
  }

  async deleteCollectionDocument(documentId: string): Promise<void> {
    try {
      await typesenseCollectionClient.documents().delete(documentId);
    } catch (e: any) {
      if (isTypesenseNotFoundError(e)) {
        this.logger.debug(
          `Collection ${documentId} is already not part of index`,
        );
        return;
      }
      this.logger.error(`Error while deleting collection ${documentId}`, e);
    }
  }

  async listPublicVariantDocumentIds(): Promise<string[]> {
    const documentsJsonL = await typesensePublicVariantClient
      .documents()
      .export({
        include_fields: 'id',
      });
    const parsedDocumentIds = jsonParse(
      `[${documentsJsonL.replace(/\n/g, ',')}]`,
    ) as { id: string }[];

    return parsedDocumentIds.map(({ id }) => id);
  }

  async listB2BVariantDocumentIds(): Promise<string[]> {
    const documentsJsonL = await typesenseB2BVariantClient.documents().export({
      include_fields: 'id',
    });
    const parsedDocumentIds = jsonParse(
      `[${documentsJsonL.replace(/\n/g, ',')}]`,
    ) as { id: string }[];

    return parsedDocumentIds.map(({ id }) => id);
  }

  async listCollectionDocumentIds(): Promise<string[]> {
    const documentsJsonL = await typesenseCollectionClient.documents().export({
      include_fields: 'id',
    });
    const parsedDocumentIds = jsonParse(
      `[${documentsJsonL.replace(/\n/g, ',')}]`,
    ) as { id: string }[];

    return parsedDocumentIds.map(({ id }) => id);
  }
}
