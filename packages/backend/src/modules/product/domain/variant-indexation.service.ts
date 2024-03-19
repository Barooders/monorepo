import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { ShopifyID } from '@libs/domain/value-objects';
import { Injectable, Logger } from '@nestjs/common';
import { ISearchClient } from './ports/search-client';
import { VariantToIndexWithTarget } from './ports/variant-to-index.type';

@Injectable()
export class VariantIndexationService {
  private readonly logger = new Logger(VariantIndexationService.name);

  constructor(
    private mainPrisma: PrismaMainClient,
    private searchClient: ISearchClient,
  ) {}

  async indexVariants(variants: VariantToIndexWithTarget[]): Promise<void> {
    const indexationPromises = variants.map((variantToIndex) =>
      this.indexVariant(variantToIndex),
    );
    await Promise.allSettled(indexationPromises);
  }

  async pruneVariants(shouldDeleteDocuments: boolean): Promise<void> {
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

    await this.searchClient.pruneVariantDocuments(
      existingVariants
        .map((variant) => {
          return variant.product.productSalesChannels.map(
            ({ salesChannelName }) => ({
              target: salesChannelName,
              shopifyId: new ShopifyID({ id: Number(variant.shopifyId) }),
            }),
          );
        })
        .flat(),
      shouldDeleteDocuments,
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
