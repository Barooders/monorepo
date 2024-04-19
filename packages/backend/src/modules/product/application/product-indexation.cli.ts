import {
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { UUID } from '@libs/domain/value-objects';
import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { IQueueClient } from '../domain/ports/queue-client';
import { VariantIndexationService } from '../domain/variant-indexation.service';

@Console({
  command: 'indexProduct',
  description: 'Product Indexation CLI',
})
export class ProductIndexationCLIConsole {
  private readonly logger: Logger = new Logger(
    ProductIndexationCLIConsole.name,
  );

  constructor(
    private mainPrisma: PrismaMainClient,
    private storePrisma: PrismaStoreClient,
    private queueClient: IQueueClient,
    private variantIndexationService: VariantIndexationService,
  ) {}

  @Command({
    command: 'many',
    description: 'Fill queue with a product to index',
    options: [
      {
        flags: '-p, --products <productIds...>',
        required: true,
        description: 'Will run only on specific productIds',
      },
    ],
  })
  async indexProducts({ products }: { products: string[] }): Promise<void> {
    await this.indexMultipleProducts(products);
  }

  @Command({
    command: 'all',
    description: 'Fill queue with a product to index',
    options: [
      {
        flags: '-b, --b2bOnly',
        required: false,
        description: 'Index only products available for B2B',
      },
    ],
  })
  async fullIndex({ b2bOnly }: { b2bOnly?: boolean }): Promise<void> {
    const productIds = await this.mainPrisma.product.findMany({
      where: {
        ...(b2bOnly
          ? {
              productSalesChannels: {
                some: {
                  salesChannelName: SalesChannelName.B2B,
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });

    this.logger.warn(
      `This command will index all products (${productIds.length}) from the database`,
    );

    await this.indexMultipleProducts(productIds.map(({ id }) => id));
  }

  @Command({
    command: 'prune',
    description: 'Remove orphans documents from search engine',
    options: [
      {
        flags: '-a, --apply',
        required: false,
        description: 'Will apply the deletion',
      },
    ],
  })
  async pruneVariants({
    apply: shouldDeleteDocuments,
  }: {
    apply?: boolean;
  }): Promise<void> {
    await this.variantIndexationService.pruneVariants(
      shouldDeleteDocuments ?? false,
    );
  }

  @Command({
    command: 'fromCollection <collectionHandle>',
    description: 'Add collection products to index queue',
  })
  async indexCollectionProducts(collectionHandle: string): Promise<void> {
    const productIds =
      await this.storePrisma.storeProductCollectionWithManualCollections.findMany(
        {
          where: {
            collection: {
              handle: collectionHandle,
            },
          },
          select: {
            productId: true,
          },
        },
      );

    this.logger.warn(
      `This command will index (${productIds.length}) products from collection ${collectionHandle}`,
    );

    await this.indexMultipleProducts(
      productIds.map(({ productId }) => productId),
    );
  }

  @Command({
    command: 'fromVendor <vendorName>',
    description: 'Add vendor products to index queue',
  })
  async indexVendorProducts(vendorName: string): Promise<void> {
    const productIds = await this.mainPrisma.product.findMany({
      where: {
        vendor: { sellerName: { equals: vendorName } },
      },
      select: {
        id: true,
      },
    });

    this.logger.warn(
      `This command will index (${productIds.length}) products of vendor ${vendorName}`,
    );

    await this.indexMultipleProducts(productIds.map(({ id }) => id));
  }

  private async indexMultipleProducts(productIds: string[]) {
    for (const productId of productIds) {
      this.logger.warn(`Sending product (${productId}) to queue`);

      await this.queueClient.planProductIndexation(
        new UUID({ uuid: productId }),
        { withoutDelay: true },
      );
    }
  }
}
