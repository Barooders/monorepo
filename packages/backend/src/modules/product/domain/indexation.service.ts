import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { Injectable, Logger } from '@nestjs/common';
import { VariantToIndex } from './ports/variant-to-index.type';
import { PublicIndexationService } from './public-indexation.service';

@Injectable()
export class IndexationService {
  private readonly logger = new Logger(IndexationService.name);

  constructor(
    private publicIndexationService: PublicIndexationService,
    private storePrisma: PrismaStoreClient,
  ) {}

  async indexVariants(variantsToIndex: VariantToIndex[]): Promise<void> {
    const indexationPromises = variantsToIndex.map((variantToIndex) =>
      this.publicIndexationService.indexVariant(variantToIndex),
    );
    await Promise.allSettled(indexationPromises);
  }

  async pruneVariants(shouldDeleteDocuments?: boolean): Promise<void> {
    const existingVariantIds =
      await this.storePrisma.storeBaseProductVariant.findMany({
        select: {
          shopifyId: true,
        },
      });

    await this.publicIndexationService.pruneVariants(
      existingVariantIds.map(({ shopifyId }) => String(shopifyId)),
      shouldDeleteDocuments,
    );
  }
}
