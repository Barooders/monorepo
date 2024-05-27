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
import { XMLProduct } from './types';
import { XMLClient } from './xml.client';
import { XMLMapper } from './xml.mapper';

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

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!XMLProducts) throw new Error('Products not found on provided XML');

    return XMLProducts;
  }

  async getProductsToUpdate(): Promise<SyncedProductToUpdate[]> {
    return await this.productService.findAll();
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
        async ({ internalId, externalVariantId, currentStock }) => {
          try {
            const variant = await this.xmlClient.getProductVariant(
              productFromVendor.id,
              externalVariantId,
            );

            await this.productService.updateProductVariantStock(
              internalId,
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
    return await this.xmlClient.getProductById(id);
  }

  async mapProduct(product: XMLProduct): Promise<SyncProduct | null> {
    return await this.xmlMapper.mapProduct(product);
  }

  async mapLightProduct(product: XMLProduct): Promise<SyncLightProduct> {
    return await this.xmlMapper.mapLightProduct(product);
  }

  async isUp(): Promise<boolean> {
    return true;
  }
}
