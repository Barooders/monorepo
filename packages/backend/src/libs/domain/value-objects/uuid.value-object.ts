import { isUUID } from 'class-validator';
import { ExceptionBase } from '../exceptions';
import { ValueObject } from './value-object.base';

class UUIDNotValidException extends ExceptionBase {
  code = 'UUID_NOT_VALID';
  constructor(uuid: any) {
    super(`String (${uuid}) should be valid UUID`);
  }
}

export interface UuidProps {
  uuid: string;
}

export class UUID extends ValueObject<UuidProps> {
  get uuid(): string {
    return this.props.uuid;
  }

  protected validate(props: UuidProps): void {
    if (!isUUID(props.uuid)) {
      throw new UUIDNotValidException(props.uuid);
    }
  }
}
