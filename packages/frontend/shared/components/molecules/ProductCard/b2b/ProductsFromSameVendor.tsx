'use client';

import HorizontalScroller from '@/components/atoms/HorizontalScroller';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { fetchB2BProductsFromSameVendor } from '@/mappers/search';
import { ErrorBoundary } from '@sentry/nextjs';
import { useEffect } from 'react';
import B2BProductCard from './card';

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

  return (
    <>
      <h3 className="mt-2 text-2xl font-semibold">
        {dict.b2b.productCard.details.productsFromSameVendor}
      </h3>
      <HorizontalScroller
        isLoading={fetchState.loading}
        className="min-h-[160px]"
      >
        {!fetchState.value ? (
          <></>
        ) : (
          fetchState.value.map((productCardProps) => (
            <ErrorBoundary
              key={productCardProps.shopifyId}
              showDialog={false}
            >
              <B2BProductCard
                {...productCardProps}
                openDetails={openDetails}
                intent="small-card"
              />
            </ErrorBoundary>
          ))
        )}
      </HorizontalScroller>
    </>
  );
};

export default B2BProductsFromSameVendor;
