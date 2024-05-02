import {
  ProductStatus,
  SyncStatus,
  VendorProProduct,
} from '@libs/domain/prisma.main.client';
import { StoredProduct } from '@libs/domain/product.interface';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { CreatedProductException } from './exception/created-product.exception';
import { SkippedProductException } from './exception/skipped-product.exception';
import { UpdatedProductException } from './exception/updated-product.exception';
import {
  SkippedProduct,
  SyncLightProduct,
  SyncOutput,
  SyncProduct,
  VendorProduct,
} from './ports/types';
import { IVendorConfigService } from './ports/vendor-config.service';
import { IVendorProductServiceProvider } from './ports/vendor-product-service.provider';
import { ProductMapper } from './service/product.mapper';
import { ProductService, getProductStatus } from './service/product.service';

export enum SynchroEvent {
  PRODUCTS_UPDATED = 'PRODUCTS_UPDATED',
  PRODUCT_STATUS_UPDATED = 'PRODUCT_STATUS_UPDATED',
  ADD_STATUS_UPDATES_TO_QUEUE = 'ADD_STATUS_UPDATES_TO_QUEUE',
}

@Injectable()
export class ProductSyncService {
  private readonly logger = new Logger(ProductSyncService.name);

  constructor(
    private productService: ProductService,
    private productMapper: ProductMapper,
    private readonly vendorConfigService: IVendorConfigService,
    private readonly vendorProductServiceProvider: IVendorProductServiceProvider,
  ) {}

  async syncDatabaseWithVendorProducts(
    sinceDate: Date | null | undefined,
    productIdsFilter: string[] = [],
    shouldUpdateImages = false,
  ): Promise<SyncOutput> {
    await this.checkIfApiIsUp();

    const createdProductIds: string[] = [];
    const updatedProductIds: string[] = [];
    const failedProductIds: string[] = [];
    const skippedProducts: SkippedProduct[] = [];

    if (!this.vendorConfigService.getVendorConfig().slug)
      throw new Error('Vendor not found');

    const productsFromVendor = await this.getProductsFromVendor(
      sinceDate,
      productIdsFilter,
    );

    for (const productFromVendor of productsFromVendor) {
      const lightProduct = await this.vendorProductServiceProvider
        .getService()
        .mapLightProduct(productFromVendor);
      const externalId = lightProduct.external_id;

      this.logger.debug(`Working on product ${jsonStringify(lightProduct)}`);

      try {
        const vendorProductFromDb =
          await this.productService.findByExternalIdAndVendor(externalId);

        this.throwIfProductInDbNotLinkedToInternalProduct(vendorProductFromDb);
        this.skipInactiveVendorProductUnknownFromUs(
          lightProduct,
          vendorProductFromDb,
        );

        const storeId = Number(vendorProductFromDb?.internalProductId);
        const productFromStore = storeId
          ? await this.productService.getProductFromStore(storeId)
          : null;
        const isArchivedOnStore =
          productFromStore?.status === ProductStatus.ARCHIVED;
        const wasSyncActive =
          vendorProductFromDb?.syncStatus === SyncStatus.ACTIVE;

        await this.setProductInDraftIfNotVisibleInVendor(
          lightProduct,
          storeId,
          !productFromStore || isArchivedOnStore,
        );

        const mappedProduct = await this.mapExternalProduct(
          productFromVendor,
          externalId,
        );

        if (!vendorProductFromDb) {
          const newProduct =
            await this.productService.createProduct(mappedProduct);
          throw new CreatedProductException(newProduct.shopifyId);
        }

        if (!productFromStore) {
          throw new SkippedProductException(
            mappedProduct.external_id,
            'Product is missing in store',
          );
        }

        if (wasSyncActive && isArchivedOnStore) {
          throw new SkippedProductException(
            storeId.toString(),
            'Active product in DB is archived in store',
          );
        }

        if (
          !this.vendorConfigService.getVendorConfig().catalog.common
            ?.skipProductUpdate
        ) {
          await this.updateProduct(
            mappedProduct,
            vendorProductFromDb,
            productFromStore,
            wasSyncActive,
            shouldUpdateImages,
          );
        }
      } catch (e: any) {
        if (e instanceof SkippedProductException) {
          this.logger.debug(
            `Skipped product (${e.productId}) because: ${e.message}`,
          );
          skippedProducts.push({ id: e.productId, reason: e.message });
        } else if (e instanceof UpdatedProductException) {
          this.logger.debug(`Updated product (${e.productId})`);
          updatedProductIds.push(String(e.productId));
        } else if (e instanceof CreatedProductException) {
          this.logger.debug(`Created product (${e.productId})`);
          createdProductIds.push(String(e.productId));
        } else {
          this.logger.error(
            `Failed to sync product with error: ${e.message}`,
            e,
          );
          Sentry.captureException(e, {
            tags: {
              eventName: SynchroEvent.PRODUCTS_UPDATED,
              vendorSlug: this.vendorConfigService.getVendorConfig().slug,
            },
          });
          failedProductIds.push(lightProduct.external_id);
        }
      }
    }

    return {
      payload: {
        createdProductIds,
        updatedProductIds,
        failedProductIds,
        skippedProducts,
      },
      metadata: {
        vendorProductsCount: productsFromVendor.length,
      },
    };
  }

  private async checkIfApiIsUp(): Promise<void> {
    try {
      if (await this.vendorProductServiceProvider.getService().isUp()) return;

      throw new Error(
        `${
          this.vendorConfigService.getVendorConfig().slug
        } API returned no products!`,
      );
    } catch (error: any) {
      throw new Error(
        `[${
          this.vendorConfigService.getVendorConfig().slug
        }] Vendor API looks down because: ${error.message}`,
      );
    }
  }

  private async mapExternalProduct(
    productFromVendor: VendorProduct,
    externalId: string,
  ): Promise<SyncProduct> {
    const baseMappedProduct = await this.vendorProductServiceProvider
      .getService()
      .mapProduct(productFromVendor);

    if (!baseMappedProduct) {
      throw new SkippedProductException(
        externalId,
        'Product was not mapped properly',
      );
    }

    return await this.productMapper.applyGenericRulesOnMappedProduct(
      baseMappedProduct,
    );
  }

  private async getProductsFromVendor(
    sinceDate: Date | null | undefined,
    productIdsFilter: string[],
  ) {
    let productsFromVendor: VendorProduct[] = [];

    this.logger.debug(
      `Fetching products from vendor: ${jsonStringify({
        productIdsFilter,
        sinceDate,
      })}`,
    );

    if (productIdsFilter.length > 0) {
      productsFromVendor = (
        await Promise.all(
          productIdsFilter.map((productId) =>
            this.vendorProductServiceProvider
              .getService()
              .getProductById(productId),
          ),
        )
      ).filter((product) => !!product) as VendorProduct[];
    } else {
      productsFromVendor = await this.vendorProductServiceProvider
        .getService()
        .getAllVendorProducts(sinceDate);
    }

    if (!productsFromVendor) throw new Error('No products found on vendor!');

    this.logger.warn(
      `▶️ Found ${productsFromVendor.length} new products on vendor`,
    );

    return productsFromVendor;
  }

  private throwIfProductInDbNotLinkedToInternalProduct(
    vendorProductFromDb: VendorProProduct | null,
  ) {
    if (!vendorProductFromDb || vendorProductFromDb.internalProductId) return;

    throw new Error(
      `Product id: ${vendorProductFromDb.id}, externalId: ${vendorProductFromDb.externalProductId}} is missing internalProductId`,
    );
  }

  private skipInactiveVendorProductUnknownFromUs(
    lightProduct: SyncLightProduct,
    vendorProductFromDb: VendorProProduct | null,
  ) {
    if (vendorProductFromDb || lightProduct.isVisibleInStore) return;

    throw new SkippedProductException(
      lightProduct.external_id,
      'Product is not active in vendor',
    );
  }

  private async updateProduct(
    mappedProduct: SyncProduct,
    vendorProductFromDb: VendorProProduct,
    productFromStore: StoredProduct,
    wasSyncActive: boolean,
    shouldUpdateImages: boolean,
  ) {
    if (!wasSyncActive) {
      this.logger.warn(
        `Product ${productFromStore.shopifyId} sync is not active but product is active in vendor API`,
      );

      await this.productService.updateProductStatusOnDbOnly(
        vendorProductFromDb.id,
        SyncStatus.ACTIVE,
      );
    }

    const updatedProductId = await this.productService.updateProductOnStore(
      mappedProduct,
      shouldUpdateImages,
      productFromStore,
    );
    throw new UpdatedProductException(updatedProductId);
  }

  private async setProductInDraftIfNotVisibleInVendor(
    lightProduct: SyncLightProduct,
    storeId: number,
    isArchivedOrMissingInOurStore: boolean,
  ): Promise<void> {
    if (lightProduct.isVisibleInStore) return;

    if (isArchivedOrMissingInOurStore) {
      throw new SkippedProductException(
        lightProduct.external_id,
        'Product is already archived or missing in store',
      );
    }

    await this.productService.updateProductStatusOnStoreOnly(
      storeId,
      getProductStatus(lightProduct),
    );

    throw new UpdatedProductException(storeId);
  }
}
