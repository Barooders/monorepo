export type ImageToUpload = {
  attachment: string;
  filename?: string;
  position?: number;
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
  brand: {
    name: string;
  };
};
