export type ImageToUpload = {
  attachment: string;
  filename?: string;
  position?: number;
};

export type ProductImage = {
  src: string;
  id: string;
};

export type ExistingBrand = {
  id: number;
};

export type NewBrand = {
  name: string;
};

export const isNewBrand = (
  brand: ExistingBrand | NewBrand,
): brand is NewBrand => (brand as ExistingBrand).id === undefined;

export type ExistingFamily = {
  id: number;
};

export type NewFamily = {
  name: string;
  productType: number;
  brand: ExistingBrand | NewBrand;
};

export const isNewFamily = (
  family: ExistingFamily | NewFamily,
): family is NewFamily => (family as ExistingFamily).id === undefined;

export type CreateProductModel = {
  name: string;
  manufacturer_suggested_retail_price?: number;
  imageUrl: string;
  year: number;
  family: ExistingFamily | NewFamily;
};
