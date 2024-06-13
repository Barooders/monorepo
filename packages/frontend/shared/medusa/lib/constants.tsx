import { CreditCard } from '@medusajs/icons';
import React from 'react';

import Bancontact from '@/medusa/modules/common/icons/bancontact';
import Ideal from '@/medusa/modules/common/icons/ideal';
import PayPal from '@/medusa/modules/common/icons/paypal';

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  stripe: {
    title: 'Carte de crédit',
    icon: <CreditCard />,
  },
  'stripe-ideal': {
    title: 'iDeal',
    icon: <Ideal />,
  },
  'stripe-bancontact': {
    title: 'Bancontact',
    icon: <Bancontact />,
  },
  paypal: {
    title: 'PayPal',
    icon: <PayPal />,
  },
  manual: {
    title: 'Virement bancaire',
    icon: <CreditCard />,
  },
  // Add more payment providers here
};

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  'krw',
  'jpy',
  'vnd',
  'clp',
  'pyg',
  'xaf',
  'xof',
  'bif',
  'djf',
  'gnf',
  'kmf',
  'mga',
  'rwf',
  'xpf',
  'htg',
  'vuv',
  'xag',
  'xdr',
  'xau',
];
