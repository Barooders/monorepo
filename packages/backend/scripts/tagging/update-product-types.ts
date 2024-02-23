/* eslint-disable no-console */
import production from '@config/env/prod.secret';
import 'dotenv.config';

import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import Shopify from 'shopify-api-node';

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'products-types-to-update.csv';
type ProductTypeToUpdateRow = [string, string];

const shopifyClient = new Shopify({
  shopName: 'barooders.myshopify.com',
  accessToken: production.externalServices.shopify.accessToken,
  autoLimit: true,
});

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, PRODUCTS_FILE, {
    from: 2,
  })) as ProductTypeToUpdateRow[];

  for (const [productId, newProductType] of rows) {
    try {
      console.log(
        `Updating product ${productId} with new product type ${newProductType}`,
      );
      await shopifyClient.product.update(Number(productId), {
        product_type: newProductType,
      });
    } catch (error) {
      console.error(
        `Error while updating product ${productId} with new product type ${newProductType} `,
      );
      console.error(error);
    }
  }
};

void run();
