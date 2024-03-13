import { BrandFilterAction } from '@config/vendor/types';
import { Variant } from '@libs/domain/product.interface';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import { ITranslator } from '@modules/pro-vendor/domain/ports/translator';
import {
  BIKE_PRODUCT_TYPES,
  SyncProduct,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { head } from 'lodash';
import { SkippedProductException } from '../exception/skipped-product.exception';
import { TagService } from './tag.service';

const getMultiplierFromCommission = (commission: number) =>
  1 + commission / (100 - commission);

@Injectable()
export class ProductMapper {
  private readonly logger = new Logger(ProductMapper.name);

  constructor(
    private tagService: TagService,
    private translator: ITranslator,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async applyGenericRulesOnMappedProduct(
    mappedProduct: SyncProduct,
  ): Promise<SyncProduct> {
    const catalogFeatures =
      this.vendorConfigService.getVendorConfig().catalog.common;
    let productDescription =
      catalogFeatures?.defaultDescription ?? mappedProduct.body_html;

    const tags = mappedProduct.tags;
    const mappedTagsObject = getTagsObject(tags);

    for (const variant of mappedProduct.variants) {
      const variantMutiplier =
        getMultiplierFromCommission(
          catalogFeatures?.commissionPercentToAdd ?? 0,
        ) * (catalogFeatures?.priceMultiplier ?? 1);
      const priceCorrection = catalogFeatures?.priceCorrection ?? 0;

      variant.price = (
        Number(variant.price) * variantMutiplier +
        priceCorrection
      ).toFixed(2);

      for (const { key, value } of variant.optionProperties) {
        if (!variant.inventory_quantity) continue;

        const suffix =
          catalogFeatures?.variantOptionTagsWithCategorySuffix?.includes(
            key.toLowerCase(),
          )
            ? mappedProduct.product_type.toLowerCase().replaceAll(' ', '-')
            : '';
        const tagKey = `variant-option-${key.toLowerCase()}-${suffix}`;
        const variantOptionTag = await this.tagService.getOrCreateTag(
          tagKey,
          value,
          tagKey,
          this.vendorConfigService.getVendorConfig().mappingKey,
          {
            externalId: mappedProduct.external_id,
            title: mappedProduct.title,
          },
        );

        tags.push(...variantOptionTag);
      }
    }

    if (catalogFeatures?.translateDescription) {
      const translatedDescription = await this.translator.translate(
        mappedProduct.body_html,
      );

      if (translatedDescription) {
        productDescription = translatedDescription;
      }
    }

    if (catalogFeatures?.showExternalIdInDescription) {
      productDescription = `Référence: ${mappedProduct.external_id}\n${productDescription}`;
    }

    const descriptionPrefix = catalogFeatures?.descriptionPrefix ?? '';
    const descriptionSuffix = catalogFeatures?.descriptionSuffix ?? '';
    productDescription = `${descriptionPrefix}${productDescription}${descriptionSuffix}`;

    const desiredParsedKeys = catalogFeatures?.parsedTagKeysFromDescription;

    if (desiredParsedKeys) {
      const tagsFromDescription = await this.tagService.parseTextAndCreateTags(
        desiredParsedKeys,
        `${mappedProduct.title} - ${mappedProduct.body_html}`,
        this.vendorConfigService.getVendorConfig().mappingKey,
        {
          externalId: mappedProduct.external_id,
          title: mappedProduct.title,
        },
      );
      tags.push(...tagsFromDescription);
    }

    if (
      catalogFeatures?.excludedTitles?.some((excludedTitle) =>
        mappedProduct.title.toLowerCase().includes(excludedTitle.toLowerCase()),
      )
    ) {
      throw new SkippedProductException(
        mappedProduct.external_id,
        'Product title is excluded',
      );
    }

    if (
      BIKE_PRODUCT_TYPES.includes(mappedProduct.product_type.toLowerCase()) &&
      !mappedTagsObject.genre
    ) {
      tags.push('genre:Mixte');
    }

    const productBrand = head(mappedTagsObject.marque)?.toLowerCase();
    const brandNames = catalogFeatures?.brandFilter?.names ?? [];
    const action = catalogFeatures?.brandFilter?.action;
    this.logger.debug({ productBrand, brandNames, action });

    if (
      action === BrandFilterAction.EXCLUDE &&
      productBrand &&
      brandNames.includes(productBrand)
    ) {
      throw new SkippedProductException(
        mappedProduct.external_id,
        `Brand ${productBrand} is excluded`,
      );
    }

    if (
      action === BrandFilterAction.ONLY &&
      productBrand &&
      !brandNames.includes(productBrand)
    ) {
      throw new SkippedProductException(
        mappedProduct.external_id,
        `Brand ${productBrand} is not allowed for this vendor`,
      );
    }

    if (
      catalogFeatures?.shouldIgnoreCheapBikesBelow150 === true &&
      mappedProduct.variants.some((variant) => Number(variant.price) < 150) &&
      BIKE_PRODUCT_TYPES.includes(mappedProduct.product_type.toLowerCase())
    ) {
      throw new SkippedProductException(
        mappedProduct.external_id,
        'Product is too cheap to be shipped',
      );
    }

    const minimalPriceInCents = catalogFeatures?.minimalPriceInCents;

    if (
      minimalPriceInCents &&
      mappedProduct.variants.some(
        (variant) => Number(variant.price) * 100 < minimalPriceInCents,
      )
    ) {
      throw new SkippedProductException(
        mappedProduct.external_id,
        'Product is too cheap to be synced',
      );
    }

    const filteredVariants = mappedProduct.variants
      .filter(({ optionProperties }: Variant) => {
        const ignoredVariants = catalogFeatures?.ignoredVariants ?? [];

        return !ignoredVariants.some((ignoredVariant) => {
          return optionProperties.some(({ value }) =>
            value.toLowerCase().includes(ignoredVariant.toLowerCase()),
          );
        });
      })
      .filter(({ price, compare_at_price }) => {
        const minimumDiscount = catalogFeatures?.minimumDiscount;

        if (!minimumDiscount) return true;
        if (!compare_at_price) return false;

        return Number(price) < Number(compare_at_price) * (1 - minimumDiscount);
      });

    const defaultProductCondition = catalogFeatures?.defaultProductCondition;

    return {
      ...mappedProduct,
      variants: filteredVariants.map((variant) => ({
        ...variant,
        ...(defaultProductCondition && { condition: defaultProductCondition }),
      })),
      isVisibleInStore:
        filteredVariants.length === 0 ? false : mappedProduct.isVisibleInStore,
      body_html: productDescription,
      tags: tags.map((tag) => tag.replace(',', '.')),
    };
  }
}
