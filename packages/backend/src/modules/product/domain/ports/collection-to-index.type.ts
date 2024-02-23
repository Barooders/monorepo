import {
  Amount,
  Percentage,
  ShopifyID,
  Stock,
  Tags,
  URL,
  ValueDate,
} from '@libs/domain/value-objects';
import { ProductType } from '../value-objects/product-type.value-object';

export interface VariantToIndex {
  variant: {
    id: ShopifyID;
    title: string;
    updatedAt: ValueDate;
    createdAt: ValueDate;
    quantityAvailable?: Stock;
    price: Amount;
    compareAtPrice: Amount;
  };
  product: {
    id: ShopifyID;
    isActive: boolean;
    imageSrc?: URL;
    title: string;
    handle: string;
    highestDiscount: Percentage;
    publishedAt: ValueDate;
    productType: ProductType;
    tags: Tags;
    collections: {
      id: ShopifyID;
      title: string;
    }[];
  };
  vendor: {
    name?: string;
    isPro: boolean;
  };
}

export interface CollectionToIndex {
  id: ShopifyID;
  title: string;
  handle: string;
  productCount: Stock;
  updatedAt: ValueDate;
  imageSrc?: URL;
}
