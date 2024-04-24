import config from '@/config/env';
import { SearchPreset } from 'shared-types';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { SEARCH_DOMAIN } from './e2e';

export const CLAIMS_KEY = 'https://hasura.io/jwt/claims';
export const SNOWFALL_OVERLAY_ANCHOR = 'snowfall-overlay';
export const MODAL_ROOT_ANCHOR = 'modal-root';
export const INNER_PAGE_BANNER_ANCHOR = 'inner-page-banner';

export const publicVariantsCollection = config.search.publicVariantsCollection;
export const b2bVariantsCollection = config.search.b2bVariantsCollection;

export const searchCollections = {
  products: {
    main: `${publicVariantsCollection}/sort/computed_scoring:desc`,
    priceAsc: `${publicVariantsCollection}/sort/price:asc`,
    priceDesc: `${publicVariantsCollection}/sort/price:desc`,
    discountDesc: `${publicVariantsCollection}/sort/discount:desc`,
    dateDesc: `${publicVariantsCollection}/sort/createdat_timestamp:desc`,
  },
  b2bProducts: {
    main: `${b2bVariantsCollection}/sort/createdat_timestamp:desc`,
  },
  collections: config.search.collectionsCollection,
  suggestions: config.search.publicVariantSuggestionsCollection,
};

export const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY ?? '',
    nodes: [
      {
        host: SEARCH_DOMAIN,
        port: 443,
        protocol: 'https',
        path: '',
      },
    ],
    cacheSearchResultsForSeconds: config.search.cacheSearchResultsForSeconds,
  },
  additionalSearchParameters: {
    highlight_fields: 'field_that_does_not_exist',
    highlight_full_fields: 'field_that_does_not_exist',
    typo_tokens_threshold: 2,
    min_len_1typo: 4,
    min_len_2typo: 12,
  },
  flattenGroupedHits: false,
  collectionSpecificSearchParameters: {
    [publicVariantsCollection]: {
      preset: SearchPreset.PUBLIC,
      group_by: 'product_internal_id',
      group_limit: 50,
    },
    [searchCollections.collections]: {
      query_by: 'title,handle',
    },
    [b2bVariantsCollection]: {
      preset: SearchPreset.B2B,
      group_by: 'product_internal_id',
      group_limit: 50,
    },
    [searchCollections.suggestions]: {
      query_by: 'q',
    },
  },
});

const searchWithoutTypesenseAdditionalData = async (params: unknown) => {
  // For more context: https://barooders.slack.com/archives/C03ERUBLF4N/p1705265444380629
  // This method overrides the default search method of the TypesenseInstantSearchAdapter
  // to remove the additional data that Typesense adds to the search response such as raw hits and highlights.

  // This is done to reduce the payload size of the page that is serialized by Next.js
  // For grouped_hits, we keep the first hit of the group as it contains the most relevant data.

  const { results } =
    await typesenseInstantsearchAdapter.searchClient.search(params);

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: results.map((result: any) => ({
      ...result,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hits: result.hits.map((hit: any) => ({
        ...hit,
        _grouped_hits: null,
        _highlightResult: null,
        _snippetResult: null,
        _rawTypesenseHit: null,
      })),
    })),
  };
};

export const searchClient = {
  ...typesenseInstantsearchAdapter.searchClient,
  search: searchWithoutTypesenseAdditionalData,
};

export const ANONYMOUS_INSIGHTS_TOKEN =
  'anonymous-token-could-not-be-generated';

export const enum ShipmentTimeframe {
  SAME_DAY = 'SAME_DAY',
  TWO_DAYS = 'TWO_DAYS',
  THREE_DAYS = 'THREE_DAYS',
  FOUR_DAYS = 'FOUR_DAYS',
  FIVE_DAYS = 'FIVE_DAYS',
  THREE_WEEKS = 'THREE_WEEKS',
}

export const COMMISSION_PRODUCT_TYPE = 'Commission';
