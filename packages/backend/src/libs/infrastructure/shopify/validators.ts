import { StoredVariant, Variant } from '@libs/domain/product.interface';
import { VariantToUpdate } from '@modules/pro-vendor/domain/ports/store-client';

export const getValidShopifyId = (id: string | number): number => {
  const idNumber = Number(id);
  if (isNaN(idNumber)) throw new Error(`Invalid shopify id: ${id}`);

  return idNumber;
};

export const getValidVariantToCreate = (
  variant: Variant,
): Omit<StoredVariant, 'id'> => {
  const { optionProperties, ...baseVariant } = variant;
  return {
    ...baseVariant,
    option1: optionProperties[0]?.value ?? null,
    option2: optionProperties[1]?.value ?? null,
    option3: optionProperties[2]?.value ?? null,
    compare_at_price: !Number(variant.compare_at_price)
      ? variant.price
      : variant.compare_at_price,
    inventory_management: 'shopify',
    inventory_policy: 'deny',
  };
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
