/**
 * pim-extractor service
 */

import groupBy from "lodash/groupBy";
import keyBy from "lodash/keyBy";
import { Breadcrumbs, SellingFormType, SellingProfile } from "../types";
import { checkIfPimIsEmpty } from "../utils/checkPim";
import {
  createBrands,
  createCategories,
  createProductAttributes,
  createProductTypes,
  createUniverses,
} from "../utils/importPimJson";

export default () => ({
  importSellingFormConfig: async (pim: SellingFormType) => {
    const isPimEmpty = await checkIfPimIsEmpty();
    if (!isPimEmpty) throw new Error("You should clean PIM before loading airtable state");

    const brandNametoId = await createBrands(Object.keys(pim.brands));
    const fieldNameToId = await createProductAttributes(pim.fieldDefinitions);
    const universeNameToId = await createUniverses(pim.domains.map(domain => domain.name));
    const rawCategories = pim.domains
      .map(domain => domain.categories.map(category => ({ name: category.name, universeName: domain.name })))
      .flat();
    const categoryNameToId = await createCategories(rawCategories, universeNameToId);

    const rawProductTypes = Object.values(
      groupBy(
        pim.domains
          .map(domain =>
            domain.categories.map(category =>
              category.types.map(type => ({
                ...type,
                category: `${domain.name} > ${category.name}`,
              }))
            )
          )
          .flat(2),
        "name"
      )
    ).map(productTypeList => ({
      ...productTypeList[0],
      categories: productTypeList.map(productType => productType.category),
    }));
    const productTypesNameToId = createProductTypes(rawProductTypes, categoryNameToId, fieldNameToId, brandNametoId);

    return productTypesNameToId;
  },
  importMakeDatastores: async (breadcrumbs: Breadcrumbs[], sellingProfiles: SellingProfile[]) => {
    const searchableBreadcrumbs = keyBy(breadcrumbs, "productType");
    const searchableSellingProfiles = keyBy(sellingProfiles, "Product type");

    const productTypes = await strapi.entityService.findMany("api::pim-product-type.pim-product-type", {
      populate: { productCategory: {} },
    });

    const recap = {
      notInMake: {
        sellingProfiles: [],
        breadcrumbs: [],
      },
      notInStrapi: {
        sellingProfiles: Object.keys(searchableSellingProfiles).filter(
          productTypeName => !productTypes.some(productType => productType.name === productTypeName)
        ),
        missingBreadcrumbs: Object.keys(searchableBreadcrumbs).filter(
          productTypeName => !productTypes.some(productType => productType.name === productTypeName)
        ),
      },
    };

    for (const productType of productTypes) {
      const breadcrumbs = searchableBreadcrumbs[productType.name];
      if (!breadcrumbs) recap.notInMake.breadcrumbs.push(productType.name);
      if (!searchableSellingProfiles[productType.name]) recap.notInMake.sellingProfiles.push(productType.name);
      await strapi.entityService.update("api::pim-product-type.pim-product-type", productType.id, {
        data: {
          weight: searchableSellingProfiles[productType.name]?.Weight ?? null,
          gendered: breadcrumbs?.gendered ?? null,
        },
      });
    }
    console.log(`Done ! Recap : ${JSON.stringify(recap, null, 2)}`);
  },
});
