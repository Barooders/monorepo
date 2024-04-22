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
  order: {
    root: '/orders',
    onCreatedEvent: '/orders/webhook/created-event',
    onPaidEvent: '/orders/webhook/paid-event',
    onPaidEventAsAdmin: '/admin/orders/webhook/paid-event',
    handDeliveryOrder: '/orders/hand-delivery',
    handDeliveryOrderStatus: '/orders/hand-delivery/status',
    getOrder: '/orders/:orderId',
    getOrCreateShippingLabel: '/orders/:orderId/shipping-label',
    fulFillOrderLineAsAdmin: '/admin/order-lines/:orderLineId/fulfill',
    updateOnOrderStatusEvent: '/orders/webhook/update',
    refundOrderAsAdmin: '/admin/order/:orderId/refund',
    cancelOrderAsAdmin: '/admin/order/:orderId/cancel',
    cancelOrderLine: '/order-lines/:orderLineId/cancel',
    updateOrderStatusAsAdmin: '/admin/order-lines/:orderLineId/update-status',
    fulFillOrderLine: '/order-lines/:orderLineId/fulfill',
  },
  product: {
    createDraftProduct: '/products/create',
    createProductByAdmin: '/admin/products/create',
    getProduct: '/products/:productId',
    addProductImage: '/products/:productId/image',
    deleteProductImage: '/products/:productId/image/:imageId',
    getProductByHandle: '/products/by-handle/:productHandle',
    updateProduct: '/products/:productId',
    updateProductVariant: '/products/:productId/variants/:productVariantId',
    getProductByAdmin: '/admin/products/:productId',
    updateProductByAdmin: '/admin/products/:productId',
    triggerVendorProductsUpdateByAdmin: '/admin/vendors/:vendorId/products',
    updateProductVariantByAdmin:
      '/admin/products/:productId/variants/:productVariantId',
    moderateProductByAdmin: '/admin/products/:productId/moderate',
    productCreatedEvent: '/products/webhook/created-event',
    productUpdatedEvent: '/products/webhook/updated-event',
    productDeletedEvent: '/products/webhook/deleted-event',
    testProductIndexation: '/products/index',
    createCommission: '/commission/create',
    computeLineItemCommission: '/commission/compute-line-item',
    computeProductCommission: '/commission/product',
    getB2BCommission: '/commission/b2b',
    createProductModel: '/products/models',
  },
  invoice: {
    previewPayout: '/invoice/preview-payout',
    executePayout: '/invoice/payout',
  },
  deliveryProfile: {
    variant: '/delivery-profile/product-variant/:shopifyProductVariantId',
  },
  shopify: {
    auth: '/shopify/auth',
    authCallback: '/shopify/auth/callback',
  },
};
