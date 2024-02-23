import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TranslatedValue } from './prestashop-product-features.dto';

export class CategoryDTO {
  @IsOptional()
  id?: number;

  @IsNumber()
  @IsNotEmpty()
  id_parent!: number;

  @IsBoolean()
  @IsNotEmpty()
  active!: boolean;

  @IsNumber()
  @IsNotEmpty()
  id_shop_default!: number;

  @IsBoolean()
  @IsNotEmpty()
  is_root_category!: boolean;

  @IsOptional()
  position?: number;

  @IsString()
  @IsNotEmpty()
  date_add!: string;

  @IsString()
  @IsNotEmpty()
  date_upd!: string;

  @IsArray()
  @IsNotEmpty()
  name!: string | TranslatedValue[];

  @IsArray()
  @IsNotEmpty()
  link_rewrite!: string | TranslatedValue[];

  @IsOptional()
  @IsArray()
  description?: string | TranslatedValue[];

  @IsOptional()
  @IsArray()
  meta_title?: string | TranslatedValue[];

  @IsOptional()
  @IsArray()
  meta_description?: string | TranslatedValue[];

  @IsOptional()
  @IsArray()
  meta_keywords?: string | TranslatedValue[];

  @IsOptional()
  associations?: { categories: number[]; products: number[] };
}
