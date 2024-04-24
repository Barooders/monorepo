import { createContext } from 'react';

export type SavedSearch = {
  id: string;
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
  SearchAlert: {
    isActive: boolean;
  } | null;
};

export const SavedSearchContext = createContext<SavedSearch | undefined>(
  undefined,
);
