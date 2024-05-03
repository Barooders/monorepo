import { USED_PRODUCT_DEFAULT_DESCRIPTION } from '@config/vendor/constants';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable } from '@nestjs/common';
import { isString } from 'lodash';
import { WooCommerceProduct } from '../types';
import { WooCommerceDefaultMapper } from './default.mapper';

@Injectable()
export class JBikesMapper extends WooCommerceDefaultMapper {
  getDescription({ meta_data }: WooCommerceProduct): string {
    const metaDataValue = meta_data?.find(
      ({ key }) => key === '_et_pb_old_content',
    )?.value;

    if (metaDataValue == null) {
      return USED_PRODUCT_DEFAULT_DESCRIPTION;
    }

    if (isString(metaDataValue)) {
      return metaDataValue;
    }

    return jsonStringify(metaDataValue);
  }

  getVariantQuantity(
    product: { purchasable: boolean; name: string },
    _variantQuantity: number | null,
  ): number {
    return product.name.toLowerCase().includes('vendu') ? 0 : 1;
  }
}
