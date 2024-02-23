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

export interface VariantToIndex {
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
