import { isInteger } from 'lodash';
import { ExceptionBase } from '../exceptions';
import { ValueObject } from './value-object.base';

class InvalidStockValue extends ExceptionBase {
  code = 'INVALID_STOCK_VALUE';
  constructor(stock: any) {
    super(`Stock value (${stock}) should be integer`);
  }
}

export interface StockProps {
  stock: number;
}

export class Stock extends ValueObject<StockProps> {
  get stock(): number {
    return this.props.stock;
  }

  protected validate(props: StockProps): void {
    if (!isInteger(props.stock)) {
      throw new InvalidStockValue(props.stock);
    }
  }
}
