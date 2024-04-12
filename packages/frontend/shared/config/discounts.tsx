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
    title: 'RADRUNNER100',
    label: 'RadRunner',
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
    title: 'LOOK_CYCLE',
    label: 'Vente exclusive',
    type: 'static',
    collections: ['5fa8c764-7763-44ca-a493-89d1e29f69ef'],
    valueType: 'custom',
    startsAt: dayjs('2024-04-11T07:00:00').toDate(),
    endsAt: dayjs('2024-04-18T23:00:00').toDate(),
    value: null,
    hideReduction: true,
  },
];
