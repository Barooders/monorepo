import { Stock, URL, UUID, ValueDate } from '@libs/domain/value-objects';

export interface CollectionToIndex {
  id: UUID;
  title: string;
  handle: string;
  productCount: Stock;
  updatedAt: ValueDate;
  imageSrc?: URL;
}
