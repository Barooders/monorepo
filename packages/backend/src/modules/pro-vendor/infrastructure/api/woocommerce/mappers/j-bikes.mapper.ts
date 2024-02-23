import { USED_PRODUCT_DEFAULT_DESCRIPTION } from '@config/vendor/constants';
import { Injectable } from '@nestjs/common';
import { WooCommerceProduct } from '../types';
import { WooCommerceDefaultMapper } from './default.mapper';

@Injectable()
export class JBikesMapper extends WooCommerceDefaultMapper {
  getDescription({ meta_data }: WooCommerceProduct): string {
    return (
      meta_data.find(({ key }) => key === '_et_pb_old_content')?.value ??
      USED_PRODUCT_DEFAULT_DESCRIPTION
    );
  }

  getVariantQuantity(
    product: { purchasable: boolean; name: string },
    _variantQuantity: number | null,
  ): number {
    return product.name.toLowerCase().includes('vendu') ? 0 : 1;
  }
}
