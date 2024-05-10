const pimResources = [
  "api::pim-brand.pim-brand",
  "api::pim-product-attribute.pim-product-attribute",
  "api::pim-universe.pim-universe",
  "api::pim-category.pim-category",
  "api::pim-product-type.pim-product-type",
];

export const checkIfPimIsEmpty = async () => {
  const results = await Promise.all(pimResources.map(resource => strapi.query(resource).count()));
  return results.reduce((total, resourceCount) => total + resourceCount, 0) === 0;
};
