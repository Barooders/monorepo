import { graphql } from '@/__generated/gql/public';
import {
  ProductCardFieldsFragment,
  VendorDetailsFragment,
} from '@/__generated/gql/public/graphql';
import { fetchCommission } from '@/clients/commission';
import { fetchHasura } from '@/clients/hasura';
import { mapReviewsFromFragment } from '@/components/molecules/Reviews/container';
import { Condition } from '@/components/pages/SellingForm/types';
import { ProductNotFoundException } from '@/exceptions/ProductNotFoundException';
import { getDictionary } from '@/i18n/translate';
import { enrichTags } from '@/mappers/search';
import { ImageType } from '@/types';
import { roundCurrency } from '@/utils/currency';
import { calculateAverageRatings } from '@/utils/rating';
import compact from 'lodash/compact';
import first from 'lodash/first';
import { createVariantName, extractTags } from '../container';
import { CardLabel, ProductMultiVariants } from '../types';

const dict = getDictionary('fr');

export type ContainerPropsType = {
  productInternalId?: string;
  productHandle?: string;
  productVariantShopifyId?: number;
  intent?: ProductMultiVariants['intent'];
};

export const PRODUCT_CARD_FRAGMENT = /* GraphQL */ /* typed_for_public */ `
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
        exposedVariant: variant {
          inventory_quantity
          option1Name
          option1
          option2Name
          option2
          option3Name
          option3
          condition
          isRefurbished
        }
        b2cVariant {
          price
          compare_at_price
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

export const VENDOR_DETAILS_FRAGMENT = /* GraphQL */ /* typed_for_public */ `
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

export const FETCH_PRODUCTS = /* GraphQL */ /* typed_for_public */ `
  query fetchProducts(
    $productInternalIds: [String!]
    $productHandles: [String!]
  ) {
    Product(
      where: {
        _or: [
          { id: { _in: $productInternalIds } }
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
  productVariantShopifyId?: number,
  vendorDetails?: VendorDetailsFragment,
  commissionAmount?: number,
): ProductMultiVariants => {
  if (!productFromDBT.product)
    throw new Error(`Product ${productFromDBT.handle} is incomplete`);

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
    ({ shopifyId, exposedVariant, b2cVariant, id }) => ({
      name: exposedVariant ? createVariantName(exposedVariant) : '',
      id: id ?? '',
      // TODO: Remove this when we remove shopifyIds
      shopifyId: shopifyId!,
      price: Number(b2cVariant?.price),
      compareAtPrice: Number(b2cVariant?.compare_at_price),
      available:
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        !!exposedVariant?.inventory_quantity &&
        exposedVariant?.inventory_quantity > 0,
      condition: (exposedVariant?.condition as Condition) ?? Condition.GOOD,
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      isRefurbished: !!exposedVariant?.isRefurbished,
    }),
  );

  const variant =
    variants.find((variant) => variant.shopifyId === productVariantShopifyId) ??
    variants[0];

  const isPro = vendorDetails?.isPro ?? false;
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
    shopifyId: productFromDBT.product.shopifyId,
    labels,
    vendor: {
      id: vendorDetails?.authUserId,
      name: vendorDetails?.sellerName ?? null,
      createdAt: vendorDetails?.createdAt ?? null,
      profilePicture: vendorDetails?.profilePictureShopifyCdnUrl ?? null,
      isPro,
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
    // TODO: Remove this when we remove shopifyIds
    variantShopifyId: variant.shopifyId!,
    variants,
    productType: productFromDBT.productType ?? '',
    numberOfViews: productFromDBT.numberOfViews ?? 0,
    variantCondition: variant.condition,
    hasRefurbishedVariant: !!variant.isRefurbished,
    tags: enrichedTags,
    isSoldOut:
      !variants.some(({ available }) => available) ||
      productFromDBT.status?.toLowerCase() !== 'active',
    collections:
      productFromDBT.product?.collections.map(({ collection_id: id }) =>
        id.toString(),
      ) ?? [],
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
      ({ productHandle, productInternalId }) =>
        productInternalId === product.product?.id ||
        productHandle === product.handle,
    )?.productVariantShopifyId;

  const productInternalIds = compact(
    productProps.map(({ productInternalId }) => productInternalId),
  );
  const productHandles = compact(
    productProps.map(({ productHandle }) => productHandle),
  );
  const products = await fetchHasura(graphql(FETCH_PRODUCTS), {
    variables: { productInternalIds, productHandles },
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
  productInternalId,
  productHandle,
  productVariantShopifyId,
}: ContainerPropsType): Promise<Omit<ProductMultiVariants, 'intent'>> => {
  if (productInternalId === undefined && productHandle === undefined) {
    throw new Error('Should pass either productId or productHandle');
  }

  const productFetchPromise = fetchHasura(graphql(FETCH_PRODUCTS), {
    variables: {
      productInternalIds: compact([productInternalId]),
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
        productInternalId,
        productVariantShopifyId,
      }),
    ]);
  } catch (e) {
    console.error(`Could not fetch error details ${JSON.stringify(e)}`);
  }

  const product = first(productResponse?.Product);

  if (!product?.storeExposedProduct)
    throw new ProductNotFoundException(
      productInternalId ?? productHandle ?? '',
    );

  return createProductFromFragment(
    product.storeExposedProduct,
    productVariantShopifyId,
    product.Vendor ?? undefined,
    commissionAmount ?? undefined,
  );
};
