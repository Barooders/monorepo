'use client';

import { graphql } from '@/__generated/gql/registered_user';
import useB2BSearchContext from '@/components/molecules/B2BSearchBar/_state/useB2BSearchContext';
import ProPage, { PRODUCT_ID_QUERY_KEY } from '@/components/pages/ProPage';
import { useHasura } from '@/hooks/useHasura';
import useSearchParams from '@/hooks/useSearchParams';
import { getDictionary } from '@/i18n/translate';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';
import { SEARCH_BAR_QUERY_KEY } from '../../../../../../shared/components/molecules/B2BSearchBar';

const FETCH_B2B_SAVED_SEARCH_BY_NAME = /* GraphQL */ /* typed_for_registered_user */ `
  query FetchB2BSavedSearchByName($searchName: String) {
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

  const fetchB2BSavedSearchByName = useHasura(
    graphql(FETCH_B2B_SAVED_SEARCH_BY_NAME),
    HASURA_ROLES.REGISTERED_USER,
  );

  useEffect(() => {
    (async () => {
      const { SavedSearch } = await fetchB2BSavedSearchByName({
        searchName: dict.b2b.proPage.saveFilters.defaultSavedSearchName,
      });
      setSavedSearch(SavedSearch[0]);
    })();
  }, []);

  return (
    <ProPage
      productInternalId={productInternalId}
      searchQuery={searchQuery}
    />
  );
};

export default WebProPage;
