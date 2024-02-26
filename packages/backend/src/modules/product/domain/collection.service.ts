import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { Injectable } from '@nestjs/common';
import { MAX_BREADCRUMBS_LENGTH } from '../constants';
import { TooLongBreadcrumbsException } from './exceptions/collection.exceptions';

@Injectable()
export class CollectionService {
  constructor(
    private mainPrisma: PrismaMainClient,
    private storePrisma: PrismaStoreClient,
  ) {}

  async getCollectionBreadcrumbs(collectionId: string) {
    const currentCollection = await this.mainPrisma.collection.findFirstOrThrow(
      {
        where: { id: collectionId },
      },
    );

    let nextCollectionId = currentCollection.parentCollectionId;
    const parentCollections = [];
    while (nextCollectionId) {
      if (parentCollections.length > MAX_BREADCRUMBS_LENGTH) {
        throw new TooLongBreadcrumbsException(collectionId);
      }

      const nextCollection = await this.mainPrisma.collection.findFirstOrThrow({
        where: { id: nextCollectionId },
      });
      parentCollections.unshift(nextCollection);
      nextCollectionId = nextCollection.parentCollectionId;
    }

    return [...parentCollections, currentCollection];
  }

  async getProductBreadcrumbs(productId: string) {
    const { collections } =
      await this.storePrisma.storeBaseProduct.findUniqueOrThrow({
        where: {
          id: productId,
        },
        include: {
          collections: true,
        },
      });

    const productCollections = await this.mainPrisma.collection.findMany({
      where: {
        id: { in: collections.map(({ collectionId }) => collectionId) },
      },
      select: { type: true, id: true },
    });

    let productTypeCollection = productCollections.find(
      (collection) => collection.type === 'productTypeGendered',
    );

    if (!productTypeCollection)
      productTypeCollection = productCollections.find(
        (collection) => collection.type === 'productType',
      );
    if (!productTypeCollection)
      productTypeCollection = productCollections.find(
        (collection) => collection.type === 'category',
      );
    if (!productTypeCollection)
      productTypeCollection = productCollections.find(
        (collection) => collection.type === 'sport',
      );

    if (!productTypeCollection)
      throw new Error(
        `Could not find product type collection for ${productId}`,
      );

    const result = await this.getCollectionBreadcrumbs(
      productTypeCollection.id,
    );

    return result;
  }
}
