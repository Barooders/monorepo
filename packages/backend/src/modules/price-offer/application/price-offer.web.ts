import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { routesV1 } from '@config/routes.config';

import { AdminGuard } from '@libs/application/decorators/admin.guard';
import { B2BUserGuard } from '@libs/application/decorators/b2b-user.guard';
import { OrGuard } from '@libs/application/decorators/or-guard';
import { User } from '@libs/application/decorators/user.decorator';
import {
  PriceOfferStatus,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { Amount, UUID } from '@libs/domain/value-objects';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  isUUID,
} from 'class-validator';
import { PriceOfferService } from '../domain/price-offer.service';

class UpdatePriceOfferDTO {
  @ApiProperty()
  @IsEnum(PriceOfferStatus)
  status!: PriceOfferStatus;
}

class UpdatePriceOfferByAdminDTO {
  @IsOptional()
  @IsEnum(PriceOfferStatus)
  @ApiProperty({ required: false })
  status?: PriceOfferStatus;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  newPriceInCents?: bigint;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  includedBuyerCommissionPercentage?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  publicNote?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  internalNote?: string;
}

class NewPublicPriceOfferDTO {
  @IsString()
  @ApiProperty()
  buyerId!: string;

  @IsInt()
  @ApiProperty()
  newPriceInCents!: number;

  @IsString()
  @ApiProperty()
  productId!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  productVariantId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}

class NewB2BPriceOfferDTO {
  @IsInt()
  @ApiProperty()
  buyerUnitPriceInCents!: number;

  @IsInt()
  @ApiProperty()
  sellerUnitPriceInCents!: number;

  @IsString()
  @ApiProperty()
  productId!: string;

  @IsString()
  @ApiProperty({ required: true })
  description!: string;
}

class PriceOfferDTO extends NewPublicPriceOfferDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  initiatedBy!: string;

  @ApiProperty()
  status!: PriceOfferStatus;

  @ApiProperty()
  discountCode?: string;
}

@Controller(routesV1.version)
export class PriceOfferController {
  private readonly logger = new Logger(PriceOfferController.name);

  constructor(
    private priceOfferService: PriceOfferService,
    protected readonly prisma: PrismaMainClient,
  ) {}

  @ApiResponse({
    type: PriceOfferDTO,
  })
  @Post(routesV1.priceOffer.root)
  @UseGuards(JwtAuthGuard)
  async createPublicPriceOffer(
    @Body()
    {
      buyerId,
      productId,
      productVariantId,
      newPriceInCents,
    }: NewPublicPriceOfferDTO,
    @User() { userId }: ExtractedUser,
  ): Promise<PriceOfferDTO> {
    if (!userId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }

    const buyerUUID = new UUID({
      uuid: isUUID(buyerId)
        ? buyerId
        : (
            await this.prisma.customer.findUniqueOrThrow({
              where: { shopifyId: parseInt(buyerId) },
              select: { authUserId: true },
            })
          ).authUserId,
    });

    const newPriceOffer =
      await this.priceOfferService.createNewPublicPriceOffer(
        new UUID({ uuid: userId }),
        buyerUUID,
        new Amount({ amountInCents: newPriceInCents }),
        new UUID({ uuid: productId }),
        productVariantId ? new UUID({ uuid: productVariantId }) : undefined,
      );

    return {
      buyerId: newPriceOffer.buyerId,
      createdAt: newPriceOffer.createdAt.toISOString(),
      id: newPriceOffer.id,
      initiatedBy: newPriceOffer.initiatedBy,
      newPriceInCents: parseInt(newPriceOffer.newPriceInCents.toString()),
      productId: newPriceOffer.productId,
      productVariantId: newPriceOffer.productVariantId ?? undefined,
      status: newPriceOffer.status,
    };
  }

  @ApiResponse({
    type: PriceOfferDTO,
  })
  @Post(routesV1.priceOffer.b2b)
  @UseGuards(B2BUserGuard)
  async createB2BPriceOfferByBuyer(
    @Body()
    {
      buyerUnitPriceInCents,
      sellerUnitPriceInCents,
      productId,
      description,
    }: NewB2BPriceOfferDTO,
    @User() { userId }: ExtractedUser,
  ): Promise<void> {
    if (!userId || !isUUID(userId)) {
      throw new UnauthorizedException(
        `User UUID not found in token, user (${userId})`,
      );
    }

    await this.priceOfferService.createNewB2BPriceOfferByBuyer(
      new UUID({ uuid: userId }),
      new Amount({ amountInCents: buyerUnitPriceInCents }),
      new Amount({ amountInCents: sellerUnitPriceInCents }),
      new UUID({ uuid: productId }),
      description,
    );
  }

  @Put(routesV1.priceOffer.priceOffer)
  @UseGuards(JwtAuthGuard)
  async updatePriceOffer(
    @Param('priceOfferId') priceOfferId: string,
    @Body() body: UpdatePriceOfferDTO,
    @User() { userId }: ExtractedUser,
  ): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }

    if (body.status === PriceOfferStatus.ACCEPTED) {
      return await this.priceOfferService.acceptPriceOffer(
        new UUID({ uuid: userId }),
        new UUID({ uuid: priceOfferId }),
      );
    }

    if (body.status === PriceOfferStatus.DECLINED) {
      return await this.priceOfferService.declinePriceOffer(
        new UUID({ uuid: userId }),
        new UUID({ uuid: priceOfferId }),
      );
    }

    if (body.status === PriceOfferStatus.CANCELED) {
      return await this.priceOfferService.cancelPriceOffer(
        new UUID({ uuid: userId }),
        new UUID({ uuid: priceOfferId }),
      );
    }

    throw new BadRequestException(
      `${body.status} is an incorrect price offer status`,
    );
  }

  @Put(routesV1.priceOffer.priceOfferByAdmin)
  @UseGuards(OrGuard([AuthGuard('header-api-key'), AdminGuard]))
  async updatePriceOfferAsAdmin(
    @Param('priceOfferId') priceOfferId: string,
    @Body() body: UpdatePriceOfferByAdminDTO,
    @Query()
    { authorId }: { authorId?: string },
  ): Promise<void> {
    return await this.priceOfferService.updatePriceOfferByAdmin(
      new UUID({ uuid: priceOfferId }),
      body,
      authorId,
    );
  }
}
