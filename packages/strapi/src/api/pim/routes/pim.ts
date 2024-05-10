export default {
  routes: [
    {
      method: "POST",
      path: "/pim/generate-from-selling-form-config",
      handler: "pim.generatePimFromSellingFormConfig",
    },
    {
      method: "POST",
      path: "/pim/import-make-datastores",
      handler: "pim.importMakeDataStores",
    },
  ],
};
