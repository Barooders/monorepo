import { graphql } from '@/__generated/gql/public';
import { fetchHasura } from '@/clients/hasura';
import { getMenuData } from '@/components/molecules/MegaMenu';
import { getData as getProductData } from '@/components/molecules/ProductCard/b2c/container';
import { mapReviewsFromFragment } from '@/components/molecules/Reviews/container';

import { ProductNotFoundException } from '@/exceptions/ProductNotFoundException';
import isEmpty from '@/utils/isEmpty';
import first from 'lodash/first';
import { PropsType as VendorHeaderPropsType } from './VendorPage/VendorHeader';
import {
  ChildCollectionType,
  CollectionData,
  GetDataType,
  ParentCollectionType,
  RelatedCollectionType,
} from './types';

type ParentCollection =
  | {
      shortName?: string | null;
      shopifyId: string;
      handle: string;
      title: string | null;
      parentCollection?: ParentCollection | null;
    }
  | null
  | undefined;

const FETCH_COLLECTION_PAGE = /* GraphQL */ /* typed_for_public */ `
  query fetchCollectionPageData(
    $collectionHandle: String!
    $vendorSellerName: String!
  ) {
    Collection(where: { handle: { _eq: $collectionHandle } }) {
      shopifyId
      handle
      type
      description
      title
      featuredImageSrc
      seoTitle
      seoDescription
      parentCollection {
        shortName
        handle
        shopifyId
        title
        childCollections {
          handle
          shortName
          shopifyId
          title
        }
        parentCollection {
          shortName
          handle
          shopifyId
          title
          parentCollection {
            shortName
            handle
            shopifyId
            title
          }
        }
      }
      childCollections {
        shortName
        handle
        title
        featuredImageSrc
      }
    }
    vendorData: Customer(
      where: {
        _and: [
          { sellerName: { _eq: $vendorSellerName } }
          { sellerName: { _neq: "" } }
        ]
      }
    ) {
      sellerName
      coverPictureShopifyCdnUrl
      description
      profilePictureShopifyCdnUrl
      VendorReviews {
        ...ReviewsFields
      }
    }
  }
`;

export const getData = async ({
  collectionHandle = '',
  productHandle = '',
  productVariantShopifyId = 0,
  vendorSellerName = '',
  searchQuery = '',
}): Promise<GetDataType> => {
  let collectionData: CollectionData | null = null;
  const parentCollections: ParentCollectionType[] = [];
  let childCollections: ChildCollectionType[] = [];
  let relatedCollections: RelatedCollectionType[] = [];
  let vendorInfo: VendorHeaderPropsType | null = null;

  const [collectionPageData, highlightedProduct, menuData] = await Promise.all([
    !isEmpty(collectionHandle)
      ? fetchHasura(graphql(FETCH_COLLECTION_PAGE), {
          variables: {
            collectionHandle,
            vendorSellerName,
          },
        })
      : Promise.resolve(),
    (async () => {
      if (!isEmpty(productHandle) && !isEmpty(productVariantShopifyId)) {
        try {
          return await getProductData({
            productHandle,
            productVariantShopifyId,
          });
        } catch (e) {
          if (e instanceof ProductNotFoundException) {
            return null;
          }

          throw e;
        }
      }
    })(),
    getMenuData(),
  ]);

  const collection = first(collectionPageData?.Collection);

  if (collection) {
    const collectionTitle =
      collection.title ?? collection.handle.replace('-', ' ') ?? '';
    collectionData = {
      descriptionHtml: collection.description ?? '',
      handle: collection.handle,
      id: Number(collection.shopifyId),
      image: null,
      title: collectionTitle,
      type: collection.type,
      seo: {
        title: collection.seoTitle ?? collectionTitle,
        description: collection.seoDescription ?? collection.description ?? '',
      },
    };

    let nextParentCollection: ParentCollection = collection?.parentCollection;

    while (nextParentCollection) {
      parentCollections.unshift({
        handle: nextParentCollection.handle,
        link: `/collections/${nextParentCollection.handle}`,
        title:
          nextParentCollection.shortName ?? nextParentCollection?.title ?? '',
        id: nextParentCollection.shopifyId,
      });
      nextParentCollection = nextParentCollection?.parentCollection;
    }

    childCollections = collection.childCollections.map((childCollection) => ({
      handle: childCollection.handle,
      imageUrl: childCollection?.featuredImageSrc ?? '',
      title: childCollection?.title ?? '',
      shortName: childCollection.shortName ?? null,
    }));

    relatedCollections =
      collection.parentCollection?.childCollections
        ?.filter(
          (relatedCollection) => relatedCollection.handle !== collectionHandle,
        )
        .map((relatedCollection) => ({
          handle: relatedCollection.handle,
          title: relatedCollection.shortName ?? relatedCollection?.title ?? '',
        })) ?? [];
  }

  const vendor = first(collectionPageData?.vendorData);
  if (vendor) {
    vendorInfo = {
      sellerName: vendor.sellerName ?? '',
      coverPictureUrl: vendor.coverPictureShopifyCdnUrl ?? '',
      description: vendor.description ?? '',
      profilePictureUrl: vendor.profilePictureShopifyCdnUrl ?? '',
      reviews: mapReviewsFromFragment(vendor.VendorReviews ?? []),
    };
  }

  const filters = ['inventory_quantity:>0'];

  if (collectionData) {
    filters.push(`collection_handles:=${collectionData.handle}`);
  }
  if (vendorInfo !== null && !isEmpty(vendorInfo?.sellerName)) {
    filters.push(`vendor:${vendorInfo.sellerName}`);
  }

  return {
    collectionData,
    parentCollections,
    childCollections,
    relatedCollections,
    vendorInfo,
    highlightedProduct: highlightedProduct ?? null,
    filters,
    query: searchQuery,
    menuData,
  };
};
