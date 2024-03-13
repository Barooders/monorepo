import { SyncProduct } from '@modules/pro-vendor/domain/ports/types';
import { Injectable } from '@nestjs/common';
import { ProductDTO } from '../dto/prestashop-product.dto';
import { PrestashopDefaultMapper } from './default.mapper';

@Injectable()
export class TribiciMapper extends PrestashopDefaultMapper {
  async map(product: ProductDTO): Promise<SyncProduct | null> {
    const mappedProduct = await super.map(product);

    const isNotABike =
      !mappedProduct ||
      !(await this.pimClient.isBike(mappedProduct.product_type.toLowerCase()));

    if (isNotABike) {
      return mappedProduct;
    }

    return {
      ...mappedProduct,
      variants: mappedProduct.variants.map((variant) => ({
        ...variant,
        price: (Number(variant.price) + 20).toFixed(2),
      })),
    };
  }
}
