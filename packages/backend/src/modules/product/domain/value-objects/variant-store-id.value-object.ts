import { ExceptionBase } from '@libs/domain/exceptions';
import { ValueObject } from '@libs/domain/value-objects/value-object.base';
import { isEmpty } from 'class-validator';

class VariantStoreIdShouldNotBeEmpty extends ExceptionBase {
  code = 'VARIANT_STORE_ID_SHOULD_NOT_BE_EMPTY';
  constructor() {
    super('Variant store id should not be empty');
  }
}

interface ShopifyVariantStoreIdProps {
  shopifyId: number;
}

interface MedusaVariantStoreIdProps {
  medusaId: string;
}

const isShopifyVariantStoreId = (
  props: VariantStoreIdProps,
): props is ShopifyVariantStoreIdProps => {
  return (props as ShopifyVariantStoreIdProps).shopifyId !== undefined;
};

export type VariantStoreIdProps =
  | ShopifyVariantStoreIdProps
  | MedusaVariantStoreIdProps;

export class VariantStoreId extends ValueObject<VariantStoreIdProps> {
  get value(): string {
    return isShopifyVariantStoreId(this.props)
      ? String(this.props.shopifyId)
      : this.props.medusaId;
  }

  get medusaIdIfExists(): string | undefined {
    if (!isShopifyVariantStoreId(this.props)) {
      return this.props.medusaId;
    }

    return undefined;
  }

  get shopifyIdIfExists(): number | undefined {
    if (isShopifyVariantStoreId(this.props)) {
      return this.props.shopifyId;
    }

    return undefined;
  }

  protected validate(props: VariantStoreIdProps): void {
    const id = isShopifyVariantStoreId(props)
      ? props.shopifyId
      : props.medusaId;
    if (isEmpty(id)) {
      throw new VariantStoreIdShouldNotBeEmpty();
    }
  }
}
