import { Discount } from '@/types';

export const TAX_AMOUNT_PERCENT = 0.2;

export const addTaxes = (price: number) => price * (1 + TAX_AMOUNT_PERCENT);

export const calculateDiscountedPrice = (discount: Discount, price: number) =>
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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

export const calculateFinalPrice = (
  discounts: Discount[],
  price: number,
  commissionAmount: number = 0,
) => calculateTotalDiscountedPrice(discounts, price) + commissionAmount;
