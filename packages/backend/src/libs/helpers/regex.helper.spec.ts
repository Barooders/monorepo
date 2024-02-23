import { SHOPIFY_SHOP_FORMAT_NO_PROTOCOL } from '@libs/helpers/regex.helper';

describe('regex helper', () => {
  describe('SHOPIFY_SHOP_FORMAT_NO_PROTOCOL', () => {
    const BAROODERS_SHOPIFY_URL_NO_PROTOCOL = 'barooders.myshopify.com';
    const BAROODERS_SHOPIFY_URL = 'https://barooders.myshopify.com';

    it('should match `barooders.myshopify.com`', () => {
      expect(
        BAROODERS_SHOPIFY_URL_NO_PROTOCOL.match(
          SHOPIFY_SHOP_FORMAT_NO_PROTOCOL,
        ),
      ).not.toBeNull();
    });

    it('should not match `https://barooders.myshopify.com`', () => {
      expect(
        BAROODERS_SHOPIFY_URL.match(SHOPIFY_SHOP_FORMAT_NO_PROTOCOL),
      ).toBeNull();
    });
  });
});
