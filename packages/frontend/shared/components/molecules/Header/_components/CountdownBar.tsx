'use client';

import NoSSR from '@/components/atoms/NoSSR';
import { getDictionary } from '@/i18n/translate';
import { useState } from 'react';
import { useInterval } from 'react-use';

const CONTDOWN_DATE = new Date('2023/03/01 10:00').getTime();

const CountDownBar = () => {
  const dictionnary = getDictionary('fr');

  const prependWithZeroIfInferiorToTen = (number: number) => {
    return number < 10 ? `0${number}` : `${number}`;
  };

  const getCountdownString = () => {
    const now = new Date().getTime();
    const distance = CONTDOWN_DATE - now;

    if (distance <= 0) {
      return null;
    } else {
      const { days, hours, minutes, seconds } =
        parseCountdownDistance(distance);

      return generateCountdownString(days, hours, minutes, seconds);
    }
  };

  const parseCountdownDistance = (distance: number) => {
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  };

  const generateCountdownString = (
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
  ) => {
    const formattedDays = prependWithZeroIfInferiorToTen(days);
    const formattedHours = prependWithZeroIfInferiorToTen(hours);
    const formattedMinutes = prependWithZeroIfInferiorToTen(minutes);
    const formattedSeconds = prependWithZeroIfInferiorToTen(seconds);

    return `${formattedDays} jours ${formattedHours}h ${formattedMinutes}m et ${formattedSeconds}s`;
  };

  const [countdown, setCountdown] = useState<string | null>(
    getCountdownString(),
  );

  useInterval(() => setCountdown(getCountdownString()), 1000);

  return countdown ? (
    <div className="flex h-[30px] w-full items-center justify-center bg-[#20292e] px-10 text-sm text-white">
      <NoSSR>
        `${dictionnary.header.countdown} ${countdown}`
      </NoSSR>
    </div>
  ) : null;
};

export default CountDownBar;
