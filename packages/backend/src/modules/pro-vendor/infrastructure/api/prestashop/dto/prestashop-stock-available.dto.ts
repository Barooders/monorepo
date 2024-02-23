import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class StockAvailableDTO {
  @IsNotEmpty()
  @IsNumber()
  id_product!: number;

  @IsNumber()
  @IsNotEmpty()
  id_product_attribute!: number;

  @IsOptional()
  @IsNumber()
  id_shop?: number;

  @IsOptional()
  @IsNumber()
  id_shop_group?: number;

  @IsNotEmpty()
  @IsNumberString()
  quantity!: string;

  @IsOptional()
  @IsBoolean()
  depends_on_stock?: boolean;

  @IsOptional()
  @IsNumber()
  out_of_stock?: number;

  @IsOptional()
  @IsString()
  location?: string;
}
