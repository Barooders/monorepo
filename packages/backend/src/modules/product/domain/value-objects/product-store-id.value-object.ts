import { ExceptionBase } from '@libs/domain/exceptions';
import { ValueObject } from '@libs/domain/value-objects/value-object.base';
import { isEmpty } from 'class-validator';

class ProductStoreIdShouldNotBeEmpty extends ExceptionBase {
  code = 'PRODUCT_STORE_ID_SHOULD_NOT_BE_EMPTY';
  constructor() {
    super('Product store id should not be empty');
  }
}

interface ShopifyProductStoreIdProps {
  shopifyId: number;
}

interface MedusaProductStoreIdProps {
  medusaId: string;
}

const isShopifyProductStoreId = (
  props: ProductStoreIdProps,
): props is ShopifyProductStoreIdProps => {
  return (props as ShopifyProductStoreIdProps).shopifyId !== undefined;
};

export type ProductStoreIdProps =
  | ShopifyProductStoreIdProps
  | MedusaProductStoreIdProps;

export class ProductStoreId extends ValueObject<ProductStoreIdProps> {
  get value(): string {
    return isShopifyProductStoreId(this.props)
      ? String(this.props.shopifyId)
      : this.props.medusaId;
  }

  get medusaIdIfExists(): string | undefined {
    if (!isShopifyProductStoreId(this.props)) {
      return this.props.medusaId;
    }

    return undefined;
  }

  get shopifyIdIfExists(): number | undefined {
    if (isShopifyProductStoreId(this.props)) {
      return this.props.shopifyId;
    }

    return undefined;
  }

  protected validate(props: ProductStoreIdProps): void {
    const id = isShopifyProductStoreId(props)
      ? props.shopifyId
      : props.medusaId;
    if (isEmpty(id)) {
      throw new ProductStoreIdShouldNotBeEmpty();
    }
  }
}
