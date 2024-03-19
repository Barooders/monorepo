import config from '@/config/env';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { SEARCH_DOMAIN } from './e2e';

export const CLAIMS_KEY = 'https://hasura.io/jwt/claims';
export enum HASURA_ROLES {
  ADMIN = 'admin',
  REGISTERED_USER = 'registered_user',
  REGISTERED_USER_SPECIFIC = 'registered_user_specific',
  PUBLIC = 'public',
  ME_AS_CUSTOMER = 'me_as_customer',
  ME_AS_VENDOR = 'me_as_vendor',
}
export const SNOWFALL_OVERLAY_ANCHOR = 'snowfall-overlay';
export const MODAL_ROOT_ANCHOR = 'modal-root';
export const INNER_PAGE_BANNER_ANCHOR = 'inner-page-banner';

export const publicVariantsCollection = `${config.search.mainSearchIndexPrefix}_products`;

export const searchIndexes = {
  products: {
    main: `${publicVariantsCollection}/sort/computed_scoring:desc`,
    priceAsc: `${publicVariantsCollection}/sort/price:asc`,
    priceDesc: `${publicVariantsCollection}/sort/price:desc`,
    discountDesc: `${publicVariantsCollection}/sort/discount:desc`,
    dateDesc: `${publicVariantsCollection}/sort/createdat_timestamp:desc`,
  },
  collections: `${config.search.mainSearchIndexPrefix}_collections`,
  suggestions: `${publicVariantsCollection}_query_suggestions`,
};

export const SEARCHABLE_PRODUCT_ATTRIBUTES_PRESET =
  'searchable_product_attributes';

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
      preset: SEARCHABLE_PRODUCT_ATTRIBUTES_PRESET,
      group_by: 'product_internal_id',
      group_limit: 50,
    },
    [searchIndexes.collections]: {
      query_by: 'title,handle',
    },
    [searchIndexes.suggestions]: {
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
