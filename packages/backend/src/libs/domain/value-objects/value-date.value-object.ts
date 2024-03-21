import { isDate } from 'class-validator';
import { ExceptionBase } from '../exceptions';
import { ValueObject } from './value-object.base';

class InvalidDate extends ExceptionBase {
  code = 'INVALID_DATE';
  constructor(date: any) {
    super(`Date (${date}) is not valid`);
  }
}

export interface DateProps {
  date: Date;
}

export class ValueDate extends ValueObject<DateProps> {
  get date(): Date {
    return this.props.date;
  }

  get timestamp(): number {
    return this.props.date.getTime();
  }

  get readableDate(): string {
    return this.props.date?.toLocaleDateString('fr-FR');
  }

  protected validate(props: DateProps): void {
    if (!isDate(props.date)) {
      throw new InvalidDate(props.date);
    }
  }
}
