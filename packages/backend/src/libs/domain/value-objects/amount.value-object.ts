import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isInteger } from 'lodash';
import { ExceptionBase } from '../exceptions';
import { ValueObject } from './value-object.base';

class AmountShouldBePassedAsCents extends ExceptionBase {
  code = 'AMOUNT_AS_CENTS';
  constructor(amountInCents: any) {
    super(`Amount (${amountInCents}) should be passed as cents`);
  }
}

export class AmountDTO {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'Value of the amount in the chosen currency',
    example: 124999,
  })
  amountInCents!: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'The chosen currency',
    default: 'EUR',
  })
  currency?: 'EUR';
}

export interface AmountProps {
  amountInCents: number;
  currency?: 'EUR';
}

const DEFAULT_CURRENCY = 'EUR';

export class Amount extends ValueObject<AmountProps> {
  get amountInCents(): number {
    return this.props.amountInCents;
  }

  get amount(): number {
    return this.props.amountInCents / 100;
  }

  get currency(): string {
    return this.props.currency ?? DEFAULT_CURRENCY;
  }

  get formattedAmount(): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }

  protected validate(props: AmountProps): void {
    if (!isInteger(props.amountInCents)) {
      throw new AmountShouldBePassedAsCents(props.amountInCents);
    }
  }
}
