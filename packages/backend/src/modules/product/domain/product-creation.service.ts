import {
  AggregateName,
  Condition,
  PrismaMainClient,
  ProductStatus,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import {
  Image,
  Metafield,
  Product,
  StoredVariant,
  Variant,
} from '@libs/domain/product.interface';
import {
  Author,
  BAROODERS_NAMESPACE,
  DISABLED_VARIANT_OPTION,
  MetafieldType,
} from '@libs/domain/types';
import { getSEOMetafields } from '@libs/helpers/seo.helper';
import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  IStoreClient,
  ProductCreatedInStore,
  VariantCreatedInStore,
} from './ports/store.client';

import { fromCents, toCents } from '@libs/helpers/currency';
// eslint-disable-next-line import/no-restricted-paths
import { UUID } from '@libs/domain/value-objects';
import { jsonStringify } from '@libs/helpers/json';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { get } from 'lodash';
import { ProductCreatedDomainEvent } from './events/product.created.domain-event';
import { ProductUpdatedDomainEvent } from './events/product.updated.domain-event';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { IPIMClient } from './ports/pim.client';
import { getHandDeliveryMetafields } from './product.methods';

class BundlePriceDTO {
  @IsInt()
  unitPriceInCents!: number;

  @IsInt()
  minQuantity!: number;
}
export class DraftProductInputDto {
  @IsOptional()
  tags: string[] = [];

  @IsOptional()
  condition: Condition = Condition.AS_NEW;

  @IsOptional()
  images: Image[] = [];

  @IsOptional()
  price?: string | number;

  @IsOptional()
  compare_at_price?: string | number;

  @IsOptional()
  @IsString()
  title: string = '';

  @IsOptional()
  @IsString()
  body_html: string = '';

  @IsNotEmpty()
  @IsString()
  product_type!: string;

  @IsOptional()
  metafields: Metafield[] = [];

  @IsBoolean()
  @IsOptional()
  handDelivery?: boolean;

  @IsString()
  @IsOptional()
  handDeliveryPostalCode?: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsOptional()
  salesChannels?: SalesChannelName[];

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @ApiProperty({ isArray: true, type: BundlePriceDTO })
  @ValidateNested({ each: true })
  @Type(() => BundlePriceDTO)
  bundlePrices?: BundlePriceDTO[];
}

export interface ProductCreationOptions {
  bypassImageCheck?: boolean;
}

export type CreatedProduct = Omit<
  ProductCreatedInStore,
  'variants' | 'shopifyId'
> & {
  internalId: string;
  variants: (Omit<VariantCreatedInStore, 'shopifyId'> & {
    internalId: string;
  })[];
};

@Injectable()
export class ProductCreationService {
  private readonly logger = new Logger(ProductCreationService.name);

  constructor(
    private pimClient: IPIMClient,
    private storeClient: IStoreClient,
    private prisma: PrismaMainClient,
    private internalNotificationClient: IInternalNotificationClient,
    private eventEmitter: EventEmitter2,
  ) {}

  async createProduct(
    product: Product,
    { uuid: vendorId }: UUID,
    options: ProductCreationOptions,
    author: Author,
  ): Promise<CreatedProduct> {
    const { product_type: productType, variants, metafields } = product;

    await this.pimClient.checkIfProductTypeExists(productType);
    await this.validateBundlePrices(product);

    const productStatus = this.isProductReadyToPublish(
      product,
      options.bypassImageCheck,
    )
      ? product.status
      : ProductStatus.DRAFT;

    const seoMetafields = await getSEOMetafields(product);

    const createdProduct = await this.storeClient.createProduct({
      ...product,
      status: productStatus,
      vendorId,
      published: true,
      variants,
      metafields: [...metafields, ...seoMetafields],
    });

    if (createdProduct.images.length !== product.images.length) {
      await this.internalNotificationClient.sendErrorNotification(
        `🎨 Some images failed to upload when creating product ${createdProduct.title}`,
      );
    }

    await this.updateProductsInDBWithSameHandle(createdProduct);

    const salesChannels = product.salesChannels
      ? product.salesChannels.map((salesChannelName) => ({ salesChannelName }))
      : [{ salesChannelName: SalesChannelName.PUBLIC }];

    const productInDB = await this.prisma.product.create({
      data: {
        createdAt: new Date(),
        vendorId,
        status: productStatus,
        shopifyId: createdProduct.shopifyId,
        description: product.body_html,
        handle: createdProduct.handle,
        productType,
        EANCode: product.EANCode,
        source: product.source,
        sourceUrl: product.sourceUrl,
        GTINCode: product.GTINCode,
        bundlePrices: {
          createMany: {
            data:
              product.bundlePrices?.map(
                ({ minQuantity, unitPriceInCents }) => ({
                  unitPriceInCents,
                  minQuantity,
                }),
              ) ?? [],
          },
        },
        variants: {
          createMany: {
            data: createdProduct.variants.map((variant, index) => ({
              createdAt: new Date(),
              shopifyId: variant.shopifyId,
              quantity: variant.inventory_quantity ?? 0,
              // TODO: remove this 0
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              priceInCents: variant.price ? toCents(variant.price) : 0,
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              compareAtPriceInCents: variant.compare_at_price
                ? toCents(variant.compare_at_price)
                : null,
              //TODO: stop using index here as shopify can return variants in different order
              condition:
                get(product.variants, `[${index}].condition`) ?? Condition.GOOD,
            })),
          },
        },
        productSalesChannels: {
          createMany: {
            data: salesChannels,
          },
        },
      },
      include: {
        variants: true,
      },
    });

    this.eventEmitter.emit(
      ProductCreatedDomainEvent.EVENT_NAME,
      new ProductCreatedDomainEvent({
        aggregateId: vendorId,
        aggregateName: AggregateName.VENDOR,
        productInternalId: productInDB.id,
        metadata: {
          author,
        },
      }),
    );

    return {
      handle: createdProduct.handle,
      title: createdProduct.title,
      images: createdProduct.images,
      internalId: productInDB.id,
      variants: productInDB.variants.map((variant) => ({
        internalId: variant.id,
        inventory_quantity: variant.quantity,
        price: fromCents(Number(variant.priceInCents)).toString(),
        compare_at_price: fromCents(
          Number(variant.compareAtPriceInCents),
        ).toString(),
        condition: variant.condition ?? Condition.GOOD,
      })),
    };
  }

  async createProductVariant(
    productInternalId: string,
    data: Variant,
    author: Author,
  ): Promise<StoredVariant> {
    const createdVariant = await this.storeClient.createProductVariant(
      new UUID({ uuid: productInternalId }),
      data,
    );

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!data.price) {
      throw new Error('Cannot create variant without price');
    }

    const productVariantInDB = await this.prisma.productVariant.create({
      data: {
        createdAt: new Date(),
        quantity: data.inventory_quantity ?? 0,
        priceInCents: toCents(data.price),
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        compareAtPriceInCents: data.compare_at_price
          ? toCents(data.compare_at_price)
          : null,
        condition: data.condition,
        product: {
          connect: {
            id: productInternalId,
          },
        },
      },
      include: {
        product: true,
      },
    });

    this.eventEmitter.emit(
      ProductUpdatedDomainEvent.EVENT_NAME,
      new ProductUpdatedDomainEvent({
        aggregateId: productVariantInDB.product.vendorId,
        aggregateName: AggregateName.VENDOR,
        productInternalId: productVariantInDB.product.id,
        payload: {
          newVariantId: productVariantInDB.id,
          productInternalId,
        },
        metadata: {
          author,
        },
      }),
    );

    return {
      ...createdVariant,
      internalId: productVariantInDB.id,
    };
  }

  async createDraftProduct(
    draftProductInputDto: DraftProductInputDto,
    vendorId: UUID,
    author: Author,
  ): Promise<CreatedProduct> {
    const { price } = draftProductInputDto;

    return await this.createProductFromWeb(
      {
        ...draftProductInputDto,
        metafields: [
          ...draftProductInputDto.metafields,
          {
            key: 'status',
            value: 'pending',
            type: MetafieldType.SINGLE_LINE_TEXT_FIELD,
            namespace: BAROODERS_NAMESPACE,
          },
        ],
      },
      vendorId,
      author,
      {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        bypassImageCheck: !!price && Number(price) > 0,
      },
    );
  }

  async createProductByAdmin(
    draftProductInputDto: DraftProductInputDto,
    vendorId: UUID,
    author: Author,
  ): Promise<CreatedProduct> {
    return await this.createProductFromWeb(
      draftProductInputDto,
      vendorId,
      author,
      {},
    );
  }

  private async validateBundlePrices({ bundlePrices, variants }: Product) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!bundlePrices?.length) return;

    const highestBundlePriceInCents = Math.min(
      ...bundlePrices.map(({ unitPriceInCents }) => unitPriceInCents),
    );

    if (
      variants.some(
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        ({ price }) => price && toCents(price) <= highestBundlePriceInCents,
      )
    ) {
      throw new Error(
        'Bundle prices should be cheaper than the unit prices of the variants.',
      );
    }
  }

  private async createProductFromWeb(
    draftProductInputDto: DraftProductInputDto,
    vendorId: UUID,
    author: Author,
    options: ProductCreationOptions,
  ): Promise<CreatedProduct> {
    const {
      tags,
      images,
      price,
      compare_at_price = price,
      title,
      body_html,
      product_type,
      metafields,
      handDelivery,
      handDeliveryPostalCode,
      condition,
      sourceUrl,
      salesChannels,
      quantity,
      bundlePrices,
    } = draftProductInputDto;

    const source = String(
      metafields?.find((metafield: Metafield) => metafield.key === 'source')
        ?.value ?? 'vendor-page',
    );

    const productWithoutStatus = {
      title,
      body_html,
      product_type,
      variants: [
        {
          price: price?.toString(),
          external_id: 'product-added-from-web',
          compare_at_price: compare_at_price?.toString(),
          inventory_quantity: Number.isInteger(quantity) ? quantity : 1,
          condition,
          optionProperties: [
            {
              key: 'Title',
              value: DISABLED_VARIANT_OPTION,
            },
          ],
        },
      ],
      images,
      tags,
      source,
      sourceUrl,
      metafields: [
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        ...getHandDeliveryMetafields(!!handDelivery, handDeliveryPostalCode),
        ...metafields.filter(({ key }) => key !== 'source'),
      ],
      salesChannels,
      bundlePrices,
    };

    return await this.createProduct(
      {
        ...productWithoutStatus,
        status: this.isProductReadyToPublish(productWithoutStatus, true)
          ? ProductStatus.ACTIVE
          : ProductStatus.DRAFT,
      },
      vendorId,
      options,
      author,
    );
  }

  private async updateProductsInDBWithSameHandle(storedProduct: {
    handle: string;
  }) {
    // This happens when an existing product is de-synchronized between database and store, for example when:
    // - A product is deleted from store but not from DB: the store will provide a previously used handle
    // - If the handle is updated in DB but not in store (this should not happen in theory): the store could provide a new handle already used in DB

    const productsWithSameHandle = await this.prisma.product.findMany({
      where: {
        handle: storedProduct.handle,
      },
    });
    const productIdsWithSameHandle = productsWithSameHandle.map(
      (product) => product.id,
    );

    if (productsWithSameHandle.length === 0) return;

    this.logger.error(
      `Found ${productsWithSameHandle.length} product(s) in DB with same handle ${storedProduct.handle}`,
    );
    Sentry.captureMessage(
      `Product created with existing handle (${
        storedProduct.handle
      }). Do check products: ${jsonStringify(productIdsWithSameHandle)}`,
      {
        level: 'error',
      },
    );

    await this.prisma.product.updateMany({
      where: {
        id: {
          in: productIdsWithSameHandle,
        },
      },
      data: {
        handle: null,
      },
    });
  }

  private isProductReadyToPublish(
    product: Omit<Product, 'status'>,
    bypassImageCheck: boolean = false,
  ): boolean {
    return !!(
      (product.price !== undefined ||
        product.variants.every(({ price }) => Number(price) > 0)) &&
      (bypassImageCheck || product.images.length > 0) &&
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      product.product_type
    );
  }
}
