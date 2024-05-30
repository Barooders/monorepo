export default async function () {
  const storeProductAPI = await import(
    '@medusajs/medusa/dist/api/routes/store/products/index'
  );
  // @ts-expect-error no override
  storeProductAPI.allowedStoreProductsFields = [
    ...storeProductAPI.allowedStoreProductsFields,
    'store_id',
  ];
  // @ts-expect-error no override
  storeProductAPI.defaultStoreProductsFields = [
    ...storeProductAPI.defaultStoreProductsFields,
    'store_id',
  ];
  // @ts-expect-error no override
  storeProductAPI.allowedStoreProductsRelations = [
    ...storeProductAPI.defaultStoreProductsFields,
    'store',
  ];

  const adminProductAPI = await import(
    '@medusajs/medusa/dist/api/routes/admin/products/index'
  );

  // @ts-expect-error no override
  adminProductAPI.defaultAdminProductFields = [
    ...adminProductAPI.defaultAdminProductFields,
    'store_id',
  ];

  // @ts-expect-error no override
  adminProductAPI.defaultAdminProductRemoteQueryObject = {
    ...adminProductAPI.defaultAdminProductRemoteQueryObject,
    store: {
      fields: ['id', 'name'],
    },
  };
}
