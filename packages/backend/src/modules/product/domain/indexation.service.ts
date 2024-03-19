import { SalesChannelName } from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable, Logger } from '@nestjs/common';
import { VariantToIndex } from './ports/variant-to-index.type';
import { PublicIndexationService } from './public-indexation.service';

export type VariantToIndexWithTarget =
  | {
      target: typeof SalesChannelName.PUBLIC;
      data: VariantToIndex;
    }
  | {
      target: typeof SalesChannelName.B2B;
      data: { id: string };
    };

@Injectable()
export class IndexationService {
  private readonly logger = new Logger(IndexationService.name);

  constructor(
    private publicIndexationService: PublicIndexationService,
    private storePrisma: PrismaStoreClient,
  ) {}

  async indexVariants(variants: VariantToIndexWithTarget[]): Promise<void> {
    const indexationPromises = variants.map((variantToIndex) => {
      switch (variantToIndex.target) {
        case SalesChannelName.PUBLIC:
          return this.publicIndexationService.indexVariant(variantToIndex.data);
        case SalesChannelName.B2B:
          throw new Error('Not implemented');
        default:
          throw new Error(`Unknown target: ${jsonStringify(variantToIndex)}`);
      }
    });
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
