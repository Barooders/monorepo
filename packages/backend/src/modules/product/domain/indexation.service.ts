import {
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable } from '@nestjs/common';
import { B2BIndexationService } from './b2b-indexation.service';
import {
  IndexationStrategy,
  VariantToIndexWithTarget,
} from './ports/indexation.strategy';
import { PublicIndexationService } from './public-indexation.service';

@Injectable()
export class IndexationService {
  private serviceMapping?: Record<SalesChannelName, IndexationStrategy>;

  constructor(
    private publicIndexationService: PublicIndexationService,
    private b2bIndexationService: B2BIndexationService,
    private mainPrisma: PrismaMainClient,
  ) {
    this.serviceMapping = {
      [SalesChannelName.PUBLIC]: publicIndexationService,
      [SalesChannelName.B2B]: b2bIndexationService,
    };
  }

  async indexVariants(variants: VariantToIndexWithTarget[]): Promise<void> {
    const indexationPromises = variants.map((variantToIndex) => {
      const indexingService = this.serviceMapping?.[variantToIndex.target];

      if (!indexingService) {
        throw new Error(`Unknown target: ${jsonStringify(variantToIndex)}`);
      }

      return indexingService.indexVariant(variantToIndex.data);
    });
    await Promise.allSettled(indexationPromises);
  }

  async pruneVariants(shouldDeleteDocuments?: boolean): Promise<void> {
    const existingVariants = await this.mainPrisma.productVariant.findMany({
      select: {
        shopifyId: true,
        product: {
          select: {
            productSalesChannels: true,
          },
        },
      },
    });

    if (!this.serviceMapping) {
      throw new Error('Service mapping is not set.');
    }

    Object.entries(this.serviceMapping).forEach(
      async ([salesChannelName, indexingService]) => {
        const variants = existingVariants.filter(({ product }) =>
          product.productSalesChannels.some(
            ({ salesChannelName: productSalesChannelName }) =>
              productSalesChannelName === salesChannelName,
          ),
        );

        await indexingService.pruneVariants(
          variants.map(({ shopifyId }) => String(shopifyId)),
          shouldDeleteDocuments,
        );
      },
    );
  }
}
