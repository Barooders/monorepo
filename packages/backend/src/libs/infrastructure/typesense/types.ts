import { DiscountRange } from '@libs/domain/types';

export type SearchPublicVariantDocument = {
  variant_shopify_id: number;
  variant_internal_id?: string;
  title: string;
  vendor: string;
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
  product_type: string;
  variant_title: string;
  computed_scoring: number;
  is_refurbished?: string;
  condition: string;
  handle: string;
  inventory_quantity: number;
  array_tags: Record<string, string[]>;
  price: number;
  discount: number;
  product_shopify_id: number;
  product_internal_id: string;
  product_image?: string;
  compare_at_price: number;
  collection_internal_ids: string[];
  collection_handles: string[];
  updatedat_timestamp: number;
  createdat_timestamp: number;
  publishedat_timestamp: number;
};

export type SearchB2BVariantDocument = {
  variant_shopify_id: number;
  variant_internal_id?: string;
  title: string;
  product_type: string;
  condition: string;
  handle: string;
  inventory_quantity: number;
  array_tags: Record<string, string[]>;
  price: number;
  product_shopify_id: number;
  product_internal_id: string;
  product_image?: string;
  updatedat_timestamp: number;
  createdat_timestamp: number;
  publishedat_timestamp: number;
};

export type CollectionDocument = {
  collectionId: string;
  title: string;
  handle: string;
  product_count: number;
  updatedat_timestamp: number;
  image?: string;
};
