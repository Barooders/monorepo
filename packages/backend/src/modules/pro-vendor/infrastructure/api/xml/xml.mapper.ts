import { Condition } from '@libs/domain/prisma.main.client';
import { mapCondition } from '@libs/domain/product.interface';
import {
  SyncLightProduct,
  SyncProduct,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { CategoryService } from '@modules/pro-vendor/domain/service/category.service';
import {
  FirstProductMapped,
  TagService,
} from '@modules/pro-vendor/domain/service/tag.service';
import { Injectable, Logger } from '@nestjs/common';
import { compact } from 'lodash';
import { XMLProduct } from './types';

@Injectable()
export class XMLMapper {
  private readonly logger = new Logger(XMLMapper.name);

  constructor(
    private categoryService: CategoryService,
    private tagService: TagService,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async mapLightProduct({ id, title }: XMLProduct): Promise<SyncLightProduct> {
    return {
      external_id: id,
      title,
      isVisibleInStore: true,
    };
  }

  async mapProduct(product: XMLProduct): Promise<SyncProduct | null> {
    const metadata = {
      externalId: product.id,
      title: product.title,
    };

    const productType = await this.categoryService.getOrCreateCategory(
      product.type,
      this.vendorConfigService.getVendorConfig().mappingKey,
      product.type,
      metadata,
    );

    if (!productType) {
      this.logger.warn(`Category not mapped, skipping product ${product.id}`);
      return null;
    }

    return {
      ...(await this.mapLightProduct(product)),
      product_type: productType,
      body_html: this.getDescription(product),
      variants: await Promise.all(
        product.variants.map(async (variant) => ({
          external_id: variant.id,
          condition: await this.getCondition(variant.condition, metadata),
          inventory_quantity: variant.inventoryQuantity.stock,
          price: variant.price.amount.toString(),
          compare_at_price: variant.compareAtPrice?.amount.toString(),
          optionProperties: compact([
            variant.option1,
            variant.option2,
            variant.option3,
          ]),
        })),
      ),
      tags: await this.getTags(product),
      EANCode: product.EANCode,
      images: product.images.map(({ url: src }) => ({
        src,
      })),
    };
  }

  getDescription({ description }: XMLProduct): string {
    return description;
  }

  private async getCondition(
    vendorCondition: string,
    metadata: FirstProductMapped,
  ): Promise<Condition> {
    const mappedCondition = await this.tagService.getOrCreateTag(
      'condition',
      vendorCondition,
      'condition',
      this.vendorConfigService.getVendorConfig().mappingKey,
      metadata,
    );

    return mapCondition(mappedCondition.join('-'));
  }

  private async getTags(xmlProduct: XMLProduct): Promise<string[]> {
    return (
      await Promise.all(
        xmlProduct.tags.map(({ key, value }) => {
          return this.tagService.getOrCreateTag(
            key,
            String(value),
            key,
            this.vendorConfigService.getVendorConfig().mappingKey,
            {
              externalId: String(xmlProduct.id),
              title: xmlProduct.title,
            },
          );
        }),
      )
    )
      .flat()
      .flatMap((f) => (f ? [f] : []));
  }
}
