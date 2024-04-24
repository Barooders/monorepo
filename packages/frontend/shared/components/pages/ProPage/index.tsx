'use client';

import { FetchB2BSavedSearchQuery } from '@/__generated/graphql';
import PageContainer from '@/components/atoms/PageContainer';
import B2BSavedSearchButton from '@/components/molecules/B2BSavedSearchButton';
import { B2BDesktopFilters } from '@/components/molecules/Filters';
import InstantSearchProvider from '@/components/pages/SearchPage/_components/InstantSearchProvider';
import Pagination from '@/components/pages/SearchPage/_components/Pagination';
import { searchCollections } from '@/config';
import { SavedSearch, SavedSearchContext } from '@/contexts/savedSearch';
import { useHasura } from '@/hooks/useHasura';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { HASURA_ROLES } from 'shared-types';
import B2BCollectionHeader from './_components/B2BCollectionHeader';
import B2BSearchResults from './_components/B2BSearchResults';

const FETCH_B2B_SAVED_SEARCH = gql`
  query FetchB2BSavedSearch {
    SavedSearch(
      limit: 1
      order_by: { createdAt: desc }
      where: { type: { _eq: "B2B_MAIN_PAGE" } }
    ) {
      FacetFilters {
        value
        facetName
      }
      NumericFilters {
        facetName
        operator
        value
      }
      query
    }
  }
`;

const ProPage: React.FC = () => {
  const { user } = useHasuraToken();
  const [savedSearch, setSavedSearch] = useState<SavedSearch | undefined>();

  const fetchB2BSavedSearch = useHasura<FetchB2BSavedSearchQuery>(
    FETCH_B2B_SAVED_SEARCH,
    HASURA_ROLES.REGISTERED_USER,
  );

  useEffect(() => {
    (async () => {
      const { SavedSearch } = await fetchB2BSavedSearch();
      setSavedSearch(SavedSearch[0]);
    })();
  }, []);

  if (!user) return <></>;

  const filters = [`total_quantity:> 0`, `vendor_id:!=${user.id}`];

  return (
    <PageContainer includeVerticalPadding={false}>
      <InstantSearchProvider
        collectionName={searchCollections.b2bProducts.main}
        filters={filters}
        query={''}
        ruleContexts={[]}
      >
        <SavedSearchContext.Provider value={savedSearch}>
          <div className="mt-1">
            <div className="grid grid-cols-5 gap-10">
              <div className="col-span-1 col-start-1 hidden lg:block">
                <div className="mb-4">
                  <B2BSavedSearchButton />
                </div>
                <B2BDesktopFilters />
              </div>
              <div className="col-span-5 flex flex-col gap-3 lg:col-span-4">
                <B2BCollectionHeader />
                <B2BSearchResults />
                <Pagination />
              </div>
            </div>
          </div>
        </SavedSearchContext.Provider>
      </InstantSearchProvider>
    </PageContainer>
  );
};

export default ProPage;
