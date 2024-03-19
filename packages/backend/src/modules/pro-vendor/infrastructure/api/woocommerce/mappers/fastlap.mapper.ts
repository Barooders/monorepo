import { Injectable } from '@nestjs/common';
import { WooCommerceProduct } from '../types';
import { WooCommerceDefaultMapper } from './default.mapper';

@Injectable()
export class FastlapMapper extends WooCommerceDefaultMapper {
  getCategory(wooCommerceProduct: WooCommerceProduct): {
    key: string;
    name: string;
  } {
    const key = wooCommerceProduct.attributes
      .find((a) => a.name.toLowerCase() === 'tipo')
      ?.options.sort()
      .join('-');

    if (!key) {
      return { key: 'unknown', name: 'unknown' };
    }

    return {
      key,
      name: key,
    };
  }

  getProductImages(wooCommerceProduct: WooCommerceProduct) {
    const truncatedImages = wooCommerceProduct.images.slice(1);
    return super.getProductImages({
      ...wooCommerceProduct,
      images: truncatedImages,
    });
  }
}
