'use client';

import { graphql } from '@/__generated/gql/registered_user';
import useB2BSearchContext from '@/components/molecules/B2BSearchBar/_state/useB2BSearchContext';
import ProPage, { PRODUCT_ID_QUERY_KEY } from '@/components/pages/ProPage';
import useSearchParams from '@/hooks/useSearchParams';
import { getDictionary } from '@/i18n/translate';
import { useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { SEARCH_BAR_QUERY_KEY } from '../../../../../../shared/components/molecules/B2BSearchBar';

const SUBSCRIPTION_B2B_SAVED_SEARCH_BY_NAME = /* GraphQL */ /* typed_for_registered_user */ `
  subscription FetchB2BSavedSearchByName($searchName: String) {
    SavedSearch(
      limit: 1
      order_by: { createdAt: desc }
      where: { type: { _eq: "B2B_MAIN_PAGE" }, name: { _eq: $searchName } }
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

const dict = getDictionary('fr');

const WebProPage: React.FC = () => {
  const productInternalId = useSearchParams(PRODUCT_ID_QUERY_KEY);
  const searchQuery = useSearchParams(SEARCH_BAR_QUERY_KEY);

  const { setSavedSearch } = useB2BSearchContext();

  const { data: savedFiltersResult } = useSubscription(
    graphql(SUBSCRIPTION_B2B_SAVED_SEARCH_BY_NAME),
    {
      variables: {
        searchName: dict.b2b.proPage.saveFilters.defaultSavedSearchName,
      },
    },
  );

  useEffect(() => {
    const savedSearch = savedFiltersResult?.SavedSearch[0];
    if (savedSearch) {
      setSavedSearch(savedSearch);
    }
  }, [savedFiltersResult, setSavedSearch]);

  return (
    <ProPage
      productInternalId={productInternalId}
      searchQuery={searchQuery}
    />
  );
};

export default WebProPage;
