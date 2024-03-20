'use client';

import PageContainer from '@/components/atoms/PageContainer';
import {
  DesktopFilters,
  MobileFilters,
} from '@/components/pages/SearchPage/_components/Filters';
import InstantSearchProvider from '@/components/pages/SearchPage/_components/InstantSearchProvider';
import SearchResults from '@/components/pages/SearchPage/_components/SearchResults';
import { searchIndexes } from '@/config';
import { Pagination } from 'react-instantsearch-hooks-web';

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
              <DesktopFilters />
            </div>
            <div className="col-span-5 flex flex-col gap-3 lg:col-span-4">
              <div className="sticky top-[100px] z-10 flex bg-white pb-2 pt-1 lg:hidden">
                <MobileFilters />
              </div>
              <SearchResults />
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
