import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export type TranslatedValue = {
  id: string;
  value: string;
};

export class ProductFeatureDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsString()
  name?: string | TranslatedValue[];
}
