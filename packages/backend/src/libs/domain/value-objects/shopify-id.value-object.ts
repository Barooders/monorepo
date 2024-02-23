import { isInt } from 'class-validator';
import { ExceptionBase } from '../exceptions';
import { ValueObject } from './value-object.base';

class ShopifyIDNotValidException extends ExceptionBase {
  code = 'SHOPIFY_ID_NOT_VALID';
  constructor(id: any) {
    super(`ShopifyID (${id}) is not valid`);
  }
}

export interface ShopifyIdProps {
  id: number;
}

export class ShopifyID extends ValueObject<ShopifyIdProps> {
  get id(): number {
    return this.props.id;
  }

  protected validate(props: ShopifyIdProps): void {
    if (!isInt(props.id)) {
      throw new ShopifyIDNotValidException(props.id);
    }
  }
}
