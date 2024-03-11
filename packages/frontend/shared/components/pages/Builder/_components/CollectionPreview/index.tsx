'use client';

import HorizontalScroller from '@/components/atoms/HorizontalScroller';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { fetchProductsInSearchFromCollectionHandle } from '@/mappers/fromSearchToProductCard';
import compact from 'lodash/compact';
import { useEffect } from 'react';
import ProductCard from '../../../../molecules/ProductCard';
import { ProductMultiVariants } from '../../../../molecules/ProductCard/types';

const dict = getDictionary('fr');

type PropsType = {
  collectionHandle: string;
};

const CollectionPreview: React.FC<PropsType> = ({ collectionHandle }) => {
  const [fetchState, fetchProducts] = useWrappedAsyncFn<
    (collectionHandle: string) => Promise<ProductMultiVariants[]>
  >(fetchProductsInSearchFromCollectionHandle);

  useEffect(() => {
    fetchProducts(collectionHandle);
  }, [collectionHandle, fetchProducts]);

  return (
    <HorizontalScroller
      isLoading={fetchState.loading}
      className="min-h-[160px]"
    >
      {fetchState.error ? (
        <p className="text-red-700">{dict.global.errors.unknownError}</p>
      ) : (
        fetchState.value &&
        compact(fetchState.value).map((product) => (
          <ProductCard
            key={product.shopifyId}
            intent="small-card"
            {...product}
          />
        ))
      )}
    </HorizontalScroller>
  );
};

export default CollectionPreview;
