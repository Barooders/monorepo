import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { UUID } from '@libs/domain/value-objects';
import { IPIMClient } from '@modules/product/domain/ports/pim.client';
import { ProductUpdateService } from '@modules/product/domain/product-update.service';
import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

@Console()
export class FixProductImageCLI {
  private readonly logger: Logger = new Logger(FixProductImageCLI.name);

  constructor(
    private prisma: PrismaStoreClient,
    private productUpdateService: ProductUpdateService,
    private pimClient: IPIMClient,
  ) {}

  @Command({
    command: 'fixProductImages',
    options: [
      {
        flags: '-d, --dry',
        required: false,
        description: 'No updates made',
      },
    ],
  })
  async fixProductImages({ dry = false }: { dry: boolean }): Promise<void> {
    const productsWithoutImages = await this.prisma.storeBaseProduct.findMany({
      where: {
        exposedImages: { none: {} },
      },
      include: {
        exposedProductTags: true,
      },
    });
    this.logger.log(
      `Found ${productsWithoutImages.length} products without images`,
    );

    for (const product of productsWithoutImages) {
      try {
        const productModelName = product.exposedProductTags.find(
          (tag) => tag.tag === 'modele',
        )?.value;
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!productModelName) {
          this.logger.log(`No model tag for product ${product.id}`);
          continue;
        }

        const productModel =
          await this.pimClient.getPimProductModel(productModelName);

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!productModel) {
          this.logger.log(`Cannot find model for product ${product.id}`);
          continue;
        }

        if (!productModel.attributes.imageUrl) {
          this.logger.log(
            `No image on model ${productModelName} for product ${product.id}`,
          );
          continue;
        }

        if (dry) {
          this.logger.log(
            `Would upload ${productModel.attributes.imageUrl.toString()} to shopify for product ${product.shopifyId.toString()}`,
          );
        } else {
          this.logger.log(
            `Adding ${productModel.attributes.imageUrl.toString()} to product ${product.shopifyId.toString()}`,
          );
          await this.productUpdateService.addProductImage(
            new UUID({ uuid: product.id }),
            {
              src: productModel.attributes.imageUrl.toString(),
            },
          );
        }
      } catch (e) {
        const error = e as { message: string };
        this.logger.error(error.message);
        continue;
      }
    }
  }
}
