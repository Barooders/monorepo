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
import { IProduct } from 'shopify-api-node';
import { AllCyclesMapper } from './mappers/all-cycles.mapper';
import { BaroudeurMapper } from './mappers/baroudeur.mapper';
import { BoussoleMapper } from './mappers/boussole.mapper';
import { CyclinkMapper } from './mappers/cyclink.mapper';
import { ShopifyDefaultMapper } from './mappers/default.mapper';
import { HbeMapper } from './mappers/hbe.mapper';
import { LoewiMapper } from './mappers/loewi.mapper';
import { MintMapper } from './mappers/mint.mapper';
import { NordicsMapper } from './mappers/nordics.mapper';
import { PastelMapper } from './mappers/pastel.mapper';
import { PilatMapper } from './mappers/pilat.mapper';
import { TCHMapper } from './mappers/tch.mapper';
import { TechniCyclesMapper } from './mappers/techni-cycles.mapper';
import { TNCMapper } from './mappers/tnc.mapper';
import { VeloMeldoisMapper } from './mappers/velo-meldois.mapper';
import { WillemMapper } from './mappers/willem.mapper';
import { ShopifyClient } from './shopify.client';

@Injectable()
export class ShopifyProductService implements ProVendorStrategy {
  private readonly logger = new Logger(ShopifyProductService.name);

  constructor(
    private shopifyClient: ShopifyClient,
    private shopifyDefaultMapper: ShopifyDefaultMapper,
    private nordicsMapper: NordicsMapper,
    private tncMapper: TNCMapper,
    private tchMapper: TCHMapper,
    private boussoleMapper: BoussoleMapper,
    private pilatMapper: PilatMapper,
    private cyclinkMapper: CyclinkMapper,
    private techniCyclesMapper: TechniCyclesMapper,
    private hbeMapper: HbeMapper,
    private pastelMapper: PastelMapper,
    private loewiMapper: LoewiMapper,
    private baroudeurMapper: BaroudeurMapper,
    private allCyclesMapper: AllCyclesMapper,
    private willemMapper: WillemMapper,
    private mintMapper: MintMapper,
    private veloMeldoisMapper: VeloMeldoisMapper,
    private productService: ProductService,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async getProductsToUpdate(): Promise<SyncedVendorProProduct[]> {
    return this.productService.findAll();
  }

  async getAllVendorProducts(sinceDate?: Date): Promise<IProduct[]> {
    const productsFromShopify =
      await this.shopifyClient.getAllProducts(sinceDate);

    if (!productsFromShopify) throw new Error('Products not found on Shopify');

    return productsFromShopify;
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return this.shopifyClient.getProduct(Number(id));
  }

  async mapProduct(product: any): Promise<SyncProduct | null> {
    return this.getMapper().mapper(product);
  }

  async mapLightProduct(product: any): Promise<SyncLightProduct> {
    return this.getMapper().mapperLight(product);
  }

  async isUp(): Promise<boolean> {
    return this.shopifyClient.isUp();
  }

  async updateProductStocks(
    productFromDB: SyncedVendorProProduct,
    variantStocksToUpdate: VariantStockToUpdate[],
  ): Promise<void> {
    let productFromVendor: IProduct | null = null;

    try {
      productFromVendor = await this.getProductById(
        productFromDB.externalProductId,
      );
    } catch (error: any) {
      if (!error.message.includes('Response code 404')) {
        throw error;
      }
    }

    if (!productFromVendor) {
      await this.productService.archiveProductIfNotInAPI(productFromDB);
      return;
    }

    await Promise.allSettled(
      variantStocksToUpdate.map(
        async ({ internalVariantId, externalVariantId, currentStock }) => {
          try {
            const newStock =
              productFromVendor?.variants.find(
                ({ id }) => id.toString() === externalVariantId,
              )?.inventory_quantity ?? 0;

            await this.productService.updateProductVariantStock(
              Number(internalVariantId),
              newStock,
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

  private getMapper(): ShopifyDefaultMapper {
    switch (this.vendorConfigService.getVendorConfig().slug) {
      case 'nordics_value':
        return this.nordicsMapper;
      case 'projet_boussole':
        return this.boussoleMapper;
      case 'pilat':
        return this.pilatMapper;
      case 'mint_bikes':
        return this.mintMapper;
      case 'tnc':
        return this.tncMapper;
      case 'tch':
        return this.tchMapper;
      case 'cyclink':
        return this.cyclinkMapper;
      case 'techni_cycles':
        return this.techniCyclesMapper;
      case 'hbe_shopify':
        return this.hbeMapper;
      case 'pastel':
        return this.pastelMapper;
      case 'loewi':
        return this.loewiMapper;
      case 'all_cycles':
        return this.allCyclesMapper;
      case 'baroudeur_cycles':
        return this.baroudeurMapper;
      case 'willemd':
        return this.willemMapper;
      case 'velo_meldois':
        return this.veloMeldoisMapper;
      default:
        return this.shopifyDefaultMapper;
    }
  }
}
