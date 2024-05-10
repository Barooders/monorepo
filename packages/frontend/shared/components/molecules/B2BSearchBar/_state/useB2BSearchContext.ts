import { create } from 'zustand';

interface B2BSearchContext {
  b2BSearchBar: string | undefined;
  setB2BSearchBar: (b2BSearchBar: string) => void;
}

const useB2BSearchContext = create<B2BSearchContext>()((set) => {
  return {
    b2BSearchBar: undefined,
    setB2BSearchBar: (b2BSearchBar: string) => set({ b2BSearchBar }),
  };
});

export default useB2BSearchContext;
