import { Discount } from '@/types';
import dayjs from 'dayjs';

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
    title: 'RENOBYKE30',
    label: 'Renobyke',
    type: 'dynamic',
  },
  // Ends on 23/05
  {
    title: 'TUBIKE_FREE_SHIPPING',
    label: 'Livraison gratuite',
    type: 'static',
    collections: ['361eaea1-b5b0-4573-98d3-4a295a9666ca'],
    valueType: 'free_shipping',
    value: null,
    hideReduction: true,
    startsAt: dayjs('2024-05-16').toDate(),
    endsAt: dayjs('2024-05-23').toDate(),
  },
  {
    // Ends on 23/05
    title: 'TREK_30',
    label: 'Trek',
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
