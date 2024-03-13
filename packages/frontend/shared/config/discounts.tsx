import { Discount } from '@/types';
import dayjs from 'dayjs';

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
    title: 'RENOBYKE50',
    label: 'Renobyke',
    type: 'dynamic',
  },
  {
    title: 'KALKHOFF30',
    label: 'Kalkhoff',
    type: 'dynamic',
  },
  {
    title: 'AGPPRO',
    label: 'Vente privée',
    type: 'static',
    collections: ['8d541ff8-b3b0-4cba-bf76-8f1b3175205f'],
    valueType: 'custom',
    description: "Vélo disponible jusqu'au 11/03",
    endsAt: dayjs('2024-03-11').toDate(),
    value: null,
    hideReduction: true,
  },
  {
    title: 'TUBIKE40',
    label: 'Tubike',
    type: 'dynamic',
  },
  {
    title: 'SPECIALIZED30',
    label: 'Vélos et VTT Specialized',
    type: 'dynamic',
  },
];
