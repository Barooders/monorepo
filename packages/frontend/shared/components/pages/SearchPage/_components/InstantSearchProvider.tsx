'use client';

import { searchClient } from '@/config';
import config from '@/config/env';
import { Configure } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

type PropsType = {
  collectionName: string;
  filters: string[];
  query: string;
  children: React.ReactNode;
  ruleContexts: string[];
  withRouter?: boolean;
};

const InstantSearchProvider: React.FC<PropsType> = ({
  collectionName,
  filters,
  query,
  ruleContexts,
  children,
  withRouter = true,
}) => {
  return (
    <InstantSearchNext
      searchClient={searchClient}
      indexName={collectionName}
      routing={
        withRouter
          ? {
              router: {
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
    </InstantSearchNext>
  );
};

export default InstantSearchProvider;
