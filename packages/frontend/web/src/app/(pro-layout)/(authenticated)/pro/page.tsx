'use client';

import PageContainer from '@/components/atoms/PageContainer';
import B2BSearchResults from '@/components/pages/SearchPage/_components/B2BSearchResults';
import { B2BDesktopFilters } from '@/components/pages/SearchPage/_components/Filters';
import InstantSearchProvider from '@/components/pages/SearchPage/_components/InstantSearchProvider';
import Pagination from '@/components/pages/SearchPage/_components/Pagination';
import { searchIndexes } from '@/config';

const ProPage: React.FC = () => {
  return (
    <PageContainer>
      <InstantSearchProvider
        indexName={searchIndexes.b2bProducts.main}
        filters={[]}
        query={''}
        ruleContexts={[]}
      >
        <div className="mt-1">
          <div className="grid grid-cols-5 gap-10">
            <div className="col-span-1 col-start-1 hidden lg:block">
              <B2BDesktopFilters />
            </div>
            <div className="col-span-5 flex flex-col gap-3 lg:col-span-4">
              <B2BSearchResults />
              <Pagination />
            </div>
          </div>
        </div>
        {/* <div className="fixed right-6 bottom-3 md:hidden">
        <SearchAlertButton />
      </div> */}
      </InstantSearchProvider>
    </PageContainer>
  );
};

export default ProPage;
