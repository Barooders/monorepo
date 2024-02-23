'use client';

import useUser from '@/hooks/state/useUser';
import useFavoriteProducts from '@/hooks/useFavoriteProducts';
import { getDictionary } from '@/i18n/translate';
import { MouseEventHandler } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

const dict = getDictionary('fr');

const FavoriteButton: React.FC<{
  productId: string;
  intent?: 'secondary' | 'tertiary';
}> = ({ productId, intent = 'tertiary' }) => {
  const { addFavoriteProducts, removeFavoriteProducts } = useFavoriteProducts();
  const { favoriteProducts } = useUser();
  const addFavorite: MouseEventHandler = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await addFavoriteProducts(productId);
  };

  const removeFavorite: MouseEventHandler = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await removeFavoriteProducts(productId);
  };

  return (
    <div
      className={`flex flex-col items-center text-lg ${
        intent === 'secondary'
          ? 'rounded-full bg-slate-200 p-2 text-slate-800'
          : 'text-slate-400'
      }`}
      title={dict.components.productCard.favoriteButtonTitle}
    >
      {favoriteProducts && favoriteProducts.includes(productId) ? (
        <BsHeartFill onClick={removeFavorite} />
      ) : (
        <BsHeart onClick={addFavorite} />
      )}
    </div>
  );
};

export default FavoriteButton;
