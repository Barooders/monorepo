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
    // Ends on 02/05
    title: 'HBVELOS5',
    label: 'HBVélos',
    type: 'dynamic',
  },
  {
    // Ends on 08/05
    title: 'TSWHEELS5',
    label: 'TSWheels',
    type: 'dynamic',
  },
];
