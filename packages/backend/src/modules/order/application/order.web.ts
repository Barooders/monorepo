import { routesV1 } from '@config/routes.config';
import { User } from '@libs/application/decorators/user.decorator';
import { OrderStatus, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import { Response } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FulfillmentService } from '../domain/fulfillment.service';
import { OrderUpdateService } from '../domain/order-update.service';
import { OrderService } from '../domain/order.service';
import {
  OrderNotFoundException,
  UserNotConcernedByOrderException,
  UserNotOrderLineVendorException,
} from '../domain/ports/exceptions';
import { AccountPageOrder } from '../domain/ports/types';
import { RefundService } from '../domain/refund.service';
import { UUID } from '@libs/domain/value-objects';
import { PassThrough } from 'stream';

class OrderLineFulfillmentDTO {
  @IsNotEmpty()
  @IsString()
  trackingUrl!: string;
}

class OrderStatusUpdateDTO {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2023-01-14 16:54:08',
  })
  updatedAt!: string;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  @ApiProperty({ enum: OrderStatus })
  status!: OrderStatus;
}

@Controller(routesV1.version)
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private orderService: OrderService,
    private fulfillmentService: FulfillmentService,
    private refundService: RefundService,
    private prisma: PrismaMainClient,
    private orderUpdateService: OrderUpdateService,
  ) {}

  @Get(routesV1.order.getOrder)
  @UseGuards(JwtAuthGuard)
  async getOrder(
    @Param('orderId')
    orderId: string,
    @User() { userId }: ExtractedUser,
  ): Promise<AccountPageOrder> {
    if (!userId) {
      throw new UnauthorizedException('User not found in token');
    }

    try {
      return await this.orderService.getAccountPageOrder(orderId, userId);
    } catch (error: any) {
      if (
        error instanceof UserNotConcernedByOrderException ||
        error instanceof OrderNotFoundException
      ) {
        throw new NotFoundException(`Order not found`);
      }
      throw new BadRequestException(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="shipping-label.pdf"')
  @Post(routesV1.order.getOrCreateShippingLabel)
  @UseGuards(JwtAuthGuard)
  async getOrCreateShippingLabel(
    @Param('orderId')
    orderId: string,
    @User() { userId }: ExtractedUser,
    @Res() res: Response,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User not found in token');
    }

    const labelPdfStream =
      await this.fulfillmentService.getOrCreateShippingLabel(
        new UUID({ uuid: orderId }),
        new UUID({ uuid: userId }),
      );

    const stream = new PassThrough();

    stream.end(labelPdfStream);
    stream.pipe(res);
  }

  @Post(routesV1.order.fulFillOrderLineAsAdmin)
  @UseGuards(AuthGuard('header-api-key'))
  async fulFillOrderLineAsAdmin(
    @Param('orderLineId')
    orderLineId: string,
    @Body()
    { trackingUrl }: OrderLineFulfillmentDTO,
    @Query()
    { authorId }: { authorId?: string },
  ): Promise<string> {
    const parsedTrackingUrl = new URL(trackingUrl).href;

    await this.fulfillmentService.fulfillOrderLine(
      orderLineId,
      parsedTrackingUrl,
      { type: 'admin', id: authorId },
    );

    return `Order line ${orderLineId} has been fulfilled with tracking url ${parsedTrackingUrl}`;
  }

  @Post(routesV1.order.fulFillOrderLine)
  @UseGuards(JwtAuthGuard)
  async fulFillOrderLine(
    @Param('orderLineId')
    orderLineId: string,
    @Body()
    { trackingUrl }: OrderLineFulfillmentDTO,
    @User() { userId }: ExtractedUser,
  ): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }

    const parsedTrackingUrl = new URL(trackingUrl).href;

    await this.fulfillmentService.fulfillOrderLineAsVendor(
      userId,
      orderLineId,
      parsedTrackingUrl,
    );
  }

  @Post(routesV1.order.refundOrderAsAdmin)
  @UseGuards(AuthGuard('header-api-key'))
  async refundOrderAsAdmin(
    @Param('orderId')
    orderId: string,
    @Query()
    { authorId }: { authorId?: string },
  ): Promise<string> {
    await this.refundService.refundOrder(orderId, {
      type: 'admin',
      id: authorId,
    });

    return `Order ${orderId} has been refunded.`;
  }

  @Post(routesV1.order.cancelOrderLine)
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @Param('orderLineId')
    orderLineId: string,
    @User() { userId }: ExtractedUser,
  ): Promise<{ success: boolean }> {
    try {
      await this.refundService.cancelOrderLineByUser(orderLineId, {
        type: 'user',
        id: userId,
      });

      return { success: true };
    } catch (error: any) {
      if (error instanceof UserNotOrderLineVendorException)
        throw new UnauthorizedException(error);

      throw new BadRequestException(error);
    }
  }

  @Post(routesV1.order.updateOrderStatusAsAdmin)
  @UseGuards(AuthGuard('header-api-key'))
  async updateOrderStatusAsAdmin(
    @Param('orderLineId')
    orderLineId: string,
    @Body()
    { updatedAt, status }: OrderStatusUpdateDTO,
    @Query()
    { authorId }: { authorId?: string },
  ): Promise<string> {
    const { orderId } = await this.prisma.orderLines.findUniqueOrThrow({
      where: { id: orderLineId },
    });
    //TODO: This update should not be handled at order level but at order line level
    await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
      orderId,
      status,
      {
        type: 'admin',
        id: authorId,
      },
      new Date(updatedAt),
      async () => {},
    );

    return `Order with order line ${orderLineId} has been marked as ${status} at ${updatedAt}`;
  }
}
