export abstract class SearchRepository {
  abstract getSavedSearchResults(
    query: string,
    facetFilters: { facetName: string; value: string }[],
    numericFilters: { facetName: string; value: string; operator: string }[],
    since: Date,
  ): Promise<{
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
  }>;
}
