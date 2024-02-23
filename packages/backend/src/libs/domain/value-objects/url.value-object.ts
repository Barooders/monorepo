import { isURL } from 'class-validator';
import { ExceptionBase } from '../exceptions';
import { ValueObject } from './value-object.base';

class NotValidURL extends ExceptionBase {
  code = 'URL_NOT_VALID';
  constructor(url: any) {
    super(`URL (${url}) is not valid`);
  }
}

export interface URLProps {
  url: string;
}

export class URL extends ValueObject<URLProps> {
  get url(): string {
    return this.props.url;
  }

  protected validate(props: URLProps): void {
    if (!isURL(props.url)) {
      throw new NotValidURL(props.url);
    }
  }
}
