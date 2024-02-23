import { CollectionDocument, SearchVariantDocument } from '@libs/domain/types';
import {
  typesenseCollectionClient,
  typesenseVariantClient,
} from '@libs/infrastructure/typesense/typesense.base.client';
import { ISearchClient } from '@modules/product/domain/ports/search-client';
import { Logger } from '@nestjs/common';
import { TypesenseError } from 'typesense/lib/Typesense/Errors';
import { jsonParse, jsonStringify } from '@libs/helpers/json';

const isTypesenseNotFoundError = (error: any) =>
  error instanceof TypesenseError && error.name === 'ObjectNotFound';

export class SearchClient implements ISearchClient {
  private readonly logger = new Logger(SearchClient.name);

  async indexVariantDocument(document: SearchVariantDocument): Promise<void> {
    const variantDocument = {
      id: document.variant_shopify_id.toString(),
      ...document,
    };

    try {
      await typesenseVariantClient.documents().upsert(variantDocument);
    } catch (e: any) {
      this.logger.error(
        `Error while indexing variant: ${jsonStringify(variantDocument)}`,
        e,
      );
    }
  }

  async deleteVariantDocument(documentId: string): Promise<void> {
    try {
      await typesenseVariantClient.documents().delete(documentId);
    } catch (e: any) {
      if (isTypesenseNotFoundError(e)) {
        this.logger.debug(`Variant ${documentId} is already not part of index`);
        return;
      }
      this.logger.error(`Error while deleting variant ${documentId}`, e);
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

  async listVariantDocumentIds(): Promise<string[]> {
    const documentsJsonL = await typesenseVariantClient.documents().export({
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
