/**
 * Application routes with its version
 * https://github.com/Sairyss/backend-best-practices#api-versioning
 */

// Api Versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,
  internal: {
    heartbeat: '/__internal__/heartbeat',
  },
  auth: {
    shopifyLogin: '/auth/shopify',
  },
  buy: {
    payment: {
      getOrCreateCheckout: 'buy/payment/checkout',
      eligibility: '/buy/payment/eligibility',
      createPaymentLink: '/buy/payment/link',
      redirectToPaymentPage: '/buy/payment/link/redirect',
      notifyPaymentResult: '/buy/payment/notify',
    },
  },
  chat: {
    conversation: '/chat/conversation',
    messageWebhook: '/chat/message/webhook',
  },
  customer: {
    root: '/customers',
    delete: '/customers/delete',
    signupHasuraEvent: '/customers/webhook/signup',
    wallet: '/customers/wallet',
    vendorData: '/customers/vendor-data',
    request: '/customers/requests',
  },
  negociationAgreement: {
    root: '/negociation-agreement',
  },
  priceOffer: {
    root: '/price-offer',
    b2b: '/price-offer/b2b',
    priceOffer: 'price-offer/:priceOfferId',
    priceOfferByAdmin: '/admin/price-offer/:priceOfferId',
  },
  savedSearch: {
    root: '/saved-search',
    one: '/saved-search/:savedSearchId',
  },
  order: {
    root: '/orders',
    onCreatedEvent: '/orders/webhook/created-event',
    onPaidEvent: '/orders/webhook/paid-event',
    onPaidEventAsAdmin: '/admin/orders/webhook/paid-event',
    getOrder: '/orders/:orderId',
    getOrCreateShippingLabel: '/orders/:orderId/shipping-label',
    fulFillAsAdmin: '/admin/fulfillment-orders/:fulfillmentOrderId/fulfill',
    fulfill: '/fulfillment-orders/:fulfillmentOrderId/fulfill',
    updateOnOrderStatusEvent: '/orders/webhook/update',
    cancelOrderAsAdmin: '/admin/orders/:orderId/cancel',
    cancelOrderLine: '/order-lines/:orderLineId/cancel',
    updateOrderStatusAsAdmin: '/admin/orders/:orderId/update-status',
  },
  product: {
    createDraftProduct: '/products/create',
    createProductByAdmin: '/admin/products/create',
    getProduct: '/products/:productInternalId',
    addProductImage: '/products/:productInternalId/image',
    deleteProductImage: '/products/:productInternalId/image/:imageId',
    getProductByHandle: '/products/by-handle/:productHandle',
    updateProduct: '/products/:productInternalId',
    updateProductVariant:
      '/products/:productInternalId/variants/:productVariantInternalId',
    updateProductByAdmin: '/admin/products/:productInternalId',
    triggerVendorProductsUpdateByAdmin: '/admin/vendors/:vendorId/products',
    updateProductVariantByAdmin:
      '/admin/products/:productInternalId/variants/:productVariantInternalId',
    moderateProductByAdmin: '/admin/products/:productInternalId/moderate',
    productCreatedEvent: '/products/webhook/created-event',
    productUpdatedEvent: '/products/webhook/updated-event',
    productDeletedEvent: '/products/webhook/deleted-event',
    testProductIndexation: '/products/index',
    createCommission: '/commission/create',
    computeLineItemCommission: '/commission/compute-line-item',
    computeProductCommission: '/commission/product',
    getB2BCommission: '/commission/b2b',
    createProductModel: '/products/models',
    importImages: '/products/images/import',
  },
  invoice: {
    previewPayout: '/invoice/preview-payout',
    previewCommission: '/invoice/preview-commission',
    executePayout: '/invoice/payout',
  },
  deliveryProfile: {
    variant: '/delivery-profile/product-variant/:variantShopifyId',
  },
  shopify: {
    auth: '/shopify/auth',
    authCallback: '/shopify/auth/callback',
  },
};

export const routesV2 = {
  version: 'v2',
  order: {
    onCreatedEvent: '/orders/webhook/created-event',
    onPaidEvent: '/orders/webhook/paid-event',
  },
};
