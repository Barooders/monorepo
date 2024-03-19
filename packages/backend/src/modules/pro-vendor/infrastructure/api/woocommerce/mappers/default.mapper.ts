import { envName } from '@config/env/env.config';
import { Environments } from '@config/env/types';
import { Condition } from '@libs/domain/prisma.main.client';
import { mapCondition } from '@libs/domain/product.interface';
import { CONDITION_TAG_KEY, DISABLED_VARIANT_OPTION } from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import {
  SyncLightProduct,
  SyncProduct,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { CategoryService } from '@modules/pro-vendor/domain/service/category.service';
import { TagService } from '@modules/pro-vendor/domain/service/tag.service';
import { Injectable, Logger } from '@nestjs/common';
import { head, isString } from 'lodash';
import { WooCommerceProduct, WooCommerceProductVariation } from '../types';
import { WooCommerceClient } from '../woocommerce.client';

@Injectable()
export class WooCommerceDefaultMapper {
  private readonly logger = new Logger(WooCommerceDefaultMapper.name);

  constructor(
    private categoryService: CategoryService,
    private wooCommerceClient: WooCommerceClient,
    private tagService: TagService,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async mapProduct(
    wooCommerceProduct: WooCommerceProduct,
  ): Promise<SyncProduct | null> {
    const productId = wooCommerceProduct.id.toString();
    const metadata = {
      externalId: productId,
      title: wooCommerceProduct.name,
    };

    const { key, name } = this.getCategory(wooCommerceProduct);
    const productType = await this.categoryService.getOrCreateCategory(
      key,
      this.vendorConfigService.getVendorConfig().mappingKey,
      name,
      metadata,
    );
    const stringifyArray = (array: string[]) => {
      if (
        this.vendorConfigService.getVendorConfig().catalog.wooCommerce
          ?.stringifySingleItemArray
      )
        return jsonStringify(array);

      return array.length === 1 ? array[0] : jsonStringify(array);
    };

    const tags = (
      await Promise.all([
        ...wooCommerceProduct.attributes.map(({ id, name, options }) => {
          return this.tagService.getOrCreateTag(
            name,
            stringifyArray(options),
            this.getTagKey(id, name),
            this.vendorConfigService.getVendorConfig().mappingKey,
            metadata,
          );
        }),
        ...(wooCommerceProduct?.meta_data ?? []).map(({ key, value }) => {
          return this.tagService.getOrCreateTag(
            key,
            isString(value) ? value : stringifyArray(value),
            key,
            this.vendorConfigService.getVendorConfig().mappingKey,
            metadata,
          );
        }),
        this.tagService.getOrCreateTag(
          'tags',
          (wooCommerceProduct?.tags ?? []).map(({ slug }) => slug).join('-'),
          'tags',
          this.vendorConfigService.getVendorConfig().mappingKey,
          metadata,
        ),
      ])
    ).flat();

    if (!productType) {
      this.logger.warn(
        `Category ${key} not mapped, skipping product ${productId}`,
      );
      return null;
    }

    const variants = await this.getVariants(wooCommerceProduct);
    const productCondition = this.getProductCondition(wooCommerceProduct, tags);
    const productImages = this.getProductImages(wooCommerceProduct);

    return {
      ...(await this.mapLightProduct(wooCommerceProduct)),
      body_html: this.getDescription(wooCommerceProduct),
      product_type: productType,
      tags: tags.flatMap((f) => (f ? [f] : [])),
      variants: variants.map((variant) => ({
        ...variant,
        condition: productCondition,
      })),
      images: productImages,
    };
  }

  async mapLightProduct({
    id,
    name,
    status,
  }: WooCommerceProduct): Promise<SyncLightProduct> {
    return {
      external_id: id.toString(),
      title: name,
      isVisibleInStore: !status || status === 'publish',
    };
  }

  getProductCondition(
    _wooCommerceProduct: WooCommerceProduct,
    tags: string[],
  ): Condition {
    const tagsObject = getTagsObject(tags);

    return mapCondition(head(tagsObject[CONDITION_TAG_KEY]));
  }

  computeProductConditionTagFromCategories(
    { categories }: WooCommerceProduct,
    hints: string[],
    usedCondition?: Condition,
  ): Condition {
    const categoryName = categories
      .map(({ name }) => name)
      .join(' - ')
      .toLowerCase();

    if (hints.some((hint) => categoryName.includes(hint)))
      return usedCondition ?? Condition.VERY_GOOD;

    return Condition.AS_NEW;
  }

  getDescription(wooCommerceProduct: WooCommerceProduct): string {
    return wooCommerceProduct.description;
  }

  getTagKey(id: number, _name: string): string {
    return id.toString();
  }

  getCategory(wooCommerceProduct: WooCommerceProduct): {
    key: string;
    name: string;
  } {
    return {
      key: wooCommerceProduct.categories.map(({ id }) => id).join('/'),
      name: wooCommerceProduct.categories.map(({ name }) => name).join(' - '),
    };
  }

  async getVariants(
    wooCommerceProduct: WooCommerceProduct,
  ): Promise<SyncProduct['variants']> {
    if (
      this.vendorConfigService.getVendorConfig().catalog.wooCommerce
        ?.mapSingleVariant
    ) {
      return this.getSingleVariant(wooCommerceProduct);
    }

    return this.getMultipleVariants(wooCommerceProduct);
  }

  private getSingleVariant({
    id,
    name,
    price,
    regular_price,
    purchasable,
    stock_quantity,
  }: WooCommerceProduct): SyncProduct['variants'] {
    return [
      {
        external_id: id.toString(),
        price,
        sku: `${id.toString()}${
          envName === Environments.LOCAL ? '-local' : ''
        }`,
        inventory_quantity: this.getVariantQuantity(
          { name, purchasable },
          stock_quantity,
        ),
        compare_at_price: regular_price,
        condition: Condition.GOOD, //Replaced in parent method
        optionProperties: [
          {
            key: DISABLED_VARIANT_OPTION,
            value: DISABLED_VARIANT_OPTION,
          },
        ],
      },
    ];
  }

  async getMultipleVariants(
    wooCommerceProduct: WooCommerceProduct,
  ): Promise<SyncProduct['variants']> {
    if (wooCommerceProduct.variations.length === 0) {
      return this.getSingleVariant(wooCommerceProduct);
    }

    const productVariations = (
      await Promise.all(
        wooCommerceProduct.variations.map((variationId) => {
          return this.wooCommerceClient.getProductVariation(
            wooCommerceProduct.id,
            variationId,
          );
        }),
      )
    ).filter((v) => v !== null) as WooCommerceProductVariation[];

    const shouldUseProductPrice = (variant: WooCommerceProductVariation) =>
      ['', '0'].includes(variant.price);

    return productVariations.map((variant) => ({
      external_id: String(variant.id),
      price: shouldUseProductPrice(variant)
        ? wooCommerceProduct.price
        : variant.price,
      sku: `${wooCommerceProduct.slug}-${variant.id}`,
      compare_at_price: shouldUseProductPrice(variant)
        ? wooCommerceProduct.regular_price
        : variant.regular_price,
      inventory_quantity: this.getVariantQuantity(
        wooCommerceProduct,
        variant.stock_quantity,
      ),
      condition: Condition.GOOD, //Replaced in parent method
      optionProperties: variant.attributes.map(({ name, option }) => {
        return {
          key: name,
          value: option,
        };
      }),
    }));
  }

  getVariantQuantity(
    { purchasable }: { purchasable?: boolean; name: string },
    variantQuantity: number | null,
  ): number {
    if (purchasable === false) return 0;

    return variantQuantity ?? 0;
  }

  getProductImages(wooCommerceProduct: WooCommerceProduct): { src: string }[] {
    return wooCommerceProduct.images.map(({ src }) => {
      return { src };
    });
  }
}
