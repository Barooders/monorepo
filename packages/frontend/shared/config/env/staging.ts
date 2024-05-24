import { EnvType } from './types';

const developmentEnv: EnvType = {
  features: {
    medusaCheckout: true,
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
    bike: 'dc821cc9-e91c-4b7e-a805-4b720cef3600',
  },
  shouldProxyAlgolia: true,
  baseUrl: 'https://staging.barooders.com',
  medusa: {
    baseUrl: 'https://store-staging.barooders.com',
  },
  gtag: {
    id: 'AW-11250764440',
    conversionLabels: {
      beginCheckout: 'c6i_CKGDh7gYEJiV5PQp',
      submitPaymentInfo: '1yI-CLuOh7gYEJiV5PQp',
      finishCheckout: 'NuA-CPjg_bcYEJiV5PQp',
      newConversation: '',
      newPriceOffer: '',
      newSalesCall: '',
    },
  },
};

export default developmentEnv;
