import { Url } from '@/types';
import {
  gtag,
  sendNewConversationConversion,
  sendNewPriceOfferConversion,
  sendNewSalesCallConversion,
} from './google';
import { trackEvent } from './klaviyo';
import {
  identifyToAnalytics,
  init as initMixpanel,
  sendEvent,
} from './mixpanel';

export const initAnalytics = () => {
  initMixpanel();
};

export const sendOpenNewConversation = (
  productShopifyId: number,
  customerId: string,
  productPrice: number,
) => {
  gtag('event', 'newConversationOpened', {
    productId: String(productShopifyId),
    customerId,
  });
  sendEvent('newConversationOpened', {
    productId: String(productShopifyId),
    customerId,
  });
  sendNewConversationConversion(productPrice);
};

export const sendBeginCheckout = (productShopifyId: string) => {
  gtag('event', 'beginCheckout', { productId: productShopifyId });
  sendEvent('beginCheckout', { productId: productShopifyId });
};

export const sendClickProduct = (productShopifyId: string) => {
  gtag('event', 'clickProduct', { productId: productShopifyId });
  sendEvent('clickProduct', { productId: productShopifyId });
};

export const searchTriggered = (query: string, totalHits: number) => {
  if (query.length < 2) return;

  gtag('event', 'searchTriggered', { query, totalHits });
  sendEvent('searchTriggered', { query, totalHits });
};

export const sendAddToWishlist = (
  productShopifyId: string,
  customerId: string,
) => {
  gtag('event', 'addToWishlist', { productId: productShopifyId, customerId });
  sendEvent('addToWishlist', { productId: productShopifyId, customerId });
};

export const sendLogin = (customerId: string) => {
  gtag('event', 'userLogin', { customerId });
  sendEvent('userLogin', { customerId });
  identifyToAnalytics(customerId);
};

export const sendProductViewed = (product: {
  shopifyId: string;
  productType: string;
  brand: string | null;
  price: number;
  compareAtPrice: number;
  imageUrl: Url | null;
  name: string;
  url: Url;
}) => {
  const item = {
    ProductName: product.name,
    ProductID: product.shopifyId,
    SKU: null,
    Categories: [product.productType],
    ImageURL: product.imageUrl,
    URL: product.url,
    Brand: product.brand,
    Price: product.price,
    CompareAtPrice: product.compareAtPrice,
  };
  trackEvent(['track', 'Viewed Product', item]);
};

export const sendCreateAccount = (displayName: string) => {
  gtag('event', 'createAccount', { displayName });
  sendEvent('createAccount', { displayName });
};

export const sendCreateAlert = (customerId: string, filters: string[]) => {
  gtag('event', 'createAlert', { customerId, filters });
  sendEvent('createAlert', { customerId, filters });
};

export const sendPriceOffer = (
  customerId: string,
  productShopifyId: string,
  productPrice: number,
  variantId?: string,
) => {
  gtag('event', 'sendPriceOffer', {
    customerId,
    variantId,
    productId: productShopifyId,
  });
  sendEvent('sendPriceOffer', {
    customerId,
    variantId,
    productId: productShopifyId,
  });
  sendNewPriceOfferConversion(productPrice);
};

export const sendNewSalesCall = (productPrice: number) => {
  sendNewSalesCallConversion(productPrice);
};
