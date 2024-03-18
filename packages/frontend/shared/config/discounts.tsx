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
    title: 'AGPPRO',
    label: 'Vente privée',
    type: 'static',
    collections: ['dea8bd50-7334-4943-ba1c-4f4863bdefbc'],
    valueType: 'custom',
    description: "Vélo disponible jusqu'au 18/03",
    endsAt: dayjs('2024-03-18T20:00:00').toDate(),
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
  {
    title: 'GRAVEL20',
    label: 'Gravel',
    type: 'dynamic',
  },
];
