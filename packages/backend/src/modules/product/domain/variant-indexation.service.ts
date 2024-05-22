import {
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import { Injectable, Logger } from '@nestjs/common';
import {
  DocumentToIndex,
  DocumentType,
  ISearchClient,
} from './ports/search-client';
import { VariantToIndexWithTarget } from './ports/variant-to-index.type';

const getDocumentTypeFromSalesChannel = (
  salesChannelName: SalesChannelName,
) => {
  switch (salesChannelName) {
    case SalesChannelName.PUBLIC:
      return DocumentType.PUBLIC_VARIANT;
    case SalesChannelName.B2B:
      return DocumentType.B2B_VARIANT;
    default:
      throw new Error(`Unknown sales channel ${salesChannelName}`);
  }
};
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
        id: true,
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
              documentType: getDocumentTypeFromSalesChannel(salesChannelName),
              id: variant.id,
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
    const documentType = getDocumentTypeFromSalesChannel(target);
    const documentToIndex = {
      documentType,
      data: variantToIndex.data,
    } as DocumentToIndex;

    try {
      if (!product.isActive) {
        this.logger.debug(
          `Product ${product.id.uuid} is not active, deleting variant ${variant.id.uuid} from ${documentType} collection`,
        );
        await this.searchClient.deleteDocument(variant.id.uuid, documentType);
        return;
      }
      await this.searchClient.indexDocument(documentToIndex);
    } catch (error: any) {
      this.logger.error(error.message, error);
    }
  }
}
