import { EnvType } from './types';

const productionEnv: EnvType = {
  features: {
    buyButton: false,
  },
  search: {
    publicVariantsCollection: 'backend_products',
    publicVariantSuggestionsCollection: 'backend_products_query_suggestions',
    b2bVariantsCollection: 'backend_b2b_products',
    collectionsCollection: 'backend_collections',
    cacheSearchResultsForSeconds: 2 * 60,
    maxValuesPerFacet: 9999,
  },
  collectionIds: {
    bike: '0021994f-255b-4b78-ac31-db95040f6d84',
  },
  shouldProxyAlgolia: true,
  baseUrl: 'https://barooders.com',
  medusa: {
    baseUrl: 'https://store.barooders.com',
  },
  gtag: {
    id: 'AW-10777839175',
    conversionLabels: {
      beginCheckout: '8Kr8CKOGrrcYEMeMo5Mo',
      submitPaymentInfo: 'FncsCLy6rLcYEMeMo5Mo',
      finishCheckout: 'blIdCI2PkvcCEMeMo5Mo',
      newConversation: 'zeOYCLjA2ZgZEMeMo5Mo',
      newPriceOffer: 'KJejCKrOjZwZEMeMo5Mo',
      newSalesCall: 'hxlkCJTlv6cZEMeMo5Mo',
    },
  },
};

export default productionEnv;
