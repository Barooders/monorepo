import {
  ArrayMinSize,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CartInfoType, CustomerInfoType } from '../domain/types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaymentSolution } from '../domain/config';
import { AmountDTO } from '@libs/domain/value-objects';

class AddressDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Address line', example: '1 rue Paul Dijon' })
  line1!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Department zipcode', example: '38000' })
  zipCode!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The city name', example: 'Grenoble' })
  city!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The country code', example: 'FR' })
  countryCode!: string;
}

class CustomerInfoDTO implements Omit<CustomerInfoType, 'id'> {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Mike' })
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Horn' })
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'tech@barooders.com' })
  email!: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Iso formatted birthdate',
    example: new Date().toISOString(),
  })
  birthDate!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Department zipcode', example: '38000' })
  birthZipCode!: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Civility (Mr or Ms)', example: 'Mr' })
  civility!: 'Mr' | 'Ms';

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDTO)
  address!: AddressDTO;

  @IsNotEmpty()
  @IsPhoneNumber()
  @ApiProperty({
    description: 'Phone number with country code',
    example: '+33612345678',
  })
  phoneNumber!: string;
}

export class PaymentLinkDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The id of the payment generated at eligibility',
  })
  paymentId!: string;
}

class ProductDTO {
  @ApiProperty()
  @ValidateNested()
  @Type(() => AmountDTO)
  amount!: AmountDTO;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  shipping!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  productType!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id!: string;
}

export class CartInfoDTO implements CartInfoType {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  storeId!: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AmountDTO)
  totalAmount!: AmountDTO;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  productsCount!: number;

  @ApiProperty({ isArray: true, minItems: 1, type: ProductDTO })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductDTO)
  products!: ProductDTO[];
}

export class EligibilityInputDTO {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CustomerInfoDTO)
  customerInfo!: CustomerInfoDTO;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CartInfoDTO)
  cartInfo!: CartInfoDTO;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  checkoutId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  paymentSolutionCode!: PaymentSolution;
}
