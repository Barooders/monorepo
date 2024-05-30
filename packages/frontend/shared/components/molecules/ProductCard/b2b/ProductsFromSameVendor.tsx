'use client';

import HorizontalScroller from '@/components/atoms/HorizontalScroller';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { fetchB2BProductsFromSameVendor } from '@/mappers/search';
import { ErrorBoundary } from '@sentry/nextjs';
import { useEffect } from 'react';
import B2BProductSmallCard from './small';

const dict = getDictionary('fr');

type PropsType = {
  vendorId: string;
  productId: string;
  openDetails: (productInternalId: string) => void;
};

const B2BProductsFromSameVendor: React.FC<PropsType> = ({
  openDetails,
  vendorId,
  productId,
}) => {
  const [fetchState, fetchProductsFromSameVendor] = useWrappedAsyncFn(
    async (vendorId: string, productId: string) => {
      return fetchB2BProductsFromSameVendor(vendorId, productId);
    },
  );

  useEffect(() => {
    fetchProductsFromSameVendor(vendorId, productId);
  }, []);

  const productsFromSameVendor = fetchState.value;

  if (!productsFromSameVendor || productsFromSameVendor.length === 0)
    return <></>;

  return (
    <>
      <h3 className="mt-2 text-2xl font-semibold">
        {dict.b2b.productCard.details.productsFromSameVendor}
      </h3>
      <HorizontalScroller
        isLoading={fetchState.loading}
        className="min-h-[160px]"
      >
        {productsFromSameVendor.map((productCardProps) => (
          <ErrorBoundary
            key={productCardProps.id}
            showDialog={false}
          >
            <B2BProductSmallCard
              {...productCardProps}
              openDetails={openDetails}
            />
          </ErrorBoundary>
        ))}
      </HorizontalScroller>
    </>
  );
};

export default B2BProductsFromSameVendor;
