import {
  Controller,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { routesV1 } from '@config/routes.config';
import { User } from '@libs/application/decorators/user.decorator';
import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';

import {
  BackOffPolicy,
  Retryable,
} from '@libs/application/decorators/retryable.decorator';
import { ExtractedUser } from '../domain/strategies/jwt/jwt.strategy';
import { encode, generateUrl } from '../infrastructure/shopify';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

class ShopifyLoginResponse {
  @ApiProperty()
  multipassToken!: string;

  @ApiProperty()
  loginUrl!: string;
}

@Controller(routesV1.version)
export class ShopifyController {
  constructor(private prismaService: PrismaMainClient) {}

  @ApiResponse({
    type: ShopifyLoginResponse,
  })
  @Post(routesV1.auth.shopifyLogin)
  @UseGuards(JwtAuthGuard)
  async shopifyLogin(
    @User() tokenInfo: ExtractedUser,
    @Query() { redirect_to }: { redirect_to?: string },
  ): Promise<ShopifyLoginResponse> {
    if (!tokenInfo) throw new UnauthorizedException();

    const user = await this.prismaService.users.findUnique({
      where: { id: tokenInfo.userId },
    });

    if (!user) throw new UnauthorizedException();
    if (!user.email) throw new Error('User email not found');

    await this.checkShopifyCustomerIsCreated(tokenInfo.userId);

    const payload: { email: string; return_to?: string } = {
      email: user.email,
    };

    if (redirect_to) payload.return_to = redirect_to;

    return {
      multipassToken: encode(payload) ?? '',
      loginUrl: generateUrl(payload),
    };
  }

  @Retryable({
    backOff: 500,
    maxAttempts: 4,
    exponentialOption: {
      maxInterval: 5000,
      multiplier: 3,
    },
    backOffPolicy: BackOffPolicy.ExponentialBackOffPolicy,
  })
  private async checkShopifyCustomerIsCreated(userId: string): Promise<void> {
    const customer = await this.prismaService.customer.findFirstOrThrow({
      where: { authUserId: userId },
    });

    if (!customer?.shopifyId)
      throw new Error(`Customer ${userId} not found in shopify`);
  }
}
