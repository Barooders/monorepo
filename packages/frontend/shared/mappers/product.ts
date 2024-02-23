import { Product, ProductAPI } from '@/types';

export const extractTagValue = (tags: string[], key: string) => {
  const matchingTags = tags.filter((tag) => tag.split(':')[0].trim() === key);
  if (matchingTags.length === 0)  return undefined;

  return matchingTags.map((tag) => tag.split(':')[1]).join('-');
}

export const fromAPI = (productApi: ProductAPI): Product => {
  const mainVariant = productApi.variants.nodes[0];

  return {
    availableForSale: productApi.availableForSale,
    featuredImage: {
      altText: productApi.featuredImage.altText,
      height: productApi.featuredImage.height,
      width: productApi.featuredImage.width,
      src: productApi.featuredImage.transformedSrc,
    },
    handle: productApi.handle,
    id: productApi.id,
    vendor: productApi.vendor,
    price: {
      amount: mainVariant.price.amount,
      currencyCode: mainVariant.price.currencyCode,
    },
    compareAtPrice: mainVariant.compareAtPrice
      ? {
          amount: mainVariant.compareAtPrice.amount,
          currencyCode: mainVariant.compareAtPrice.currencyCode,
        }
      : undefined,
    title: productApi.title,
    state: extractTagValue(productApi.tags, 'état'),
    brand: extractTagValue(productApi.tags, 'marque'),
    model: extractTagValue(productApi.tags, 'modele'),
    tags: productApi.tags,
    productType: productApi.productType,
  };
};
