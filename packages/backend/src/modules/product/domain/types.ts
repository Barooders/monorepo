import { ImageStoreId } from './value-objects/image-store-id.value-object';

export type ImageToUpload = {
  attachment?: string;
  filename?: string;
  position?: number;
  src?: string;
};

export type ProductImage = {
  src: string;
  storeId: ImageStoreId;
};

export type CreateProductModel = {
  name: string;
  manufacturer_suggested_retail_price?: number;
  imageUrl: string;
  year: number;
  productType?: string;
  brand: {
    name: string;
  };
};
