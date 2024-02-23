import { ProVendorStrategy } from '@modules/pro-vendor/domain/ports/pro-vendor.strategy';
import {
  SyncedProductToUpdate,
  SyncedVendorProProduct,
  SyncLightProduct,
  SyncProduct,
  VariantStockToUpdate,
} from '@modules/pro-vendor/domain/ports/types';
import { ProductService } from '@modules/pro-vendor/domain/service/product.service';
import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { CSVClient } from './csv.client';
import { CSVMapper } from './csv.mapper';
import { CSVProduct } from './types';

@Injectable()
export class CSVProductService implements ProVendorStrategy {
  private readonly logger = new Logger(CSVProductService.name);

  constructor(
    private csvClient: CSVClient,
    private csvMapper: CSVMapper,
    private productService: ProductService,
  ) {}

  async getAllVendorProducts(
    _sinceDate: Date | null | undefined,
  ): Promise<CSVProduct[]> {
    const csvProducts = await this.csvClient.getAllProducts();

    if (!csvProducts) throw new Error('Products not found on provided CSV');

    return csvProducts;
  }

  async getProductsToUpdate(): Promise<SyncedProductToUpdate[]> {
    return this.productService.findAll();
  }

  async updateProductStocks(
    productFromDB: SyncedVendorProProduct,
    variantStocksToUpdate: VariantStockToUpdate[],
  ): Promise<void> {
    const productFromVendor = await this.getProductById(
      productFromDB.externalProductId,
    );

    if (!productFromVendor) {
      await this.productService.archiveProductIfNotInAPI(productFromDB);
      return;
    }

    await Promise.allSettled(
      variantStocksToUpdate.map(
        async ({ internalVariantId, externalVariantId, currentStock }) => {
          try {
            const variant = await this.csvClient.getProductVariant(
              productFromVendor.id,
              externalVariantId,
            );

            await this.productService.updateProductVariantStock(
              Number(internalVariantId),
              variant?.inventoryQuantity.stock ?? 0,
              currentStock,
            );
          } catch (error: any) {
            this.logger.error(error.message, error);
            Sentry.captureException(error);
          }
        },
      ),
    );
  }

  async getProductById(id: string): Promise<CSVProduct | null> {
    return this.csvClient.getProductById(id);
  }

  async mapProduct(product: CSVProduct): Promise<SyncProduct | null> {
    return this.csvMapper.mapProduct(product);
  }

  async mapLightProduct(product: CSVProduct): Promise<SyncLightProduct> {
    return this.csvMapper.mapLightProduct(product);
  }

  async isUp(): Promise<boolean> {
    return true;
  }
}
