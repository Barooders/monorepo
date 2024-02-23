/* eslint-disable no-console */
import production from '@config/env/prod.secret';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import 'dotenv.config';
import Shopify from 'shopify-api-node';

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'compare-price-empty.csv';
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

  for (const [variantId, variantPrice] of rows) {
    try {
      console.log(`Updating variant ${variantId}`);

      await shopifyClient.productVariant.update(Number(variantId), {
        compare_at_price: `${variantPrice}`,
      });
    } catch (error) {
      console.error(`Error while updating variant ${variantId}`);
      console.error(error);
    }
  }
};

void run();
