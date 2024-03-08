import {
  CardLabel,
  ProductMultiVariants,
} from '@/components/molecules/ProductCard/types';
import { ProductCardProps } from '@/components/pages/ProductPage';
import {
  SEARCHABLE_PRODUCT_ATTRIBUTES_PRESET,
  typesenseInstantsearchAdapter,
  variantsCollection,
} from '@/config';
import { getDictionary } from '@/i18n/translate';
import { HitSearchType } from '@/types';
import { mapValues } from 'lodash';

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
  hit: HitSearchType,
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

  return {
    tags: productTags,
    variantCondition: hit.condition,
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
        shopifyId: hit.variant_shopify_id.toString(),
        id: hit.variant_internal_id ?? 'UNKNOWN',
        name: '',
        available: true,
        isRefurbished,
      },
    ],
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
    shopifyId: hit.product_shopify_id.toString(),
    id: hit.product_internal_id,
    collections: hit.collection_internal_ids ?? [],
  };
};

const getProductsFromFilterQuery = async (
  filterQuery: string,
  maxResults = 20,
) => {
  const { grouped_hits } = await typesenseInstantsearchAdapter.typesenseClient
    .collections<HitSearchType>(variantsCollection)
    .documents()
    .search(
      {
        q: '*',
        preset: SEARCHABLE_PRODUCT_ATTRIBUTES_PRESET,
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
      .map(({ document }) => fromSearchToProductCard(document as HitSearchType))
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
