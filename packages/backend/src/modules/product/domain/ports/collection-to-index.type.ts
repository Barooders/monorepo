import { ShopifyID, Stock, URL, ValueDate } from '@libs/domain/value-objects';

export interface CollectionToIndex {
  id: ShopifyID;
  title: string;
  handle: string;
  productCount: Stock;
  updatedAt: ValueDate;
  imageSrc?: URL;
}
