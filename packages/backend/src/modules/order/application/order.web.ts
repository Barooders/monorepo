import { routesV1 } from '@config/routes.config';
import { User } from '@libs/application/decorators/user.decorator';
import {
  Currency,
  OrderStatus,
  PrismaMainClient,
  SalesChannelName,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import {
  Condition,
  PrismaStoreClient,
  ProductStatus,
} from '@libs/domain/prisma.store.client';
import { UUID } from '@libs/domain/value-objects';
import { jsonStringify } from '@libs/helpers/json';
import { readableCode } from '@libs/helpers/safe-id';
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
import { Type } from 'class-transformer';
import {
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
import { reduce } from 'lodash';
import { PassThrough } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { FulfillmentService } from '../domain/fulfillment.service';
import {
  OrderAdminCreation,
  OrderCreationService,
} from '../domain/order-creation.service';
import { OrderUpdateService } from '../domain/order-update.service';
import { OrderService } from '../domain/order.service';
import {
  OrderNotFoundException,
  UserNotConcernedByOrderException,
  UserNotOrderLineVendorException,
} from '../domain/ports/exceptions';
import { AccountPageOrder, OrderToStore } from '../domain/ports/types';
import { RefundService } from '../domain/refund.service';

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
  unitBuyerCommission!: number;
}

class CreateOrderInputDTO {
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
  @ValidateNested({ each: true })
  @Type(() => OrderLineItemDTO)
  lineItems!: OrderLineItemDTO[];
}

@Controller(routesV1.version)
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private orderService: OrderService,
    private fulfillmentService: FulfillmentService,
    private refundService: RefundService,
    private prisma: PrismaMainClient,
    private storePrisma: PrismaStoreClient,
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
    {
      customerId,
      lineItems,
      shippingAddress,
      salesChannelName,
    }: CreateOrderInputDTO,
    @Query()
    { authorId }: { authorId?: string },
  ): Promise<void> {
    const { email: customerEmail } = await this.prisma.users.findFirstOrThrow({
      where: { id: customerId },
    });
    const { orderLines, fulfillmentOrders } =
      await this.mapAdminInputForOrderCreation(lineItems);

    await this.orderCreationService.storeOrder(
      {
        order: {
          salesChannelName,
          name: `#${readableCode()}`,
          status: OrderStatus.CREATED,
          customerEmail: customerEmail ?? '',
          customerId,
          totalPriceInCents: reduce(
            lineItems,
            (total, { quantity, unitPriceInCents, unitBuyerCommission }) => {
              return (
                total + quantity * (unitPriceInCents + unitBuyerCommission)
              );
            },
            0,
          ),
          totalPriceCurrency: Currency.EUR,
          shippingAddressAddress1: shippingAddress.address1,
          shippingAddressAddress2: shippingAddress.address2 ?? null,
          shippingAddressCompany: shippingAddress.company ?? null,
          shippingAddressCity: shippingAddress.city,
          shippingAddressCountry: shippingAddress.country,
          shippingAddressPhone: shippingAddress.phone,
          shippingAddressZip: shippingAddress.zip,
          shippingAddressFirstName: shippingAddress.firstName,
          shippingAddressLastName: shippingAddress.lastName,
        },
        orderLines,
        fulfillmentOrders,
        priceOffers: [], // Input
      },
      {
        type: 'admin',
        id: authorId,
      },
    );
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

  /**
   * @deprecated Use cancel endpoint instead
   */
  @Post(routesV1.order.refundOrderAsAdmin)
  @UseGuards(AuthGuard('header-api-key'))
  async refundOrderAsAdmin(
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

  private async mapAdminInputForOrderCreation(
    lineItems: OrderAdminCreation['lineItems'],
  ): Promise<Pick<OrderToStore, 'orderLines' | 'fulfillmentOrders'>> {
    const storeVariants =
      await this.storePrisma.storeExposedProductVariant.findMany({
        where: {
          id: {
            in: lineItems.map(({ variantId }) => variantId),
          },
          variant: {
            product: {
              exposedProduct: {
                status: ProductStatus.ACTIVE,
              },
            },
          },
        },
        select: {
          id: true,
          title: true,
          condition: true,
          inventoryQuantity: true,
          variant: {
            include: {
              product: {
                include: {
                  exposedProduct: true,
                },
              },
            },
          },
        },
      });

    const generatedFulfillmentOrderIds = reduce(
      storeVariants,
      (
        acc,
        {
          variant: {
            product: { vendorId },
          },
        },
      ) => {
        if (!acc[vendorId]) {
          acc[vendorId] = uuidv4();
        }

        return acc;
      },
      {} as Record<string, string>,
    );

    return {
      orderLines: lineItems.map(({ variantId, quantity, unitPriceInCents }) => {
        const storeVariant = storeVariants.find(({ id }) => variantId === id);

        if (!storeVariant || storeVariant.inventoryQuantity < quantity) {
          throw new Error(
            `Order cannot be processed for variant ${variantId}: ${jsonStringify({ storeVariant, inventoryQuantity: storeVariant?.inventoryQuantity, quantity })}`,
          );
        }

        const exposedProduct = storeVariant.variant.product.exposedProduct;

        return {
          name: storeVariant.title,
          vendorId: storeVariant.variant.product.vendorId,
          priceInCents: unitPriceInCents,
          discountInCents: 0,
          shippingSolution: ShippingSolution.VENDOR,
          priceCurrency: Currency.EUR,
          productType: exposedProduct?.productType ?? '',
          productHandle: exposedProduct?.handle ?? '',
          productImage: exposedProduct?.firstImage ?? '',
          variantCondition:
            storeVariant.condition === Condition.REFURBISHED_AS_NEW
              ? Condition.AS_NEW
              : storeVariant.condition,
          productModelYear: exposedProduct?.modelYear,
          productGender: exposedProduct?.gender,
          productBrand: exposedProduct?.brand,
          quantity,
          productVariantId: variantId,
          fulfillmentOrder: {
            id: generatedFulfillmentOrderIds[
              storeVariant.variant.product.vendorId
            ],
          },
        };
      }),
      fulfillmentOrders: Object.values(generatedFulfillmentOrderIds).map(
        (id) => ({
          id,
        }),
      ),
    };
  }
}
