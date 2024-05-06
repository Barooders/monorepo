import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { QueueNames, SyncOutput, SyncedProductToUpdate } from './ports/types';
import { IVendorProductServiceProvider } from './ports/vendor-product-service.provider';

@Injectable()
export class StockUpdateService {
  private readonly logger = new Logger(StockUpdateService.name);

  constructor(
    @InjectQueue(QueueNames.UPDATE_STOCK)
    private productStatusUpdateQueue: Queue,
    private readonly vendorConfigService: IVendorConfigService,
    private readonly vendorProductServiceProvider: IVendorProductServiceProvider,
    private prisma: PrismaMainClient,
  ) {}

  async updateStocks(): Promise<SyncOutput> {
    const productsToUpdate = await this.vendorProductServiceProvider
      .getService()
      .getProductsToUpdate();

    this.logger.warn(`Found ${productsToUpdate.length} products to update`);

    for (const product of productsToUpdate) {
      this.logger.debug(
        `Publishing message for product ${product.internalProductId}`,
      );
      //TODO: prevent domain to depend on infra
      await this.productStatusUpdateQueue.add(
        {
          product,
          vendorSlug: this.vendorConfigService.getVendorConfig().slug,
        },
        {
          attempts: 2,
          removeOnComplete: true,
          removeOnFail: true,
          delay: 0,
        },
      );
    }

    return {
      payload: {
        updatedProductIds: productsToUpdate.map(
          ({ internalProductId }) => internalProductId,
        ),
      },
      metadata: { productsToUpdateCount: productsToUpdate.length },
    };
  }

  async updateProductStocks(product: SyncedProductToUpdate): Promise<void> {
    if (!(await this.isApiUp())) return;

    const internalVariants = await this.prisma.productVariant.findMany({
      where: {
        product: {
          shopifyId: Number(product.internalProductId),
        },
      },
    });
    const externalVariants = await this.prisma.vendorProVariant.findMany({
      where: {
        internalVariantId: {
          in: internalVariants.map(({ shopifyId }) => shopifyId.toString()),
        },
      },
    });

    const variantStocksToUpdate = externalVariants.map(
      ({ internalVariantId, externalVariantId }) => ({
        internalVariantId,
        externalVariantId,
        currentStock: internalVariants.find(
          ({ shopifyId }) => shopifyId.toString() === internalVariantId,
        )?.quantity,
      }),
    );

    await this.vendorProductServiceProvider
      .getService()
      .updateProductStocks(product, variantStocksToUpdate);
  }

  private async isApiUp(): Promise<boolean> {
    try {
      if (await this.vendorProductServiceProvider.getService().isUp())
        return true;

      throw new Error(
        `${
          this.vendorConfigService.getVendorConfig().slug
        } API returned no products!`,
      );
    } catch (error: any) {
      this.logger.error('Vendor API looks down', error);
      return false;
    }
  }
}
