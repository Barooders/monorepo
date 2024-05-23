import { getFacetValueLabel } from '@/components/molecules/Filters/utils/getFacetLabel';
import {
  CardLabel,
  ProductMultiVariants,
} from '@/components/molecules/ProductCard/types';
import { ProductCardProps } from '@/components/pages/ProductPage';
import { Condition } from '@/components/pages/SellingForm/types';
import {
  b2bVariantsCollection,
  publicVariantsCollection,
  typesenseInstantsearchAdapter,
} from '@/config';
import { getDictionary } from '@/i18n/translate';
import { mapValues } from 'lodash';
import capitalize from 'lodash/capitalize';
import {
  SearchB2BVariantDocument,
  SearchPreset,
  SearchPublicVariantDocument,
} from 'shared-types';

const TAG_VALUES_JOINER = ' / ';
const RECOMMENDED_PRODUCT_PRICE_PERCENTAGE_RANGE = 30;

export const orderedSeoSizes = [
  'taille-textile',
  'taille-pointure',
  'taille-crampon',
  'longueur-aileron',
  'taille-wing',
  'taille-velo',
  'taille-gants-boxe',
  'places-canoe',
  'taille-gear',
  'taille-ski',
  'taille-mp',
  'taille-batons',
  'taille-montre',
  'taille-planche-feet',
  'taille-planche-volume',
  'taille-volume',
];

export const enrichTags = (tags: Record<string, string>) => {
  const enrichedTags = { ...tags };
  const sizeName: string =
    orderedSeoSizes.find((seoSize) => tags.hasOwnProperty(seoSize)) ?? 'taille';

  const size = sizeName && tags[sizeName];

  if (size) enrichedTags.taille = size;

  return enrichedTags;
};

export const fromSearchToProductCard = (
  hit: SearchPublicVariantDocument,
): ProductMultiVariants => {
  const dict = getDictionary('fr');

  let imageUrl = null;
  const image = hit.product_image ?? null;
  if (image) {
    imageUrl = new URL(image);
    imageUrl.pathname = imageUrl.pathname.replace(/\.([a-z]+)$/, '_500x.$1');
  }

  const productTags = enrichTags(
    mapValues(hit.array_tags, (tag) => tag.join(TAG_VALUES_JOINER)),
  );

  const isPro = hit.meta.barooders.owner === 'b2c';
  const isRefurbished = hit.is_refurbished === 'true';

  const labels: CardLabel[] = [];

  if (isPro) {
    labels.push({
      color: 'white',
      position: 'right',
      content: dict.components.productCard.labels.pro,
    });
  }

  if (isRefurbished) {
    labels.push({
      color: 'blue',
      position: 'left',
      content: dict.components.productCard.labels.refurbished,
    });
  }

  const variantShopifyId = hit.variant_shopify_id ?? 0;
  const variantId = hit.variant_internal_id;

  return {
    tags: productTags,
    variantCondition: hit.condition as Condition,
    hasRefurbishedVariant: isRefurbished,
    numberOfViews: 0,
    images:
      imageUrl !== null
        ? [
            {
              src: imageUrl.toString(),
              altText: hit.title,
              width: null,
              height: null,
            },
          ]
        : [],
    labels,
    variants: [
      {
        compareAtPrice: hit.compare_at_price,
        price: hit.price,
        shopifyId: variantShopifyId,
        id: variantId,
        name: '',
        available: true,
        isRefurbished,
      },
    ],
    variantShopifyId,
    variantId,
    isSoldOut: false,
    title: hit.title,
    vendor: {
      id: null,
      name: hit.vendor,
      createdAt: '2022-01-01',
      profilePicture: null,
      isPro,
      shipmentTimeframeSentence: null,
      negociationMaxAmountPercent: null,
      reviews: {
        count: hit.vendor_informations?.reviews.count ?? 0,
        averageRating: hit.vendor_informations?.reviews.average_rating
          ? Math.round(hit.vendor_informations.reviews.average_rating * 10) / 10
          : undefined,
      },
    },
    reviews: [],
    productType: hit.product_type,
    handle: hit.handle,
    shopifyId: hit.product_shopify_id ?? 0,
    id: hit.product_internal_id,
    collections: hit.collection_internal_ids ?? [],
  };
};

export const fromSearchToB2BProductCard = (hit: SearchB2BVariantDocument) => {
  let imageUrl = null;
  const image = hit.product_image ?? null;
  if (image) {
    imageUrl = new URL(image);
    imageUrl.pathname = imageUrl.pathname.replace(/\.([a-z]+)$/, '_500x.$1');
  }

  const productTags = enrichTags(
    mapValues(hit.array_tags, (tag) => tag.join(TAG_VALUES_JOINER)),
  );

  return {
    tags: productTags,
    variantCondition: hit.condition as Condition,
    image:
      imageUrl !== null
        ? {
            src: imageUrl.toString(),
            altText: hit.title,
            width: null,
            height: null,
          }
        : undefined,
    title: hit.title,
    price: hit.price,
    largestBundlePrice: hit.largest_bundle_price
      ? hit.largest_bundle_price
      : undefined,
    compareAtPrice: hit.compare_at_price,
    stock: hit.total_quantity,
    productType: hit.product_type,
    handle: hit.handle,
    shopifyId: hit.product_shopify_id,
    id: hit.product_internal_id,
    vendorId: hit.vendor_id,
  };
};

const getProductsFromFilterQuery = async (
  filterQuery: string,
  maxResults = 20,
) => {
  const { grouped_hits } = await typesenseInstantsearchAdapter.typesenseClient
    .collections<SearchPublicVariantDocument>(publicVariantsCollection)
    .documents()
    .search(
      {
        q: '*',
        preset: SearchPreset.PUBLIC,
        filter_by: filterQuery,
        sort_by: 'computed_scoring:desc',
        group_by: 'product_internal_id',
        group_limit: maxResults,
        per_page: maxResults,
      },
      {},
    );

  return (
    (grouped_hits ?? [])
      .map(({ hits }) => hits[0])
      // We need to force the type because Typesense lib is typing the document as object
      // See: typesense/lib/Typesense/SearchClient.d.ts
      .map(({ document }) =>
        fromSearchToProductCard(document as SearchPublicVariantDocument),
      )
  );
};

export const fetchProductsInSearchFromCollectionHandle = async (
  collectionHandle: string,
): Promise<ProductMultiVariants[]> => {
  return getProductsFromFilterQuery(
    ['inventory_quantity:> 0', `collection_handles:=${collectionHandle}`].join(
      ' && ',
    ),
  );
};

export const fetchRecommendedProducts = async ({
  productType,
  tags,
  variants,
  id,
}: ProductCardProps): Promise<ProductMultiVariants[]> => {
  const productMinPrice = Math.min(...variants.map((variant) => variant.price));
  const lowerBound =
    productMinPrice * (1 - RECOMMENDED_PRODUCT_PRICE_PERCENTAGE_RANGE / 100);
  const upperBound =
    productMinPrice * (1 + RECOMMENDED_PRODUCT_PRICE_PERCENTAGE_RANGE / 100);

  const productSizeMatch = Object.entries(tags).find(([key]) =>
    orderedSeoSizes.includes(key),
  );
  const productSizeQuery = productSizeMatch
    ? `array_tags.${productSizeMatch[0]}:[${productSizeMatch[1].split(
        TAG_VALUES_JOINER,
      )}]`
    : undefined;

  return getProductsFromFilterQuery(
    [
      'inventory_quantity:>0',
      `product_type:=${productType}`,
      `price: [${lowerBound.toFixed(0)}..${upperBound.toFixed(0)}]`,
      `product_internal_id:!=${id}`,
      productSizeQuery,
    ]
      .filter(Boolean)
      .join(' && '),
  );
};

export const mapCurrentSearchToString = (
  refinements: {
    attribute: string;
    operator?: string;
    label: string;
    value: string;
  }[],
  query?: string,
): string => {
  return mapCurrentSearch(refinements, query).join('・');
};

export const mapCurrentSearch = (
  refinements: {
    attribute: string;
    operator?: string;
    label: string;
    value: string;
  }[],
  query?: string,
) => {
  return [
    ...(query ? [query] : []),
    ...refinements
      .map((refinement) =>
        refinement.operator
          ? `${refinement.operator} ${refinement.value}`
          : getFacetValueLabel(refinement.attribute, refinement.label),
      )
      .map(String),
  ].map(capitalize);
};

export const fetchB2BProductsFromSameVendor = async (
  vendorId: string,
  product_internal_id: string,
) => {
  const filterQuery = [
    'inventory_quantity:> 0',
    `vendor_id:=${vendorId}`,
    `product_internal_id:!=${product_internal_id}`,
  ].join(' && ');
  const maxResults = 20;

  const { grouped_hits } = await typesenseInstantsearchAdapter.typesenseClient
    .collections<SearchB2BVariantDocument>(b2bVariantsCollection)
    .documents()
    .search(
      {
        q: '*',
        preset: SearchPreset.B2B,
        filter_by: filterQuery,
        group_by: 'product_internal_id',
        group_limit: maxResults,
        per_page: maxResults,
      },
      {},
    );

  return (
    (grouped_hits ?? [])
      .map(({ hits }) => hits[0])
      // We need to force the type because Typesense lib is typing the document as object
      // See: typesense/lib/Typesense/SearchClient.d.ts
      .map(({ document }) =>
        fromSearchToB2BProductCard(document as SearchB2BVariantDocument),
      )
  );
};
