import { Injectable, Logger } from '@nestjs/common';
import { VariantToIndex } from './ports/variant-to-index.type';
import { PublicIndexationService } from './public-indexation.service';

@Injectable()
export class IndexationService {
  private readonly logger = new Logger(IndexationService.name);

  constructor(private publicIndexationService: PublicIndexationService) {}

  async indexVariants(variantsToIndex: VariantToIndex[]): Promise<void> {
    const indexationPromises = variantsToIndex.map((variantToIndex) =>
      this.publicIndexationService.indexVariant(variantToIndex),
    );
    await Promise.allSettled(indexationPromises);
  }

  async pruneVariants(
    existingVariantIds: string[],
    shouldDeleteDocuments?: boolean,
  ): Promise<void> {
    await this.publicIndexationService.pruneVariants(
      existingVariantIds,
      shouldDeleteDocuments,
    );
  }
}
