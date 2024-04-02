import {
  AggregateName,
  Condition,
  EventName,
  PrismaMainClient,
  ProductStatus,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import {
  Image,
  Metafield,
  Product,
  StoredProduct,
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
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IStoreClient } from './ports/store.client';

import { UUID } from '@libs/domain/value-objects';
import { toCents } from '@libs/helpers/currency';
// eslint-disable-next-line import/no-restricted-paths
import { jsonStringify } from '@libs/helpers/json';
import { IPIMClient } from './ports/pim.client';
import { IQueueClient } from './ports/queue-client';
import { getHandDeliveryMetafields } from './product.methods';

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
}

export interface ProductCreationOptions {
  bypassImageCheck?: boolean;
}

@Injectable()
export class ProductCreationService {
  private readonly logger = new Logger(ProductCreationService.name);

  constructor(
    private pimClient: IPIMClient,
    private storeClient: IStoreClient,
    private prisma: PrismaMainClient,
    private queueClient: IQueueClient,
  ) {}

  async createProduct(
    product: Product,
    vendorId: string,
    options: ProductCreationOptions,
    author: Author,
  ): Promise<StoredProduct> {
    if (!vendorId) throw new Error('Cannot create product without vendorId');

    const { product_type: productType, variants, metafields } = product;

    await this.pimClient.checkIfProductTypeExists(productType);

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

    await this.storeClient.publishProduct(String(createdProduct.id));

    await this.updateProductsInDBWithSameHandle(createdProduct);

    const salesChannels = product.salesChannels
      ? product.salesChannels.map((salesChannelName) => ({ salesChannelName }))
      : [{ salesChannelName: SalesChannelName.PUBLIC }];

    const productInDB = await this.prisma.product.create({
      data: {
        createdAt: new Date(),
        vendorId,
        shopifyId: createdProduct.id,
        status: productStatus,
        handle: createdProduct.handle,
        productType,
        EANCode: product.EANCode,
        source: product.source,
        sourceUrl: product.sourceUrl,
        GTINCode: product.GTINCode,
        variants: {
          createMany: {
            data: createdProduct.variants.map((variant) => ({
              createdAt: new Date(),
              shopifyId: variant.id,
              quantity: variant.inventory_quantity ?? 0,
              // TODO: remove this 0
              priceInCents: variant.price ? toCents(variant.price) : 0,
              condition: variant.condition,
            })),
          },
        },
        productSalesChannels: {
          createMany: {
            data: salesChannels,
          },
        },
      },
    });

    await this.notifyEvent({
      eventName: EventName.PRODUCT_CREATED,
      vendorId,
      productId: productInDB.id,
      payload: {
        productShopifyId: createdProduct.id,
      },
      metadata: {
        author,
      },
    });

    return createdProduct;
  }

  async createProductVariant(productId: number, data: Variant, author: Author) {
    const createdVariant = await this.storeClient.createProductVariant(
      productId,
      data,
    );

    const productVariantInDB = await this.prisma.productVariant.create({
      data: {
        createdAt: new Date(),
        shopifyId: createdVariant.id,
        quantity: data.inventory_quantity ?? 0,
        priceInCents: Math.round(Number(data.price) * 100),
        condition: data.condition,
        product: {
          connect: {
            shopifyId: productId,
          },
        },
      },
      include: {
        product: true,
      },
    });

    await this.notifyEvent({
      eventName: EventName.PRODUCT_UPDATED,
      vendorId: productVariantInDB.product.vendorId,
      productId: productVariantInDB.product.id,
      payload: {
        newVariantId: productVariantInDB.id,
        newVariantShopifyId: createdVariant.id,
        productShopifyId: productId,
      },
      metadata: {
        author,
      },
    });

    return createdVariant;
  }

  async createDraftProduct(
    draftProductInputDto: DraftProductInputDto,
    vendorId: string,
    author: Author,
  ): Promise<StoredProduct> {
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
        bypassImageCheck: !!price && Number(price) > 0,
      },
    );
  }

  async createProductByAdmin(
    draftProductInputDto: DraftProductInputDto,
    vendorId: string,
    author: Author,
  ): Promise<StoredProduct> {
    return await this.createProductFromWeb(
      draftProductInputDto,
      vendorId,
      author,
      {},
    );
  }

  private async createProductFromWeb(
    draftProductInputDto: DraftProductInputDto,
    vendorId: string,
    author: Author,
    options: ProductCreationOptions,
  ): Promise<StoredProduct> {
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
          inventory_quantity: 1,
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
        ...getHandDeliveryMetafields(!!handDelivery, handDeliveryPostalCode),
        ...metafields.filter(({ key }) => key !== 'source'),
      ],
      salesChannels,
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

  private async updateProductsInDBWithSameHandle(storedProduct: StoredProduct) {
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
      (product.price ||
        product.variants.every(({ price }) => Number(price) > 0)) &&
      (bypassImageCheck || product.images.length > 0) &&
      product.product_type
    );
  }

  private async notifyEvent({
    eventName,
    vendorId,
    productId,
    payload,
    metadata,
  }: {
    eventName: EventName;
    vendorId: string;
    productId: string;
    payload: Record<string, string | number>;
    metadata: { author: Author; comment?: string };
  }) {
    await this.prisma.event.create({
      data: {
        aggregateName: AggregateName.VENDOR,
        aggregateId: vendorId,
        name: eventName,
        payload: {
          ...payload,
          productId,
        },
        metadata,
      },
    });
    await this.queueClient.planProductIndexation(new UUID({ uuid: productId }));
  }
}
