const productionEnv = {
  search: {
    mainSearchIndexPrefix: 'backend',
    cacheSearchResultsForSeconds: 2 * 60,
    maxValuesPerFacet: 9999,
  },
  collectionIds: {
    bike: '0021994f-255b-4b78-ac31-db95040f6d84',
  },
  shouldProxyAlgolia: true,
  baseUrl: 'https://barooders.com',
  gtag: {
    id: 'AW-10777839175',
    conversionLabels: {
      beginCheckout: '8Kr8CKOGrrcYEMeMo5Mo',
      submitPaymentInfo: 'FncsCLy6rLcYEMeMo5Mo',
      finishCheckout: 'blIdCI2PkvcCEMeMo5Mo',
      newConversation: 'zeOYCLjA2ZgZEMeMo5Mo',
      newPriceOffer: 'KJejCKrOjZwZEMeMo5Mo',
    },
  },
};

export default productionEnv;
