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
    const variantsWithStock = variants.map((variant) => ({
      ...variant,
      inventory_quantity: 1,
    }));

    const observedNewProductPrice = (
      wooCommerceProduct?.meta_data ?? []
    ).filter(({ key, value }) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      return key === 'prix_neuf_constate_v' && !!value && !isNaN(Number(value));
    });

    if (observedNewProductPrice.length === 0) return variantsWithStock;

    return variantsWithStock.map((variant) => ({
      ...variant,
      compare_at_price: observedNewProductPrice[0].value as string,
    }));
  }
}
