'use client';

import { PublicTypes } from '@/__generated/hasura-role-graphql.types';
import { fetchHasura } from '@/clients/hasura';
import Collapse from '@/components/atoms/Collapse';
import InnerPageBanner from '@/components/atoms/InnerPageBanner';
import { DesktopFilters, MobileFilters } from '@/components/molecules/Filters';
import { getMenuData } from '@/components/molecules/MegaMenu';
import { MegaMenuChunk } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import { getData as getProductData } from '@/components/molecules/ProductCard/b2c/container';
import { ProductMultiVariants as ProductCardPropsType } from '@/components/molecules/ProductCard/types';
import Reviews from '@/components/molecules/Reviews';
import {
  REVIEWS_FRAGMENT,
  REVIEW_BLOCK_ANCHOR,
  mapReviewsFromFragment,
} from '@/components/molecules/Reviews/container';
import { searchCollections } from '@/config';
import { ProductNotFoundException } from '@/exceptions/ProductNotFoundException';
import useSearchPage from '@/hooks/state/useSearchPage';
import { gql_public } from '@/hooks/useHasura';
import useInitDiscounts from '@/hooks/useInitDiscounts';
import { getDictionary } from '@/i18n/translate';
import first from 'lodash/first';
import { useEffect } from 'react';
import SavedSearchButton from '../../molecules/SavedSearchButton/index.mobile';
import CollectionHeader from './CollectionPage/CollectionHeader';
import RelatedCollections from './CollectionPage/RelatedCollections';
import SearchHeader from './GlobalSearch/SearchHeader';
import VendorHeader, {
  PropsType as VendorHeaderPropsType,
} from './VendorPage/VendorHeader';
import InstantSearchProvider from './_components/InstantSearchProvider';
import Pagination from './_components/Pagination';
import SearchResults from './_components/SearchResults';
import {
  ChildCollectionType,
  CollectionData,
  ParentCollectionType,
  RelatedCollectionType,
} from './types';

const dict = getDictionary('fr');

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

const FETCH_COLLECTION_PAGE = gql_public`
  ${REVIEWS_FRAGMENT}

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
  productVariant = '',
  vendorSellerName = '',
  searchQuery = '',
}): Promise<GetDataType> => {
  let collectionData: CollectionData | null = null;
  const parentCollections: ParentCollectionType[] = [];
  let childCollections: ChildCollectionType[] = [];
  let relatedCollections: RelatedCollectionType[] = [];
  let vendorInfo: VendorHeaderPropsType | null = null;

  const [collectionPageData, highlightedProduct, menuData] = await Promise.all([
    collectionHandle
      ? fetchHasura<PublicTypes.FetchCollectionPageDataQuery>(
          FETCH_COLLECTION_PAGE,
          {
            variables: {
              collectionHandle,
              vendorSellerName,
            },
          },
        )
      : Promise.resolve(),
    (async () => {
      if (productHandle && productVariant) {
        try {
          return await getProductData({
            productHandle,
            productVariant,
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
      id: collection.shopifyId,
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
  if (vendorInfo?.sellerName) {
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

export type GetDataType = {
  parentCollections?: ParentCollectionType[];
  collectionData?: CollectionData | null;
  childCollections?: ChildCollectionType[];
  relatedCollections?: RelatedCollectionType[];
  highlightedProduct?: ProductCardPropsType | null;
  vendorInfo?: VendorHeaderPropsType | null;
  filters: string[];
  query: string;
  menuData: MegaMenuChunk;
};

type PropsType = GetDataType & { serverUrl: string };

const SearchPage: React.FC<PropsType> = ({
  parentCollections,
  collectionData,
  childCollections,
  relatedCollections,
  highlightedProduct,
  vendorInfo,
  query,
  serverUrl,
  filters,
}) => {
  const setQuery = useSearchPage((state) => state.setQuery);
  const setCollection = useSearchPage((state) => state.setCollection);
  useEffect(() => {
    setCollection(
      collectionData
        ? {
            id: collectionData?.id,
            handle: collectionData?.handle,
            name: collectionData?.title,
          }
        : null,
    );
    setQuery(query);
  }, []);

  useInitDiscounts();

  return (
    <InstantSearchProvider
      collectionName={searchCollections.products.main}
      serverUrl={serverUrl}
      filters={filters}
      query={query}
      ruleContexts={[
        collectionData ? collectionData.handle : vendorInfo?.sellerName ?? '',
      ]}
    >
      <InnerPageBanner />
      <div className="mt-1">
        <div className="grid grid-cols-5 gap-10">
          <div className="col-span-1 col-start-1 hidden lg:block">
            <DesktopFilters />
          </div>
          <div className="col-span-5 flex flex-col gap-3 lg:col-span-4">
            {vendorInfo ? (
              <VendorHeader {...vendorInfo} />
            ) : collectionData ? (
              <CollectionHeader
                {...{
                  collectionData,
                  childCollections,
                  highlightedProduct,
                  parentCollections,
                }}
              />
            ) : (
              <SearchHeader searchQuery={query} />
            )}
            <div className="sticky top-[100px] z-10 flex bg-white pb-2 pt-1 lg:hidden">
              <MobileFilters />
            </div>
            <SearchResults />
            <Pagination />
            {vendorInfo?.reviews && vendorInfo.reviews.length > 0 && (
              <div
                className="mt-8"
                id={REVIEW_BLOCK_ANCHOR}
              >
                <Reviews reviews={vendorInfo?.reviews} />
              </div>
            )}
            {relatedCollections && relatedCollections.length > 0 && (
              <RelatedCollections relatedCollections={relatedCollections} />
            )}
            {collectionData && (
              <Collapse
                defaultOpen={true}
                renderTitle={() => <p>{dict.search.descriptionTitle}</p>}
                ContentComponent={() => (
                  <div
                    className="collection-descriptions my-3"
                    dangerouslySetInnerHTML={{
                      __html: collectionData.descriptionHtml,
                    }}
                  />
                )}
              />
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-3 right-6 md:hidden">
        <SavedSearchButton />
      </div>
    </InstantSearchProvider>
  );
};

export default SearchPage;
