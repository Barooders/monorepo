'use client';

import Link from '@/components/atoms/Link';
import Modal from '@/components/atoms/Modal';
import { getDictionary } from '@/i18n/translate';
import { Url } from '@/types';
import { useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';

const dict = getDictionary('fr');

type PropsType = {
  price: number;
};

type SplitPaymentSolution = {
  durations: number[];
  name: string;
  logo: Url | null;
  firstPaymentFee(price: number, duration: number): number;
  monthlyPayment(price: number, duration: number): number | null;
  priceRange: [number, number];
  detailsComponent?: React.ReactNode;
};

type RatesType = {
  monthlyRate: number;
  priceMax?: number;
  duration?: number;
};

const ALMA_RATE = 0.0071;

const YOUNITED_RATES: RatesType[] = [
  {
    monthlyRate: 0.1499 / 12,
    priceMax: 1500,
  },
  {
    monthlyRate: 0.1147 / 12,
    priceMax: 3000,
  },
  {
    monthlyRate: 0.0664 / 12,
    priceMax: 6000,
  },
];

const FLOA_RATES: RatesType[] = [
  {
    monthlyRate: 0.0162,
    duration: 3,
    priceMax: 1500,
  },
  {
    monthlyRate: 0.0244,
    duration: 4,
    priceMax: 1500,
  },
  {
    monthlyRate: 0.0153,
    duration: 3,
    priceMax: 3000,
  },
  {
    monthlyRate: 0.0229,
    duration: 4,
    priceMax: 3000,
  },
  {
    monthlyRate: 0.0094,
    duration: 3,
    priceMax: 6000,
  },
  {
    monthlyRate: 0.0142,
    duration: 4,
    priceMax: 6000,
  },
  {
    monthlyRate: 0.035,
    duration: 10,
    priceMax: 3000,
  },
];

const splitPaymentSolutions: SplitPaymentSolution[] = [
  {
    durations: [4, 3, 2],
    name: 'alma',
    logo: '/alma-logo.png',
    firstPaymentFee(price: number, duration: number) {
      return (duration - 1) * ALMA_RATE * price;
    },
    monthlyPayment(price: number, duration: number) {
      return price / duration;
    },
    priceRange: [100, 2920],
  },
  {
    durations: [10],
    name: 'floa',
    logo: '/floa-logo.png',
    firstPaymentFee() {
      return 0;
    },
    monthlyPayment: (price: number, duration: number) => {
      const monthlyRate = FLOA_RATES.find(
        (rate) =>
          (!rate.priceMax || rate.priceMax > price) &&
          (!rate.duration || rate.duration === duration),
      )?.monthlyRate;

      return !monthlyRate ? null : (price * (1 + monthlyRate)) / duration;
    },
    priceRange: [200, 3000],
    detailsComponent: (
      <Modal
        ButtonComponent={({ openModal }) => (
          <Link
            onClick={openModal}
            className="text-xs text-slate-500"
          >
            <MdInfoOutline />
          </Link>
        )}
        ContentComponent={() => (
          <div className="flex flex-col gap-3">
            <p className="text-lg font-semibold">
              {
                dict.components.productCard.splitPayment.providers.floa
                  .conditionsTitle
              }
            </p>
            {dict.components.productCard.splitPayment.providers.floa.conditions()}
          </div>
        )}
      />
    ),
  },
  {
    durations: [4, 3],
    name: 'floa',
    logo: '/floa-logo.png',
    firstPaymentFee() {
      return 0;
    },
    monthlyPayment: (price: number, duration: number) => {
      const monthlyRate = FLOA_RATES.find(
        (rate) =>
          (!rate.priceMax || rate.priceMax > price) &&
          (!rate.duration || rate.duration === duration),
      )?.monthlyRate;

      return !monthlyRate ? null : (price * (1 + monthlyRate)) / duration;
    },
    priceRange: [3250, 5700],
  },
  {
    durations: [36, 24, 10],
    name: 'younited',
    logo: '/younited-logo.png',
    firstPaymentFee() {
      return 0;
    },
    monthlyPayment: (price: number, duration: number) => {
      const monthlyRate = YOUNITED_RATES.find(
        (rate) =>
          (!rate.priceMax || rate.priceMax > price) &&
          (!rate.duration || rate.duration === duration),
      )?.monthlyRate;
      return !monthlyRate
        ? null
        : (price * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
            (Math.pow(1 + monthlyRate, duration) - 1);
    },
    priceRange: [6000, 20_000],
  },
];

const SplittedPayments: React.FC<PropsType> = ({ price }) => {
  return (
    <div className="flex flex-col rounded-lg border border-slate-300 px-3">
      {splitPaymentSolutions
        .filter(
          (paymentSolution) =>
            price > paymentSolution.priceRange[0] &&
            price < paymentSolution.priceRange[1],
        )
        .map((paymentSolution, index) => (
          <PaymentSolution
            key={paymentSolution.name}
            paymentSolution={paymentSolution}
            price={price}
            isFirst={index === 0}
          />
        ))}
    </div>
  );
};

const PaymentSolution: React.FC<{
  paymentSolution: SplitPaymentSolution;
  price: number;
  isFirst: boolean;
}> = ({ paymentSolution, price, isFirst }) => {
  const [selectedDuration, setSelectedDuration] = useState(0);

  const duration = paymentSolution.durations[selectedDuration];
  const firstPaymentFee = paymentSolution.firstPaymentFee(price, duration);
  const recurringPayment = paymentSolution.monthlyPayment(price, duration);

  return !recurringPayment ? (
    <></>
  ) : (
    <div
      key={paymentSolution.name}
      className={`flex items-center gap-2 py-2 text-slate-900 ${isFirst ? '' : 'border-t border-slate-200'}`}
    >
      <img
        className="h-4"
        src={paymentSolution.logo ?? ''}
        alt={paymentSolution.name}
      />
      <div className="flex gap-1">
        {paymentSolution.durations.map((duration: number, index: number) => (
          <button
            key={duration}
            onClick={() => setSelectedDuration(index)}
            className={`rounded-full px-2 py-[3px] text-sm ${
              index === selectedDuration
                ? 'bg-black font-medium text-white'
                : 'bg-slate-200 font-light'
            }`}
          >{`${duration}x`}</button>
        ))}
      </div>
      <p className="text-sm">
        {firstPaymentFee > 0
          ? dict.components.productCard.splitPayment.withFirstTime({
              firstPayment: Math.ceil(recurringPayment + firstPaymentFee),
              duration,
              recurringPayment: Math.ceil(recurringPayment),
            })
          : dict.components.productCard.splitPayment.result({
              amount: Math.ceil(recurringPayment),
            })}
      </p>
      {paymentSolution.detailsComponent && paymentSolution.detailsComponent}
    </div>
  );
};

export default SplittedPayments;
