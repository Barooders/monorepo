'use client';

import { graphql } from '@/__generated/gql/registered_user';
import { SEARCH_BAR_QUERY_KEY } from '@/components/molecules/B2BSearchBar';
import useB2BSearchContext from '@/components/molecules/B2BSearchBar/_state/useB2BSearchContext';
import ProPage from '@/components/pages/ProPage';
import { useHasura } from '@/hooks/useHasura';
import useSearchParams from '@/hooks/useSearchParams';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';

const FETCH_B2B_SAVED_SEARCH_BY_URL = /* GraphQL */ /* typed_for_registered_user */ `
  query FetchB2BSavedSearchByUrl($resultsUrl: String) {
    SavedSearch(
      limit: 1
      order_by: { createdAt: desc }
      where: {
        type: { _eq: "B2B_MAIN_PAGE" }
        resultsUrl: { _eq: $resultsUrl }
      }
    ) {
      id
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
      SearchAlert {
        isActive
      }
    }
  }
`;

const SavedSearchPage = ({
  params,
}: {
  params: { searchName: string; search: string };
}) => {
  const searchQuery = useSearchParams(SEARCH_BAR_QUERY_KEY);

  const { setSavedSearch } = useB2BSearchContext();

  const fetchB2BSavedSearch = useHasura(
    graphql(FETCH_B2B_SAVED_SEARCH_BY_URL),
    HASURA_ROLES.REGISTERED_USER,
  );

  useEffect(() => {
    (async () => {
      const { SavedSearch } = await fetchB2BSavedSearch({
        resultsUrl: `https://${process.env.NEXT_PUBLIC_FRONT_DOMAIN}/pro/search/${params.searchName}`,
      });
      setSavedSearch(SavedSearch[0]);
    })();
  }, [params.searchName]);

  return (
    <ProPage
      productInternalId={null}
      searchName={params.searchName}
      searchQuery={searchQuery}
    />
  );
};

export default SavedSearchPage;
