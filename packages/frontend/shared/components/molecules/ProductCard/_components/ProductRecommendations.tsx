'use client';

import HorizontalScroller from '@/components/atoms/HorizontalScroller';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { fetchRecommendedProducts } from '@/mappers/fromSearchToProductCard';
import { ErrorBoundary } from '@sentry/nextjs';
import { useEffect } from 'react';
import ProductCard from '..';
import { ProductCardProps } from '@/components/pages/ProductPage';

const dict = getDictionary('fr');

type PropsType = {
  productCardProps: ProductCardProps;
};

const ProductRecommendations: React.FC<PropsType> = ({ productCardProps }) => {
  const [fetchState, fetchRecommendations] = useWrappedAsyncFn(
    async (productCardProps: ProductCardProps) => {
      return fetchRecommendedProducts(productCardProps);
    },
  );

  useEffect(() => {
    fetchRecommendations(productCardProps);
  }, [productCardProps, fetchRecommendations]);

  return (
    <>
      <h3 className="mb-5 text-2xl font-semibold">
        {dict.components.productCard.recommendations}
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
              <ProductCard
                {...productCardProps}
                intent="small-card"
              />
            </ErrorBoundary>
          ))
        )}
      </HorizontalScroller>
    </>
  );
};

export default ProductRecommendations;
