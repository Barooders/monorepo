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
    title: 'WEEK_VENDOR',
    label: 'cette semaine',
    type: 'dynamic',
  },
  {
    title: 'CUBE30',
    label: 'Cube',
    type: 'dynamic',
  },
  {
    title: 'FREE_SHIPPING',
    label: 'Livraison gratuite',
    type: 'dynamic',
  },
  {
    title: 'TNC10',
    label: 'TNC',
    type: 'dynamic',
  },
];
