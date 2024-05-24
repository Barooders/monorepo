'use client';

import Collapse from '@/components/atoms/Collapse';
import InnerPageBanner from '@/components/atoms/InnerPageBanner';
import { DesktopFilters, MobileFilters } from '@/components/molecules/Filters';
import Reviews from '@/components/molecules/Reviews';
import { REVIEW_BLOCK_ANCHOR } from '@/components/molecules/Reviews/container';
import { searchCollections } from '@/config';
import useSearchPage from '@/hooks/state/useSearchPage';
import useInitDiscounts from '@/hooks/useInitDiscounts';
import { getDictionary } from '@/i18n/translate';
import { useEffect } from 'react';
import SavedSearchButton from '../../molecules/SavedSearchButton/index.mobile';
import CollectionHeader from './CollectionPage/CollectionHeader';
import RelatedCollections from './CollectionPage/RelatedCollections';
import SearchHeader from './GlobalSearch/SearchHeader';
import VendorHeader from './VendorPage/VendorHeader';
import InstantSearchProvider from './_components/InstantSearchProvider';
import Pagination from './_components/Pagination';
import SearchResults from './_components/SearchResults';
import { GetDataType } from './types';
import PageContainer from '@/components/atoms/PageContainer';

const dict = getDictionary('fr');

type PropsType = GetDataType;

const SearchPage: React.FC<PropsType> = ({
  parentCollections,
  collectionData,
  childCollections,
  relatedCollections,
  highlightedProduct,
  vendorInfo,
  query,
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
    <PageContainer>
      <InstantSearchProvider
        collectionName={searchCollections.products.main}
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
    </PageContainer>
  );
};

export default SearchPage;
