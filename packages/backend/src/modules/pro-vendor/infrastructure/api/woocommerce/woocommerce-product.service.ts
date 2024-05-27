import { ProVendorStrategy } from '@modules/pro-vendor/domain/ports/pro-vendor.strategy';
import {
  SyncedVendorProProduct,
  SyncLightProduct,
  SyncProduct,
  VariantStockToUpdate,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { ProductService } from '@modules/pro-vendor/domain/service/product.service';
import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { BernaudeauMapper } from './mappers/bernaudeau.mapper';
import { BikeFMapper } from './mappers/bikef.mapper';
import { DazBikeMapper } from './mappers/daz-bike.mapper';
import { WooCommerceDefaultMapper } from './mappers/default.mapper';
import { FastlapMapper } from './mappers/fastlap.mapper';
import { JBikesMapper } from './mappers/j-bikes.mapper';
import { LeHollandaisMapper } from './mappers/le-hollandais.mapper';
import { MontaniniMapper } from './mappers/montanini.mapper';
import { MoulinAVelosMapper } from './mappers/moulin-a-velos.mapper';
import { PanameBicisMapper } from './mappers/paname-bicis.mapper';
import { RecocycleMapper } from './mappers/recocycle.mapper';
import { SBikesMapper } from './mappers/sbikes.mapper';
import { WooCommerceProduct } from './types';
import { WooCommerceClient } from './woocommerce.client';

@Injectable()
export class WooCommerceProductService implements ProVendorStrategy {
  private readonly logger = new Logger(WooCommerceProductService.name);

  constructor(
    private productService: ProductService,
    private wooCommerceClient: WooCommerceClient,
    private wooCommerceDefaultMapper: WooCommerceDefaultMapper,
    private moulinAVelosMapper: MoulinAVelosMapper,
    private jBikesMapper: JBikesMapper,
    private dazBikeMapper: DazBikeMapper,
    private leHollandaisMapper: LeHollandaisMapper,
    private sBikesMapper: SBikesMapper,
    private bikefMapper: BikeFMapper,
    private montaniniMapper: MontaniniMapper,
    private panameBicisMapper: PanameBicisMapper,
    private bernaudeauMapper: BernaudeauMapper,
    private recocycleMapper: RecocycleMapper,
    private fastlapMapper: FastlapMapper,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async getProductsToUpdate(): Promise<SyncedVendorProProduct[]> {
    return await this.productService.findAll();
  }

  async getAllVendorProducts(sinceDate?: Date): Promise<WooCommerceProduct[]> {
    const productsFromWooCommerce =
      await this.wooCommerceClient.getAllProducts(sinceDate);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!productsFromWooCommerce)
      throw new Error('Products not found on WooCommerce');

    return productsFromWooCommerce;
  }

  async getProductById(id: string): Promise<WooCommerceProduct | null> {
    return await this.wooCommerceClient.getProduct(Number(id));
  }

  async mapProduct(
    productFromWooCommerce: WooCommerceProduct,
  ): Promise<SyncProduct | null> {
    return await this.getMapper().mapProduct(productFromWooCommerce);
  }

  async mapLightProduct(
    productFromWooCommerce: WooCommerceProduct,
  ): Promise<SyncLightProduct> {
    return await this.getMapper().mapLightProduct(productFromWooCommerce);
  }

  async isUp(): Promise<boolean> {
    return (await this.wooCommerceClient.getPageProducts(1, 1)).length > 0;
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
            const stock = await this.wooCommerceClient.getProductVariation(
              productFromVendor.id,
              Number(externalVariantId),
            );

            await this.productService.updateProductVariantStock(
              internalId,
              this.getMapper().getVariantQuantity(
                productFromVendor,
                stock?.stock_quantity ?? 0,
              ),
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

  private getMapper(): WooCommerceDefaultMapper {
    switch (this.vendorConfigService.getVendorConfig().slug) {
      case 'moulin_a_velos':
        return this.moulinAVelosMapper;
      case 'jbikes':
        return this.jBikesMapper;
      case 'daz_bike':
        return this.dazBikeMapper;
      case 'le_hollandais':
        return this.leHollandaisMapper;
      case 'sbikes':
        return this.sBikesMapper;
      case 'recocycle':
        return this.recocycleMapper;
      case 'fastlap':
        return this.fastlapMapper;
      case 'bikef':
        return this.bikefMapper;
      case 'bernaudeau_woo':
        return this.bernaudeauMapper;
      case 'montanini':
        return this.montaniniMapper;
      case 'paname_bicis':
        return this.panameBicisMapper;
      default:
        return this.wooCommerceDefaultMapper;
    }
  }
}
