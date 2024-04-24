import { SavedSearchType } from '@libs/domain/prisma.main.client';

export type SearchResults = {
  nbHits: number;
  hits: {
    imageUrl: string;
    brand: string;
    handle: string;
    characteristics: string;
    price: string;
    compareAtPrice: string;
    discount: string;
  }[];
};

export abstract class SearchRepository {
  abstract getSavedSearchResults(
    type: SavedSearchType,
    query: string,
    facetFilters: { facetName: string; value: string }[],
    numericFilters: { facetName: string; value: string; operator: string }[],
    since: Date,
  ): Promise<SearchResults>;
}
