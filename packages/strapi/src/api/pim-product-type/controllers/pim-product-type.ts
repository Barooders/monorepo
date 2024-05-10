/**
 * pim-product-type controller
 */

import { factories } from "@strapi/strapi";
import { extractBrands, extractDomains, extractFieldDefinitions } from "../utils/sellingFormConfig";

export default factories.createCoreController("api::pim-product-type.pim-product-type", {
  async getSellingFormConfig(ctx) {
    const brands = await extractBrands();
    const fieldDefinitions = await extractFieldDefinitions();
    const domains = await extractDomains();

    ctx.response.body = { domains, fieldDefinitions, brands };
  },
});
