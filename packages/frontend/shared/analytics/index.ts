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

export const sendOpenNewConversation = ({
  productMerchantItemId,
  customerId,
  productPrice,
}: {
  productMerchantItemId: string;
  customerId: string;
  productPrice: number;
}) => {
  gtag('event', 'newConversationOpened', {
    productId: productMerchantItemId,
    customerId,
  });
  sendEvent('newConversationOpened', {
    productId: productMerchantItemId,
    customerId,
  });
  sendNewConversationConversion(productPrice);
};

export const sendBeginCheckout = ({
  productMerchantItemId,
}: {
  productMerchantItemId: string;
}) => {
  const payload = { productId: productMerchantItemId };
  gtag('event', 'beginCheckout', payload);
  sendEvent('beginCheckout', payload);
};

export const sendClickProduct = ({
  productMerchantItemId,
}: {
  productMerchantItemId: string;
}) => {
  const payload = { productId: productMerchantItemId };
  gtag('event', 'clickProduct', payload);
  sendEvent('clickProduct', payload);
};

export const searchTriggered = (query: string, totalHits: number) => {
  if (query.length < 2) return;

  gtag('event', 'searchTriggered', { query, totalHits });
  sendEvent('searchTriggered', { query, totalHits });
};

export const sendAddToWishlist = ({
  productMerchantItemId,
  customerId,
}: {
  productMerchantItemId: string;
  customerId: string;
}) => {
  const payload = { productId: productMerchantItemId, customerId };
  gtag('event', 'addToWishlist', payload);
  sendEvent('addToWishlist', payload);
};

export const sendLogin = (customerId: string) => {
  gtag('event', 'userLogin', { customerId });
  sendEvent('userLogin', { customerId });
  identifyToAnalytics(customerId);
};

export const sendProductViewed = (product: {
  merchantItemId: string;
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
    ProductID: product.merchantItemId,
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

export const sendPriceOffer = ({
  productMerchantItemId,
  customerId,
  productPrice,
  variantId,
}: {
  productMerchantItemId: string;
  customerId: string;
  productPrice: number;
  variantId?: string;
}) => {
  const payload = {
    customerId,
    variantId,
    productId: productMerchantItemId,
  };
  gtag('event', 'sendPriceOffer', payload);
  sendEvent('sendPriceOffer', payload);
  sendNewPriceOfferConversion(productPrice);
};

export const sendNewSalesCall = (productPrice: number) => {
  sendNewSalesCallConversion(productPrice);
};
