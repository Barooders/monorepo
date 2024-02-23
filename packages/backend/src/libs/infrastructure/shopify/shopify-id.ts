type ShopifyEntity = 'Collection' | 'Product' | 'ProductVariant' | 'Customer';

export const fromStorefrontId = (
  storefrontId: string,
  type: ShopifyEntity,
): string => storefrontId.replace(`gid://shopify/${type}/`, '');

export const toStorefrontId = (id: string, type: ShopifyEntity): string =>
  `gid://shopify/${type}/${id}`;
