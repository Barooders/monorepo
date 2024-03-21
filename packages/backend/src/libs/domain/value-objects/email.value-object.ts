import { isEmail } from 'class-validator';
import { ExceptionBase } from '../exceptions';
import { ValueObject } from './value-object.base';

class NotValidEmail extends ExceptionBase {
  code = 'EMAIL_NOT_VALID';
  constructor(email: any) {
    super(`Mail (${email}) is not valid`);
  }
}

export interface EmailProps {
  email: string;
}

export class Email extends ValueObject<EmailProps> {
  get email(): string {
    return this.props.email;
  }

  protected validate(props: EmailProps): void {
    if (!isEmail(props.email)) {
      throw new NotValidEmail(props.email);
    }
  }
}
