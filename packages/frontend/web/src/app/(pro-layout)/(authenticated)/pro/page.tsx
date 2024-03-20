'use client';

import Filters from '@/components/pages/SearchPage/_components/Filters';
import InstantSearchProvider from '@/components/pages/SearchPage/_components/InstantSearchProvider';
import { InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';

const ProPage: React.FC = () => {
  return (
    <>
      <InstantSearchSSRProvider>
        <InstantSearchProvider
          filters={[]}
          query={''}
          ruleContexts={['']}
        >
          <Filters />
        </InstantSearchProvider>
      </InstantSearchSSRProvider>
    </>
  );
};

export default ProPage;
