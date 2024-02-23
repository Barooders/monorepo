import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { WooCommerceProduct, WooCommerceProductVariation } from './types';
import { jsonStringify } from '@libs/helpers/json';

const PRODUCTS_PER_PAGE = 40;

@Injectable()
export class WooCommerceClient {
  private readonly logger = new Logger(WooCommerceClient.name);

  constructor(private readonly vendorConfigService: IVendorConfigService) {}

  async getAllProducts(sinceDate?: Date): Promise<WooCommerceProduct[]> {
    const products: WooCommerceProduct[] = [];
    let pageNumber = 1;
    let pageProducts = await this.getPageProducts(
      pageNumber,
      PRODUCTS_PER_PAGE,
      sinceDate,
    );
    while (pageProducts.length > 0) {
      products.push(...pageProducts);
      pageNumber++;
      pageProducts = await this.getPageProducts(
        pageNumber,
        PRODUCTS_PER_PAGE,
        sinceDate,
      );
    }
    return products;
  }

  async getPageProducts(
    page: number,
    itemsPerPage: number,
    sinceDate?: Date,
  ): Promise<WooCommerceProduct[]> {
    const endpoint = this.getUrl('', {
      page: page.toString(),
      per_page: itemsPerPage.toString(),
      ...(sinceDate && { modified_after: sinceDate.toISOString() }),
    });

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(
        `Cannot fetch woocommerce page products: ${response.status}`,
      );
    }

    return response.json();
  }

  async getProduct(productId: number): Promise<WooCommerceProduct | null> {
    try {
      const endpoint = this.getUrl(`/${productId}`);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(jsonStringify(response));
      }

      return (await response.json()) as WooCommerceProduct;
    } catch (error) {
      this.logger.debug(`Could not get product ${productId} because: `, error);

      return null;
    }
  }

  async getProductVariation(
    productId: number,
    variationId: number,
  ): Promise<WooCommerceProductVariation | null> {
    try {
      const endpoint = this.getUrl(`/${productId}/variations/${variationId}`);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(jsonStringify(response));
      }

      return (await response.json()) as WooCommerceProductVariation;
    } catch (error) {
      this.logger.debug(
        `Could not get product variation ${variationId} for product ${productId} because: `,
        error,
      );

      return null;
    }
  }

  private getUrl(
    pathSuffix: string,
    extraParams?: Record<string, string>,
  ): string {
    const { apiKey: consumerKey, apiSecret: consumerSecret } =
      this.vendorConfigService.getVendorConfig();

    if (!consumerKey || !consumerSecret) {
      throw new Error('WooCommerce API credentials not found');
    }
    const queryParams = {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      ...extraParams,
    };
    const url = new URL(
      `${this.vendorConfigService.getVendorConfig().apiUrl}${pathSuffix ?? ''}`,
    );
    url.search = new URLSearchParams(queryParams).toString();

    return url.href;
  }
}
