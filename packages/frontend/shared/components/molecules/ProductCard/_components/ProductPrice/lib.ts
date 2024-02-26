import { Discount } from '@/types';

export const calculateDiscountedPrice = (discount: Discount, price: number) =>
  !discount.value
    ? null
    : discount.valueType === 'fixed_amount'
      ? discount.value
      : discount.valueType === 'percentage'
        ? price * (discount.value / 100)
        : null;

export const calculateTotalDiscountedPrice = (
  discounts: Discount[],
  price: number,
) =>
  discounts.reduce(
    (total, discount) =>
      total - (calculateDiscountedPrice(discount, price) ?? 0),
    price,
  );
