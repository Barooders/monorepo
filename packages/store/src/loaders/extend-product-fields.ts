export default async function () {
  const storeProductAPI = await import(
    '@medusajs/medusa/dist/api/routes/store/products/index'
  );
  // @ts-expect-error no override
  storeProductAPI.allowedStoreProductsFields = [
    ...storeProductAPI.allowedStoreProductsFields,
    'vendor_id',
  ];
  // @ts-expect-error no override
  storeProductAPI.defaultStoreProductsFields = [
    ...storeProductAPI.defaultStoreProductsFields,
    'vendor_id',
  ];

  const adminProductAPI = await import(
    '@medusajs/medusa/dist/api/routes/admin/products/index'
  );

  // @ts-expect-error no override
  adminProductAPI.defaultAdminProductFields = [
    ...adminProductAPI.defaultAdminProductFields,
    'vendor_id',
  ];
}
