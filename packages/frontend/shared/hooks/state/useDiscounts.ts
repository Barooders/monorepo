'use client';

import { calculateDiscountedPrice } from '@/components/molecules/ProductCard/_components/ProductPrice/lib';
import { Discount } from '@/types';
import { createPersistedStore } from './createPersistedStore';

interface DiscountsState {
  discounts: Discount[];
  latestUpdate: number;
  isOutdated: () => boolean;
  getDiscountsByCollectionList: (collections: string[]) => Discount[];
  getDiscountByPrice: (price: number) => Discount | null;
  setDiscounts: (discounts: Discount[]) => void;
}

const TEN_MIN = 1000 * 60 * 10;

export const isDiscountAvailable = (discount: Discount) => {
  const today = new Date();
  const hasStarted = !discount.startsAt || new Date(discount.startsAt) < today;
  const hasNotFinished = !discount.endsAt || new Date(discount.endsAt) > today;

  return hasStarted && hasNotFinished;
};

const useDiscounts = createPersistedStore<DiscountsState>(
  (set, get) => {
    return {
      discounts: [],
      latestUpdate: 0,
      isOutdated: () => Date.now() - get().latestUpdate > TEN_MIN,
      getDiscountByPrice: (price) => {
        return (
          get()
            .discounts.sort(
              (discountA, discountB) =>
                (calculateDiscountedPrice(discountB, price) ?? 0) -
                (calculateDiscountedPrice(discountA, price) ?? 0),
            )
            .find(
              (discount) =>
                isDiscountAvailable(discount) &&
                discount.collections.length === 0 &&
                (!discount.minAmount || discount.minAmount < price),
            ) ?? null
        );
      },
      getDiscountsByCollectionList: (collections) => {
        return (
          get().discounts.filter(
            (discount) =>
              isDiscountAvailable(discount) &&
              discount.collections.some((collection) =>
                collections.includes(collection),
              ),
          ) ?? []
        );
      },
      setDiscounts: (discounts) => {
        set({ discounts, latestUpdate: Date.now() });
      },
    };
  },
  {
    name: 'discountState',
  },
);

export default useDiscounts;
