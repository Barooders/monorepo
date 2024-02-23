import { ProVendorStrategy } from '@modules/pro-vendor/domain/ports/pro-vendor.strategy';
import {
  SyncedVendorProProduct,
  SyncLightProduct,
  SyncProduct,
  VariantStockToUpdate,
} from '@modules/pro-vendor/domain/ports/types';
import { ProductService } from '@modules/pro-vendor/domain/service/product.service';
import { Injectable, Logger } from '@nestjs/common';
import { TuvalumProductDto } from './dto/tuvalum-product.input.dto';
import { TuvalumMapper } from './mappers/tuvalum.mapper';
import { TuvalumClient } from './tuvalum.client';
import { jsonStringify } from '@libs/helpers/json';

@Injectable()
export class TuvalumProductService implements ProVendorStrategy {
  private readonly logger = new Logger(TuvalumProductService.name);

  constructor(
    private tuvalumClient: TuvalumClient,
    private tuvalumMapper: TuvalumMapper,
    private productService: ProductService,
  ) {}

  async getProductsToUpdate(): Promise<SyncedVendorProProduct[]> {
    return this.productService.findAll();
  }

  async getAllVendorProducts(sinceDate?: Date): Promise<TuvalumProductDto[]> {
    /* get all products from tuvalum */
    let productsFromTuvalum = await this.tuvalumClient.getAllProducts();

    if (!productsFromTuvalum) throw new Error('Products not found on Tuvalum');

    if (sinceDate) {
      productsFromTuvalum = productsFromTuvalum.filter(
        (productFromTuvalum) =>
          new Date(productFromTuvalum.updated_at).getTime() >
          new Date(sinceDate).getTime(),
      );
    }

    return productsFromTuvalum;
  }

  async getProductById(id: string): Promise<TuvalumProductDto | null> {
    return this.tuvalumClient.getProduct(id);
  }

  async mapProduct(product: TuvalumProductDto): Promise<SyncProduct | null> {
    return this.tuvalumMapper.mapper(product);
  }

  async mapLightProduct(product: TuvalumProductDto): Promise<SyncLightProduct> {
    return this.tuvalumMapper.mapperLight(product);
  }

  async isUp(): Promise<boolean> {
    return this.tuvalumClient.isUp();
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

    if (variantStocksToUpdate.length !== 1) {
      throw new Error(
        `Tuvalum product should have exactly one variant to update, received variants: ${jsonStringify(
          variantStocksToUpdate,
        )}`,
      );
    }

    const variant = variantStocksToUpdate[0];

    await this.productService.updateProductVariantStock(
      Number(variant.internalVariantId),
      this.tuvalumMapper.getProductQuantity(productFromVendor),
      variant.currentStock,
    );
  }
}
