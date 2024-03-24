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
    title: 'AGPPRO',
    label: 'Vente privée',
    type: 'static',
    collections: ['dea8bd50-7334-4943-ba1c-4f4863bdefbc'],
    valueType: 'custom',
    description: "Vélo disponible jusqu'au 07/04",
    endsAt: dayjs('2024-04-07T20:00:00').toDate(),
    value: null,
    hideReduction: true,
  },
  {
    // tag to filter on: discount:BDAYS_SHIPPING
    title: 'BDAYS_SHIPPING',
    label: 'Livraison gratuite',
    type: 'static',
    collections: ['4a786b87-caed-4a53-bfed-16fae90f2521'],
    valueType: 'free_shipping',
    description: "Vélo disponible jusqu'au 18/03",
    startsAt: dayjs('2024-03-24T07:00:00').toDate(),
    endsAt: dayjs('2024-04-01T23:00:00').toDate(),
    value: null,
    hideReduction: true,
  },
  {
    // Until 01/04
    title: 'BDAYS5',
    label: 'Barooders Days',
    type: 'dynamic',
    groupKey: 'BDAYS',
  },
  {
    // Until 01/04
    title: 'BDAYS10',
    label: 'Barooders Days',
    type: 'dynamic',
    groupKey: 'BDAYS',
  },
  {
    // Until 01/04
    title: 'BDAYS15',
    label: 'Barooders Days',
    type: 'dynamic',
    groupKey: 'BDAYS',
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
