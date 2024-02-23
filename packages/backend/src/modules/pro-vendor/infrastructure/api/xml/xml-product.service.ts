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
import { XMLClient } from './xml.client';
import { XMLMapper } from './xml.mapper';
import { XMLProduct } from './types';

@Injectable()
export class XMLProductService implements ProVendorStrategy {
  private readonly logger = new Logger(XMLProductService.name);

  constructor(
    private xmlClient: XMLClient,
    private xmlMapper: XMLMapper,
    private productService: ProductService,
  ) {}

  async getAllVendorProducts(
    _sinceDate: Date | null | undefined,
  ): Promise<XMLProduct[]> {
    const XMLProducts = await this.xmlClient.getAllProducts();

    if (!XMLProducts) throw new Error('Products not found on provided XML');

    return XMLProducts;
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
            const variant = await this.xmlClient.getProductVariant(
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

  async getProductById(id: string): Promise<XMLProduct | null> {
    return this.xmlClient.getProductById(id);
  }

  async mapProduct(product: XMLProduct): Promise<SyncProduct | null> {
    return this.xmlMapper.mapProduct(product);
  }

  async mapLightProduct(product: XMLProduct): Promise<SyncLightProduct> {
    return this.xmlMapper.mapLightProduct(product);
  }

  async isUp(): Promise<boolean> {
    return true;
  }
}
