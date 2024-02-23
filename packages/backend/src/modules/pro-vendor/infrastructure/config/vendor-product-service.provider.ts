import {
  FullVendorConfig,
  SynchronizedProVendor,
  VendorType,
} from '@config/vendor/types';
import { vendorConfig } from '@config/vendor/vendor.config';
import { ProVendorStrategy } from '@modules/pro-vendor/domain/ports/pro-vendor.strategy';
import { IVendorProductServiceProvider } from '@modules/pro-vendor/domain/ports/vendor-product-service.provider';
import { Injectable } from '@nestjs/common';
import { CSVProductService } from '../api/csv/csv-product.service';
import { PrestashopProductService } from '../api/prestashop/prestashop-product.service';
import { ScrapflyProductService } from '../api/scrapping/scrapfly.product.service';
import { ShopifyProductService } from '../api/shopify/shopify-product.service';
import { TuvalumProductService } from '../api/tuvalum/tuvalum-product.service';
import { WooCommerceProductService } from '../api/woocommerce/woocommerce-product.service';
import { XMLProductService } from '../api/xml/xml-product.service';

@Injectable()
export class VendorProductServiceProvider
  implements IVendorProductServiceProvider
{
  private vendorConfig?: FullVendorConfig;

  constructor(
    private prestashopProductService: PrestashopProductService,
    private tuvalumProductService: TuvalumProductService,
    private shopifyProductService: ShopifyProductService,
    private scrapflyProductService: ScrapflyProductService,
    private wooCommerceProductService: WooCommerceProductService,
    private csvProductService: CSVProductService,
    private xmlProductService: XMLProductService,
  ) {}

  setVendorConfigFromSlug(vendorSlug: SynchronizedProVendor) {
    if (!vendorConfig[vendorSlug]) {
      throw new Error(`Vendor slug ${vendorSlug} is not configured.`);
    }

    this.vendorConfig = vendorConfig[vendorSlug];
  }

  getService(): ProVendorStrategy {
    switch (this.getVendorConfig().type) {
      case VendorType.PRESTASHOP:
        return this.prestashopProductService;
      case VendorType.TUVALUM:
        return this.tuvalumProductService;
      case VendorType.SHOPIFY:
        return this.shopifyProductService;
      case VendorType.SCRAPFLY:
        return this.scrapflyProductService;
      case VendorType.WOO_COMMERCE:
        return this.wooCommerceProductService;
      case VendorType.CSV:
        return this.csvProductService;
      case VendorType.XML:
        return this.xmlProductService;
      default:
        throw new Error(
          `Vendor type ${this.getVendorConfig().type} is not supported.`,
        );
    }
  }

  private getVendorConfig(): FullVendorConfig {
    if (!this.vendorConfig) {
      throw new Error('Vendor config is not set.');
    }

    return this.vendorConfig;
  }
}
