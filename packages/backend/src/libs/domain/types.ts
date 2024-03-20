import { UUID } from './value-objects';

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

export type PIMCategory = {
  id: number;
  attributes: {
    name: string;
    label: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    order: number | null;
    productTypes: {
      data: {
        id: number;
        attributes: {
          name: string;
        };
      }[];
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

const mapBikeSize = (size: string) => {
  const matchOneOf = (values: string[]) =>
    values.some((v) => size.toLowerCase().replaceAll('/', '').includes(v));

  if (matchOneOf(['unique', 'universelle'])) return 'UNIQUE';
  if (matchOneOf(['enfant'])) return 'CHILD';

  if (
    matchOneOf([
      'xxl',
      '23 pouces',
      '24 pouces',
      '23',
      '24',
      '61',
      '62',
      '63',
      '64',
      '65',
    ])
  )
    return 'XXL';
  if (matchOneOf(['xl', '22 pouces', '22', '58', '59', '60'])) return 'XL';
  if (matchOneOf(['ml'])) return 'M/L';
  if (matchOneOf(['xxs', '42', '43', '44', '45'])) return 'XXS';
  if (
    matchOneOf(['xs', '16 pouces', '17 pouces', '16', '17', '46', '47', '48'])
  )
    return 'XS';

  if (matchOneOf(['l', '21 pouces', '21', '55', '56', '57'])) return 'L';
  if (matchOneOf(['m', '20 pouces', '20', '52', '53', '54'])) return 'M';
  if (matchOneOf(['s', '18 pouces', '18', '19 pouces', '19', '49', '50', '51']))
    return 'S';

  return null;
};

const mapMountainBikeSize = (size: string) => {
  const matchOneOf = (values: string[]) =>
    values.some((v) => size.toLowerCase().replaceAll('/', '').includes(v));

  if (matchOneOf(['unique', 'universelle'])) return 'UNIQUE';
  if (matchOneOf(['enfant'])) return 'CHILD';

  if (
    matchOneOf([
      'xxl',
      '23 pouces',
      '24 pouces',
      '23',
      '24',
      '57',
      '58',
      '59',
      '60',
      '61',
      '62',
      '63',
      '64',
    ])
  )
    return 'XXL';
  if (
    matchOneOf([
      'xl',
      '21 pouces',
      '22 pouces',
      '21',
      '22',
      '52',
      '53',
      '54',
      '55',
      '56',
    ])
  )
    return 'XL';
  if (matchOneOf(['ml', '18 pouces', '18', '46', '47'])) return 'M/L';
  if (matchOneOf(['xxs'])) return 'XXS';
  if (
    matchOneOf([
      'xs',
      '13 pouces',
      '14 pouces',
      '13',
      '14',
      '33',
      '34',
      '35',
      '36',
    ])
  )
    return 'XS';

  if (
    matchOneOf([
      'l',
      '19 pouces',
      '20 pouces',
      '19',
      '20',
      '48',
      '49',
      '50',
      '51',
    ])
  )
    return 'L';
  if (matchOneOf(['m', '17 pouces', '17', '43', '44', '45'])) return 'M';
  if (
    matchOneOf([
      's',
      '15 pouces',
      '16 pources',
      '15',
      '16',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
    ])
  )
    return 'S';

  return null;
};

export const addFormattedBikeSizeToTags = (
  tags: Record<string, string[]>,
  collections: {
    id: UUID;
    handle: string;
  }[],
): Record<string, string[]> => {
  const isBike = collections.some(
    ({ handle }) => handle === BIKES_COLLECTION_HANDLE,
  );
  const isMountainBike = collections.some(({ handle }) =>
    MOUNTAIN_BIKES_COLLECTION_HANDLES.includes(handle),
  );
  const existingSizeTags = tags[BIKE_SIZE_TAG_KEY] ?? [];

  if (existingSizeTags.length === 0 || !isBike) return tags;

  return {
    ...tags,
    'formatted-bike-size': existingSizeTags
      .map(isMountainBike ? mapMountainBikeSize : mapBikeSize)
      .flatMap((size) => (size ? [size] : [])),
  };
};
