import { routesV1 } from '@config/routes.config';
import { User } from '@libs/application/decorators/user.decorator';
import {
  OrderStatus,
  PrismaMainClient,
  SalesChannelName,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
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
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Response } from 'express';
import { PassThrough } from 'stream';
import { FulfillmentService } from '../domain/fulfillment.service';
import { OrderCreationService } from '../domain/order-creation.service';
import { OrderUpdateService } from '../domain/order-update.service';
import { OrderService } from '../domain/order.service';
import {
  OrderNotFoundException,
  UserNotConcernedByOrderException,
  UserNotOrderLineVendorException,
} from '../domain/ports/exceptions';
import {
  AccountPageOrder,
  OrderToStoreFromAdminInput,
} from '../domain/ports/types';
import { RefundService } from '../domain/refund.service';
import { OrderMapper } from '../infrastructure/store/order.mapper';

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

class ShippingAddressDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  address1!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  address2?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  company?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  phone!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  lastName!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  zip!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  city!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  country!: string;
}

class OrderLineItemDTO {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ required: true })
  variantId!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true })
  quantity!: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true })
  unitPriceInCents!: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true })
  unitBuyerCommissionInCents!: number;

  @IsEnum(ShippingSolution)
  @IsNotEmpty()
  @ApiProperty({ required: true })
  shippingSolution!: ShippingSolution;
}

class CreateOrderInputDTO implements OrderToStoreFromAdminInput {
  @IsEnum(SalesChannelName)
  @IsNotEmpty()
  @ApiProperty({ required: true })
  salesChannelName!: SalesChannelName;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ required: true })
  customerId!: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ShippingAddressDTO)
  shippingAddress!: ShippingAddressDTO;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderLineItemDTO)
  lineItems!: OrderLineItemDTO[];

  @ApiProperty({ required: true, isArray: true, type: String })
  @IsArray()
  @Type(() => String)
  priceOfferIds!: string[];
}

@Controller(routesV1.version)
export class OrderController {
  constructor(
    private orderService: OrderService,
    private orderMapper: OrderMapper,
    private fulfillmentService: FulfillmentService,
    private refundService: RefundService,
    private prisma: PrismaMainClient,
    private orderCreationService: OrderCreationService,
    private orderUpdateService: OrderUpdateService,
  ) {}

  @Get(routesV1.order.getOrder)
  @UseGuards(JwtAuthGuard)
  async getOrder(
    @Param('orderId')
    orderId: string,
    @User() { userId }: ExtractedUser,
  ): Promise<AccountPageOrder> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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

  @Post(routesV1.order.root)
  @UseGuards(AuthGuard('header-api-key'))
  async createOrderAsAdmin(
    @Body()
    body: CreateOrderInputDTO,
    @Query()
    { authorId }: { authorId?: string },
  ): Promise<void> {
    const orderToStore =
      await this.orderMapper.mapOrderToStoreFromUserInput(body);
    await this.orderCreationService.storeOrder(orderToStore, {
      type: 'admin',
      id: authorId,
    });
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
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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

  @Post(routesV1.order.fulFillAsAdmin)
  @UseGuards(AuthGuard('header-api-key'))
  async fulFillOrderLineAsAdmin(
    @Param('fulfillmentOrderId')
    fulfillmentOrderId: string,
    @Body()
    { trackingUrl }: OrderLineFulfillmentDTO,
    @Query()
    { authorId }: { authorId?: string },
  ): Promise<void> {
    const parsedTrackingUrl = new URL(trackingUrl).href;

    await this.fulfillmentService.fulfill(
      fulfillmentOrderId,
      parsedTrackingUrl,
      { type: 'admin', id: authorId },
    );
  }

  @Post(routesV1.order.fulfill)
  @UseGuards(JwtAuthGuard)
  async fulFillOrderLine(
    @Param('fulfillmentOrderId')
    fulfillmentOrderId: string,
    @Body()
    { trackingUrl }: OrderLineFulfillmentDTO,
    @User() { userId }: ExtractedUser,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!userId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }

    const parsedTrackingUrl = new URL(trackingUrl).href;

    await this.fulfillmentService.fulfillAsVendor(
      userId,
      fulfillmentOrderId,
      parsedTrackingUrl,
    );
  }

  @Post(routesV1.order.cancelOrderAsAdmin)
  @UseGuards(AuthGuard('header-api-key'))
  async cancelOrderAsAdmin(
    @Param('orderId')
    orderId: string,
    @Query()
    { authorId }: { authorId?: string },
  ): Promise<string> {
    await this.refundService.cancelOrder(orderId, {
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
      await this.refundService.cancelOrderLineByVendor(orderLineId, {
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
    @Param('orderId')
    orderId: string,
    @Body()
    { updatedAt, status }: OrderStatusUpdateDTO,
    @Query()
    { authorId }: { authorId?: string },
  ): Promise<string> {
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

    return `Order ${orderId} has been marked as ${status} at ${updatedAt}`;
  }
}
