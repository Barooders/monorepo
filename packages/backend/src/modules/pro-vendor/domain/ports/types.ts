/* eslint-disable import/no-restricted-paths */
import { SynchronizedProVendor } from '@config/vendor/types';
import { VendorProProduct } from '@libs/domain/prisma.main.client';
import { FullProduct } from '@libs/domain/product.interface';
import { CSVProduct } from '@modules/pro-vendor/infrastructure/api/csv/types';
import { ProductDTO } from '@modules/pro-vendor/infrastructure/api/prestashop/dto/prestashop-product.dto';
import { TuvalumProductDto } from '@modules/pro-vendor/infrastructure/api/tuvalum/dto/tuvalum-product.input.dto';
import { WooCommerceProduct } from '@modules/pro-vendor/infrastructure/api/woocommerce/types';
import { XMLProduct } from '@modules/pro-vendor/infrastructure/api/xml/types';
import { IProduct } from 'shopify-api-node';

export enum QueueNames {
  UPDATE_STOCK = 'update-product-status',
}

export type QueuePayload = {
  [QueueNames.UPDATE_STOCK]: {
    vendorSlug: SynchronizedProVendor;
    product: SyncedProductToUpdate;
  };
};

export interface SyncOutput {
  payload: {
    updatedProductIds: string[];
    createdProductIds?: string[];
    failedProductIds?: string[];
    skippedProducts?: SkippedProduct[];
  };
  metadata?: {
    productsToUpdateCount?: number;
    vendorProductsCount?: number;
  };
}

export interface SyncLightProduct {
  title: string;
  isVisibleInStore: boolean;
  external_id: string;
}

export interface SyncProduct extends FullProduct, SyncLightProduct {}

export type SkippedProduct = {
  id: string;
  reason: string;
};

export interface FulfillmentOrderToSyncOnVendor {
  vendorId: string;
  orderId: string;
  name: string;
  orderName: string;
  content: OrderContent;
}

export interface ShippingDetails {
  trackingId?: string;
  trackingUrl: string;
}

interface BaseProductVariant {
  variantId: string | null;
  price: number;
  discount: number;
  quantity: number;
  productType: string;
}

interface BaseCustomer {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  zipCode: string;
  city: string;
  phone: string;
  country: string;
  realEmail: string;
}
export interface OrderContent {
  customer: BaseCustomer;
  products: BaseProductVariant[];
}

export type OrderVendorInput = {
  order: {
    discount: number;
    name: string;
  };
  customer: BaseCustomer & {
    obfuscatedEmail: string;
    password: string;
  };
  products: (BaseProductVariant & {
    externalProductId: string;
    externalVariantId: string;
  })[];
};

export type ProductWithReferenceUrl = {
  internalId: string;
  referenceUrl: string;
};

export type VendorProduct =
  | ProductDTO
  | TuvalumProductDto
  | WooCommerceProduct
  | CSVProduct
  | XMLProduct
  | IProduct;

export type SyncedVendorProProduct = VendorProProduct & {
  internalId: string;
};
export type SyncedProductToUpdate =
  | SyncedVendorProProduct
  | ProductWithReferenceUrl;

export type VariantStockToUpdate = {
  internalId: string;
  externalVariantId: string;
  currentStock?: number;
};
