import config from '@/config/env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gtag = (...args: any[]) => {
  if (!window.gtag) return;
  window.gtag(...args);
};

export const sendNewConversationConversion = () => {
  gtag('event', 'conversion', {
    send_to: `${config.gtag.id}/${config.gtag.conversionLabels.newConversation}`,
  });
};
