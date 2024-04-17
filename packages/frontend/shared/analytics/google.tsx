import config from '@/config/env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gtag = (...args: any[]) => {
  if (!window.gtag) return;
  window.gtag(...args);
};

const sendConversion = (value: number, id: string) => {
  gtag('event', 'conversion', {
    send_to: `${config.gtag.id}/${id}`,
    value: value,
    currency: 'EUR',
  });
};

export const sendNewConversationConversion = (productPrice: number) => {
  sendConversion(productPrice, config.gtag.conversionLabels.newConversation);
};

export const sendNewPriceOfferConversion = (productPrice: number) => {
  sendConversion(productPrice, config.gtag.conversionLabels.newPriceOffer);
};

export const sendNewSalesCallConversion = (productPrice: number) => {
  sendConversion(productPrice, config.gtag.conversionLabels.newSalesCall);
};
