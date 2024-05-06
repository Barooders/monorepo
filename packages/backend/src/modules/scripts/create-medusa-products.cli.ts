import {
  PrismaStoreClient,
  ProductStatus,
} from '@libs/domain/prisma.store.client';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import Medusa from '@medusajs/medusa-js';
import { ProductStatus as MedusaStatus } from '@medusajs/types';
import { ProductUpdateService } from '@modules/product/domain/product-update.service';
import { Logger } from '@nestjs/common';
import { compact, first } from 'lodash';
import { Command, Console } from 'nestjs-console';

const MEDUSA_BACKEND_URL = 'https://store.barooders.com';

@Console()
export class SyncProductsInMedusaCLI {
  private readonly logger: Logger = new Logger(SyncProductsInMedusaCLI.name);
  private medusaClient = new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    maxRetries: 3,
    apiKey: process.env.MEDUSA_DEVELOPER_API_TOKEN,
  });

  constructor(
    private prisma: PrismaStoreClient,
    private readonly loggerService: LoggerService,
    private productUpdateService: ProductUpdateService,
  ) {}

  @Command({
    command: 'syncMedusa',
    options: [
      {
        flags: '-a, --onlyActive',
        description: 'sync only shopify active products',
        required: false,
      },
    ],
  })
  async syncMedusa({
    onlyActive = false,
  }: {
    onlyActive: boolean;
  }): Promise<void> {
    const statusWhereClause = onlyActive
      ? { status: { equals: ProductStatus.ACTIVE } }
      : {};
    const productIds = await this.prisma.storeExposedProduct.findMany({
      select: { id: true, handle: true },
      where: statusWhereClause,
    });

    this.logger.log(`Syncing ${productIds.length} products in Medusa`);

    for (const { id, handle } of productIds) {
      try {
        const existingProduct = await this.medusaClient.admin.products.list({
          handle,
        });
        if (existingProduct.count > 0) continue;
      } catch (e) {}

      this.logger.log(`Treating product ${id} `);
      const product = await this.prisma.storeExposedProduct.findFirstOrThrow({
        where: { id },
        include: {
          product: {
            include: {
              exposedImages: true,
              storeProductForAnalytics: true,
              collections: true,
              baseProductVariants: {
                include: {
                  exposedProductVariant: true,
                  storeB2CProductVariant: true,
                },
              },
            },
          },
        },
      });
      const firstVariant = first(
        product.product.baseProductVariants,
      )?.exposedProductVariant;

      if (!firstVariant) {
        this.logger.error(`No variant found on product ${product.id}`);
        continue;
      }

      const productTypeId = await this.getOrCreateCategory(product.productType);

      await this.medusaClient.admin.products.create({
        title: product.title,
        is_giftcard: false,
        discountable: true,
        status: this.mapStatus(product.status),
        thumbnail: product.firstImage ?? undefined,
        images: product.product.exposedImages.map((image) => image.src),
        handle: product.handle,
        description: product.description ?? undefined,
        options: compact([
          firstVariant.option1Name,
          firstVariant.option2Name,
          firstVariant.option3Name,
        ]).map((name) => ({ title: name })),
        categories: [{ id: productTypeId }],
        variants: compact(
          product.product.baseProductVariants.map((variant) => {
            if (!variant.exposedProductVariant) return null;
            return {
              prices: [
                {
                  amount: Math.round(
                    Number(variant.storeB2CProductVariant?.price ?? 0) * 100,
                  ),
                  currency_code: 'EUR',
                },
              ],
              title: variant.exposedProductVariant.title,
              options: compact([
                firstVariant.option1,
                firstVariant.option2,
                firstVariant.option3,
              ]).map((option) => ({ value: option })),
              ean:
                product.product.storeProductForAnalytics?.EANCode ?? undefined,
              inventory_quantity: Number(
                variant.exposedProductVariant.inventoryQuantity,
              ),
            };
          }),
        ),
      });
    }
  }

  private mapStatus(status: ProductStatus): MedusaStatus {
    return status === 'ACTIVE'
      ? MedusaStatus.PUBLISHED
      : status === 'ARCHIVED'
        ? MedusaStatus.REJECTED
        : MedusaStatus.DRAFT;
  }

  private async createCategory(categoryName: string) {
    this.logger.log(`Creating category ${categoryName}`);
    const createResponse =
      await this.medusaClient.admin.productCategories.create({
        name: categoryName,
        is_active: true,
      });

    return createResponse.product_category.id;
  }

  private async getOrCreateCategory(categoryName: string) {
    try {
      const response = await this.medusaClient.admin.productCategories.list({
        q: categoryName,
      });
      const existingCategory = first(response.product_categories);
      if (existingCategory) return existingCategory.id;

      return await this.createCategory(categoryName);
    } catch (e) {
      return await this.createCategory(categoryName);
    }
  }
}
