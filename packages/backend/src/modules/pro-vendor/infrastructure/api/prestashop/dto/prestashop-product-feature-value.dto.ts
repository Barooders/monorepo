import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TranslatedValue } from './prestashop-product-features.dto';

export class ProductFeatureValueDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsNotEmpty()
  @IsNumber()
  id_feature!: number;

  @IsOptional()
  @IsBoolean()
  custom?: boolean;

  @IsOptional()
  @IsString()
  value?: string | TranslatedValue[];
}
