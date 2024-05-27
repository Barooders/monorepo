import Shopify from 'shopify-api-node';

export const cleanShopifyVariant = (variant: Shopify.IProductVariant) => ({
  ...variant,
  option1: variant.option1 ?? undefined,
  option2: variant.option2 ?? undefined,
  option3: variant.option3 ?? undefined,
});
