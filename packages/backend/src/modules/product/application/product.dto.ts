import { Condition, ProductStatus } from '@libs/domain/prisma.main.client';
import {
  Image,
  Option,
  StoredProduct,
  StoredVariant,
} from '@libs/domain/product.interface';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class SimpleImageDTO implements Image {
  @ApiProperty()
  src?: string;

  @ApiProperty()
  attachment?: string;

  @ApiProperty()
  id?: number;
}

class MainProductImageDTO extends SimpleImageDTO {
  @ApiProperty()
  created_at!: string;

  @ApiProperty()
  id!: number;

  @ApiProperty()
  position!: number;

  @ApiProperty()
  updated_at!: string;

  @ApiProperty()
  product_id!: number;

  @ApiProperty({ isArray: true })
  variant_ids!: number[];

  @ApiProperty()
  width!: number;

  @ApiProperty()
  height!: number;

  @ApiProperty()
  alt?: string;

  @ApiProperty()
  src!: string;
}

class OptionDTO {
  @ApiProperty()
  name!: string;

  @ApiProperty({ isArray: true })
  values!: string[];
}

class VariantDTO implements StoredVariant {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  option1?: string;

  @ApiProperty()
  option2?: string;

  @ApiProperty()
  option3?: string;

  @ApiProperty()
  inventory_management!: string;

  @ApiProperty()
  inventory_policy!: string;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  price?: string;

  @ApiProperty()
  compare_at_price?: string;

  @ApiProperty()
  sku?: string;

  @ApiProperty()
  inventory_quantity?: number;

  @ApiProperty()
  condition!: Condition;
}

export class ProductAdminDTO implements StoredProduct {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  status!: ProductStatus;

  @ApiProperty()
  vendor!: string;

  @ApiProperty()
  tags!: string[];

  @ApiProperty({ isArray: true, type: VariantDTO })
  variants!: StoredVariant[];

  @ApiProperty({ isArray: true, type: OptionDTO })
  options!: Option[];

  @ApiProperty()
  created_at!: string;

  @ApiProperty()
  updated_at!: string;

  @ApiProperty()
  template_suffix?: string;

  @ApiProperty()
  handle!: string;

  @ApiProperty()
  published_at?: string;

  @ApiProperty()
  published_scope?: string;

  @ApiProperty({ type: MainProductImageDTO })
  image!: MainProductImageDTO;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  body_html!: string;

  @ApiProperty()
  product_type!: string;

  @ApiProperty({ isArray: true, type: SimpleImageDTO })
  images!: SimpleImageDTO[];

  @ApiProperty()
  price?: number;

  @ApiProperty()
  compare_at_price?: number;

  @ApiProperty()
  EANCode?: string;

  @ApiProperty()
  GTINCode?: string;

  @ApiProperty()
  source?: string;
}

class ExistingFamily {
  @ApiProperty()
  id!: number;
}

class ExistingBrand {
  @ApiProperty()
  id!: number;
}

class NewBrand {
  @ApiProperty()
  name!: string;
}

class NewFamily {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  productType!: number;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ExistingBrand) },
      { $ref: getSchemaPath(NewBrand) },
    ],
  })
  brand!: ExistingBrand | NewBrand;
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

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ExistingFamily) },
      { $ref: getSchemaPath(NewFamily) },
    ],
  })
  family!: ExistingFamily | NewFamily;
}
