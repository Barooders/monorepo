import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class TuvalumProductDto {
  @ApiProperty({
    description: 'Primary ID',
  })
  @IsNotEmpty()
  @IsString()
  uuid!: string;

  @ApiProperty({
    description: 'EAN code',
  })
  @IsNotEmpty()
  @IsString()
  ean!: string;

  @ApiProperty({
    description: 'Category ID',
  })
  @IsNotEmpty()
  @IsInt()
  category_id!: number;

  @ApiProperty({
    description: 'Category name',
  })
  @IsNotEmpty()
  @IsString()
  category!: string;

  @ApiProperty({
    description: 'Product is sold out',
  })
  @IsNotEmpty()
  @IsString()
  sold_out!: boolean;

  @ApiProperty({
    description: 'Product availability',
  })
  @IsNotEmpty()
  @IsString()
  is_available!: boolean;

  @ApiProperty({
    description: 'Defines if a product is a bike',
  })
  @IsNotEmpty()
  @IsString()
  is_bike!: boolean;

  @ApiProperty({
    description: 'Product associated files',
  })
  @IsNotEmpty()
  @IsString()
  files!: string[];

  @ApiProperty({
    description: 'Product price',
  })
  @IsNotEmpty()
  @IsInt()
  price!: number;

  @ApiProperty({
    description: 'Previous product price',
  })
  @IsInt()
  old_price!: number;

  @ApiProperty({
    description: 'Product size as string',
  })
  @IsNotEmpty()
  @IsString()
  size!: string;

  @ApiProperty({
    description: 'Product main material',
  })
  @IsNotEmpty()
  @IsString()
  material!: string;

  @ApiProperty({
    description: 'Main group model',
  })
  @IsNotEmpty()
  @IsString()
  main_group!: string;

  @ApiProperty({
    description: 'Product name',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Product brand',
  })
  @IsNotEmpty()
  @IsString()
  brand!: string;

  @ApiProperty({
    description: 'Product model',
  })
  @IsNotEmpty()
  @IsString()
  model!: string;

  @ApiProperty({
    description: 'Product year',
  })
  @IsNotEmpty()
  @IsInt()
  year!: number;

  @ApiProperty({
    description: 'Seller type',
  })
  @IsNotEmpty()
  @IsString()
  seller!: string;

  @ApiProperty({
    description: 'Product use condition [new|used]',
  })
  @IsNotEmpty()
  @IsString()
  condition!: string;

  @ApiProperty({
    description: 'Characteristics array',
  })
  @IsNotEmpty()
  @IsString()
  characteristics!: [
    {
      key: string;
      text: string;
      value: string;
    },
  ];

  @ApiProperty({
    description: 'Seller summary',
  })
  @IsNotEmpty()
  @IsString()
  aesthetic_damages!: string[];

  @ApiProperty({
    description: 'Aesthetic damages description',
  })
  @IsNotEmpty()
  @IsString()
  mechanical_damages!: string[];

  @ApiProperty({
    description: 'Product accessories',
  })
  @IsNotEmpty()
  @IsString()
  accessories!: string[];

  @ApiProperty({
    description: 'Product has warranty',
  })
  @IsNotEmpty()
  @IsString()
  warranty!: boolean;

  @ApiProperty({
    description: 'API contact endpoint',
  })
  @IsNotEmpty()
  @IsString()
  call_me!: string;

  @ApiProperty({
    description: 'Product can be contacted.',
  })
  @IsNotEmpty()
  @IsString()
  call_me_granted!: boolean;

  @ApiProperty({
    description: 'Product price discount',
  })
  @IsNotEmpty()
  @IsInt()
  discount!: number;

  @ApiProperty({
    description: 'Product short description.',
  })
  @IsNotEmpty()
  @IsString()
  slogan!: string;

  @ApiProperty({
    description: 'Product info locale.',
  })
  @IsNotEmpty()
  @IsString()
  locale!: string;

  @ApiProperty({
    description: 'Last product update datetime.',
  })
  @IsNotEmpty()
  @IsString()
  updated_at!: string;

  @ApiProperty({
    description: 'Product creation datetime.',
  })
  @IsNotEmpty()
  @IsString()
  created_at!: string;
}
