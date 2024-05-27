'use client';

import PortalDrawer from '@/components/atoms/Drawer/portal';
import { DrawerSide } from '@/components/atoms/Drawer/types';
import PageContainer from '@/components/atoms/PageContainer';
import B2BClientRequestButton from '@/components/molecules/B2BCustomerRequestButton';
import B2BSavedSearchButton from '@/components/molecules/B2BSavedSearchButton';
import useB2BSearchContext from '@/components/molecules/B2BSearchBar/_state/useB2BSearchContext';
import {
  B2BDesktopFilters,
  B2BMobileFilters,
} from '@/components/molecules/Filters';
import B2BProductPanel from '@/components/molecules/ProductCard/b2b/connected';
import InstantSearchProvider from '@/components/pages/SearchPage/_components/InstantSearchProvider';
import Pagination from '@/components/pages/SearchPage/_components/Pagination';
import { searchCollections } from '@/config';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import AdminProductBanner from '../ProductPage/_components/AdminProductBanner';
import B2BCollectionHeader from './_components/B2BCollectionHeader';
import B2BSearchResults from './_components/B2BSearchResults';

export const PRODUCT_ID_QUERY_KEY = 'product';

type PropsType = {
  productInternalId: string | null;
  searchName?: string;
  searchQuery: string | null;
};

const ProPage: React.FC<PropsType> = ({ productInternalId, searchQuery }) => {
  const { user } = useHasuraToken();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const { setB2BSearchBar } = useB2BSearchContext();

  useEffect(() => {
    if (!isEmpty(productInternalId)) {
      setSelectedProductId(productInternalId);
    }
  }, [productInternalId]);

  useEffect(() => {
    if (searchQuery != null) {
      setB2BSearchBar(searchQuery);
    }
  }, [searchQuery]);

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
    <PageContainer includeVerticalPadding={true}>
      {selectedProductId !== null && (
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
        withRouter={false}
      >
        <div className="mt-1">
          <div className="grid grid-cols-5 gap-10">
            <div className="col-span-1 col-start-1 hidden lg:block">
              <B2BDesktopFilters />
            </div>
            <div className="col-span-5 flex flex-col gap-3 lg:col-span-4">
              <B2BCollectionHeader />
              <div className="flex bg-white pb-2 pt-1 lg:hidden">
                <B2BMobileFilters />
              </div>
              <B2BSearchResults openDetails={openDetails} />
              <Pagination />
            </div>
          </div>
        </div>
        <div className="fixed bottom-5 right-5 flex flex-col items-end gap-3">
          <B2BSavedSearchButton />
          <B2BClientRequestButton />
        </div>
      </InstantSearchProvider>
      <PortalDrawer
        ContentComponent={() =>
          selectedProductId !== null ? (
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
        isOpen={selectedProductId !== null}
      />
    </PageContainer>
  );
};

export default ProPage;
