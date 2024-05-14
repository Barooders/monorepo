import { routesV1 } from '@config/routes.config';
import { User } from '@libs/application/decorators/user.decorator';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { HandDeliveryService } from '../domain/hand-delivery.service';
import { UserIsNotOrderCustomerException } from '../domain/ports/exceptions';

class ValidateHandDeliveryOrderDto {
  @IsNotEmpty()
  @IsString()
  orderShopifyId!: string;

  @IsNotEmpty()
  @IsString()
  conversationId!: string;
}

@Controller(routesV1.version)
export class HandDeliveryOrderController {
  private readonly logger = new Logger(HandDeliveryOrderController.name);

  constructor(private handDeliveryService: HandDeliveryService) {}

  @Post(routesV1.order.handDeliveryOrderStatus)
  @UseGuards(JwtAuthGuard)
  async setDeliveredOrderMatchingProductId(
    @User() { shopifyId, userId }: ExtractedUser,
    @Body() { orderShopifyId, conversationId }: ValidateHandDeliveryOrderDto,
  ): Promise<{ success: boolean }> {
    if (!shopifyId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }
    try {
      await this.handDeliveryService.setOrderAsDeliveredIfFound(
        shopifyId,
        orderShopifyId,
        conversationId,
      );
      return { success: true };
    } catch (error: any) {
      if (error instanceof UserIsNotOrderCustomerException) {
        throw new UnauthorizedException(error);
      }
      throw new BadRequestException(error);
    }
  }
}
