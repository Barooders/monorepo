import { Metafield } from '@libs/domain/product.interface';
import { BAROODERS_NAMESPACE, MetafieldType } from '@libs/domain/types';

export const getHandDeliveryMetafields = (
  handDelivery: boolean,
  handDeliveryPostalCode?: string,
): Metafield[] => {
  if (!handDelivery) return [];
  if (!handDeliveryPostalCode)
    throw new Error(
      'Cannot create product with handDelivery without handDeliveryPostalCode',
    );

  return [
    {
      key: 'hand_delivery',
      value: 'true',
      type: MetafieldType.BOOLEAN,
      namespace: BAROODERS_NAMESPACE,
    },
    {
      key: 'hand_delivery_postal_code',
      value: handDeliveryPostalCode,
      type: MetafieldType.SINGLE_LINE_TEXT_FIELD,
      namespace: BAROODERS_NAMESPACE,
    },
  ];
};
