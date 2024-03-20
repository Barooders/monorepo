import { searchClient, searchIndexes } from '@/config';
import config from '@/config/env';
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-hooks-router-nextjs';
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web';

type PropsType = {
  filters: string[];
  query: string;
  serverUrl?: string;
  children: React.ReactNode;
  ruleContexts: string[];
};

const InstantSearchProvider: React.FC<PropsType> = ({
  filters,
  query,
  serverUrl,
  ruleContexts,
  children,
}) => {
  const router = createInstantSearchRouterNext({
    singletonRouter,
    serverUrl,
    routerOptions: {
      createURL({ location, qsModule, routeState }) {
        const { origin, pathname, hash, search } = location;

        const params = qsModule.parse(search, {
          ignoreQueryPrefix: true,
        });
        const queryString = qsModule.stringify(
          {
            ...params,
            ...routeState,
          },
          { addQueryPrefix: true },
        );

        return `${origin}${pathname}${queryString}${hash}`;
      },
    },
  });

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={searchIndexes.products.main}
      routing={
        serverUrl
          ? {
              router,
            }
          : false
      }
    >
      <Configure
        filters={filters.join(' && ')}
        hitsPerPage={51}
        query={query}
        ruleContexts={ruleContexts}
        maxValuesPerFacet={config.search.maxValuesPerFacet}
      />
      {children}
    </InstantSearch>
  );
};

export default InstantSearchProvider;
