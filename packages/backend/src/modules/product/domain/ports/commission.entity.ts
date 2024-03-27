import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class Commission {
  @ApiProperty()
  @IsString()
  productStoreId!: string;

  @ApiProperty()
  @IsString()
  variantStoreId!: string;

  @ApiProperty()
  @IsInt()
  amountInCents!: number;
}
