import {
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable, Logger } from '@nestjs/common';
import { B2BIndexationService } from './b2b-indexation.service';
import { IndexationStrategy } from './ports/indexation.strategy';
import { ISearchClient } from './ports/search-client';
import { VariantToIndexWithTarget } from './ports/variant-to-index.type';
import { PublicIndexationService } from './public-indexation.service';

@Injectable()
export class IndexationService {
  private readonly logger = new Logger(IndexationService.name);

  private serviceMapping?: Record<SalesChannelName, IndexationStrategy>;

  constructor(
    private publicIndexationService: PublicIndexationService,
    private b2bIndexationService: B2BIndexationService,
    private mainPrisma: PrismaMainClient,
    private searchClient: ISearchClient,
  ) {
    this.serviceMapping = {
      [SalesChannelName.PUBLIC]: publicIndexationService,
      [SalesChannelName.B2B]: b2bIndexationService,
    };
  }

  async indexVariants(variants: VariantToIndexWithTarget[]): Promise<void> {
    const indexationPromises = variants.map((variantToIndex) =>
      this.indexVariant(variantToIndex),
    );
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

  private async indexVariant(
    variantToIndex: VariantToIndexWithTarget,
  ): Promise<void> {
    const {
      target,
      data: { variant, product },
    } = variantToIndex;
    try {
      if (!product.isActive) {
        this.logger.debug(
          `Product ${product.id.uuid} is not active, deleting variant ${variant.shopifyId.id} from ${target} index`,
        );
        await this.searchClient.deleteVariantDocument(variantToIndex);
        return;
      }
      await this.searchClient.indexVariantDocument(variantToIndex);
    } catch (error: any) {
      this.logger.error(error.message, error);
    }
  }
}
