export interface ProductModelToIndex {
  id: string; // PimId
  name: string;
  manufacturer_suggested_retail_price?: number;
  imageUrl?: URL;
  year?: number;
  brand: {
    name: string;
  };
  productType: {
    name: string;
  };
}
