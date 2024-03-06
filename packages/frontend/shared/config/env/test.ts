const testEnv = {
  search: {
    mainSearchIndexPrefix: 'staging_backend',
    cacheSearchResultsForSeconds: 0,
    maxValuesPerFacet: 9999,
  },
  collectionIds: {
    bike: '1',
  },
  shouldProxyAlgolia: true,
  baseUrl: '',
  gtag: {
    id: '',
    conversionLabels: {
      beginCheckout: '',
      submitPaymentInfo: '',
      finishCheckout: '',
      newConversation: '',
    },
  },
};

export default testEnv;
