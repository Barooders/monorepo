export type ImageToUpload = {
  attachment?: string;
  filename?: string;
  position?: number;
  src?: string;
};

export type ProductImage = {
  src: string;
  id: string;
};

export type CreateProductModel = {
  name: string;
  manufacturer_suggested_retail_price?: number;
  imageUrl: string;
  year: number;
  productType: string;
  brand: {
    name: string;
  };
};
