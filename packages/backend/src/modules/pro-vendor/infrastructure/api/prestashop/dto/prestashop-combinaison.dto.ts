import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CombinaisonDTO {
  @IsNotEmpty()
  @IsNumber()
  id_product!: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  ean13?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  upc?: string;

  @IsOptional()
  @IsString()
  mpn?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  supplier_reference?: string;

  @IsOptional()
  @IsNumber()
  wholesale_price?: number;

  @IsOptional()
  @IsNumber()
  price?: string;

  @IsNumber()
  price_on_sale!: string;

  @IsNumber()
  price_old!: string;

  @IsOptional()
  @IsNumber()
  ecotax?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  unit_price_impact?: number;

  @IsOptional()
  @IsNumber()
  minimal_quantity?: number;

  @IsOptional()
  @IsNumber()
  low_stock_threshold?: number;

  @IsOptional()
  @IsBoolean()
  low_stock_alert?: boolean;

  @IsOptional()
  @IsBoolean()
  default_on?: boolean;

  @IsOptional()
  @IsString()
  available_date?: string;

  @IsOptional()
  associations?: Association;
}

class Association {
  @IsOptional()
  @IsArray()
  product_option_values?: ProductOptionValue[];
}

class ProductOptionValue {
  @IsOptional()
  @IsString()
  id?: string;
}
