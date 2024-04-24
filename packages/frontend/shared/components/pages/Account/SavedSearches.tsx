'use client';

import { FetchSavedSearchesQuery } from '@/__generated/graphql';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import { getFacetValueLabel } from '@/components/molecules/Filters/utils/getFacetLabel';
import SearchAlertToggleButton from '@/components/molecules/SearchAlertToggleButton';
import useDeleteSavedSearch from '@/hooks/useDeleteSavedSearch';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { gql } from '@apollo/client';
import capitalize from 'lodash/capitalize';
import { useEffect } from 'react';

const FETCH_SAVED_SEARCHES = gql`
  query fetchSavedSearches {
    SavedSearch {
      id
      name
      type
      resultsUrl
      FacetFilters {
        facetName
        label
        value
      }
      NumericFilters {
        facetName
        operator
        value
      }
      SearchAlert {
        isActive
      }
    }
  }
`;

const SavedSearches = () => {
  const [, removeSavedSearch] = useDeleteSavedSearch();
  const fetchSavedSearches =
    useHasura<FetchSavedSearchesQuery>(FETCH_SAVED_SEARCHES);
  const [fetchState, doFetchSavedSearches] =
    useWrappedAsyncFn<() => Promise<FetchSavedSearchesQuery>>(
      fetchSavedSearches,
    );

  const doRemoveSavedSearch = async (searchId: string) => {
    await removeSavedSearch(searchId);
    doFetchSavedSearches();
  };

  useEffect(() => {
    doFetchSavedSearches();
  }, []);

  const dict = getDictionary('fr');
  return (
    <PageContainer size="medium">
      <div className="flex flex-col gap-5">
        <h1 className="self-center text-2xl font-semibold">
          {dict.savedSearches.title}
        </h1>
        <ul className="grid grid-cols-1 gap-3 px-5 sm:grid-cols-3 lg:grid-cols-4">
          {fetchState.loading ? (
            <Loader />
          ) : fetchState.error ? (
            <p className="text-red-600">{dict.global.errors.unknownError}</p>
          ) : fetchState.value ? (
            fetchState.value.SavedSearch.map((savedSearch) => {
              return (
                <li
                  key={savedSearch.id}
                  className="flex w-full flex-col rounded-xl border border-slate-200 p-5"
                >
                  <div>
                    <p className="text-base font-semibold">
                      {savedSearch.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {[
                        ...savedSearch.FacetFilters.map((filter) =>
                          getFacetValueLabel(filter.facetName, filter.label),
                        ),
                        ...savedSearch.NumericFilters.map(
                          (filter) => `${filter.operator} ${filter.value}`,
                        ),
                      ]
                        .map(String)
                        .map(capitalize)
                        .join('・')}
                    </p>
                  </div>
                  {savedSearch.resultsUrl && (
                    <Button
                      className="mt-2"
                      size="small"
                      intent="secondary"
                      href={savedSearch.resultsUrl}
                    >
                      {dict.savedSearches.link}
                    </Button>
                  )}
                  <div className="mt-2 flex gap-1">
                    <Button
                      className="flex-grow"
                      size="small"
                      intent="tertiary"
                      onClick={() => doRemoveSavedSearch(savedSearch.id)}
                    >
                      {dict.savedSearches.deleteButton}
                    </Button>
                    <SearchAlertToggleButton
                      searchId={savedSearch.id}
                      isSearchAlertInitiallyActive={
                        savedSearch?.SearchAlert?.isActive ?? false
                      }
                    />
                  </div>
                </li>
              );
            })
          ) : (
            <></>
          )}
        </ul>
      </div>
    </PageContainer>
  );
};

export default SavedSearches;
