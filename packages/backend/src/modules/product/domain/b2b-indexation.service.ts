import { Injectable, Logger } from '@nestjs/common';
import { IndexationStrategy } from './ports/indexation.strategy';
import { ISearchClient } from './ports/search-client';

@Injectable()
export class B2BIndexationService implements IndexationStrategy {
  private readonly logger = new Logger(B2BIndexationService.name);

  constructor(private searchClient: ISearchClient) {}

  async pruneVariants(
    existingVariantIds: string[],
    shouldDeleteDocuments?: boolean,
  ): Promise<void> {
    this.logger.warn(`Found ${existingVariantIds.length} stored B2B variants`);
    const variantDocumentsIds =
      await this.searchClient.listB2BVariantDocumentIds();
    this.logger.warn(
      `Found ${variantDocumentsIds.length} indexed B2B variants`,
    );
    const variantIdsToDelete = variantDocumentsIds.filter(
      (variantId) => !existingVariantIds.includes(variantId),
    );
    this.logger.warn(
      `Found ${variantIdsToDelete.length} B2B variants to delete`,
    );
    if (!shouldDeleteDocuments) {
      this.logger.warn(`No documents were deleted, use --apply to delete them`);
      return;
    }
    await Promise.allSettled(
      variantIdsToDelete.map((variantId) =>
        this.searchClient.deleteB2BVariantDocument(variantId),
      ),
    );
  }
}
