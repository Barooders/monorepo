import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { routesV1 } from '@config/routes.config';

import { B2BUserGuard } from '@libs/application/decorators/b2b-user.guard';
import { User } from '@libs/application/decorators/user.decorator';
import {
  PriceOfferStatus,
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import { Amount, UUID } from '@libs/domain/value-objects';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, isUUID } from 'class-validator';
import { PriceOfferService } from '../domain/price-offer.service';

class UpdatePriceOfferDTO {
  @ApiProperty()
  status!: PriceOfferStatus;
}

class NewPriceOfferDTO {
  @IsString()
  @ApiProperty()
  buyerId!: string;

  @IsNumber()
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

class PriceOfferDTO extends NewPriceOfferDTO {
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
    body: NewPriceOfferDTO,
    @User() { userId }: ExtractedUser,
  ): Promise<PriceOfferDTO> {
    return this.createPriceOffer(body, SalesChannelName.PUBLIC, userId);
  }

  @ApiResponse({
    type: PriceOfferDTO,
  })
  @Post(routesV1.priceOffer.b2b)
  @UseGuards(B2BUserGuard)
  async createB2BPriceOffer(
    @Body()
    body: NewPriceOfferDTO,
    @User() { userId }: ExtractedUser,
  ): Promise<PriceOfferDTO> {
    return this.createPriceOffer(body, SalesChannelName.B2B, userId);
  }

  @ApiResponse({
    type: PriceOfferDTO,
  })
  @Put(routesV1.priceOffer.getPriceOffer)
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

  private async createPriceOffer(
    {
      buyerId,
      newPriceInCents,
      description,
      productId,
      productVariantId,
    }: NewPriceOfferDTO,
    salesChannelName: SalesChannelName,
    userId?: string,
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

    const newPriceOffer = await this.priceOfferService.createNewPriceOffer(
      new UUID({ uuid: userId }),
      buyerUUID,
      new Amount({ amountInCents: newPriceInCents }),
      new UUID({ uuid: productId }),
      salesChannelName,
      productVariantId ? new UUID({ uuid: productVariantId }) : undefined,
      description,
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
}
