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
import { ProductDTO } from './dto/prestashop-product.dto';
import { BikeXtremeMapper } from './mappers/bike-xtreme.mapper';
import { PrestashopDefaultMapper } from './mappers/default.mapper';
import { FietsMapper } from './mappers/fiets.mapper';
import { FreeglisseMapper } from './mappers/freeglisse.mapper';
import { FunbikeMapper } from './mappers/funbike.mapper';
import { GemBikesMapper } from './mappers/gem-bikes.mapper';
import { MatbikeMapper } from './mappers/matbike.mapper';
import { SanferbikeMapper } from './mappers/sanferbike.mapper';
import { SEMotionMapper } from './mappers/semotion.mapper';
import { UsedEliteBikesMapper } from './mappers/used-elite-bikes.mapper';
import { Velosport34Mapper } from './mappers/velosport34.mapper';
import { PrestashopClient } from './prestashop.client';

@Injectable()
export class PrestashopProductService implements ProVendorStrategy {
  private readonly logger = new Logger(PrestashopProductService.name);

  constructor(
    private prestashopClient: PrestashopClient,
    private prestashopDefaultMapper: PrestashopDefaultMapper,
    private fietsMapper: FietsMapper,
    private freeglisseMapper: FreeglisseMapper,
    private semotionMapper: SEMotionMapper,
    private funbikeMapper: FunbikeMapper,
    private bikeXtremeMapper: BikeXtremeMapper,
    private matbikeMapper: MatbikeMapper,
    private sanferbikeMapper: SanferbikeMapper,
    private gemBikesMapper: GemBikesMapper,
    private usedEliteBikesMapper: UsedEliteBikesMapper,
    private velosport34Mapper: Velosport34Mapper,
    private productService: ProductService,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async getProductsToUpdate(): Promise<SyncedVendorProProduct[]> {
    return this.productService.findAll();
  }

  async getAllVendorProducts(sinceDate?: Date): Promise<ProductDTO[]> {
    // Code to retrieve all products from the Prestashop API using the provided inputs
    let prestashopProducts = await this.prestashopClient.getAllProducts();

    if (!prestashopProducts) return [];
    if (sinceDate) {
      prestashopProducts = prestashopProducts.filter(
        (prestashopProduct) =>
          new Date(prestashopProduct.date_upd).getTime() >
          new Date(sinceDate).getTime(),
      );
    }

    prestashopProducts = prestashopProducts.sort(
      (a, b) => new Date(b.date_upd).getTime() - new Date(a.date_upd).getTime(),
    );

    return prestashopProducts;
  }

  async getProductById(productId: string): Promise<ProductDTO | null> {
    return this.prestashopClient.getProduct(productId);
  }

  async mapProduct(product: ProductDTO): Promise<SyncProduct | null> {
    return this.getMapper().map(product);
  }

  private getMapper(): PrestashopDefaultMapper | FietsMapper {
    switch (this.vendorConfigService.getVendorConfig().slug) {
      case 'fiets':
        return this.fietsMapper;
      case 'freeglisse':
        return this.freeglisseMapper;
      case 'semotion':
        return this.semotionMapper;
      case 'matkite':
        return this.matbikeMapper;
      case 'sanferbike':
        return this.sanferbikeMapper;
      case 'velosport34':
        return this.velosport34Mapper;
      case 'funbike':
        return this.funbikeMapper;
      case 'bike_xtreme':
        return this.bikeXtremeMapper;
      case 'gem_bikes':
        return this.gemBikesMapper;
      case 'used_elite_bikes':
        return this.usedEliteBikesMapper;
      default:
        return this.prestashopDefaultMapper;
    }
  }
  async mapLightProduct(product: ProductDTO): Promise<SyncLightProduct> {
    return this.getMapper().mapLight(product);
  }

  async isUp(): Promise<boolean> {
    return (await this.prestashopClient.getPageProducts(0, 1)).length > 0;
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

    const lightProduct = await this.mapLightProduct(productFromVendor);

    if (!lightProduct.isVisibleInStore) {
      // This is because prestashop client only looks for active products
      // when doing daily sync
      await this.productService.archiveProductIfNotInAPI(productFromDB);
      return;
    }

    await Promise.allSettled(
      variantStocksToUpdate.map(
        async ({ internalVariantId, externalVariantId, currentStock }) => {
          try {
            const stock =
              await this.prestashopClient.getStockItem(externalVariantId);

            await this.productService.updateProductVariantStock(
              Number(internalVariantId),
              this.getMapper().getQuantity(productFromVendor, stock),
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
}
