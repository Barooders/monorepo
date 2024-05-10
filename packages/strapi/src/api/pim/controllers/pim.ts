import axios from "axios";

const requestMake = async (url: string) => {
  const makeToken = process.env.MAKE_TOKEN;
  if (!makeToken) throw new Error("Missing Make token");

  const {
    data: { records },
  } = await axios.get(url, {
    headers: {
      Authorization: `Token ${makeToken}`,
    },
  });

  return records.map(({ data }) => data);
};

export default {
  generatePimFromSellingFormConfig: async ctx => {
    const { data: sellingFormConfig } = await axios.get(
      "https://cdn.shopify.com/s/files/1/0576/4340/1365/files/pim.json"
    );
    try {
      await strapi.service("api::pim.pim").importSellingFormConfig(sellingFormConfig);
      ctx.response.status = 200;
    } catch (e) {
      ctx.response.status = 500;
      ctx.response.message = e.message;
    }
  },
  importMakeDataStores: async ctx => {
    const sellingProfiles1 = await requestMake("https://eu1.make.com/api/v2/data-stores/12293/data?pg%5Blimit%5D=100");
    const sellingProfiles2 = await requestMake(
      "https://eu1.make.com/api/v2/data-stores/12293/data?pg%5Blimit%5D=100&pg%5Boffset%5D=100"
    );
    const breadcrumbs1 = await requestMake("https://eu1.make.com/api/v2/data-stores/15869/data?pg%5Blimit%5D=100");
    const breadcrumbs2 = await requestMake(
      "https://eu1.make.com/api/v2/data-stores/15869/data?pg%5Blimit%5D=100&pg%5Boffset%5D=100"
    );

    const sellingProfiles = [...sellingProfiles1, ...sellingProfiles2];
    const breadcrumbs = [...breadcrumbs1, ...breadcrumbs2];

    ctx.response.body = await strapi.service("api::pim.pim").importMakeDatastores(breadcrumbs, sellingProfiles);
  },
};
