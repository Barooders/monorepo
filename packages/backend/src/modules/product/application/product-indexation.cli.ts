import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { UUID } from '@libs/domain/value-objects';
import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { PublicIndexationService } from '../domain/indexation.service';
import { IQueueClient } from '../domain/ports/queue-client';

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
    private indexationService: PublicIndexationService,
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
  })
  async fullIndex(): Promise<void> {
    const productIds = await this.mainPrisma.product.findMany({
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
    const existingVariantIds =
      await this.storePrisma.storeBaseProductVariant.findMany({
        select: {
          shopifyId: true,
        },
      });

    await this.indexationService.pruneVariants(
      existingVariantIds.map(({ shopifyId }) => String(shopifyId)),
      shouldDeleteDocuments,
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

  private async indexMultipleProducts(productIds: string[]) {
    productIds.forEach(async (productId) => {
      this.logger.warn(`Sending product (${productId}) to queue`);

      await this.queueClient.planProductIndexation(
        new UUID({ uuid: productId }),
        { withoutDelay: true },
      );
    });
  }
}
