import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TranslatedValue } from './prestashop-product-features.dto';

export class ProductOptionValuesDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsNotEmpty()
  @IsString()
  id_attribute_group!: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsString()
  name?: string | TranslatedValue[];
}
