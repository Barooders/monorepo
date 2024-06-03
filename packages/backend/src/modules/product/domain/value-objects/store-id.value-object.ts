import { ExceptionBase } from '@libs/domain/exceptions';
import { ValueObject } from '@libs/domain/value-objects/value-object.base';
import { isEmpty } from 'class-validator';

class StoreIdShouldNotBeEmpty extends ExceptionBase {
  code = 'STORE_ID_SHOULD_NOT_BE_EMPTY';
  constructor() {
    super('Store id should not be empty');
  }
}

interface ShopifyStoreIdProps {
  shopifyId: number;
}

interface MedusaStoreIdProps {
  medusaId: string;
}

const hasShopifyStoreId = (
  props: StoreIdProps,
): props is ShopifyStoreIdProps => {
  return (props as ShopifyStoreIdProps).shopifyId !== undefined;
};

const hasMedusaStoreId = (props: StoreIdProps): props is MedusaStoreIdProps => {
  return (props as MedusaStoreIdProps).medusaId !== undefined;
};

export type StoreIdProps = ShopifyStoreIdProps | MedusaStoreIdProps;

export class StoreId extends ValueObject<StoreIdProps> {
  get value(): string {
    return hasShopifyStoreId(this.props)
      ? String(this.props.shopifyId)
      : this.props.medusaId;
  }

  get medusaIdIfExists(): string | undefined {
    if (hasMedusaStoreId(this.props)) {
      return this.props.medusaId;
    }

    return undefined;
  }

  get shopifyIdIfExists(): number | undefined {
    if (hasShopifyStoreId(this.props)) {
      return this.props.shopifyId;
    }

    return undefined;
  }

  protected validate(props: StoreIdProps): void {
    const id = hasShopifyStoreId(props) ? props.shopifyId : props.medusaId;
    if (isEmpty(id)) {
      throw new StoreIdShouldNotBeEmpty();
    }
  }
}
