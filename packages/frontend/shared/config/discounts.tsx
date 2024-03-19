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
    // Until 28/03
    title: 'CYCLESAV40',
    label: 'CyclesAveyron',
    type: 'dynamic',
  },
  {
    // Until 21/03
    title: 'TUBIKE40',
    label: 'Tubike',
    type: 'dynamic',
  },
  {
    // Until 21/03
    title: 'SPECIALIZED30',
    label: 'Vélos et VTT Specialized',
    type: 'dynamic',
  },
  {
    // Until 23/03
    title: 'GRAVEL20',
    label: 'Gravel',
    type: 'dynamic',
  },
];
