import {
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable } from '@nestjs/common';
import { B2BIndexationService } from './b2b-indexation.service';
import {
  B2BVariantToIndex,
  PublicVariantToIndex,
} from './ports/variant-to-index.type';
import { PublicIndexationService } from './public-indexation.service';

export type VariantToIndexWithTarget =
  | {
      target: typeof SalesChannelName.PUBLIC;
      data: PublicVariantToIndex;
    }
  | {
      target: typeof SalesChannelName.B2B;
      data: B2BVariantToIndex;
    };

@Injectable()
export class IndexationService {
  constructor(
    private publicIndexationService: PublicIndexationService,
    private b2bIndexationService: B2BIndexationService,
    private mainPrisma: PrismaMainClient,
  ) {}

  async indexVariants(variants: VariantToIndexWithTarget[]): Promise<void> {
    const indexationPromises = variants.map((variantToIndex) => {
      switch (variantToIndex.target) {
        case SalesChannelName.PUBLIC:
          return this.publicIndexationService.indexVariant(variantToIndex.data);
        case SalesChannelName.B2B:
          return this.b2bIndexationService.indexVariant(variantToIndex.data);
        default:
          throw new Error(`Unknown target: ${jsonStringify(variantToIndex)}`);
      }
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

    const publicVariants = existingVariants.filter(({ product }) =>
      product.productSalesChannels.some(
        ({ salesChannelName }) => salesChannelName === SalesChannelName.PUBLIC,
      ),
    );

    const b2BVariants = existingVariants.filter(({ product }) =>
      product.productSalesChannels.some(
        ({ salesChannelName }) => salesChannelName === SalesChannelName.B2B,
      ),
    );

    await this.publicIndexationService.pruneVariants(
      publicVariants.map(({ shopifyId }) => String(shopifyId)),
      shouldDeleteDocuments,
    );

    await this.b2bIndexationService.pruneVariants(
      b2BVariants.map(({ shopifyId }) => String(shopifyId)),
      shouldDeleteDocuments,
    );
  }
}
