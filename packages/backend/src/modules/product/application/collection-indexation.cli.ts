import {
  PrismaStoreClient,
  ProductStatus,
  StoreCollection,
} from '@libs/domain/prisma.store.client';
import { Stock, UUID, ValueDate } from '@libs/domain/value-objects';
import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { CollectionIndexationService } from '../domain/collection-indexation.service';

@Console({
  command: 'indexCollection',
  description: 'Product Indexation CLI',
})
export class CollectionIndexationCLIConsole {
  private readonly logger: Logger = new Logger(
    CollectionIndexationCLIConsole.name,
  );

  constructor(
    private collectionIndexationService: CollectionIndexationService,
    private storePrisma: PrismaStoreClient,
  ) {}

  @Command({
    command: 'all',
    description: 'Index all collections',
  })
  async indexAllCollections(): Promise<void> {
    const collections = await this.storePrisma.storeCollection.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                baseProduct: {
                  exposedProduct: {
                    status: ProductStatus.ACTIVE,
                  },
                },
              },
            },
          },
        },
      },
    });

    await this.indexCollections(collections);
  }

  @Command({
    command: 'fromHandles',
    description: 'Index collections from their handles',
    options: [
      {
        flags: '-h, --handles <collectionHandles...>',
        required: true,
        description: 'Index collections from their collection handles',
      },
    ],
  })
  async indexCollectionsFromHandles({
    handles,
  }: {
    handles: string[];
  }): Promise<void> {
    const collections = await this.storePrisma.storeCollection.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                baseProduct: {
                  exposedProduct: {
                    status: ProductStatus.ACTIVE,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        handle: {
          in: handles,
        },
      },
    });

    await this.indexCollections(collections);
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
  async pruneCollections({
    apply: shouldDeleteDocuments,
  }: {
    apply?: boolean;
  }): Promise<void> {
    await this.collectionIndexationService.pruneCollections(
      shouldDeleteDocuments ?? false,
    );
  }

  private async indexCollections(
    collections: (StoreCollection & { _count: { products: number } })[],
  ) {
    await Promise.allSettled(
      collections.map(async ({ id, title, handle, _count }) => {
        this.logger.warn(`This command will index collection (${handle})`);

        if (handle.toLowerCase().includes('admin')) {
          this.logger.warn(
            `This collection (${id}) has an admin handle, skipping`,
          );
          return;
        }

        await this.collectionIndexationService.indexCollection({
          id: new UUID({ uuid: id }),
          title,
          handle,
          productCount: new Stock({ stock: _count.products }),
          updatedAt: new ValueDate({ date: new Date() }),
        });
      }),
    );
  }
}
