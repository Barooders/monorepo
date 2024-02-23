// Only alpha numeric characters with hyphens preceeding .myshopify.com
// https://shopify.dev/apps/auth/oauth/getting-started#security-checks
export const SHOPIFY_SHOP_FORMAT_NO_PROTOCOL =
  /^[a-zA-Z0-9][a-zA-Z0-9-]*.myshopify.com/;

// Only alpha numeric characters, hyphens, underscores, plus, and equals
export const SHOPIFY_REQUEST_ID_FORMAT = /^([\w_+-=]*[a-zA-Z0-9_]*[\w_+-=])?$/;
