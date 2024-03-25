import { SalesChannelName } from '@libs/domain/prisma.main.client';
import { Condition } from '@libs/domain/prisma.store.client';
import {
  Amount,
  Percentage,
  ShopifyID,
  Stock,
  Tags,
  URL,
  UUID,
  ValueDate,
} from '@libs/domain/value-objects';
import { ProductType } from '../value-objects/product-type.value-object';

export interface PublicVariantToIndex {
  variant: {
    shopifyId: ShopifyID;
    id?: UUID;
    title: string;
    updatedAt: ValueDate;
    createdAt: ValueDate;
    quantityAvailable?: Stock;
    isRefurbished: boolean;
    condition: Condition;
    price: Amount;
    compareAtPrice: Amount;
  };
  product: {
    shopifyId: ShopifyID;
    id: UUID;
    isActive: boolean;
    imageSrc?: URL;
    title: string;
    handle: string;
    highestDiscount: Percentage;
    calculatedScoring: number;
    publishedAt: ValueDate;
    productType: ProductType;
    tags: Tags;
    collections: {
      id: UUID;
      handle: string;
    }[];
  };
  vendor: {
    name: string;
    isPro: boolean;
    reviews: {
      count: number;
      averageRating?: number;
    };
  };
}

export interface B2BVariantToIndex {
  variant: {
    shopifyId: ShopifyID;
    id?: UUID;
    updatedAt: ValueDate;
    createdAt: ValueDate;
    quantityAvailable?: Stock;
    condition: Condition;
    price: Amount;
    compareAtPrice: Amount;
    largestBundlePrice?: Amount;
  };
  product: {
    shopifyId: ShopifyID;
    id: UUID;
    vendorId: UUID;
    isActive: boolean;
    imageSrc?: URL;
    title: string;
    handle: string;
    publishedAt: ValueDate;
    productType: ProductType;
    tags: Tags;
  };
}

export type VariantToIndexWithTarget =
  | {
      target: typeof SalesChannelName.PUBLIC;
      data: PublicVariantToIndex;
    }
  | {
      target: typeof SalesChannelName.B2B;
      data: B2BVariantToIndex;
    };
