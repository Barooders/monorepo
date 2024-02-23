import { sendEvent, init as initMixpanel } from './mixpanel';
import { gtag } from './google';
import { trackEvent } from './klaviyo';
import { Url } from '@/types';

export const initAnalytics = () => {
  initMixpanel();
};

export const sendOpenNewConversation = (
  productId: string,
  customerId: string,
) => {
  gtag('event', 'newConversationOpened', { productId, customerId });
  sendEvent('newConversationOpened', { productId, customerId });
};

export const sendBeginCheckout = (productId: string) => {
  gtag('event', 'beginCheckout', { productId });
  sendEvent('beginCheckout', { productId });
};

export const sendClickProduct = (productId: string) => {
  gtag('event', 'clickProduct', { productId });
  sendEvent('clickProduct', { productId });
};

export const searchTriggered = (query: string, totalHits: number) => {
  if (query.length < 2) return;

  gtag('event', 'searchTriggered', { query, totalHits });
  sendEvent('searchTriggered', { query, totalHits });
};

export const sendAddToWishlist = (productId: string, customerId: string) => {
  gtag('event', 'addToWishlist', { productId, customerId });
  sendEvent('addToWishlist', { productId, customerId });
};

export const sendLogin = (customerId: string) => {
  gtag('event', 'userLogin', { customerId });
  sendEvent('userLogin', { customerId });
};

export const sendProductViewed = (product: {
  id: string;
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
    ProductID: product.id,
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
  productId: string,
  variantId?: string,
) => {
  gtag('event', 'sendPriceOffer', { customerId, variantId, productId });
  sendEvent('sendPriceOffer', { customerId, variantId, productId });
};
