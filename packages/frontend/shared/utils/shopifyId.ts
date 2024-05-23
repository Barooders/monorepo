type ShopifyEntity = 'Collection' | 'Product' | 'ProductVariant';

export const fromStorefrontId = (
  storefrontId: string,
  type: ShopifyEntity,
): string => storefrontId.replace(`gid://shopify/${type}/`, '');

export const toStorefrontId = (
  id: string | number,
  type: ShopifyEntity,
): string => `gid://shopify/${type}/${id}`;
