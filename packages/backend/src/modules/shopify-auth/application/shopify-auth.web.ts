import { routesV1 } from '@config/routes.config';
import {
  SHOPIFY_REQUEST_ID_FORMAT,
  SHOPIFY_SHOP_FORMAT_NO_PROTOCOL,
} from '@libs/helpers/regex.helper';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import {
  IsAlphanumeric,
  IsHexadecimal,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import type { Request, Response } from 'express';
import { ShopifyAuthService } from '../domain/shopify-auth.service';

class AuthInputDo {
  @IsNotEmpty()
  @IsString()
  @Matches(SHOPIFY_SHOP_FORMAT_NO_PROTOCOL)
  shop!: string;
}

class AuthCallbackInputDo {
  @IsNotEmpty()
  @IsString()
  @Matches(SHOPIFY_SHOP_FORMAT_NO_PROTOCOL)
  shop!: string;

  @IsString()
  @IsHexadecimal()
  @IsNotEmpty()
  code!: string;

  @IsNotEmpty()
  @Matches(SHOPIFY_REQUEST_ID_FORMAT)
  host!: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  state!: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  timestamp!: string;

  @IsString()
  @IsHexadecimal()
  @IsNotEmpty()
  hmac!: string;
}

@Controller(routesV1.version)
export class ShopifyAuthController {
  constructor(private shopifyAuthService: ShopifyAuthService) {}

  @Get(routesV1.shopify.auth)
  async handleAuthentication(
    @Req()
    req: Request,
    @Res()
    res: Response,
    @Query()
    authInputDto: AuthInputDo,
  ): Promise<void> {
    await this.shopifyAuthService.handleAuthentication(req, res, authInputDto);
  }

  @Get(routesV1.shopify.authCallback)
  async handleAuthenticationCallback(
    @Req()
    req: Request,
    @Res()
    res: Response,
    @Query()
    authCallbackInputDto: AuthCallbackInputDo,
  ): Promise<void> {
    await this.shopifyAuthService.handleAuthenticationCallback(
      req,
      res,
      authCallbackInputDto,
    );
  }
}
