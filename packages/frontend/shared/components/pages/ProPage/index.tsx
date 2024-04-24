'use client';

import PortalDrawer from '@/components/atoms/Drawer/portal';
import { DrawerSide } from '@/components/atoms/Drawer/types';
import PageContainer from '@/components/atoms/PageContainer';
import B2BSavedSearchButton from '@/components/molecules/B2BSavedSearchButton';
import { B2BDesktopFilters } from '@/components/molecules/Filters';
import B2BProductPanel from '@/components/molecules/ProductCard/b2b/connected';
import InstantSearchProvider from '@/components/pages/SearchPage/_components/InstantSearchProvider';
import Pagination from '@/components/pages/SearchPage/_components/Pagination';
import { searchCollections } from '@/config';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import { useEffect, useState } from 'react';
import B2BCollectionHeader from './_components/B2BCollectionHeader';
import B2BSearchResults from './_components/B2BSearchResults';

type PropsType = {
  productInternalId: string | null;
};

const ProPage: React.FC<PropsType> = ({ productInternalId = null }) => {
  const { user } = useHasuraToken();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (productInternalId) {
      setSelectedProductId(productInternalId);
    }
  }, [productInternalId]);

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
              <B2BSearchResults
                openDetails={(productInternalId: string) =>
                  setSelectedProductId(productInternalId)
                }
              />
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearchProvider>
      <PortalDrawer
        ContentComponent={() =>
          selectedProductId ? (
            <B2BProductPanel productInternalId={selectedProductId} />
          ) : (
            <></>
          )
        }
        side={DrawerSide.RIGHT}
        closeMenu={() => setSelectedProductId(null)}
        isOpen={!!selectedProductId}
      />
    </PageContainer>
  );
};

export default ProPage;
