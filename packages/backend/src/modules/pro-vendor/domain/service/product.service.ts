import {
  PrismaMainClient,
  ProductStatus,
  SyncStatus,
  VendorProProduct,
} from '@libs/domain/prisma.main.client';
import {
  ProductToUpdate,
  StoredProduct,
  StoredVariant,
  Variant,
} from '@libs/domain/product.interface';
import {
  BAROODERS_NAMESPACE,
  MetafieldType,
  getValidTags,
} from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { getSEOMetafields } from '@libs/helpers/seo.helper';
import {
  IStoreClient,
  VariantToUpdate,
} from '@modules/pro-vendor/domain/ports/store-client';
import {
  SyncLightProduct,
  SyncProduct,
  SyncedVendorProProduct,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { omit, omitBy } from 'lodash';
import { SkippedProductException } from '../exception/skipped-product.exception';

const hasInternalProductId = (
  product: VendorProProduct,
): product is VendorProProduct & { internalProductId: string } => {
  return product.internalProductId !== null;
};

export const getProductStatus = ({ isVisibleInStore }: SyncLightProduct) => {
  return isVisibleInStore ? ProductStatus.ACTIVE : ProductStatus.DRAFT;
};

const TAG_TO_KEEP_KEYS = ['discount'];

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private storeClient: IStoreClient,
    private prisma: PrismaMainClient,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async findByExternalIdAndVendor(
    externalProductId: string,
  ): Promise<VendorProProduct | null> {
    return this.prisma.vendorProProduct.findFirst({
      where: {
        externalProductId,
        vendorSlug: this.vendorConfigService.getVendorConfig().slug,
      },
    });
  }

  async findAll(): Promise<SyncedVendorProProduct[]> {
    const products = await this.prisma.vendorProProduct.findMany({
      where: {
        vendorSlug: this.vendorConfigService.getVendorConfig().slug,
        syncStatus: SyncStatus.ACTIVE,
        internalProductId: { not: null },
      },
    });

    //Note: the following filter is only here to fix Prisma typing
    return products.filter(hasInternalProductId);
  }

  async getProductFromStore(storeId: number): Promise<StoredProduct | null> {
    return this.storeClient.getProduct(storeId);
  }

  async createProduct(product: SyncProduct): Promise<StoredProduct> {
    const vendorSlug = this.vendorConfigService.getVendorConfig().slug;

    const vendorProProduct = await this.prisma.vendorProProduct.create({
      data: {
        internalProductId: null,
        externalProductId: product.external_id,
        syncStatus: SyncStatus.ACTIVE,
        vendorSlug,
      },
    });

    const newProduct = await this.storeClient.createProduct({
      ...product,
      status:
        this.vendorConfigService.getVendorConfig().catalog.common
          ?.defaultPublishedProductStatus ?? getProductStatus(product),
      metafields: [
        {
          key: 'reference_id',
          value: product.external_id,
          type: MetafieldType.SINGLE_LINE_TEXT_FIELD,
          namespace: BAROODERS_NAMESPACE,
        },
      ],
    });
    if (!newProduct) throw new Error('Product not created on store');

    await this.prisma.vendorProProduct.update({
      data: {
        internalProductId: String(newProduct.id),
      },
      where: { id: vendorProProduct.id },
    });

    if (newProduct.variants.length !== product.variants.length) {
      throw new Error(
        `Created product ${newProduct.id} has not the same number of variants as the product from the vendor (${newProduct.variants.length} instead of ${product.variants.length})`,
      );
    }

    let index = 0;
    for (const newVariant of newProduct.variants) {
      await this.prisma.vendorProVariant.create({
        data: {
          externalVariantId: product.variants[index].external_id,
          internalVariantId: String(newVariant.id),
          vendorSlug,
        },
      });
      index++;
    }

    return newProduct;
  }

  async updateProductStatusOnDbOnly(
    dbId: string,
    syncStatus: SyncStatus,
  ): Promise<void> {
    await this.prisma.vendorProProduct.update({
      data: {
        syncStatus,
      },
      where: { id: dbId },
    });
  }

  async updateProductStatusOnStoreOnly(
    storeId: number,
    status: ProductStatus,
  ): Promise<void> {
    await this.storeClient.updateProduct(storeId, { status });
  }

  async archiveProductIfNotInAPI(
    productToUpdate: SyncedVendorProProduct,
  ): Promise<void> {
    const storeId = Number(productToUpdate.internalProductId);

    this.logger.debug(
      `Product (${storeId}) not found vendor (or not mapped properly), archiving on store and DB`,
    );
    await this.updateProductStatusOnDbOnly(
      productToUpdate.id,
      SyncStatus.INACTIVE,
    );
    await this.updateProductStatusOnStoreOnly(storeId, ProductStatus.ARCHIVED);
  }

  async updateProductOnStore(
    mappedProduct: SyncProduct,
    shouldUpdateImages: boolean,
    productFromStore: StoredProduct,
  ): Promise<number> {
    const productStoreId = productFromStore.id;

    await this.updateVariants(mappedProduct, productStoreId, productFromStore);
    await this.updateSEOMetafields(productStoreId, mappedProduct);

    const addUpdate = <MappedType, StoreType>(
      mappedValue: MappedType | undefined,
      storeValue: StoreType,
      compareFunction: (
        mappedValue: MappedType,
        storeValue: StoreType,
      ) => boolean,
      mergeFunction: (
        mappedValue: MappedType,
        storeValue: StoreType,
      ) => MappedType = (v) => v,
    ): unknown | null =>
      mappedValue && compareFunction(mappedValue, storeValue)
        ? mergeFunction(mappedValue, storeValue)
        : null;

    const compareString = (a: string | null, b: string | null) => a !== b;

    const compareTextBlock = (a: string | undefined, b: string | undefined) =>
      (a ?? '').replaceAll('\n', '') !== (b ?? '').replaceAll('\n', '');

    const productUpdates = {
      status: addUpdate(
        getProductStatus(mappedProduct),
        productFromStore.status,
        compareString,
      ),
      body_html: addUpdate(
        mappedProduct.body_html,
        productFromStore.body_html,
        compareTextBlock,
      ),
      title: addUpdate(
        mappedProduct.title,
        productFromStore.title,
        compareString,
      ),
      product_type: addUpdate(
        mappedProduct.product_type,
        productFromStore.product_type,
        compareString,
      ),
      tags: addUpdate(
        getValidTags(mappedProduct.tags),
        getValidTags(productFromStore.tags),
        (tagsNew: string[], tagsOld: string[]) => {
          return (
            this.sortTagsInAlphabeticalOrder(tagsOld) !==
            this.sortTagsInAlphabeticalOrder(tagsNew)
          );
        },
        (tagsNew: string[], tagsOld: string[]) => {
          const tagsToKeep = tagsOld.filter((tag) =>
            TAG_TO_KEEP_KEYS.some((tagToKeepKey) =>
              tag.startsWith(`${tagToKeepKey}:`),
            ),
          );

          return [...tagsToKeep, ...tagsNew];
        },
      ),
      images: addUpdate(
        mappedProduct.images,
        productFromStore.images,
        () =>
          shouldUpdateImages ||
          mappedProduct.images.length !== productFromStore.images.length,
      ),
      GTINCode: addUpdate(
        mappedProduct.GTINCode,
        productFromStore.GTINCode ?? null,
        compareString,
      ),
      EANCode: addUpdate(
        mappedProduct.EANCode,
        productFromStore.EANCode ?? null,
        compareString,
      ),
    };

    const shouldUpdateVendor =
      this.vendorConfigService.getVendorConfig().vendorName !==
      productFromStore.vendor;

    const concreteProductUpdates: ProductToUpdate = {
      ...omitBy(productUpdates, (value) => value === null),
      ...(shouldUpdateVendor
        ? { vendorId: this.vendorConfigService.getVendorConfig().vendorId }
        : {}),
    };

    if (Object.keys(concreteProductUpdates).length > 0) {
      // update product on Shopify
      this.logger.debug(
        `Will update product ${productStoreId} with: ${jsonStringify(
          concreteProductUpdates,
        )}`,
      );
      await this.storeClient.updateProduct(productStoreId, {
        ...concreteProductUpdates,
      });

      return productStoreId;
    }

    throw new SkippedProductException(
      String(productStoreId),
      'No updates to be made',
    );
  }

  private async updateVariants(
    mappedProduct: SyncProduct,
    productStoreId: number,
    productFromStore: StoredProduct,
  ) {
    const internalVariants = await this.prisma.vendorProVariant.findMany({
      where: {
        internalVariantId: {
          in: productFromStore.variants.map(({ id }) => String(id)),
        },
      },
    });
    const variantsToDelete = internalVariants.filter((internalVariant) => {
      return !mappedProduct.variants?.find(
        (variant) => variant.external_id === internalVariant.externalVariantId,
      );
    });

    await Promise.all(
      variantsToDelete.map(async ({ internalVariantId, id }) => {
        await this.storeClient.deleteProductVariant(Number(internalVariantId));
        await this.prisma.vendorProVariant.delete({
          where: { id },
        });
        this.logger.warn(`Deleted outdated variant ${internalVariantId}`);
      }),
    );

    this.logger.debug(jsonStringify({ internalVariants, variantsToDelete }));

    if (!mappedProduct.variants) return;

    const createdVariants = await Promise.all(
      mappedProduct.variants.map(async (variant) => {
        return {
          ...variant,
          internal_id: await this.getOrCreateVariantId(variant, productStoreId), //TODO: we know here which variants already exist
        };
      }),
    );

    this.logger.debug(jsonStringify({ createdVariants }));

    await this.updateVariantsPricesAndQuantities(
      createdVariants,
      productFromStore.variants,
    );
  }

  private async updateSEOMetafields(
    productStoreId: number,
    mappedProduct: SyncProduct,
  ): Promise<void> {
    const newSEOMetafields = await getSEOMetafields(mappedProduct);
    const productFromStoreMetafields =
      await this.storeClient.getProductMetafields(productStoreId);

    if (!Array.isArray(productFromStoreMetafields)) {
      this.logger.error(
        `Could not get metafields for product ${productStoreId}`,
      );
    }

    for (const { key, value, namespace, id } of productFromStoreMetafields) {
      for (const newMetafield of newSEOMetafields) {
        if (key === newMetafield.key && value !== newMetafield.value) {
          await this.storeClient.updateProductMetafieldValue(
            id,
            newMetafield.value,
          );
          this.logger.debug(
            `Updated SEO metafield (${namespace}.${key}) from (${value}) to (${newMetafield.value}) for product ${productStoreId}`,
          );
        }
      }
    }
  }

  private async updateVariantsPricesAndQuantities(
    variantsFromVendor: Variant[],
    variantsFromStore: StoredVariant[],
  ): Promise<void> {
    for (const variantFromVendor of variantsFromVendor) {
      const {
        internal_id,
        price,
        compare_at_price,
        inventory_quantity,
        condition,
      } = variantFromVendor;
      const variantFromStore = variantsFromStore.find(
        (variant) => variant.id === internal_id,
      );
      if (!variantFromStore)
        throw new Error(
          `Could not link variant to shopify variant: ${internal_id}, ${jsonStringify(
            variantsFromStore,
          )}`,
        );
      const newInventoryQuantity = inventory_quantity ?? 0;

      const variantUpdates = {
        price:
          Number(price).toFixed(2) !== variantFromStore.price ? price : null,
        compare_at_price:
          !!compare_at_price &&
          Number(compare_at_price).toFixed(2) !==
            variantFromStore.compare_at_price
            ? compare_at_price
            : null,
        inventory_quantity:
          variantFromStore.inventory_quantity !== newInventoryQuantity
            ? newInventoryQuantity
            : null,
        condition: variantFromStore.condition !== condition ? condition : null,
      };

      const concreteVariantUpdates: VariantToUpdate = omitBy(
        variantUpdates,
        (value) => value === null || value === undefined,
      );

      this.logger.debug(
        jsonStringify({ variantUpdates, concreteVariantUpdates }),
      );

      if (Object.keys(concreteVariantUpdates).length > 0) {
        this.logger.debug(
          `Updating variant ${variantFromStore.id}. Update: ${jsonStringify(
            concreteVariantUpdates,
          )}`,
        );

        await this.storeClient.updateProductVariant(
          variantFromStore.id,
          concreteVariantUpdates,
        );
      }
    }
  }

  async updateProductVariantStock(
    variantId: number,
    newStock: number,
    currentStock?: number,
  ): Promise<void> {
    if (newStock === currentStock) return;

    this.logger.warn(
      `Updating stock for variant ${variantId} from ${currentStock} to ${newStock}`,
    );
    await this.storeClient.updateProductVariant(variantId, {
      inventory_quantity: newStock,
    });
  }

  private sortTagsInAlphabeticalOrder(tags: string[]): string {
    tags.sort((a, b) => {
      const nameA = a.split(':')[0].replace(/\s/g, '');
      const nameB = b.split(':')[0].replace(/\s/g, '');
      return nameA.localeCompare(nameB);
    });
    this.logger.debug(`Sorted: ${tags.join(',')}`);
    return tags.join(',');
  }

  private async getOrCreateVariantId(
    variantFromVendor: Variant,
    productStoreId: number,
  ): Promise<number> {
    const vendorSlug = this.vendorConfigService.getVendorConfig().slug;
    const variantFromDb = await this.prisma.vendorProVariant.findMany({
      where: { externalVariantId: variantFromVendor.external_id, vendorSlug },
    });
    if (variantFromDb.length > 0)
      return Number(variantFromDb[0].internalVariantId);
    let storeVariant = await this.storeClient.getVariantByTitle(
      productStoreId,
      variantFromVendor,
    );
    if (!storeVariant) {
      storeVariant = await this.storeClient.createProductVariant(
        productStoreId,
        omit(variantFromVendor, 'inventory_quantity'),
      );
    }

    await this.prisma.vendorProVariant.create({
      data: {
        externalVariantId: variantFromVendor.external_id,
        internalVariantId: String(storeVariant.id),
        vendorSlug: vendorSlug,
      },
    });

    return storeVariant.id;
  }
}
