import { routesV1 } from '@config/routes.config';
import { AdminGuard } from '@libs/application/decorators/admin.guard';
import { OrGuard } from '@libs/application/decorators/or-guard';
import { User } from '@libs/application/decorators/user.decorator';
import {
  Condition,
  PrismaMainClient,
  ProductNotation,
  ProductStatus,
} from '@libs/domain/prisma.main.client';
import { StoredProduct } from '@libs/domain/product.interface';
import { getValidShopifyId } from '@libs/infrastructure/shopify/validators';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';

import { Author, BAROODERS_NAMESPACE, MetafieldType } from '@libs/domain/types';
import { Amount, AmountDTO, UUID } from '@libs/domain/value-objects';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDataURI,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CollectionService } from '../domain/collection.service';
import { UserNotAllowedException } from '../domain/ports/exceptions';
import { IStoreClient } from '../domain/ports/store.client';
import {
  DraftProductInputDto,
  ProductCreationService,
} from '../domain/product-creation.service';
import {
  ModerationAction,
  ProductUpdateService,
} from '../domain/product-update.service';
import { ProductAdminDTO } from './product.dto';

type CollectionType = {
  id: string;
  handle: string;
  shortName: string | null;
  title: string | null;
};

type ProductPublicDTO = {
  id: string;
  breadcrumbs: CollectionType[];
};

class MetafieldInputDto {
  @IsString()
  @ApiProperty({ type: 'string' })
  key!: string;

  @IsEnum(MetafieldType)
  @ApiProperty({ enum: MetafieldType })
  type!: MetafieldType;

  @IsString()
  @ApiProperty({ type: 'string' })
  value!: string;

  namespace = BAROODERS_NAMESPACE;
}

class ProductUpdateInputDto {
  @IsOptional()
  @IsEnum(ProductStatus)
  @ApiProperty({ enum: ProductStatus, required: false })
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  bodyHtml?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  title?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  @ApiProperty({ required: false, isArray: true, minItems: 1, type: String })
  tags?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, type: 'string' })
  product_type?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', required: false })
  handDeliveryPostalCode?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MetafieldInputDto)
  @ApiProperty({ type: 'array', required: false })
  metafields?: MetafieldInputDto[];
}

class ProductAdminUpdateInputDto extends ProductUpdateInputDto {
  @IsOptional()
  @IsEnum(ProductNotation)
  @ApiProperty({ required: false, enum: ProductNotation })
  manualNotation?: ProductNotation;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ required: false, type: UUID })
  vendorId?: string;
}

class ProductVariantUpdateInputDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ required: false, type: AmountDTO })
  @IsOptional()
  price?: AmountDTO;

  @ApiProperty({ required: false, type: AmountDTO })
  @IsOptional()
  compareAtPrice?: AmountDTO;

  @ApiProperty({ required: false })
  @IsOptional()
  condition?: Condition;
}

class ModerateProductInputDto {
  @IsEnum(ModerationAction)
  action!: ModerationAction;
}

class AddProductImageDTO {
  @ApiProperty()
  @IsDataURI()
  attachment!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  position?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  filename?: string;
}

class AddProductImageResponseDTO {
  @ApiProperty()
  src!: string;

  @ApiProperty()
  id!: string;
}

@Controller(routesV1.version)
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(
    private productCreationService: ProductCreationService,
    private productUpdateService: ProductUpdateService,
    private collectionService: CollectionService,
    private storeClient: IStoreClient,
    private prisma: PrismaMainClient,
  ) {}

  @Post(routesV1.product.createDraftProduct)
  @UseGuards(OrGuard([AuthGuard('header-api-key'), JwtAuthGuard]))
  async createDraftProduct(
    @Body()
    draftProductInputDto: DraftProductInputDto,
    @Query()
    { sellerId, isAdminMode }: { sellerId: string; isAdminMode?: string },
  ): Promise<{ body: { product: StoredProduct } }> {
    const author: Author = {
      type: 'user',
    };

    const product = await this.productCreationService.createDraftProduct(
      draftProductInputDto,
      sellerId,
      isAdminMode !== 'true',
      author,
    );
    return {
      body: {
        product,
      },
    };
  }

  @ApiCreatedResponse({
    type: AddProductImageResponseDTO,
  })
  @Post(routesV1.product.addProductImage)
  async addProductImage(
    @Param('productId') productId: string,
    @Body()
    addProductImageDTO: AddProductImageDTO,
  ): Promise<{ src: string; id: string }> {
    const image = await this.productUpdateService.addProductImage(
      productId,
      addProductImageDTO,
    );

    return { src: image.src, id: image.id };
  }

  @ApiOkResponse()
  @Delete(routesV1.product.deleteProductImage)
  async deleteProductImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
  ): Promise<void> {
    await this.productUpdateService.deleteProductImage(productId, imageId);
  }

  @Get(routesV1.product.getProductByHandle)
  async getProductByHandle(
    @Param('productHandle')
    productHandle: string,
  ): Promise<ProductPublicDTO | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { handle: productHandle },
      });

      if (!product) {
        throw new NotFoundException(
          `Could not find product by handle ${productHandle}`,
        );
      }

      const breadcrumbs = await this.collectionService.getProductBreadcrumbs(
        product.id,
      );

      return { id: product.id, breadcrumbs };
    } catch (e: any) {
      this.logger.warn(e.message, e);
      return null;
    }
  }

  @ApiResponse({
    type: ProductAdminDTO,
  })
  @Get(routesV1.product.getProductByAdmin)
  @UseGuards(JwtAuthGuard)
  async getProductByAdmin(
    @User() { userId }: ExtractedUser,
    @Param('productId') productId: string,
  ): Promise<ProductAdminDTO> {
    const product = await this.prisma.product.findFirst({
      where: { shopifyId: Number(productId) },
      select: { vendorId: true },
    });
    if (product?.vendorId !== userId) {
      throw new UnauthorizedException(
        `Not authorized to access product ${productId}`,
      );
    }
    return await this.storeClient.getProductDetails(productId);
  }

  @Patch(routesV1.product.updateProduct)
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @User() { shopifyId: userShopifyId, userId }: ExtractedUser,
    @Param('productId')
    productId: string,
    @Body()
    productUpdates: ProductUpdateInputDto,
  ): Promise<void> {
    try {
      if (!userShopifyId) {
        throw new UnauthorizedException(
          `User not found in token, user (${userId})`,
        );
      }

      const { bodyHtml } = productUpdates;
      const concreteUpdates = {
        ...productUpdates,
        ...(bodyHtml && { body_html: bodyHtml }),
      };

      await this.productUpdateService.updateProductByUser(
        {
          id: await this.getInternalProductId(productId),
          storeId: productId,
        },
        concreteUpdates,
        {
          id: userId,
          storeId: userShopifyId,
        },
      );
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof UserNotAllowedException)
        throw new UnauthorizedException(error);

      throw new BadRequestException(error);
    }
  }

  @Patch(routesV1.product.updateProductVariant)
  @UseGuards(JwtAuthGuard)
  async updateProductVariant(
    @Param('productId')
    productId: string,
    @Param('productVariantId')
    productVariantId: string,
    @Body()
    productVariantUpdates: ProductVariantUpdateInputDto,
    @User() jwtToken: ExtractedUser | undefined,
  ): Promise<void> {
    if (!jwtToken?.shopifyId) {
      throw new UnauthorizedException(
        `User not found in token, user (${jwtToken?.userId})`,
      );
    }

    await this.productUpdateService.updateProductVariant(
      {
        id: await this.getInternalProductId(productId),
        storeId: productId,
      },
      {
        id: await this.getInternalVariantId(productVariantId),
        storeId: productVariantId,
      },
      this.mapProductVariantUpdate(productVariantUpdates),
      {
        type: 'user',
        id: jwtToken?.userId,
      },
    );
  }

  @Patch(routesV1.product.updateProductByAdmin)
  @UseGuards(OrGuard([AuthGuard('header-api-key'), AdminGuard]))
  async updateProductByAdmin(
    @Param('productId')
    productId: string,
    @Body()
    productUpdates: ProductAdminUpdateInputDto,
    @Query()
    { authorId }: { authorId?: string },
    @User() jwtToken: ExtractedUser | undefined,
  ): Promise<void> {
    await this.productUpdateService.updateProduct(
      {
        id: await this.getInternalProductId(productId),
        storeId: productId,
      },
      productUpdates,
      { notifyVendor: false },
      {
        type: 'admin',
        id: jwtToken?.userId ?? authorId,
      },
    );
  }

  @Post(routesV1.product.triggerVendorProductsUpdateByAdmin)
  @UseGuards(OrGuard([AuthGuard('header-api-key'), AdminGuard]))
  async triggerVendorProductsUpdateByAdmin(
    @Param('vendorId')
    vendorId: string,
    @Query()
    { authorId }: { authorId?: string },
    @User() jwtToken: ExtractedUser | undefined,
  ): Promise<void> {
    const products = await this.prisma.product.findMany({
      where: {
        vendorId,
      },
      select: {
        id: true,
        shopifyId: true,
      },
    });

    for (const { id, shopifyId } of products) {
      void this.productUpdateService.updateProduct(
        {
          id,
          storeId: shopifyId.toString(),
        },
        {
          vendorId,
        },
        { notifyVendor: false },
        {
          type: 'admin',
          id: jwtToken?.userId ?? authorId,
        },
      );
    }
  }

  @Patch(routesV1.product.updateProductVariantByAdmin)
  @UseGuards(OrGuard([AuthGuard('header-api-key'), AdminGuard]))
  async updateProductVariantByAdmin(
    @Param('productId')
    productId: string,
    @Param('productVariantId')
    productVariantId: string,
    @Body()
    productVariantUpdates: ProductVariantUpdateInputDto,
    @Query()
    { authorId }: { authorId?: string },
    @User() jwtToken: ExtractedUser | undefined,
  ): Promise<void> {
    await this.productUpdateService.updateProductVariant(
      {
        id: await this.getInternalProductId(productId),
        storeId: productId,
      },
      {
        id: await this.getInternalVariantId(productVariantId),
        storeId: productVariantId,
      },
      this.mapProductVariantUpdate(productVariantUpdates),
      {
        type: 'admin',
        id: jwtToken?.userId ?? authorId,
      },
    );
  }

  @Post(routesV1.product.moderateProductByAdmin)
  @UseGuards(OrGuard([AuthGuard('header-api-key'), AdminGuard]))
  async moderateProduct(
    @Param('productId')
    productId: string,
    @Body()
    { action }: ModerateProductInputDto,
    @Query()
    { authorId }: { authorId?: string },
    @User() jwtToken: ExtractedUser | undefined,
  ): Promise<void> {
    await this.productUpdateService.moderateProduct(
      {
        id: await this.getInternalProductId(productId),
        storeId: productId,
      },
      action,
      {
        type: 'admin',
        id: jwtToken?.userId ?? authorId,
      },
    );
  }

  private async getInternalProductId(productId: string): Promise<string> {
    const { id } = await this.prisma.product.findUniqueOrThrow({
      where: {
        shopifyId: getValidShopifyId(productId),
      },
    });

    return id;
  }

  private async getInternalVariantId(variantId: string): Promise<string> {
    const { id } = await this.prisma.productVariant.findUniqueOrThrow({
      where: {
        shopifyId: getValidShopifyId(variantId),
      },
    });

    return id;
  }

  private mapProductVariantUpdate = ({
    quantity,
    price,
    compareAtPrice,
    condition,
  }: ProductVariantUpdateInputDto) => ({
    ...(condition && { condition }),
    ...(quantity !== undefined && { inventory_quantity: quantity }),
    ...(compareAtPrice !== undefined && {
      compare_at_price: new Amount({
        amountInCents: compareAtPrice.amountInCents,
      }).amount.toString(),
    }),
    ...(price !== undefined && {
      price: new Amount({
        amountInCents: price.amountInCents,
      }).amount.toString(),
    }),
  });
}
