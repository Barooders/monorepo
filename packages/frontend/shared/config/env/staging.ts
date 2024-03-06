const developmentEnv = {
  search: {
    mainSearchIndexPrefix: 'staging_backend',
    cacheSearchResultsForSeconds: 0,
    maxValuesPerFacet: 9999,
  },
  collectionIds: {
    bike: 'dc821cc9-e91c-4b7e-a805-4b720cef3600',
  },
  shouldProxyAlgolia: true,
  baseUrl: 'https://staging.barooders.com',
  gtag: {
    id: 'AW-11250764440',
    conversionLabels: {
      beginCheckout: 'c6i_CKGDh7gYEJiV5PQp',
      submitPaymentInfo: '1yI-CLuOh7gYEJiV5PQp',
      finishCheckout: 'NuA-CPjg_bcYEJiV5PQp',
      newConversation: '',
    },
  },
};

export default developmentEnv;
