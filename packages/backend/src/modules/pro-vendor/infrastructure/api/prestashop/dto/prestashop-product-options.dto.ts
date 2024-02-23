import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TranslatedValue } from './prestashop-product-features.dto';

export class ProductOptionDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsBoolean()
  is_color_group?: boolean;

  @IsOptional()
  @IsString()
  group_type?: string;

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsString()
  name?: string | TranslatedValue[];

  @IsOptional()
  @IsString()
  public_name?: string;

  @IsOptional()
  @IsArray()
  associations?: Associations[];
}

class Associations {
  @IsOptional()
  @IsArray()
  product_option_values?: ProductOptionValues[];
}

class ProductOptionValues {
  @IsNotEmpty()
  @IsNumber()
  id?: number;
}
