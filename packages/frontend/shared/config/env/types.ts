export type EnvType = {
  search: {
    publicVariantsCollection: string;
    publicVariantSuggestionsCollection: string;
    b2bVariantsCollection: string;
    collectionsCollection: string;
    cacheSearchResultsForSeconds: number;
    maxValuesPerFacet: number;
  };
  collectionIds: {
    bike: string;
  };
  shouldProxyAlgolia: true;
  medusa: {
    baseUrl: string;
  };
  baseUrl: string;
  gtag: {
    id: string;
    conversionLabels: {
      beginCheckout: string;
      submitPaymentInfo: string;
      finishCheckout: string;
      newConversation: string;
      newPriceOffer: string;
      newSalesCall: string;
    };
  };
};
