'use client';

import { sendProductViewed } from '@/analytics';
import config from '@/config/env';
import useDiscounts from '@/hooks/state/useDiscounts';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { getVariantToSelect } from '../container';
import { ProductMultiVariants, ProductSingleVariant } from '../types';
import MediumProductCard from './card';
import FullProductCard from './full';
import ProductPage from './page';
import SmallProductCard from './small';

const ProductCard: React.FC<ProductMultiVariants> = (props) => {
  const availableVariants = props.variants.filter(({ available }) => available);
  const defaultVariant = getVariantToSelect(props.variants, props.variantId);

  const [selectedVariantInternalId, setSelectedVariant] = useState(
    defaultVariant.id,
  );
  const { getDiscountsByCollectionList, getDiscountByPrice } = useDiscounts();
  const { isAdmin } = useAuth();

  useEffect(() => {
    setSelectedVariant(getVariantToSelect(props.variants, props.variantId).id);
  }, [props.variantId]);

  const { compareAtPrice, price } =
    props.variants.find(
      (variant) => variant.id === selectedVariantInternalId,
    ) ?? defaultVariant;
  const productLink = new URL(`/products/${props.handle}`, config.baseUrl);

  productLink.searchParams.append('variant', selectedVariantInternalId);

  const discounts = [
    ...getDiscountsByCollectionList(props.collections, isAdmin()),
  ];
  const discountByPrice = getDiscountByPrice(price, isAdmin());
  if (discountByPrice) discounts.push(discountByPrice);

  const productSingleVariant: ProductSingleVariant = {
    ...props,
    variants: availableVariants,
    variantId: selectedVariantInternalId,
    productLink: `${productLink.pathname}${productLink.search}`,
    price,
    compareAtPrice,
    setSelectedVariant,
    discounts,
  };

  useEffect(() => {
    if (
      props.intent !== undefined &&
      ['page', 'highlight'].includes(props.intent)
    ) {
      sendProductViewed({
        merchantItemId: props.productMerchantItemId,
        productType: props.productType,
        brand: props.tags?.marque ?? null,
        compareAtPrice,
        price,
        imageUrl: props.images[0]?.src ?? null,
        url: productLink.toString(),
        name: props.title,
      });
    }
  });

  if (props.intent === 'highlight')
    return <FullProductCard {...productSingleVariant} />;
  if (props.intent === 'page') return <ProductPage {...productSingleVariant} />;
  if (props.intent === 'small-card')
    return <SmallProductCard {...productSingleVariant} />;
  return <MediumProductCard {...productSingleVariant} />;
};

export default ProductCard;
