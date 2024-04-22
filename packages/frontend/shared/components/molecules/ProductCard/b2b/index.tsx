'use client';

import { B2BProductCardProps } from '../types';
import MediumProductCard from './card';
import ProductPanel from './panel';

const ProductCard: React.FC<
  B2BProductCardProps & { intent: 'card' | 'panel' }
> = (props) => {
  if (props.intent === 'panel') return <ProductPanel {...props} />;
  if (props.intent === 'card') return <MediumProductCard {...props} />;
};

export default ProductCard;
