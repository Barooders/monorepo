import { Discount } from '@/types';

export type DynamicDiscountConfig = {
  title: string;
  label: string;
  type: 'dynamic';
  hideReduction?: boolean;
};

export type StaticDiscountConfig = {
  type: 'static';
} & Discount;

export type DiscountConfig = DynamicDiscountConfig | StaticDiscountConfig;

export const DISCOUNTS_CONFIG: DiscountConfig[] = [
  {
    title: 'FREE_SHIPPING',
    label: 'Livraison gratuite',
    type: 'dynamic',
  },
  {
    title: 'WHEELY100',
    label: 'Wheely',
    type: 'dynamic',
  },
  {
    title: 'TREK30',
    label: 'Trek',
    type: 'dynamic',
  },
];
