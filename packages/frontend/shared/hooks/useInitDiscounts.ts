import { fetchDiscountsByTitles } from '@/clients/discounts';
import { DISCOUNTS_CONFIG, StaticDiscountConfig } from '@/config/discounts';
import { useEffect } from 'react';
import useDiscounts from './state/useDiscounts';

const useInitDiscounts = () => {
  const { setDiscounts, isOutdated } = useDiscounts();

  useEffect(() => {
    (async () => {
      if (isOutdated()) {
        const dynamicDiscounts = await fetchDiscountsByTitles(
          DISCOUNTS_CONFIG.filter(({ type }) => type === 'dynamic').map(
            ({ title }) => title,
          ),
        );
        const staticDiscounts = DISCOUNTS_CONFIG.filter(
          ({ type }) => type === 'static',
        ) as StaticDiscountConfig[];

        setDiscounts([...dynamicDiscounts, ...staticDiscounts] ?? []);
      }
    })();
  }, [isOutdated, setDiscounts]);
};

export default useInitDiscounts;
