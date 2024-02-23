'use client';

import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import { ProductCardWithContainer } from '@/components/molecules/ProductCard/connected';
import useUser from '@/hooks/state/useUser';
import useFavoriteProducts from '@/hooks/useFavoriteProducts';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import React, { useEffect } from 'react';

const dict = getDictionary('fr');

const Favorites: React.FC = () => {
  const { fetchFavoriteProducts } = useFavoriteProducts();
  const [{ loading }, doFetchFavoriteProducts] = useWrappedAsyncFn(
    fetchFavoriteProducts,
  );
  const { favoriteProducts } = useUser();

  useEffect(() => {
    doFetchFavoriteProducts();
  }, []);

  return (
    <PageContainer>
      <h1 className="text-center text-3xl">{dict.favorites.title}</h1>

      {loading ? (
        <Loader />
      ) : favoriteProducts.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3">
          {favoriteProducts.map((productId) => (
            <React.Fragment key={productId}>
              <ProductCardWithContainer productId={productId} />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="mt-3 text-justify text-gray-500">
          {dict.favorites.emptyList()}
        </div>
      )}
    </PageContainer>
  );
};

export default Favorites;
