type WooCommerceProductImage = {
  src: string;
  alt: string;
};

type WooCommerceCategories = {
  id: number;
  name: string;
};

type WooCommerceProductAttribute = {
  id: number;
  name: string;
  variation: boolean;
  options: string[];
};

type WooCommerceProductVariationAttribute = {
  id: number;
  name: string;
  option: string;
};

type WooCommerceMetadata = {
  id: number;
  key: string;
  value: string;
};

type WooCommerceTag = {
  id: number;
  name: string;
  slug: string;
};

export type WooCommerceProductVariation = {
  id: number;
  price: string;
  regular_price: string;
  stock_quantity: number | null;
  attributes: WooCommerceProductVariationAttribute[];
};

export type WooCommerceProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  stock_quantity: number | null;
  stock_status?: 'instock' | 'outofstock';
  purchasable: boolean;
  status?: string;
  images: WooCommerceProductImage[];
  price: string;
  regular_price?: string;
  categories: WooCommerceCategories[];
  attributes: WooCommerceProductAttribute[];
  meta_data?: WooCommerceMetadata[];
  variations: number[];
  tags?: WooCommerceTag[];
};
