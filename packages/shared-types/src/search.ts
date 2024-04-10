export enum DiscountRange {
  FROM_0_TO_20 = '0-20%',
  FROM_20_TO_40 = '20-40%',
  FROM_40_TO_60 = '40-60%',
  FROM_60_TO_80 = '60-80%',
  FROM_80_TO_100 = '80-100%',
}

type SearchBaseVariantDocument = {
  variant_shopify_id: number;
  variant_internal_id?: string;
  title: string;
  vendor: string;
  product_type: string;
  condition: string;
  handle: string;
  inventory_quantity: number;
  array_tags: Record<string, string[]>;
  price: number;
  compare_at_price: number;
  product_shopify_id: number;
  product_internal_id: string;
  product_image?: string;
  updatedat_timestamp: number;
  createdat_timestamp: number;
  publishedat_timestamp: number;
};

export type SearchPublicVariantDocument = SearchBaseVariantDocument & {
  vendor_informations: {
    reviews: {
      count: number;
      average_rating?: number;
    };
  };
  meta: {
    barooders: {
      owner: string;
      product_discount_range: DiscountRange;
    };
  };
  variant_title: string;
  computed_scoring: number;
  is_refurbished?: string;
  discount: number;
  collection_internal_ids: string[];
  collection_handles: string[];
};

export type SearchB2BVariantDocument = SearchBaseVariantDocument & {
  vendor_id: string;
  largest_bundle_price?: number;
  total_quantity: number;
};

export type SearchCollectionDocument = {
  collectionId: string;
  title: string;
  handle: string;
  product_count: number;
  updatedat_timestamp: number;
  image?: string;
};

export type SearchProductModelDocument = {
  name: string;
  brand: string;
  family?: string;
  imageUrl?: string;
  year?: number;
  manufacturer_suggested_retail_price?: number;
};
