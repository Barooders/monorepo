import { create } from 'zustand';

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

interface B2BSearchContext {
  b2BSearchBar: string | undefined;
  savedSearch: SavedSearch | undefined;
  setB2BSearchBar: (b2BSearchBar: string) => void;
  setSavedSearch: (savedSearch: SavedSearch) => void;
}

const useB2BSearchContext = create<B2BSearchContext>()((set) => {
  return {
    b2BSearchBar: undefined,
    setB2BSearchBar: (b2BSearchBar: string) => set({ b2BSearchBar }),
    savedSearch: undefined,
    setSavedSearch: (savedSearch: SavedSearch) => set({ savedSearch }),
  };
});

export default useB2BSearchContext;
