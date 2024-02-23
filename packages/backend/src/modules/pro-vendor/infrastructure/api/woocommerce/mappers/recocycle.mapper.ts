import { Injectable } from '@nestjs/common';
import { WooCommerceProduct } from '../types';
import { WooCommerceDefaultMapper } from './default.mapper';

@Injectable()
export class RecocycleMapper extends WooCommerceDefaultMapper {
  getCategory(wooCommerceProduct: WooCommerceProduct): {
    key: string;
    name: string;
  } {
    const key = wooCommerceProduct.attributes
      .find((a) => a.name.toLowerCase() === 'type de vélo')
      ?.options.sort()
      .join('-');

    if (!key) {
      return super.getCategory(wooCommerceProduct);
    }

    return {
      key,
      name: key,
    };
  }

  getTagKey(id: number, name: string): string {
    return `${name}-${id.toString()}`;
  }
}
