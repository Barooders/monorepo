'use client';

import { calculateDiscountedPrice } from '@/components/molecules/ProductCard/_components/ProductPrice/lib';
import { Discount } from '@/types';
import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';
import last from 'lodash/last';
import orderBy from 'lodash/orderBy';
import { createPersistedStore } from './createPersistedStore';

interface DiscountsState {
  discounts: Discount[];
  latestUpdate: number;
  isOutdated: () => boolean;
  getDiscountsByCollectionList: (
    collections: string[],
    isAdmin: boolean,
  ) => Discount[];
  getDiscountByPrice: (price: number, isAdmin: boolean) => Discount | null;
  setDiscounts: (discounts: Discount[]) => void;
}

const TEN_MIN = 1000 * 60 * 10;

export const isDiscountAvailable = (discount: Discount, isAdmin = false) => {
  const today = new Date();
  const hasStarted =
    isAdmin || !discount.startsAt || new Date(discount.startsAt) < today;
  const hasNotFinished = !discount.endsAt || new Date(discount.endsAt) > today;

  return hasStarted && hasNotFinished;
};

const useDiscounts = createPersistedStore<DiscountsState>(
  (set, get) => {
    return {
      discounts: [],
      latestUpdate: 0,
      isOutdated: () => Date.now() - get().latestUpdate > TEN_MIN,
      getDiscountByPrice: (price, isAdmin) => {
        return (
          get()
            .discounts.sort(
              (discountA, discountB) =>
                (calculateDiscountedPrice(discountB, price) ?? 0) -
                (calculateDiscountedPrice(discountA, price) ?? 0),
            )
            .find(
              (discount) =>
                isDiscountAvailable(discount, isAdmin) &&
                discount.collections.length === 0 &&
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                (!discount.minAmount || discount.minAmount < price),
            ) ?? null
        );
      },
      getDiscountsByCollectionList: (collections, isAdmin) => {
        const ungroupedDiscounts = get().discounts.filter(
          (discount) =>
            isDiscountAvailable(discount, isAdmin) &&
            discount.collections.some((collection) =>
              collections.includes(collection),
            ),
        );
        return (
          compact(
            Object.values(
              groupBy(
                orderBy(ungroupedDiscounts, 'value'),
                (discount) => discount.groupKey ?? discount.title,
              ),
            ).map((group) => last(group)),
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
