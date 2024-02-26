import { Condition, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { mapCondition, Variant } from '@libs/domain/product.interface';
import {
  BAROODERS_NAMESPACE,
  CONDITION_TAG_KEY,
  DISABLED_VARIANT_OPTION,
  MetafieldType,
} from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import {
  SyncLightProduct,
  SyncProduct,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import {
  FirstProductMapped,
  TagService,
} from '@modules/pro-vendor/domain/service/tag.service';
import { Injectable, Logger } from '@nestjs/common';
import { head } from 'lodash';
import { TranslatedValue } from '../dto/prestashop-product-features.dto';
import {
  Categories,
  Combinations,
  ProductDTO,
  ProductFeature,
  StockAvailables,
} from '../dto/prestashop-product.dto';
import { StockAvailableDTO } from '../dto/prestashop-stock-available.dto';
import { PrestashopClient } from '../prestashop.client';

@Injectable()
export class PrestashopDefaultMapper {
  protected readonly logger = new Logger(PrestashopDefaultMapper.name);

  constructor(
    private prestashopClient: PrestashopClient,
    private tagService: TagService,
    private readonly vendorConfigService: IVendorConfigService,
    private prisma: PrismaMainClient,
  ) {}

  private async getProductImages({
    images,
    productId,
  }: {
    images?: { id?: string }[];
    productId?: number;
  }): Promise<{ attachment: string }[]> {
    if (!images || images.length === 0 || !productId) {
      return [];
    }

    const imageLimit = 5;

    return (
      await Promise.all(
        images.slice(0, imageLimit).map(async ({ id: imageId }) => {
          return {
            attachment: await this.prestashopClient.getProductImage(
              `${productId}/${imageId}`,
            ),
          };
        }),
      )
    ).filter(({ attachment }) => !!attachment) as { attachment: string }[];
  }

  private async generateTags(
    tagValueMetadata: FirstProductMapped,
    product_features?: ProductFeature[],
  ): Promise<string[]> {
    try {
      const tags: string[] = [];

      if (!product_features || product_features.length === 0) {
        return tags;
      }

      for (const product_feature of product_features) {
        if (
          !product_feature.id ||
          !product_feature.id_feature_value ||
          product_feature.id === '0'
        ) {
          continue;
        }

        const productFeature = {
          id: product_feature.id.toString(),
          id_feature_value: product_feature.id_feature_value.toString(),
        };

        const trimmedTagKey = productFeature.id.trim();
        const trimmedTagValueKey = productFeature.id_feature_value.trim();

        const tagName = await this.prisma.vendorProTagMapping.findMany({
          where: {
            externalTagId: trimmedTagKey,
            mappingKey: this.vendorConfigService.getVendorConfig().mappingKey,
          },
        });

        const tagValue = await this.prisma.vendorProTagValueMapping.findMany({
          where: {
            externalTagValueId: trimmedTagValueKey,
            mappingKey: this.vendorConfigService.getVendorConfig().mappingKey,
          },
        });

        const hasMappedTagName =
          tagName.length > 0 && tagName[0].internalTagName;
        const hasMappedTagValue =
          tagValue.length > 0 && tagValue[0].internalTagValue;

        if (hasMappedTagName && hasMappedTagValue) {
          tags.push(
            `${tagName[0].internalTagName}:${tagValue[0].internalTagValue}`,
          );
          continue;
        }

        if (hasMappedTagName && tagName[0].useDefaultTagValues) {
          const productFeatureValues =
            await this.prestashopClient.getProductFeatureValues(
              productFeature.id_feature_value,
            );
          if (!productFeatureValues || !productFeatureValues.value) continue;
          tags.push(
            `${tagName[0].internalTagName}:${this.getSingleValue(
              productFeatureValues.value,
            )}`,
          );
          continue;
        }

        const productFeatures = await this.prestashopClient.getProductFeatures(
          productFeature.id,
        );

        if (!productFeatures || !productFeatures.name) {
          continue;
        }

        const externalTagName = this.getSingleValue(productFeatures.name);

        if (tagValue.length === 0) {
          const productFeatureValues =
            await this.prestashopClient.getProductFeatureValues(
              productFeature.id_feature_value,
            );

          if (!productFeatureValues || !productFeatureValues.value) {
            continue;
          }

          await this.prisma.vendorProTagValueMapping.create({
            data: {
              externalTagValueId: trimmedTagValueKey,
              externalTagName,
              externalTagValue: this.getSingleValue(productFeatureValues.value),
              mappingKey: this.vendorConfigService.getVendorConfig().mappingKey,
              metadata: tagValueMetadata,
            },
          });
        }

        if (tagName.length === 0) {
          await this.prisma.vendorProTagMapping.create({
            data: {
              externalTagId: trimmedTagKey,
              externalTagName,
              mappingKey: this.vendorConfigService.getVendorConfig().mappingKey,
            },
          });
        }
      }

      return tags;
    } catch (error: any) {
      this.logger.error(error.message, error);
      return [];
    }
  }

  public async generateSingleTag(tagKey: string, tagValue: string, mappingMetadata: FirstProductMapped): Promise<string[]> {
   return this.tagService.getOrCreateTag(
      'Brand',
      tagValue,
      tagKey,
      this.vendorConfigService.getVendorConfig().mappingKey,
      mappingMetadata,
    );
  }

  public async getExtraTags(_productTitle: string, mappingMetadata: FirstProductMapped):Promise<string[]>{
    return [];
  }

  private async createCategory(
    categoriesSorted: number[],
    categoriesKey: string,
    mappingMetadata: FirstProductMapped,
  ): Promise<null> {
    const categoriesNames = [];

    for (const category of categoriesSorted) {
      const categoryData = await this.prestashopClient.getCategory(
        String(category),
      );
      if (categoryData) {
        const { name } = categoryData;
        categoriesNames.push(this.getSingleValue(name));
      }
    }

    await this.prisma.vendorProCategoryMapping.create({
      data: {
        externalCategoryName: categoriesNames.join('/'),
        externalCategoryId: categoriesKey.trim(),
        mappingKey: this.vendorConfigService.getVendorConfig().mappingKey,
        metadata: mappingMetadata,
      },
    });

    return null;
  }

  private getSingleValue = (value: string | TranslatedValue[]) => {
    if (!Array.isArray(value)) return value;

    const languageId =
      this.vendorConfigService.getVendorConfig().catalog?.externalLanguageId;

    if (!languageId) return value[0].value;

    return value.find(({ id }) => id === languageId)?.value ?? value[0].value;
  };

  private async getProductTypeFromCategories(
    categories: Categories[],
    mappingMetadata: FirstProductMapped,
  ): Promise<string | null> {
    const categoriesSorted = categories
      .map((category) => category.id)
      .sort((a, b) => a - b);

    const categoryKey = this.getCategoryKey(
      categoriesSorted,
      mappingMetadata.title,
    );

    const existingCategories =
      await this.prisma.vendorProCategoryMapping.findMany({
        where: {
          externalCategoryId: categoryKey.trim(),
          mappingKey: this.vendorConfigService.getVendorConfig().mappingKey,
        },
      });

    if (existingCategories.length > 0) {
      return (
        existingCategories
          .find((category) => category.internalCategoryName)
          ?.internalCategoryName?.trim() ?? null
      );
    }

    return this.createCategory(categoriesSorted, categoryKey, mappingMetadata);
  }

  getCategoryKey(categoriesSorted: number[], _productTitle: string) {
    return categoriesSorted.join('/');
  }

  private async getFormattedVariants(
    product: ProductDTO,
    {
      combinations,
      stock_availables,
    }: {
      combinations: Combinations[];
      stock_availables: StockAvailables[];
    },
  ) {
    const variants: Variant[] = [];

    for (const combination of combinations) {
      const { id } = combination;
      if (!id) continue;

      const combinationData = await this.prestashopClient.getCombination(id);

      if (!combinationData) continue;

      const product_option_values =
        combinationData?.associations?.product_option_values ?? [];

      const variantOptions = await Promise.all(
        product_option_values.map(async ({ id }) => {
          if (!id) return null;

          const optionValueData =
            await this.prestashopClient.getProductOptionValues(id);

          if (!optionValueData || !optionValueData.name) return null;

          const optionData = await this.prestashopClient.getProductOptions(
            optionValueData.id_attribute_group,
          );
          if (!optionData || !optionData.name) return null;

          const key = this.getSingleValue(optionData.name).replace('/', '-');
          const value = this.getSingleValue(optionValueData?.name) ?? '';

          return { key, value };
        }),
      );

      const stock_available = stock_availables.find(
        (stock) => stock.id_product_attribute === id,
      );
      if (!stock_available || !stock_available.id) continue;

      const variantLevel = await this.prestashopClient.getStockItem(
        stock_available.id,
      );

      variants.push({
        external_id: String(stock_available.id),
        price: String(
          parseFloat(parseFloat(combinationData.price_on_sale).toFixed(4)),
        ),
        compare_at_price: String(
          parseFloat(parseFloat(combinationData.price_old).toFixed(4)),
        ),
        inventory_quantity: this.getQuantity(product, variantLevel),
        condition: Condition.GOOD, //Is replaced in later map
        metafields: [
          {
            key: 'reference_id',
            value: stock_available.id,
            type: MetafieldType.SINGLE_LINE_TEXT_FIELD,
            namespace: BAROODERS_NAMESPACE,
          },
        ],
        optionProperties: variantOptions.filter(
          (x): x is NonNullable<typeof x> => Boolean(x),
        ),
      });
    }

    return variants;
  }

  async mapLight(product: ProductDTO): Promise<SyncLightProduct> {
    return {
      title: this.getTitle(product),
      isVisibleInStore:
        product.active === '1' && product.available_for_order === '1',
      external_id: String(product.id),
    };
  }

  async map(product: ProductDTO): Promise<SyncProduct | null> {
    const { id, description, associations, id_manufacturer } = product;

    const lightProduct = await this.mapLight(product);
    const mappingMetadata = {
      externalId: lightProduct.external_id,
      title: lightProduct.title,
    };

    if (!associations) {
      this.logger.error(`No associations found, skipping product ${id}`);
      return null;
    }

    const {
      categories,
      images,
      combinations,
      product_features,
      stock_availables,
    } = associations;

    const tagsFormatted = [
      ...(await this.generateTags(
        mappingMetadata,
        product_features,
      )),
      ...(await this.tagService.getOrCreateTag(
        'Marque',
        id_manufacturer ? id_manufacturer.toString() : 'unknown_brand_id',
        'id_manufacturer',
        this.vendorConfigService.getVendorConfig().mappingKey,
        mappingMetadata,
      )),
      ...(await this.getExtraTags(lightProduct.title, mappingMetadata)),
    ];

    const productType = await this.getProductTypeFromCategories(
      categories,
      mappingMetadata,
    );
    if (!productType) {
      this.logger.warn(
        `Category ${jsonStringify(
          categories,
        )} not mapped, skipping product ${id}`,
      );
      return null;
    }

    const imagesFormatted = await this.getProductImages({
      images,
      productId: id,
    });
    if (imagesFormatted.length === 0) {
      this.logger.warn(`No images found, skipping product ${id}`);
      return null;
    }

    let productData: SyncProduct = {
      ...lightProduct,
      body_html: this.getSingleValue(description ?? '').replace(/nbsp;/g, ''),
      product_type: productType,
      images: imagesFormatted,
      tags: tagsFormatted.flatMap((f) => (f ? [f] : [])),
      variants: [],
    };

    /* product with multiple variants */
    if (combinations) {
      productData.variants = await this.getFormattedVariants(product, {
        combinations,
        stock_availables: stock_availables ?? [],
      });
    }

    /* single product without variants */
    if (!combinations && stock_availables && stock_availables.length > 0) {
      const variantLevel = await this.prestashopClient.getStockItem(
        stock_availables[0].id,
      );
      productData = {
        ...productData,
        variants: [
          {
            external_id: String(stock_availables[0].id),
            price: String(
              parseFloat(parseFloat(product.price_on_sale).toFixed(4)),
            ),
            compare_at_price: String(
              parseFloat(parseFloat(product.price_old).toFixed(4)),
            ),
            optionProperties: [
              {
                key: DISABLED_VARIANT_OPTION,
                value: DISABLED_VARIANT_OPTION,
              },
            ],
            condition: Condition.GOOD, //Is replaced in later map
            inventory_quantity: this.getQuantity(product, variantLevel),
            metafields: [
              {
                key: 'reference_id',
                value: stock_availables[0].id,
                type: MetafieldType.SINGLE_LINE_TEXT_FIELD,
                namespace: BAROODERS_NAMESPACE,
              },
            ],
          },
        ],
      };
    }

    return {
      ...productData,
      variants: productData.variants.map((variant) => ({
        ...variant,
        condition: this.getProductCondition(product, tagsFormatted),
      })),
    };
  }

  getProductCondition(_product: ProductDTO, tags: string[]): Condition {
    const tagsObject = getTagsObject(tags);

    return mapCondition(head(tagsObject[CONDITION_TAG_KEY]));
  }

  getQuantity(_product: ProductDTO, variant: StockAvailableDTO | null): number {
    return variant?.quantity ? Number(variant.quantity) : 0;
  }

  getTitle(product: ProductDTO): string {
    return this.getSingleValue(product.name ?? 'Missing title');
  }
}
