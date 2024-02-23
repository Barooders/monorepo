import { ExceptionBase } from '@libs/domain/exceptions';
import { ValueObject } from '@libs/domain/value-objects/value-object.base';
import { isEmpty } from 'class-validator';

class ProductTypeShouldNotBeEmpty extends ExceptionBase {
  code = 'PRODUCT_TYPE_SHOULD_NOT_BE_EMPTY';
  constructor() {
    super('Product type should not be empty');
  }
}

export interface ProductTypeProps {
  productType: string;
}

export class ProductType extends ValueObject<ProductTypeProps> {
  get productType(): string {
    return this.props.productType;
  }

  protected validate(props: ProductTypeProps): void {
    if (isEmpty(props.productType)) {
      throw new ProductTypeShouldNotBeEmpty();
    }
  }
}
