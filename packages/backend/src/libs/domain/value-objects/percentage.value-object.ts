import { isNumber } from 'class-validator';
import { ExceptionBase } from '../exceptions';
import { ValueObject } from './value-object.base';

class PercentageShouldBeANumber extends ExceptionBase {
  code = 'PERCENTAGE_AS_NUMBER';
  constructor(percentage: any) {
    super(`Percentage ${percentage} should be passed as a number`);
  }
}

class PercentageIsAbsolute extends ExceptionBase {
  code = 'PERCENTAGE_IS_BETWEEN_0_AND_1';
  constructor(percentage: any) {
    super(`Percentage (${percentage}) should be between 0 and 1`);
  }
}

export interface PercentageProps {
  percentage: number;
}

export class Percentage extends ValueObject<PercentageProps> {
  get percentage(): number {
    return this.props.percentage;
  }

  get percentageOn100(): number {
    return this.props.percentage * 100;
  }

  protected validate(props: PercentageProps): void {
    if (!isNumber(props.percentage)) {
      throw new PercentageShouldBeANumber(props.percentage);
    }

    if (props.percentage < 0 || props.percentage > 1) {
      throw new PercentageIsAbsolute(props.percentage);
    }
  }
}
