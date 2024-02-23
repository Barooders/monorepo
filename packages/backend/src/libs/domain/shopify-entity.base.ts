import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsDateString } from 'class-validator';

export interface ShopifyEntityBaseProps {
  id: number;
  // ISO 8601
  created_at: string;
  // ISO 8601
  updated_at: string;
}

export class ShopifyEntityBase {
  constructor(props: ShopifyEntityBaseProps) {
    this.id = props.id;
    this.created_at = new Date(props.created_at).toISOString();
    this.updated_at = new Date(props.updated_at).toISOString();
  }

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: '706405506930370000',
    description: 'Shopify legacy resource id',
  })
  readonly id: number;

  @IsDateString()
  @ApiProperty({
    example: '2023-01-14 16:54:08',
  })
  created_at: string;

  @IsDateString()
  @ApiProperty({
    example: '2023-01-14 16:54:08',
  })
  updated_at: string;
}
