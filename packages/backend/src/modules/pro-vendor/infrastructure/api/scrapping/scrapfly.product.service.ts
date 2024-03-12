import envConfig from '@config/env/env.config';
import {
  PrismaStoreClient,
  ProductStatus,
} from '@libs/domain/prisma.store.client';
import { ProVendorStrategy } from '@modules/pro-vendor/domain/ports/pro-vendor.strategy';
import { IStoreClient } from '@modules/pro-vendor/domain/ports/store-client';
import {
  ProductWithReferenceUrl,
  SyncLightProduct,
  SyncProduct,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { IProduct } from 'shopify-api-node';

@Injectable()
export class ScrapflyProductService implements ProVendorStrategy {
  public readonly logger = new Logger(ScrapflyProductService.name);

  constructor(
    private storeClient: IStoreClient,
    private prismaStoreClient: PrismaStoreClient,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async getProductsToUpdate(): Promise<ProductWithReferenceUrl[]> {
    const collectionHandle =
      this.vendorConfigService.getVendorConfig().catalog.scrapfly
        ?.productCollectionHandle;

    if (!collectionHandle) {
      throw new Error('No collection handle found in config');
    }

    const productsToUpdate =
      await this.prismaStoreClient.storeBaseProduct.findMany({
        where: {
          collections: {
            some: {
              collection: {
                handle: collectionHandle,
              },
            },
          },
          storeProductForAdmin: {
            sourceUrl: {
              not: null,
            },
          },
          exposedProduct: {
            status: {
              notIn: [ProductStatus.ARCHIVED],
            },
          },
        },
        include: {
          storeProductForAdmin: true,
        },
      });

    return productsToUpdate.map((product) => ({
      internalProductId: String(product.shopifyId),
      referenceUrl: product.storeProductForAdmin?.sourceUrl ?? '',
    }));
  }

  getAllVendorProducts(): Promise<IProduct[]> {
    throw new Error('Method getAllVendorProducts is not implemented.');
  }
  getProductById(): Promise<IProduct | null> {
    throw new Error('Method getProductById is not implemented.');
  }
  mapProduct(): Promise<SyncProduct | null> {
    throw new Error('Method mapProduct is not implemented.');
  }
  mapLightProduct(): Promise<SyncLightProduct> {
    throw new Error('Method mapLightProduct is not implemented.');
  }

  async isUp(): Promise<boolean> {
    return true;
  }

  async updateProductStocks(
    productToUpdate: ProductWithReferenceUrl,
  ): Promise<void> {
    const { referenceUrl, internalProductId } = productToUpdate;

    const vendorApiUrl = this.vendorConfigService.getVendorConfig().apiUrl;

    if (!referenceUrl.includes(vendorApiUrl)) {
      this.logger.warn(
        `[Product: ${internalProductId}] Reference URL ${referenceUrl} does not contain ${vendorApiUrl}`,
      );
      return;
    }

    const mapReferenceUrl =
      this.vendorConfigService.getVendorConfig().catalog.scrapfly
        ?.mapReferenceUrl || ((url: string) => url);
    const scrappedUrl = mapReferenceUrl(referenceUrl);

    const scrappingUrl = new URL('https://api.scrapfly.io/scrape');
    scrappingUrl.searchParams.append('url', scrappedUrl);
    scrappingUrl.searchParams.append('asp', 'true');
    scrappingUrl.searchParams.append(
      'key',
      envConfig.externalServices.scrapflyApiKey,
    );

    const response = await fetch(scrappingUrl);

    if (response.status !== 200) {
      throw new Error(
        `Scrapfly API returned status ${response.status} when scrapping ${scrappedUrl}`,
      );
    }

    const {
      result: { content, status_code },
    } = await response.json();

    if (status_code >= 400 && status_code < 500) {
      this.logger.warn(
        `Product ${internalProductId} is not available anymore (vendor returned a ${status_code}), archiving it`,
      );
      await this.storeClient.updateProduct(Number(internalProductId), {
        status: ProductStatus.ARCHIVED,
      });
      return;
    }

    const isAvailableMethod =
      this.vendorConfigService.getVendorConfig().catalog.scrapfly?.isAvailable;

    const isAvailable = isAvailableMethod ? isAvailableMethod(content) : true;

    if (!isAvailable) {
      this.logger.warn(
        `Product ${internalProductId} page is 200 but a user can't buy it, archiving it`,
      );
      await this.storeClient.updateProduct(Number(internalProductId), {
        status: ProductStatus.ARCHIVED,
      });
      return;
    }

    this.logger.warn(
      `Product ${internalProductId} is still available for sale`,
    );
  }
}
