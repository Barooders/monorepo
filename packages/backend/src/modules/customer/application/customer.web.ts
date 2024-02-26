import {
  Controller,
  Get,
  Post,
  Logger,
  UnauthorizedException,
  UseGuards,
  Body,
  Delete,
  Put,
} from '@nestjs/common';

import { routesV1 } from '@config/routes.config';
import { User } from '@libs/application/decorators/user.decorator';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import { IsInt, IsPhoneNumber, IsString } from 'class-validator';
import {
  PaymentAccountProviderService,
  Wallet,
} from '../domain/payment-account-provider.service';
import { CustomerService } from '../domain/customer.service';
import { UUID } from '@libs/domain/value-objects';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

class NegociationAgreementInputDto {
  @ApiProperty()
  @IsInt()
  maxAmountPercent!: number;
}

class UpdateUserInputDto {
  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber!: string;
}

class NegociationAgreementResponseDto {
  @ApiProperty()
  @IsString()
  id!: string;
}

@Controller(routesV1.version)
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(
    private customerService: CustomerService,
    private paymentAccountProvider: PaymentAccountProviderService,
  ) {}

  @Get(routesV1.customer.wallet)
  @UseGuards(JwtAuthGuard)
  async fetchCustomerWallet(
    @User() { userId }: ExtractedUser,
  ): Promise<Wallet> {
    if (!userId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }

    return await this.paymentAccountProvider.getWallet(userId);
  }

  @Put(routesV1.customer.root)
  @UseGuards(JwtAuthGuard)
  async updateUserInfo(
    @User() { userId }: ExtractedUser,
    @Body()
    updateUserInputDto: UpdateUserInputDto,
  ): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }

    await this.customerService.updateUserInfo(new UUID({ uuid: userId }), {
      phoneNumber: updateUserInputDto.phoneNumber,
    });

    return;
  }

  @ApiResponse({ type: NegociationAgreementResponseDto })
  @Post(routesV1.negociationAgreement.root)
  @UseGuards(JwtAuthGuard)
  async upsertNegociationAgreement(
    @User() { userId }: ExtractedUser,
    @Body()
    negociationAgreementInputDto: NegociationAgreementInputDto,
  ) {
    return this.customerService.upsertNegociationAgreement(
      new UUID({ uuid: userId }),
      negociationAgreementInputDto.maxAmountPercent,
    );
  }

  @Delete(routesV1.negociationAgreement.root)
  @UseGuards(JwtAuthGuard)
  async deleteNegociationAgreement(@User() { userId }: ExtractedUser) {
    return this.customerService.deleteNegociationAgreement(
      new UUID({ uuid: userId }),
    );
  }
}
