export const DISABLED_VARIANT_OPTION = 'Default Title';
export const BAROODERS_NAMESPACE = 'barooders';

export type Author = {
  type: 'backend' | 'shopify' | 'send_cloud' | 'admin' | 'user';
  id?: string | null;
};

export const CONDITION_TAG_KEY = 'état';

export enum MetafieldType {
  SINGLE_LINE_TEXT_FIELD = 'single_line_text_field',
  MULTI_LINE_TEXT_FIELD = 'multi_line_text_field',
  JSON = 'json',
  BOOLEAN = 'boolean',
  NUMBER_DECIMAL = 'number_decimal',
  NUMBER_INTEGER = 'number_integer',
}

export const BIKES_COLLECTION_HANDLE = 'velos';
export const MOUNTAIN_BIKES_COLLECTION_HANDLES = ['vtt', 'vtt-electriques'];
export const BIKE_SIZE_TAG_KEY = 'taille-velo';

export type PIMProductType = {
  id: number;
  attributes: {
    name: string;
    weight: number;
    gendered?: string;
    shopifyManCollectionId?: string;
    shopifyCollectionId?: string;
    shopifyWomanCollectionId?: string;
    shopifyChildCollectionId?: string;
    shopifySportCollectionId?: string;
    sportName?: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    order?: number;
    categories: {
      data: {
        id: number;
        attributes: {
          name: string;
          label: string;
          createdAt: Date;
          updatedAt: Date;
          publishedAt: Date;
          order: number | null;
        };
      }[];
    };
  };
};

export type PIMProductAttribute = {
  id: number;
  attributes: {
    tagPrefix: string;
  };
};

export type PIMDynamicAttribute = {
  attributes: {
    pim_product_attributes: {
      data: PIMProductAttribute[];
    };
  };
};

export const getValidTags = (tags: string[]): string[] => {
  const formattedTags = tags.reduce((acc: string[], tag) => {
    const [key, ...valueEntries] = tag.split(':');
    const value = valueEntries.join(':');

    if (!key || !value) return acc;

    return [...acc, `${key.toLowerCase().trim()}:${value.trim()}`];
  }, []);

  if (formattedTags.some((tag) => tag.includes('genre'))) {
    return formattedTags;
  }
  return [...formattedTags, `genre:Mixte`];
};

export enum DiscountRange {
  FROM_0_TO_20 = '0-20%',
  FROM_20_TO_40 = '20-40%',
  FROM_40_TO_60 = '40-60%',
  FROM_60_TO_80 = '60-80%',
  FROM_80_TO_100 = '80-100%',
}

const DISCOUNT_RANGE_DEFINITION = [
  { limit: 20, range: DiscountRange.FROM_0_TO_20 },
  { limit: 40, range: DiscountRange.FROM_20_TO_40 },
  { limit: 60, range: DiscountRange.FROM_40_TO_60 },
  { limit: 80, range: DiscountRange.FROM_60_TO_80 },
  { limit: 100, range: DiscountRange.FROM_80_TO_100 },
];

export const getDiscountRange = (discount: number): DiscountRange => {
  const range = DISCOUNT_RANGE_DEFINITION.find(
    (step) => discount <= step.limit,
  )?.range;

  if (!range) {
    throw new Error(`Cannot find discount range for ${discount}`);
  }

  return range;
};

export type SearchVariantDocument = {
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
      owner: 'b2c' | 'c2c';
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

export type CollectionDocument = {
  collectionId: string;
  title: string;
  handle: string;
  product_count: number;
  updatedat_timestamp: number;
  image?: string;
};
