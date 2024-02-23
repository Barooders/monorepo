import { getVariantsOptions } from '@libs/domain/product.interface';
import { Injectable } from '@nestjs/common';
import { WooCommerceProduct } from '../types';
import { WooCommerceDefaultMapper } from './default.mapper';

@Injectable()
export class PanameBicisMapper extends WooCommerceDefaultMapper {
  async getVariants(wooCommerceProduct: WooCommerceProduct) {
    const variants = await super.getMultipleVariants(wooCommerceProduct);
    const filteredVariantsOptions = getVariantsOptions(variants)
      .filter((x) => x.values.length > 1)
      .sort((a, b) => b.values.length - a.values.length)
      .slice(0, 3);

    return variants.map((variant) => ({
      ...variant,
      optionProperties: variant.optionProperties.filter(({ key }) =>
        filteredVariantsOptions.some(
          ({ name: optionName }) => key === optionName,
        ),
      ),
    }));
  }
}
