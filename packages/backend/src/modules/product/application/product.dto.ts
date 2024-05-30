import { Condition, ProductStatus } from '@libs/domain/prisma.main.client';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class SimpleImageDTO {
  @ApiProperty()
  src!: string;

  @ApiProperty()
  storeId!: string;
}

class VariantDTO {
  @ApiProperty()
  internalId!: string;

  @ApiProperty()
  price!: string;

  @ApiProperty({ required: false })
  compare_at_price?: string;

  @ApiProperty()
  condition!: Condition;
}

export class ProductAdminDTO {
  @ApiProperty()
  status!: ProductStatus;

  @ApiProperty()
  vendor!: string;

  @ApiProperty()
  tags!: string[];

  @ApiProperty({ isArray: true, type: VariantDTO })
  variants!: VariantDTO[];

  @ApiProperty()
  body_html!: string;

  @ApiProperty()
  product_type!: string;

  @ApiProperty({ isArray: true, type: SimpleImageDTO })
  images!: SimpleImageDTO[];
}

class PimBrand {
  @ApiProperty()
  name!: string;
}

export class CreateProductModelDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  @IsOptional()
  manufacturer_suggested_retail_price?: number;

  @ApiProperty()
  imageUrl!: string;

  @ApiProperty()
  year!: number;

  @ApiProperty()
  @IsOptional()
  productType?: string;

  @ApiProperty({ type: PimBrand })
  brand!: PimBrand;
}
