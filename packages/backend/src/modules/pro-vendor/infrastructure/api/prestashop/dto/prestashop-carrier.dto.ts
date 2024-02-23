import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CarrierDTO {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  url!: string;
}
