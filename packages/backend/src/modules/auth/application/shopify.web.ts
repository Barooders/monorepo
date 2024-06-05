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

import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ExtractedUser } from '../domain/strategies/jwt/jwt.strategy';
import { encode, generateUrl } from '../infrastructure/shopify';

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
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!tokenInfo) throw new UnauthorizedException();

    const user = await this.prismaService.users.findUnique({
      where: { id: tokenInfo.userId },
    });

    if (!user) throw new UnauthorizedException();
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!user.email) throw new Error('User email not found');

    const payload: { email: string; return_to?: string } = {
      email: user.email,
    };

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (redirect_to) payload.return_to = redirect_to;

    return {
      multipassToken: encode(payload) ?? '',
      loginUrl: generateUrl(payload),
    };
  }
}
