import { create } from 'zustand';

interface OpenedOffersState {
  openedPriceOfferProductIds: string[];
  setOpenedPriceOfferProductIds: (openedPriceOfferProductIds: string[]) => void;
  addOpenedPriceOfferProductId: (productId: string) => void;
  hasOpenedPriceOffer: (productId: string) => boolean;
}

const useOpenedOffersState = create<OpenedOffersState>()((set, get) => {
  return {
    openedPriceOfferProductIds: [],
    setOpenedPriceOfferProductIds: (openedPriceOfferProductIds: string[]) =>
      set({ openedPriceOfferProductIds }),
    addOpenedPriceOfferProductId: (productId: string) =>
      set((state) => ({
        openedPriceOfferProductIds: [
          ...state.openedPriceOfferProductIds,
          productId,
        ],
      })),
    hasOpenedPriceOffer: (productId: string) =>
      get().openedPriceOfferProductIds.includes(productId),
  };
});

export default useOpenedOffersState;
