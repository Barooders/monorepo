import { mapCondition } from '@libs/domain/product.interface';
import {
  SyncLightProduct,
  SyncProduct,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { CategoryService } from '@modules/pro-vendor/domain/service/category.service';
import { TagService } from '@modules/pro-vendor/domain/service/tag.service';
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
    const productType = await this.categoryService.getOrCreateCategory(
      product.type,
      this.vendorConfigService.getVendorConfig().mappingKey,
      product.type,
      {
        externalId: product.id,
        title: product.title,
      },
    );

    if (!productType) {
      this.logger.warn(`Category not mapped, skipping product ${product.id}`);
      return null;
    }

    return {
      ...(await this.mapLightProduct(product)),
      product_type: productType,
      body_html: product.description,
      variants: product.variants.map((variant) => ({
        external_id: variant.id,
        condition: mapCondition(variant.condition),
        inventory_quantity: variant.inventoryQuantity.stock,
        price: variant.price.amount.toString(),
        compare_at_price: variant.compareAtPrice?.amount.toString(),
        optionProperties: compact([
          variant.option1,
          variant.option2,
          variant.option3,
        ]),
      })),
      tags: await this.getTags(product),
      EANCode: product.EANCode,
      images: product.images.map(({ url: src }) => ({
        src,
      })),
    };
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
