'use client';

import { sendProductViewed } from '@/analytics';
import config from '@/config/env';
import useDiscounts from '@/hooks/state/useDiscounts';
import { useEffect, useState } from 'react';
import MediumProductCard from './card';
import FullProductCard from './full';
import ProductPage from './page';
import SmallProductCard from './small';
import { ProductMultiVariants, ProductSingleVariant } from './types';

const ProductCard: React.FC<ProductMultiVariants> = (props) => {
  const availableVariants = props.variants.filter(({ available }) => available);
  const getVariantToSelect = (variantId?: string) =>
    availableVariants.find(({ shopifyId: id }) => id === variantId) ??
    availableVariants[0] ??
    props.variants[0];
  const defaultVariant = getVariantToSelect(props.variantShopifyId);

  const [selectedVariantId, setSelectedVariant] = useState(
    defaultVariant.shopifyId,
  );
  const { getDiscountsByCollectionList, getDiscountByPrice } = useDiscounts();

  useEffect(() => {
    setSelectedVariant(getVariantToSelect(props.variantShopifyId).shopifyId);
  }, [props.variantShopifyId]);

  const { compareAtPrice, price } =
    props.variants.find((variant) => variant.shopifyId === selectedVariantId) ??
    defaultVariant;
  const productLink = new URL(`/products/${props.handle}`, config.baseUrl);
  if (selectedVariantId)
    productLink.searchParams.append('variant', selectedVariantId);

  const discounts = [...getDiscountsByCollectionList(props.collections)];
  const discountByPrice = getDiscountByPrice(price);
  if (discountByPrice) discounts.push(discountByPrice);

  const productSingleVariant: ProductSingleVariant = {
    ...props,
    variants: availableVariants,
    variantShopifyId: selectedVariantId,
    productLink: `${productLink.pathname}${productLink.search}`,
    price,
    compareAtPrice,
    setSelectedVariant,
    discounts,
  };

  useEffect(() => {
    if (props.intent && ['page', 'highlight'].includes(props.intent)) {
      sendProductViewed({
        id: props.shopifyId,
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
