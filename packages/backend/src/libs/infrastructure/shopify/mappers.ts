import {
  mapProductStatus,
  ShopifyProductStatus,
  StoreProductWithoutCondition,
} from '@libs/domain/product.interface';
import Shopify from 'shopify-api-node';

export const cleanShopifyProduct = ({
  ...product
}: Shopify.IProduct): StoreProductWithoutCondition => ({
  ...product,
  template_suffix: product.template_suffix ?? undefined,
  published_at: product.published_at ?? undefined,
  published_scope: product.published_scope ?? undefined,
  tags: product.tags.split(', '),
  image: {
    src: product.image.src,
    shopifyId: product.image.id,
  },
  images: product.images.map((image) => ({
    src: image.src,
    shopifyId: image.id,
  })),
  variants: product.variants.map(cleanShopifyVariant),
  status: mapProductStatus(product.status as ShopifyProductStatus),
});

export const cleanShopifyVariant = (variant: Shopify.IProductVariant) => ({
  ...variant,
  option1: variant.option1 ?? undefined,
  option2: variant.option2 ?? undefined,
  option3: variant.option3 ?? undefined,
});
