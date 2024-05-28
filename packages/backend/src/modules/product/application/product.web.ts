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
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';

import { CustomerRepository } from '@libs/domain/customer.repository';
import { Author, BAROODERS_NAMESPACE, MetafieldType } from '@libs/domain/types';
import { Amount, AmountDTO, UUID } from '@libs/domain/value-objects';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import { InjectQueue } from '@nestjs/bull';
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
import { Queue } from 'bull';
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
import { QueueNames } from '../config';
import { CollectionService } from '../domain/collection.service';
import { UserNotAllowedException } from '../domain/ports/exceptions';
import { IPIMClient } from '../domain/ports/pim.client';
import { DocumentType, ISearchClient } from '../domain/ports/search-client';
import { IStoreClient } from '../domain/ports/store.client';
import {
  DraftProductInputDto,
  ProductCreationService,
} from '../domain/product-creation.service';
import {
  ModerationAction,
  ProductUpdateService,
} from '../domain/product-update.service';
import {
  CreateProductModelDto,
  ProductAdminDTO,
  UploadImagesDto,
} from './product.dto';

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

class CreatedProductResponseDTO {
  @ApiProperty()
  internalId!: string;
}

@Controller(routesV1.version)
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(
    @InjectQueue(QueueNames.IMPORT_IMAGES)
    private importImageQueue: Queue,
    private productCreationService: ProductCreationService,
    private productUpdateService: ProductUpdateService,
    private customerRepository: CustomerRepository,
    private collectionService: CollectionService,
    private storeClient: IStoreClient,
    private prisma: PrismaMainClient,
    private pimClient: IPIMClient,
    private searchClient: ISearchClient,
  ) {}

  @Post(routesV1.product.createDraftProduct)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: CreatedProductResponseDTO })
  async createDraftProduct(
    @User() { userId }: ExtractedUser,
    @Body()
    draftProductInputDto: DraftProductInputDto,
  ): Promise<CreatedProductResponseDTO> {
    const author: Author = {
      type: 'user',
    };

    const { internalId } = await this.productCreationService.createDraftProduct(
      draftProductInputDto,
      new UUID({ uuid: userId }),
      author,
    );

    return {
      internalId,
    };
  }

  @Post(routesV1.product.createProductByAdmin)
  @UseGuards(AuthGuard('header-api-key'))
  async createProduct(
    @Body()
    draftProductInputDto: DraftProductInputDto,
    @Query()
    { sellerId }: { sellerId: string; isAdminMode?: string },
  ): Promise<{
    body?: { product: { internalId: string } };
    status: 'success' | 'error';
    reason?: string;
  }> {
    const author: Author = {
      type: 'user',
    };

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!sellerId)
      throw new Error(`Cannot find vendor with sellerId: ${sellerId}`);

    try {
      const { internalId } =
        await this.productCreationService.createProductByAdmin(
          draftProductInputDto,
          new UUID({ uuid: sellerId }),
          author,
        );
      return {
        status: 'success',
        body: {
          product: {
            internalId,
          },
        },
      };
    } catch (error: any) {
      return {
        status: 'error',
        reason: error.message,
      };
    }
  }

  @ApiCreatedResponse({
    type: AddProductImageResponseDTO,
  })
  @Post(routesV1.product.addProductImage)
  async addProductImage(
    @Param('productInternalId') productInternalId: string,
    @Body()
    addProductImageDTO: AddProductImageDTO,
  ): Promise<{ src: string; id: string }> {
    const image = await this.productUpdateService.addProductImage(
      new UUID({ uuid: productInternalId }),
      addProductImageDTO,
    );

    return { src: image.src, id: image.id };
  }

  @ApiOkResponse()
  @Delete(routesV1.product.deleteProductImage)
  async deleteProductImage(
    @Param('productInternalId') productInternalId: string,
    @Param('imageId') imageId: string,
  ): Promise<void> {
    await this.productUpdateService.deleteProductImage(
      new UUID({ uuid: productInternalId }),
      imageId,
    );
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
  @Get(routesV1.product.getProduct)
  @UseGuards(JwtAuthGuard)
  async getProduct(
    @User() { userId }: ExtractedUser,
    @Param('productInternalId') productInternalId: string,
  ): Promise<ProductAdminDTO> {
    const product = await this.prisma.product.findFirstOrThrow({
      where: { id: productInternalId },
      select: { vendorId: true },
    });
    if (product?.vendorId !== userId) {
      throw new UnauthorizedException(
        `Not authorized to access product ${productInternalId}`,
      );
    }
    return await this.storeClient.getProductDetails(
      new UUID({ uuid: productInternalId }),
    );
  }

  @Patch(routesV1.product.updateProduct)
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @User() { userId }: ExtractedUser,
    @Param('productInternalId')
    productInternalId: string,
    @Body()
    productUpdates: ProductUpdateInputDto,
  ): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!userId) {
        throw new UnauthorizedException(
          `User not found in token, user (${userId})`,
        );
      }

      const { bodyHtml } = productUpdates;
      const concreteUpdates = {
        ...productUpdates,
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        ...(bodyHtml && { body_html: bodyHtml }),
      };

      await this.productUpdateService.updateProductByUser(
        new UUID({ uuid: productInternalId }),
        concreteUpdates,
        new UUID({ uuid: userId }),
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
    @Param('productInternalId')
    productInternalId: string,
    @Param('productVariantInternalId')
    productVariantInternalId: string,
    @Body()
    productVariantUpdates: ProductVariantUpdateInputDto,
    @User() { userId }: ExtractedUser,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!userId) {
      throw new UnauthorizedException(
        `User not found in token, user (${userId})`,
      );
    }

    await this.productUpdateService.updateProductVariant(
      new UUID({ uuid: productInternalId }),
      new UUID({ uuid: productVariantInternalId }),
      this.mapProductVariantUpdate(productVariantUpdates),
      {
        type: 'user',
        id: userId,
      },
    );
  }

  @Patch(routesV1.product.updateProductByAdmin)
  @UseGuards(OrGuard([AuthGuard('header-api-key'), AdminGuard]))
  async updateProductByAdmin(
    @Param('productInternalId')
    productInternalId: string,
    @Body()
    productUpdates: ProductAdminUpdateInputDto,
    @Query()
    { authorId }: { authorId?: string },
    @User() jwtToken: ExtractedUser | undefined,
  ): Promise<void> {
    await this.productUpdateService.updateProduct(
      new UUID({ uuid: productInternalId }),
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
      },
    });

    for (const { id } of products) {
      void this.productUpdateService.updateProduct(
        new UUID({ uuid: id }),
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
    @Param('productInternalId')
    productInternalId: string,
    @Param('productVariantInternalId')
    productVariantInternalId: string,
    @Body()
    productVariantUpdates: ProductVariantUpdateInputDto,
    @Query()
    { authorId }: { authorId?: string },
    @User() jwtToken: ExtractedUser | undefined,
  ): Promise<void> {
    await this.productUpdateService.updateProductVariant(
      new UUID({ uuid: productInternalId }),
      new UUID({ uuid: productVariantInternalId }),
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
    @Param('productInternalId')
    productInternalId: string,
    @Body()
    { action }: ModerateProductInputDto,
    @Query()
    { authorId }: { authorId?: string },
    @User() jwtToken: ExtractedUser | undefined,
  ): Promise<void> {
    await this.productUpdateService.moderateProduct(
      new UUID({ uuid: productInternalId }),
      action,
      {
        type: 'admin',
        id: jwtToken?.userId ?? authorId,
      },
    );
  }

  @Post(routesV1.product.createProductModel)
  @UseGuards(OrGuard([AuthGuard('header-api-key'), AdminGuard]))
  async createProductModel(
    @Body()
    data: CreateProductModelDto,
  ): Promise<void> {
    const model = await this.pimClient.createProductModel(data);

    await this.searchClient.indexDocument({
      documentType: DocumentType.PRODUCT_MODEL,
      data: model,
    });
  }

  @Post(routesV1.product.importImages)
  @UseGuards(OrGuard([AuthGuard('header-api-key'), AdminGuard]))
  async uploadImages(
    @Body()
    data: UploadImagesDto,
  ): Promise<void> {
    this.logger.log(
      `Planning import of ${data.imageUrls.length} images for product ${data.storeProductId}`,
    );

    await this.importImageQueue.add(
      {
        storeProductId: data.storeProductId,
        imageUrls: data.imageUrls,
      },
      {
        attempts: 2,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  private mapProductVariantUpdate = ({
    quantity,
    price,
    compareAtPrice,
    condition,
  }: ProductVariantUpdateInputDto) => ({
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
