import { create } from 'zustand';

type CollectionState = {
  id: string;
  handle: string;
  name: string;
} | null;

interface SearchPageState {
  collection: CollectionState;
  query: string | null;
  setCollection: (collection: CollectionState) => void;
  setQuery: (query: string | null) => void;
}

const useSearchPage = create<SearchPageState>()((set) => {
  return {
    collection: null,
    query: null,
    setCollection: (collection: SearchPageState['collection']) => {
      set({ collection });
    },
    setQuery: (query: string | null) => {
      set({ query });
    },
  };
});

export default useSearchPage;
