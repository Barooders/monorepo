'use client';

import type {
  AutocompleteReshapeSource,
  AutocompleteState,
  BaseItem,
} from '@algolia/autocomplete-core';
import type { AutocompleteComponents, Render } from '@algolia/autocomplete-js';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import type { Hit, SearchResponse } from '@algolia/client-search';
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';

import { searchTriggered } from '@/analytics';
import Link from '@/components/atoms/Link';
import { searchClient, searchCollections } from '@/config';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import type { ReactNode } from 'react';
import { Fragment, createElement, useEffect, useMemo, useState } from 'react';
import {
  SearchCollectionDocument,
  SearchPublicVariantDocument,
} from 'shared-types';

type RenderItemType = (args: {
  item: BaseItem;
  components: AutocompleteComponents;
}) => ReactNode;

type TemplatesType = {
  default: {
    header: RenderItemType;
    footer: RenderItemType;
    item: RenderItemType;
    noResults: RenderItemType;
  };
  product: { item: RenderItemType };
  collection: { item: RenderItemType };
  vendor: { item: RenderItemType };
  suggestion: { item: RenderItemType };
};

type QuerySuggestionHit = {
  q: string;
  count: number;
};

type QuerySuggestionItem = QuerySuggestionHit;

type VendorItem = {
  username: string;
  isPro: boolean;
  bgPicture: string;
  picture: string;
  rating: number;
  priority: number;
  __autocomplete_indexName: string;
  objectID: string;
  objectIDs: string[];
} & SearchPublicVariantDocument;

type CollectionItem = SearchCollectionDocument & { priority: number };

const SearchBar = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const plugins = useMemo(() => {
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'RECENT_SEARCH',
      limit: 2,
      transformSource: ({ source }) => {
        return {
          ...source,
          getItemUrl: ({ item }) => `/search?q=${encodeURI(item.id)}`,
          templates: {
            ...source.templates,
            item: (params) => {
              const { item } = params;

              return (
                <Link
                  className="aa-ItemWrapper"
                  href={`/search?q=${encodeURI(item.id)}`}
                >
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  {source.templates.item(params).props.children}
                </Link>
              );
            },
          },
        };
      },
    });

    return [recentSearchesPlugin];
  }, []);

  const templates: TemplatesType = {
    default: {
      header: () => <></>,
      footer: () => <></>,
      item: () => <></>,
      noResults: () => <></>,
    },
    product: {
      item: ({ item, components }) => (
        <Link
          href={`/products/${item.handle}`}
          className="aa-item"
        >
          <div
            className="aa-item-picture"
            style={{
              backgroundImage: `url('${item.image}&width=96&height=96')`,
            }}
          ></div>
          <div className="aa-item-text">
            <p
              className="aa-item-title"
              title={`${item.title}`}
            >
              {components.Highlight({
                hit: item,
                attribute: 'title',
              })}
            </p>
            <p className="aa-item-info">
              <span>
                {components.Highlight({
                  hit: item,
                  attribute: 'product_type',
                })}
              </span>
              <span> by </span>
              <span>
                {components.Highlight({
                  hit: item,
                  attribute: 'vendor',
                })}
              </span>
            </p>
          </div>
        </Link>
      ),
    },
    collection: {
      item: ({ item, components }) => (
        <Link
          href={`/collections/${item.handle}`}
          className="aa-item"
        >
          <div className="aa-icon-container">
            <div className="aa-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path d="M45.91,21.76H28.53c-1.15,0-2.08-.94-2.08-2.1V2.11C26.45,.95,27.38,.01,28.53,.01h17.39c1.15,0,2.08,.94,2.08,2.1V19.66c0,1.15-.94,2.09-2.09,2.09Z" />
                <path d="M19.46,21.75H2.08c-1.15,0-2.08-.94-2.08-2.1V2.1C0,.94,.93,0,2.08,0H19.46c1.15,0,2.08,.94,2.08,2.1V19.65c0,1.16-.93,2.1-2.08,2.1Z" />
                <path d="M45.91,27c.73,0,1.34,.6,1.34,1.35v17.55c0,.74-.6,1.35-1.34,1.35H28.53c-.73,0-1.34-.6-1.34-1.35V28.35c0-.74,.6-1.35,1.34-1.35h17.38m0-.75H28.53c-1.15,0-2.08,.94-2.08,2.1v17.55c0,1.16,.93,2.1,2.08,2.1h17.39c1.15,0,2.08-.94,2.08-2.1V28.35c0-1.16-.94-2.1-2.09-2.1h0Z" />
                <path d="M19.46,47.99H2.08c-1.15,0-2.08-.94-2.08-2.1V28.34c0-1.16,.93-2.1,2.08-2.1H19.46c1.15,0,2.08,.94,2.08,2.1v17.55c0,1.16-.93,2.1-2.08,2.1Z" />
              </svg>
            </div>
          </div>
          <div className="aa-item-text">
            <span
              className="aa-item-title"
              title={`${item.title ?? item.unslugified_handle}`}
            >
              {components.Highlight({
                hit: item,
                attribute: item.title ? 'title' : 'unslugified_handle',
              })}
            </span>
          </div>
        </Link>
      ),
    },
    vendor: {
      item: ({ item, components }) => (
        <Link
          href={encodeURI(
            `/collections/vendors?refinementList[vendor][0]=${item.username}&q=${item.username}`,
          )}
          className="aa-item"
        >
          <div
            className="aa-item-picture"
            style={{
              backgroundImage: `url('${item.picture}&width=96&height=96')`,
            }}
          >
            {!!item.isPro && (
              <div className="badge-container pro">
                <div className="badge">
                  <span className="label"> P </span>
                </div>
              </div>
            )}
          </div>
          <div className="aa-item-text">
            <p
              className="aa-item-title"
              title={`${item.username}`}
            >
              {components.Highlight({
                hit: item,
                attribute: 'username',
              })}
            </p>
            <p className="aa-item-info">
              {item.isPro ? 'Voir la boutique officielle' : ' Voir sa boutique'}
            </p>
          </div>
        </Link>
      ),
    },
    suggestion: {
      item: ({ item, components }) => (
        <Link
          href={encodeURI(`/search?q=${item.q}`)}
          className="aa-item"
        >
          <div className="aa-icon-container">
            <div className="aa-icon">
              <svg viewBox="0 0 24 24">
                <path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path>
              </svg>
            </div>
          </div>
          <div className="aa-item-text">
            <p
              className="aa-item-title"
              title={`${item.q}`}
            >
              {components.Highlight({
                hit: item,
                attribute: 'q',
              })}
            </p>
          </div>
        </Link>
      ),
    },
  };
  /* eslint-enable */

  const COLLECTIONS_HIT = 6;
  const VENDORS_HIT = 2;

  const MINIMUM_SUGGESTION_HITS = 2;
  const MAXIMUM_SUGGESTION_HITS = 6;

  // The position of the items in this array is important and will
  // match the position that the sources will be displayed in the
  // autocomplete searchbox
  const sourcesConfig = [
    // Collections
    {
      id: searchCollections.collections,
      indexName: searchCollections.collections,
      hitsPerPage: Math.ceil(COLLECTIONS_HIT * 1.5),
      templates: {
        header: templates.default.header,
        footer: templates.default.footer,
        noResults: templates.default.noResults,
        item: templates.collection.item,
      },
      restrictSearchableAttributes: ['title', 'handle'],
      typoTolerance: false,
      getItemUrl: ({ item }: { item: CollectionItem }) =>
        `/collections/${item.handle}`,
      transformResponse: ({
        hits,
      }: {
        hits: Hit<SearchCollectionDocument>[][];
      }): CollectionItem[] => {
        let collections: CollectionItem[] = [];

        // Populate unique vendors array
        hits[0] &&
          hits[0].forEach((hit) => {
            const { handle } = hit;

            // Not very scalable, but will do the trick for now
            const HANDLE_TO_REMOVE_FROM_INDEX = [
              'all',
              'tous-les-produits',
              'best-selling-products',
              'newest-products',
            ];

            if (HANDLE_TO_REMOVE_FROM_INDEX.indexOf(handle) !== -1) return;

            const existingItemIndex = collections.findIndex(
              (collection) => collection.handle === handle,
            );

            if (existingItemIndex !== -1)
              collections[existingItemIndex].priority += 1;
            else {
              collections.push({
                ...hit,
                priority: 0,
              });
            }
          });

        // Sort by priority
        collections = collections.sort((a, b) => {
          if (a.priority > b.priority) return -1;

          if (a.priority < b.priority) return 1;

          return 0;
        });

        // Sort by products counts
        collections = collections.sort((a, b) => {
          if (a.product_count > b.product_count) return -1;

          if (a.product_count < b.product_count) return 1;

          return 0;
        });

        collections = collections.slice(0, COLLECTIONS_HIT);

        return collections;
      },
    },

    // Vendors
    // algolia.getAlgoliaFacets does not seem to work properly so we will
    // do the trick ourselves. We will look for an arbitrary number of hits.
    // We will retrieve their vendor attribute and put it in an array.
    // Then we will pick the max 2 firsts vendor and return them.
    {
      id: searchCollections.products.main,
      indexName: searchCollections.products.main,
      // These will not be the real hits number
      // They are only used for retrieving vendor attribute
      hitsPerPage: 10,
      templates: {
        header: templates.default.header,
        footer: templates.default.footer,
        noResults: templates.default.noResults,
        item: templates.vendor.item,
      },
      restrictSearchableAttributes: ['vendor'],
      typoTolerance: false,
      getItemUrl: ({ item }: { item: VendorItem }) =>
        encodeURI(
          `/collections/vendors?refinementList[vendor][0]=${item.username}&q=${item.username}`,
        ),
      transformResponse: ({
        results,
        hits,
      }: {
        results: SearchResponse<SearchPublicVariantDocument>;
        hits: Hit<SearchPublicVariantDocument>[][];
      }) => {
        let vendors: VendorItem[] = [];

        // Populate unique vendors array
        hits[0] &&
          hits[0].forEach((hit) => {
            if (!hit.vendor) return;

            const existingItemIndex = vendors.findIndex(
              (vendor) => vendor.username === hit.vendor,
            );

            if (existingItemIndex !== -1)
              vendors[existingItemIndex].priority += 1;
            else {
              const vendorProfile = JSON.parse(
                '{}', //TODO: index vendor info (vendor_profile is not set anymore)
              );

              vendors.push({
                username: hit.vendor,
                isPro: vendorProfile.isPro,
                bgPicture:
                  vendorProfile.bgPicture ||
                  'https://cdn.shopify.com/s/files/1/0576/4340/1365/files/incognito.png?v=1655313869',
                picture:
                  vendorProfile.picture ||
                  'https://cdn.shopify.com/s/files/1/0576/4340/1365/files/incognito.png?v=1655313869',
                rating: vendorProfile.rating || 0,
                // Count the number of time this vendor appears in
                // hits.
                priority: 0,

                // Emulated data for vendor pseudo-tracking
                // We need to do so because we do not retrieve
                // vendors from a vendor index
                // Hence we have no index to track from
                ...hit,
                __autocomplete_indexName: searchCollections.products.main,
                objectID: hit.vendor,
                objectIDs: [hit.vendor],
              });
            }
          });

        // Sort by priority and isPro = true
        vendors = vendors.sort((a, b) => {
          if (a.priority > b.priority) return -1;

          if (a.priority < b.priority) return 1;

          if (a.isPro && !b.isPro) return -1;

          if (!a.isPro && b.isPro) return 1;

          return 0;
        });

        // Prioritize exact match
        const { query } = results;
        vendors = vendors.sort((a, b) => {
          if (a.username === query) return -1;

          if (b.username === query) return 1;

          return 0;
        });

        vendors = vendors.slice(0, VENDORS_HIT);

        return vendors;
      },
    },

    // Suggestions
    {
      id: searchCollections.suggestions,
      indexName: searchCollections.suggestions,
      // These will not be the real hits number
      // They are only used for maximizing the chance to suggestions
      // hits with a nice amount of hits
      hitsPerPage: Math.ceil(MAXIMUM_SUGGESTION_HITS * 1.5),
      templates: {
        header: templates.default.header,
        footer: templates.default.footer,
        noResults: templates.default.noResults,
        item: templates.suggestion.item,
      },
      getItemUrl: ({ item }: { item: QuerySuggestionItem }) =>
        encodeURI(`/search?q=${item.q}`),
      // Sort suggestions by number of hits rather than popularity
      transformResponse: ({ hits }: { hits: Hit<QuerySuggestionHit>[][] }) => {
        let suggestions: QuerySuggestionItem[] = [];

        if (hits[0]) {
          suggestions = hits[0].sort((a, b) => {
            const aHits = a?.count || 0;
            const bHits = b?.count || 0;

            if (aHits > bHits) return -1;

            if (aHits < bHits) return 1;

            return 0;
          });
        }

        suggestions = suggestions.slice(0, MAXIMUM_SUGGESTION_HITS);

        return suggestions;
      },
    },
  ];

  /**
   * It gets algolia sources from the config defined above.
   * @param {} params.query - The user query.
   * @return {Sources} - It returns algolia sources.
   */
  const getSources = ({ query }: { query: string }) => {
    if (query?.length <= 2) return [];

    return debounced(
      sourcesConfig.map((source) => ({
        sourceId: source.id,
        getItems: ({ query }: { query: string }) =>
          getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: source.indexName,
                query,
                params: {
                  query,
                  hitsPerPage: source.hitsPerPage,
                  restrictSearchableAttributes:
                    source.restrictSearchableAttributes || [],
                  typoTolerance:
                    source.typoTolerance === false
                      ? source.typoTolerance
                      : true,
                  naturalLanguages: ['fr'],
                  removeWordsIfNoResults: 'none',
                  clickAnalytics: true,
                },
              },
            ],
            // TODO: Clean more types of this file
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            transformResponse: source.transformResponse,
          }),
        templates: source.templates,
        // Used for navigation with keyboard
        getItemUrl: source.getItemUrl,
      })),
    );
  };

  const reshape = ({
    sources,
    state,
  }: {
    sources: AutocompleteReshapeSource<BaseItem>[];
    state: AutocompleteState<BaseItem>;
  }): AutocompleteReshapeSource<BaseItem>[] => {
    let totalHits = 0;

    // Make sure that the query suggestions source is at the end of the
    // array so that our total hits computing does not fail
    sources = sources.sort((a, b) => {
      if (a.sourceId === searchCollections.suggestions) return 1;

      if (b.sourceId === searchCollections.suggestions) return -1;

      return 0;
    });

    const sourcesHits: AutocompleteReshapeSource<BaseItem>[][] = [];

    // Limit query suggestions number
    sources.map((source) => {
      let items = source.getItems();

      if (source.sourceId === searchCollections.suggestions) {
        const suggestionsHitsToDisplay = Math.max(
          MAXIMUM_SUGGESTION_HITS - totalHits,
          MINIMUM_SUGGESTION_HITS,
        );

        items = items.slice(0, suggestionsHitsToDisplay);

        // Put suggestion at the top of the list
        sourcesHits.unshift({
          ...source,
          // TODO: Clean more types of this file
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          getItems: () => items,
        });
      } else {
        totalHits += items.length;

        sourcesHits.push({
          ...source,
          // TODO: Clean more types of this file
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          getItems: () => items,
        });
      }
    });

    searchTriggered(state.query, totalHits);

    return sourcesHits.flat();
  };

  useEffect(() => {
    const autocompleteInstance = autocomplete({
      container: '.Algolia-Autocomplete-Form-Container',
      panelContainer: '.Algolia-Autocomplete-Panel-Container',
      placeholder: 'Rechercher un article',
      translations: {
        clearButtonTitle: 'Effacer',
        submitButtonTitle: 'Rechercher',
        // No text because we will append an icon in CSS
        detachedCancelButtonText: '',
      },
      detachedMediaQuery: 'none',
      openOnFocus: true,
      plugins,
      // TODO: Clean more types of this file
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getSources,
      reshape,
      onSubmit: (params) => {
        const { query } = params.state;

        window.location.href = `/search?q=${query}`;
      },
      renderer: { createElement, Fragment, render: render as Render },
    });

    setIsLoaded(true);

    return () => autocompleteInstance.destroy();
  }, [plugins]);

  // Detached mode toggle buton on mobile
  function debouncePromise(fn: (...args: unknown[]) => unknown, time: number) {
    let timerId: NodeJS.Timeout | undefined = undefined;

    return function debounced(...args: unknown[]) {
      if (timerId) {
        clearTimeout(timerId);
      }

      return new Promise((resolve) => {
        timerId = setTimeout(() => resolve(fn(...args)), time);
      });
    };
  }

  const debounced = debouncePromise(
    (items: unknown) => Promise.resolve(items),
    500,
  );

  return (
    <div className="Algolia-Autocomplete-Wrapper">
      <div className="Algolia-Autocomplete-Form-Container relative">
        {!isLoaded && (
          <div
            className="aa-Autocomplete right-0 top-0 w-full"
            aria-expanded="false"
            aria-haspopup="listbox"
            aria-labelledby="autocomplete-0-label"
          >
            <form
              className="aa-Form"
              action=""
              role="search"
            >
              <div className="aa-InputWrapperPrefix">
                <label
                  className="aa-Label"
                  htmlFor="autocomplete-0-input"
                  id="autocomplete-0-label"
                >
                  <button
                    className="aa-SubmitButton"
                    type="submit"
                    title="Rechercher"
                  >
                    <svg
                      className="aa-SubmitIcon"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                    >
                      <path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path>
                    </svg>
                  </button>
                </label>
              </div>
              <div className="aa-InputWrapper">
                <input
                  className="aa-Input"
                  aria-autocomplete="both"
                  aria-labelledby="autocomplete-0-label"
                  id="autocomplete-0-input"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  enterKeyHint="go"
                  spellCheck="false"
                  placeholder="Rechercher un article"
                  maxLength={512}
                  type="search"
                />
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="Algolia-Autocomplete-Panel-Container" />
      <div className="Algolia-Autocomplete-Overlay" />
    </div>
  );
};

export default SearchBar;
