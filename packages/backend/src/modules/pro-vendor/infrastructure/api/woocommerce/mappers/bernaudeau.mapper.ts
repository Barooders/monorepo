import { SyncProduct } from '@modules/pro-vendor/domain/ports/types';
import { Injectable } from '@nestjs/common';
import { WooCommerceProduct } from '../types';
import { WooCommerceDefaultMapper } from './default.mapper';

@Injectable()
export class BernaudeauMapper extends WooCommerceDefaultMapper {
  async getVariants(
    wooCommerceProduct: WooCommerceProduct,
  ): Promise<SyncProduct['variants']> {
    const variants = await super.getVariants(wooCommerceProduct);
    const observedNewProductPrice = wooCommerceProduct.meta_data.filter(
      ({ key, value }) => {
        return (
          key === 'prix_neuf_constate_v' && !!value && !isNaN(Number(value))
        );
      },
    );

    if (observedNewProductPrice.length === 0) return variants;

    return variants.map((variant) => ({
      ...variant,
      compare_at_price: observedNewProductPrice[0].value,
    }));
  }
}
