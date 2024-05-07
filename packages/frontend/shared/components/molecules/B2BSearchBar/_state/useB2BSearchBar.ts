import { create } from 'zustand';

interface B2BSearchBarState {
  b2BSearchBar: string | undefined;
  setB2BSearchBar: (b2BSearchBar: string) => void;
}

const useB2BSearchBar = create<B2BSearchBarState>()((set) => {
  return {
    b2BSearchBar: undefined,
    setB2BSearchBar: (b2BSearchBar: string) => set({ b2BSearchBar }),
  };
});

export default useB2BSearchBar;
