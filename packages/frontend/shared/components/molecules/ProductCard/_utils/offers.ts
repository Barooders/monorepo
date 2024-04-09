import { Condition } from '@/components/pages/SellingForm/types';
import {
  AvailableOffers,
  bikesCollectionIds,
  electricBikesCollectionIds,
  handicapedBikesCollectionIds,
} from '../config';

export const getAvailableOffers = (
  productCondition: Condition,
  breadcrumbs: { shopifyId: string }[],
) => {
  const availableOffers: AvailableOffers[] = [];
  if (productCondition !== Condition.AS_NEW) return availableOffers;

  const isElectricBike = breadcrumbs.some(({ shopifyId }) =>
    electricBikesCollectionIds.includes(shopifyId),
  );

  const isMuscleBike = breadcrumbs.some(({ shopifyId }) =>
    bikesCollectionIds.includes(shopifyId),
  );

  const isHandicapedBike = breadcrumbs.some(({ shopifyId }) =>
    handicapedBikesCollectionIds.includes(shopifyId),
  );

  if (isMuscleBike) {
    availableOffers.push(AvailableOffers.MUSCLES_BIKE_SUBVENTION);
  }

  if (isHandicapedBike) {
    availableOffers.push(AvailableOffers.HANDICAPED_BIKE_SUBVENTION);
  }

  if (isElectricBike)
    availableOffers.push(AvailableOffers.ELECTRIC_BIKE_SUBVENTION);

  return availableOffers;
};

export const getSubventionAmount = (availableOffers: AvailableOffers[]) => {
  if (availableOffers.includes(AvailableOffers.HANDICAPED_BIKE_SUBVENTION))
    return 600;
  if (availableOffers.includes(AvailableOffers.ELECTRIC_BIKE_SUBVENTION))
    return 500;
  if (availableOffers.includes(AvailableOffers.MUSCLES_BIKE_SUBVENTION))
    return 100;

  return null;
};
