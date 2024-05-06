'use client';

import { graphql } from '@/__generated/gql/registered_user';
import PortalDrawer from '@/components/atoms/Drawer/portal';
import { DrawerSide } from '@/components/atoms/Drawer/types';
import PageContainer from '@/components/atoms/PageContainer';
import B2BClientRequestButton from '@/components/molecules/B2BCustomerRequestButton';
import B2BSavedSearchButton from '@/components/molecules/B2BSavedSearchButton';
import { B2BDesktopFilters } from '@/components/molecules/Filters';
import B2BProductPanel from '@/components/molecules/ProductCard/b2b/connected';
import InstantSearchProvider from '@/components/pages/SearchPage/_components/InstantSearchProvider';
import Pagination from '@/components/pages/SearchPage/_components/Pagination';
import { searchCollections } from '@/config';
import { SavedSearch, SavedSearchContext } from '@/contexts/savedSearch';
import { useHasura } from '@/hooks/useHasura';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import { useEffect, useState } from 'react';
import { HASURA_ROLES } from 'shared-types';
import AdminProductBanner from '../ProductPage/_components/AdminProductBanner';
import B2BCollectionHeader from './_components/B2BCollectionHeader';
import B2BSearchResults from './_components/B2BSearchResults';

export const PRODUCT_ID_QUERY_KEY = 'product';

const FETCH_B2B_SAVED_SEARCH = /* GraphQL */ /* typed_for_registered_user */ `
  query FetchB2BSavedSearch($resultsUrl: String) {
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

type PropsType = {
  productInternalId: string | null;
  searchName?: string;
};

const ProPage: React.FC<PropsType> = ({ productInternalId, searchName }) => {
  const { user } = useHasuraToken();
  const [savedSearch, setSavedSearch] = useState<SavedSearch | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const fetchB2BSavedSearch = useHasura(
    graphql(FETCH_B2B_SAVED_SEARCH),
    HASURA_ROLES.REGISTERED_USER,
  );

  useEffect(() => {
    if (productInternalId) {
      setSelectedProductId(productInternalId);
    }
  }, [productInternalId]);

  useEffect(() => {
    (async () => {
      if (!searchName) return;

      const { SavedSearch } = await fetchB2BSavedSearch({
        resultsUrl: `https://${process.env.NEXT_PUBLIC_FRONT_DOMAIN}/pro/search/${searchName}`,
      });
      setSavedSearch(SavedSearch[0]);
    })();
  }, [searchName]);

  const addProductToUrl = (productInternalId: string) => {
    const newUrl = new URL(window.location.href);
    if (newUrl.searchParams.has(PRODUCT_ID_QUERY_KEY)) {
      newUrl.searchParams.set(PRODUCT_ID_QUERY_KEY, productInternalId);
    } else {
      newUrl.searchParams.append(PRODUCT_ID_QUERY_KEY, productInternalId);
    }

    history.pushState({}, 'Open product', newUrl.toString());
  };

  const removeProductFromUrl = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete(PRODUCT_ID_QUERY_KEY);

    history.pushState({}, 'Close product', newUrl.toString());
  };

  if (!user) return <></>;

  const filters = [`total_quantity:> 0`, `vendor_id:!=${user.id}`];

  const openDetails = (productInternalId: string) => {
    addProductToUrl(productInternalId);
    setSelectedProductId(productInternalId);
  };

  return (
    <PageContainer includeVerticalPadding={false}>
      {selectedProductId && (
        <AdminProductBanner
          productInternalId={selectedProductId}
          showByDefault={false}
          market="B2B"
        />
      )}
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
                  <B2BClientRequestButton />
                </div>
                <B2BDesktopFilters />
              </div>
              <div className="col-span-5 flex flex-col gap-3 lg:col-span-4">
                <B2BCollectionHeader />
                <B2BSearchResults openDetails={openDetails} />
                <Pagination />
                <div className="sticky bottom-10 left-0 right-0 mt-5 hidden justify-center md:flex">
                  <B2BSavedSearchButton />
                </div>
              </div>
            </div>
          </div>
        </SavedSearchContext.Provider>
      </InstantSearchProvider>
      <PortalDrawer
        ContentComponent={() =>
          selectedProductId ? (
            <div className="w-[360px] md:w-[400px] lg:w-[450px]">
              <B2BProductPanel
                productInternalId={selectedProductId}
                openDetails={openDetails}
              />
            </div>
          ) : (
            <></>
          )
        }
        side={DrawerSide.RIGHT}
        closeMenu={() => {
          removeProductFromUrl();
          setSelectedProductId(null);
        }}
        isOpen={!!selectedProductId}
      />
    </PageContainer>
  );
};

export default ProPage;
