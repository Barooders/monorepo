import { shopifyApiByToken } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { StoreRepository } from '@modules/chat/domain/chat.service';

export class ShopifyRepository implements StoreRepository {
  async getProductInfo(productId: string) {
    const { handle, product_type, vendor, title } =
      await shopifyApiByToken.product.get(Number(productId));
    return { sellerName: vendor, handle, productType: product_type, title };
  }
}
