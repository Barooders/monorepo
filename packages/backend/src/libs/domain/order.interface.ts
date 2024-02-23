import { ShippingSolution, ShippingType } from './prisma.main.client';

export const getOrderShippingSolution = async (
  isHandDeliveryOrder: boolean,
  hasBikesInOrder: boolean,
  vendorUsedShipping?: ShippingType,
): Promise<ShippingSolution> => {
  if (isHandDeliveryOrder) return ShippingSolution.HAND_DELIVERY;

  switch (vendorUsedShipping) {
    case ShippingType.vendor:
      return ShippingSolution.VENDOR;
    case ShippingType.barooders:
      if (hasBikesInOrder) return ShippingSolution.GEODIS;
    default:
      return ShippingSolution.SENDCLOUD;
  }
};
