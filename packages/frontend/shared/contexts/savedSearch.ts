import { createContext } from 'react';

export type SavedSearch = {
  query: string | null;
  FacetFilters: Array<{
    value: string;
    facetName: string;
  }>;
  NumericFilters: Array<{
    facetName: string;
    operator: string;
    value: string;
  }>;
};

export const SavedSearchContext = createContext<SavedSearch | undefined>(
  undefined,
);
