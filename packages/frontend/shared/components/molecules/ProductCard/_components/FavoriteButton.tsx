'use client';

import useUser from '@/hooks/state/useUser';
import useFavoriteProducts from '@/hooks/useFavoriteProducts';
import { getDictionary } from '@/i18n/translate';
import { MouseEventHandler } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

const dict = getDictionary('fr');

type PropsType = {
  productShopifyId: string;
  intent?: 'secondary' | 'tertiary' | 'square';
};

const FavoriteButton: React.FC<PropsType> = ({
  productShopifyId,
  intent = 'tertiary',
}) => {
  const { addFavoriteProducts, removeFavoriteProducts } = useFavoriteProducts();
  const { favoriteProducts } = useUser();
  const addFavorite: MouseEventHandler = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await addFavoriteProducts(productShopifyId);
  };

  const removeFavorite: MouseEventHandler = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await removeFavoriteProducts(productShopifyId);
  };

  const getButtonStyle = (intent: PropsType['intent']) => {
    if (intent === 'secondary') {
      return 'rounded-full bg-slate-200 p-2 text-slate-800';
    }

    if (intent === 'square') {
      return 'border rounded p-2 border-slate-300 hover:border-slate-800 text-slate-800 flex items-center justify-center';
    }

    return 'text-slate-400';
  };

  return (
    <div
      className={`flex cursor-pointer flex-col items-center text-lg ${getButtonStyle(intent)}`}
      title={dict.components.productCard.favoriteButtonTitle}
    >
      {favoriteProducts && favoriteProducts.includes(productShopifyId) ? (
        <BsHeartFill onClick={removeFavorite} />
      ) : (
        <BsHeart onClick={addFavorite} />
      )}
    </div>
  );
};

export default FavoriteButton;
