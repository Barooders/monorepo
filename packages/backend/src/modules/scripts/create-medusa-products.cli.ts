import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Condition, PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { Variant } from '@libs/domain/product.interface';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { MedusaClient } from '@modules/product/infrastructure/store/medusa.client';
import compact from 'lodash/compact';
import first from 'lodash/first';
import { Command, Console } from 'nestjs-console';

@Console()
export class SyncProductsInMedusaCLI {
  constructor(
    private prismaMain: PrismaMainClient,
    private prismaStore: PrismaStoreClient,
    private readonly loggerService: LoggerService,
    private medusaClient: MedusaClient,
  ) {}

  @Command({
    command: 'syncMedusa',
    options: [
      {
        flags: '-p, --productType <productType>',
        description: 'Sync only products of a specific productType',
        required: false,
      },
    ],
  })
  async syncMedusa({ productType }: { productType?: string }): Promise<void> {
    const productIds = await this.prismaMain.product.findMany({
      select: { id: true },
      where: {
        status: { equals: 'ACTIVE' },
        variants: {
          some: { quantity: { gt: 0 } },
        },
        medusaId: { equals: null },
        ...(productType !== undefined
          ? { productType: { equals: productType } }
          : {}),
      },
    });

    this.loggerService.info(`Syncing ${productIds.length} products in Medusa`);

    for (const { id } of productIds) {
      try {
        this.loggerService.info(`Treating product ${id} `);
        const product = await this.prismaStore.storeExposedProduct.findFirst({
          where: { id },
          include: {
            product: {
              include: {
                exposedImages: true,
                storeProductForAnalytics: true,
                collections: true,
                exposedProductTags: true,
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

        if (!product) {
          this.loggerService.error(
            `Product not found in store database, continuing...`,
          );
          continue;
        }

        const firstVariant = first(product.product.baseProductVariants);

        if (!firstVariant) {
          this.loggerService.error(`No variant found on product ${product.id}`);
          continue;
        }

        const vendorId = (
          await this.prismaMain.customer.findFirstOrThrow({
            where: { sellerName: product.vendor },
            select: { authUserId: true },
          })
        ).authUserId;

        const { storeId } = await this.medusaClient.createProduct({
          title: product.title,
          status: product.status,
          images: product.product.exposedImages.map(({ src }) => ({ src })),
          vendorId,
          tags: product.product.exposedProductTags.map(
            (tag) => `${tag.tag}:${tag.value}`,
          ),
          body_html: product.description ?? '',
          published: true,
          metafields: [],
          source: 'medusa-migration',
          compare_at_price:
            firstVariant.storeB2CProductVariant?.compareAtPrice ?? undefined,
          price: firstVariant.storeB2CProductVariant?.price ?? undefined,
          product_type: product.productType,
          variants: compact(
            product.product.baseProductVariants.map(
              (variant): Variant | null => {
                if (!variant.exposedProductVariant) return null;
                return {
                  optionProperties: [
                    {
                      key: variant.exposedProductVariant.option1Name,
                      value: variant.exposedProductVariant.option1,
                    },
                    {
                      key: variant.exposedProductVariant.option2Name,
                      value: variant.exposedProductVariant.option2,
                    },
                    {
                      key: variant.exposedProductVariant.option3Name,
                      value: variant.exposedProductVariant.option3,
                    },
                  ].filter((opt) => opt.key !== null && opt.value !== null) as {
                    key: string;
                    value: string;
                  }[],
                  price: variant.storeB2CProductVariant?.price.toString(),
                  title: variant.exposedProductVariant.title,
                  sku:
                    product.product.storeProductForAnalytics?.EANCode ??
                    undefined,
                  inventory_quantity: Number(
                    variant.exposedProductVariant.inventoryQuantity,
                  ),
                  condition:
                    variant.exposedProductVariant.condition ??
                    Condition.VERY_GOOD,
                  external_id: id,
                  compare_at_price:
                    variant.storeB2CProductVariant?.compareAtPrice?.toString(),
                };
              },
            ),
          ),
        });

        await this.prismaMain.product.update({
          where: { id },
          data: { medusaId: storeId.medusaIdIfExists },
        });
      } catch (e: any) {
        this.loggerService.error(e);
        continue;
      }
    }
  }
}
