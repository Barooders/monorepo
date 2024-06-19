import { EnvType } from './types';

const testEnv: EnvType = {
  features: {
    buyButton: true,
  },
  search: {
    publicVariantsCollection: 'staging_backend_products',
    publicVariantSuggestionsCollection:
      'staging_backend_products_query_suggestions',
    b2bVariantsCollection: 'staging_backend_b2b_products',
    collectionsCollection: 'staging_backend_collections',
    cacheSearchResultsForSeconds: 0,
    maxValuesPerFacet: 9999,
  },
  collectionIds: {
    bike: '1',
  },
  shouldProxyAlgolia: true,
  medusa: {
    baseUrl: '',
  },
  baseUrl: '',
  gtag: {
    id: '',
    conversionLabels: {
      beginCheckout: '',
      submitPaymentInfo: '',
      finishCheckout: '',
      newConversation: '',
      newPriceOffer: '',
      newSalesCall: '',
    },
  },
};

export default testEnv;
