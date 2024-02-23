import { fetchCommission } from '@/clients/commission';
import { fetchHasura } from '@/clients/hasura';
import { Condition } from '@/components/pages/SellingForm/types';
import { ProductNotFoundException } from '@/exceptions/ProductNotFoundException';
import { getDictionary } from '@/i18n/translate';
import { enrichTags } from '@/mappers/fromSearchToProductCard';
import { ImageType } from '@/types';
import { roundCurrency } from '@/utils/currency';
import { calculateAverageRatings } from '@/utils/rating';
import {
  FetchProductsQuery,
  ProductCardFieldsFragment,
  VendorDetailsFragment,
} from '@/__generated/graphql';
import { gql } from '@apollo/client';
import capitalize from 'lodash/capitalize';
import compact from 'lodash/compact';
import first from 'lodash/first';
import flow from 'lodash/flow';
import groupBy from 'lodash/groupBy';
import isArray from 'lodash/isArray';
import mapValues from 'lodash/mapValues';
import { mapReviewsFromFragment, REVIEWS_FRAGMENT } from '../Reviews/container';
import { CardLabel, ProductMultiVariants } from './types';

const dict = getDictionary('fr');

type TagType = { tag: string | null; value: string | null };

export type ContainerPropsType = {
  productId?: string;
  productHandle?: string;
  productVariant?: string;
  intent?: ProductMultiVariants['intent'];
};

export const VENDOR_DETAILS_FRAGMENT = gql`
  ${REVIEWS_FRAGMENT}
  fragment VendorDetails on Customer {
    isPro
    sellerName
    shipmentTimeframe
    profilePictureShopifyCdnUrl
    createdAt
    authUserId
    VendorReviews {
      ...ReviewsFields
    }
    negociationAgreements {
      maxAmountPercent
    }
  }
`;

export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCardFields on dbt_store_exposed_product {
    product {
      id
      collections {
        collection_id
      }
      shopifyId
      variants(limit: 30) {
        id
        shopifyId: shopify_id
        variant {
          inventoryQuantity
          option1Name
          option1
          option2Name
          option2
          option3Name
          option3
          price
          compareAtPrice
          condition
          isRefurbished
        }
      }
      tags {
        tag
        value
      }
      images(limit: 30, order_by: { position: asc }) {
        alt
        src
        height
        width
      }
    }
    handle
    vendor
    title
    description
    productType
    numberOfViews
    status
  }
`;

export const FETCH_PRODUCTS = gql`
  ${VENDOR_DETAILS_FRAGMENT}

  ${PRODUCT_CARD_FRAGMENT}

  query fetchProducts($productIds: [bigint!], $productHandles: [String!]) {
    Product(
      where: {
        _or: [
          { shopifyId: { _in: $productIds } }
          { handle: { _in: $productHandles } }
        ]
      }
    ) {
      storeExposedProduct {
        ...ProductCardFields
      }

      Vendor {
        ...VendorDetails
      }
    }
  }
`;

export const createProductFromFragment = (
  productFromDBT: ProductCardFieldsFragment,
  variantId?: string,
  vendorDetails?: VendorDetailsFragment,
  commissionAmount?: number,
): ProductMultiVariants => {
  if (productFromDBT.product === null)
    throw new Error(`Product ${productFromDBT.handle} is incomplete`);

  const extractTags: (tags: TagType[]) => Record<string, string> = flow([
    (tags) => groupBy(tags, (tag) => tag.tag),
    (tags) =>
      mapValues(tags, (values) =>
        values.map(({ value }: TagType) => capitalize(value ?? '')),
      ),
    (tags) =>
      mapValues(tags, (values) =>
        isArray(values) ? values.join(' / ') : values,
      ),
  ]);

  const tags = extractTags(productFromDBT.product.tags);
  const enrichedTags = enrichTags(tags);

  const images: ImageType[] = compact(
    productFromDBT?.product.images?.map((image) => ({
      src: image?.src ?? '',
      altText: image?.alt ?? '',
      height: image.height,
      width: image.width,
    })),
  );

  const variants = productFromDBT.product.variants.map(
    ({ shopifyId, variant, id }) => ({
      name: [
        { name: variant?.option1Name, value: variant?.option1 },
        { name: variant?.option2Name, value: variant?.option2 },
        { name: variant?.option3Name, value: variant?.option3 },
      ]
        .filter((option) => !!option.name)
        .map(
          (selectedOption) => `${selectedOption.name}: ${selectedOption.value}`,
        )
        .join(' / '),
      id: id ?? '',
      shopifyId: String(shopifyId) ?? '',
      price: Number(variant?.price),
      compareAtPrice: Number(variant?.compareAtPrice),
      available: !!variant?.inventoryQuantity && variant?.inventoryQuantity > 0,
      condition: (variant?.condition as Condition) ?? Condition.GOOD,
      isRefurbished: !!variant?.isRefurbished,
    }),
  );

  const variant =
    variants.find((variant) => String(variant.shopifyId) === variantId) ??
    variants[0];

  const isPro = vendorDetails?.isPro;
  const hasRefurbishedVariant = !!variant.isRefurbished;

  const labels: CardLabel[] = [];

  if (isPro) {
    labels.push({
      color: 'white',
      position: 'right',
      content: dict.components.productCard.labels.pro,
    });
  }

  if (hasRefurbishedVariant) {
    labels.push({
      color: 'blue',
      position: 'left',
      content: dict.components.productCard.labels.refurbished,
    });
  }

  const reviews = mapReviewsFromFragment(vendorDetails?.VendorReviews ?? []);

  return {
    id: String(productFromDBT.product.id),
    shopifyId: String(productFromDBT.product.shopifyId),
    labels,
    vendor: {
      id: vendorDetails?.authUserId,
      name: vendorDetails?.sellerName ?? null,
      createdAt: vendorDetails?.createdAt ?? null,
      profilePicture: vendorDetails?.profilePictureShopifyCdnUrl ?? null,
      isPro: !!vendorDetails?.isPro,
      shipmentTimeframeSentence:
        dict.components.productCard.delivery.getShipmentTimeframeSentence(
          vendorDetails?.shipmentTimeframe,
        ),
      negociationMaxAmountPercent:
        first(vendorDetails?.negociationAgreements)?.maxAmountPercent ?? null,
      reviews: {
        averageRating: calculateAverageRatings(
          reviews.map(({ rating }) => rating),
        ),
        count: reviews.length,
      },
    },
    reviews: mapReviewsFromFragment(vendorDetails?.VendorReviews ?? []),
    title: productFromDBT.title ?? '',
    images,
    commissionAmount: roundCurrency(Number(commissionAmount)),
    description: productFromDBT.description ?? '',
    handle: productFromDBT.handle ?? '',
    variantId: variant.id ?? '',
    variantShopifyId: String(variant.shopifyId) ?? '',
    variants,
    productType: productFromDBT.productType ?? '',
    numberOfViews: productFromDBT.numberOfViews ?? 0,
    variantCondition: variant.condition,
    hasRefurbishedVariant: !!variant.isRefurbished,
    tags: enrichedTags,
    isSoldOut:
      !variants.some(({ available }) => available) ||
      productFromDBT.status?.toLowerCase() !== 'active',
    collections: productFromDBT.product.collections.map(
      ({ collection_id: id }) => id.toString(),
    ),
  };
};

export const getMultipleProductsData = async (
  productProps: ContainerPropsType[],
) => {
  const getFindVariantFromProduct = (
    product: ProductCardFieldsFragment,
    productProps: ContainerPropsType[],
  ) =>
    productProps.find(
      ({ productHandle, productId }) =>
        productId === product.product?.shopifyId ||
        productHandle === product.handle,
    )?.productVariant;

  const productIds = compact(productProps.map(({ productId }) => productId));
  const productHandles = compact(
    productProps.map(({ productHandle }) => productHandle),
  );
  const products = await fetchHasura<FetchProductsQuery>(FETCH_PRODUCTS, {
    variables: { productIds, productHandles },
  });

  return compact(
    products.Product.map(
      (product) =>
        product.storeExposedProduct &&
        createProductFromFragment(
          product.storeExposedProduct,
          getFindVariantFromProduct(product.storeExposedProduct, productProps),
          product.Vendor,
        ),
    ),
  );
};

export const getData = async ({
  productId,
  productHandle,
  productVariant,
}: ContainerPropsType): Promise<Omit<ProductMultiVariants, 'intent'>> => {
  if (!productId && !productHandle) {
    throw new Error('Should pass either productId or productHandle');
  }

  const productFetchPromise = fetchHasura<FetchProductsQuery>(FETCH_PRODUCTS, {
    variables: {
      productIds: compact([productId]),
      productHandles: compact([productHandle]),
    },
  });

  let productResponse = null;
  let commissionAmount = null;

  try {
    [productResponse, commissionAmount] = await Promise.all([
      await productFetchPromise,
      fetchCommission({
        productHandle,
        productId,
        productVariant,
      }),
    ]);
  } catch (e) {
    console.error(`Could not fetch error details ${JSON.stringify(e)}`);
  }

  const product = first(productResponse?.Product);

  if (!product?.storeExposedProduct)
    throw new ProductNotFoundException(productId ?? productHandle ?? '');

  return createProductFromFragment(
    product.storeExposedProduct,
    productVariant,
    product.Vendor ?? undefined,
    commissionAmount ?? undefined,
  );
};
