import {
  PrismaMainClient,
  ProductStatus,
  SyncStatus,
  VendorProProduct,
} from '@libs/domain/prisma.main.client';
import { ProductToUpdate, Variant } from '@libs/domain/product.interface';
import {
  BAROODERS_NAMESPACE,
  MetafieldType,
  getValidTags,
} from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { getSEOMetafields } from '@libs/helpers/seo.helper';
import {
  IStoreClient,
  ProductFromStore,
  VariantFromStore,
} from '@modules/pro-vendor/domain/ports/store-client';
import {
  SyncLightProduct,
  SyncProduct,
  SyncedVendorProProduct,
  VariantToUpdate,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { omit, omitBy } from 'lodash';
import { SkippedProductException } from '../exception/skipped-product.exception';

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
    return await this.prisma.vendorProProduct.findFirst({
      where: {
        externalProductId,
        vendorSlug: this.vendorConfigService.getVendorConfig().slug,
      },
    });
  }

  async findAll(): Promise<SyncedVendorProProduct[]> {
    return await this.prisma.vendorProProduct.findMany({
      where: {
        vendorSlug: this.vendorConfigService.getVendorConfig().slug,
        syncStatus: SyncStatus.ACTIVE,
      },
    });
  }

  async getProductFromStore(
    productInternalId: string,
  ): Promise<ProductFromStore | null> {
    return await this.storeClient.getProduct(productInternalId);
  }

  async createProduct(product: SyncProduct): Promise<string> {
    const vendorSlug = this.vendorConfigService.getVendorConfig().slug;

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

    await this.prisma.vendorProProduct.create({
      data: {
        internalId: newProduct.internalId,
        externalProductId: product.external_id,
        syncStatus: SyncStatus.ACTIVE,
        vendorSlug,
      },
    });

    if (newProduct.variants.length !== product.variants.length) {
      throw new Error(
        `Created product ${newProduct.internalId} has not the same number of variants as the product from the vendor (${newProduct.variants.length} instead of ${product.variants.length})`,
      );
    }

    let index = 0;
    for (const newVariant of newProduct.variants) {
      await this.prisma.vendorProVariant.create({
        data: {
          externalVariantId: product.variants[index].external_id,
          internalId: newVariant.internalId,
          vendorSlug,
        },
      });
      index++;
    }

    return newProduct.internalId;
  }

  async updateProductStatusOnDbOnly(
    productInternalId: string,
    syncStatus: SyncStatus,
  ): Promise<void> {
    await this.prisma.vendorProProduct.update({
      data: {
        syncStatus,
      },
      where: { internalId: productInternalId },
    });
  }

  async updateProductStatusOnStoreOnly(
    productInternalId: string,
    status: ProductStatus,
  ): Promise<void> {
    await this.storeClient.updateProduct(productInternalId, { status });
  }

  async archiveProductIfNotInAPI({
    internalId,
  }: SyncedVendorProProduct): Promise<void> {
    this.logger.debug(
      `Product (${internalId}) not found vendor (or not mapped properly), archiving on store and DB`,
    );
    await this.updateProductStatusOnDbOnly(internalId, SyncStatus.INACTIVE);
    await this.updateProductStatusOnStoreOnly(
      internalId,
      ProductStatus.ARCHIVED,
    );
  }

  async updateProductOnStore(
    mappedProduct: SyncProduct,
    shouldUpdateImages: boolean,
    productFromStore: ProductFromStore,
  ): Promise<string> {
    const productInternalId = productFromStore.internalId;

    await this.updateVariants(
      mappedProduct,
      productInternalId,
      productFromStore,
    );
    await this.updateSEOMetafields(productInternalId, mappedProduct);

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
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
        `Will update product ${productInternalId} with: ${jsonStringify(
          concreteProductUpdates,
        )}`,
      );
      await this.storeClient.updateProduct(productInternalId, {
        ...concreteProductUpdates,
      });

      return productInternalId;
    }

    throw new SkippedProductException(
      String(productInternalId),
      'No updates to be made',
    );
  }

  private async updateVariants(
    mappedProduct: SyncProduct,
    productInternalId: string,
    productFromStore: ProductFromStore,
  ) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!mappedProduct.variants || mappedProduct.variants.length === 0) return;

    const createdVariants = await Promise.all(
      mappedProduct.variants.map(async (variant) => {
        return {
          ...variant,
          internalId: await this.getOrCreateVariantId(
            variant,
            productInternalId,
          ), //TODO: we know here which variants already exist
        };
      }),
    );

    this.logger.debug(jsonStringify({ createdVariants }));

    await this.updateVariantsPricesAndQuantities(
      createdVariants,
      productFromStore.variants,
    );

    const internalVariants = await this.prisma.vendorProVariant.findMany({
      where: {
        internalId: {
          in: productFromStore.variants.map(({ internalId }) => internalId),
        },
      },
    });
    const variantsToDelete = internalVariants.filter((internalVariant) => {
      return !mappedProduct.variants?.find(
        (variant) => variant.external_id === internalVariant.externalVariantId,
      );
    });

    await Promise.all(
      variantsToDelete.map(async ({ internalId }) => {
        await this.storeClient.deleteProductVariant(internalId);
        await this.prisma.vendorProVariant.delete({
          where: { internalId },
        });
        this.logger.warn(`Deleted outdated variant ${internalId}`);
      }),
    );

    this.logger.debug(jsonStringify({ internalVariants, variantsToDelete }));
  }

  private async updateSEOMetafields(
    productInternalId: string,
    mappedProduct: SyncProduct,
  ): Promise<void> {
    const newSEOMetafields = await getSEOMetafields(mappedProduct);
    const productFromStoreMetafields =
      await this.storeClient.getProductMetafields(productInternalId);

    if (!Array.isArray(productFromStoreMetafields)) {
      this.logger.error(
        `Could not get metafields for product ${productInternalId}`,
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
            `Updated SEO metafield (${namespace}.${key}) from (${value}) to (${newMetafield.value}) for product ${productInternalId}`,
          );
        }
      }
    }
  }

  private async updateVariantsPricesAndQuantities(
    variantsFromVendor: VariantToUpdate[],
    variantsFromStore: VariantFromStore[],
  ): Promise<void> {
    for (const variantFromVendor of variantsFromVendor) {
      const {
        internalId,
        price,
        compare_at_price,
        inventory_quantity,
        condition,
      } = variantFromVendor;
      const variantFromStore = variantsFromStore.find(
        (variant) => variant.internalId === internalId,
      );
      if (!variantFromStore)
        throw new Error(
          `Could not link variant to shopify variant: ${internalId}, ${jsonStringify(
            variantsFromStore,
          )}`,
        );
      const newInventoryQuantity = inventory_quantity ?? 0;

      const variantUpdates = {
        price:
          Number(price).toFixed(2) !== variantFromStore.price ? price : null,
        compare_at_price:
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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

      const concreteVariantUpdates: Omit<VariantToUpdate, 'internalId'> =
        omitBy(
          variantUpdates,
          (value) => value === null || value === undefined,
        );

      this.logger.debug(
        jsonStringify({ variantUpdates, concreteVariantUpdates }),
      );

      if (Object.keys(concreteVariantUpdates).length > 0) {
        this.logger.debug(
          `Updating variant ${variantFromStore.internalId}. Update: ${jsonStringify(
            concreteVariantUpdates,
          )}`,
        );

        await this.storeClient.updateProductVariant({
          internalId: variantFromStore.internalId,
          ...concreteVariantUpdates,
        });
      }
    }
  }

  async updateProductVariantStock(
    variantInternalId: string,
    newStock: number,
    currentStock?: number,
  ): Promise<void> {
    if (newStock === currentStock) return;

    this.logger.warn(
      `Updating stock for variant ${variantInternalId} from ${currentStock} to ${newStock}`,
    );
    await this.storeClient.updateProductVariant({
      internalId: variantInternalId,
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
    productInternalId: string,
  ): Promise<string> {
    const vendorSlug = this.vendorConfigService.getVendorConfig().slug;
    const variantFromDb = await this.prisma.vendorProVariant.findMany({
      where: { externalVariantId: variantFromVendor.external_id, vendorSlug },
    });
    if (variantFromDb.length > 0) return variantFromDb[0].internalId;
    let variantInternalId = await this.storeClient.getVariantByTitle(
      productInternalId,
      variantFromVendor,
    );
    if (variantInternalId === null) {
      variantInternalId = await this.storeClient.createProductVariant(
        productInternalId,
        omit(variantFromVendor, 'inventory_quantity'),
      );
    }

    await this.prisma.vendorProVariant.create({
      data: {
        externalVariantId: variantFromVendor.external_id,
        internalId: variantInternalId,
        vendorSlug: vendorSlug,
      },
    });

    return variantInternalId;
  }
}
