import { VariantToUpdate } from '@modules/pro-vendor/domain/ports/store-client';

export const getValidShopifyId = (id: string | number): number => {
  const idNumber = Number(id);
  if (isNaN(idNumber)) throw new Error(`Invalid shopify id: ${id}`);

  return idNumber;
};

export const getValidVariantToUpdate = (
  variant: VariantToUpdate,
): VariantToUpdate => {
  if (!variant.compare_at_price && !variant.price) return variant;

  return {
    ...variant,
    compare_at_price: !Number(variant.compare_at_price)
      ? variant.price
      : variant.compare_at_price,
  };
};
