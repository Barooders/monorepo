import { Discount } from '@/types';

export type DynamicDiscountConfig = {
  title: string;
  label: string;
  type: 'dynamic';
  groupKey?: string;
  hideReduction?: boolean;
};

export type StaticDiscountConfig = {
  type: 'static';
  groupKey?: string;
} & Discount;

export type DiscountConfig = DynamicDiscountConfig | StaticDiscountConfig;

export const DISCOUNTS_CONFIG: DiscountConfig[] = [
  {
    title: 'FREE_SHIPPING',
    label: 'Livraison gratuite',
    type: 'dynamic',
  },
  {
    // Ends on 14/05
    title: 'TSWHEELS5',
    label: 'TSWheels',
    type: 'dynamic',
  },
  {
    // Ends on 14/05
    title: 'SPECIALIZED30',
    label: 'Specialized',
    type: 'dynamic',
  },
];
