/* eslint-disable no-console */
import production from '@config/env/prod.secret';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import 'dotenv.config';
import Shopify from 'shopify-api-node';

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'weight.csv';
type VariantWeight = [string, string, string];

const shopifyClient = new Shopify({
  shopName: 'barooders.myshopify.com',
  accessToken: production.externalServices.shopify.accessToken,
  autoLimit: true,
});

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, PRODUCTS_FILE, {
    from: 2,
  })) as VariantWeight[];

  for (const [variantId, newWeight] of rows) {
    try {
      console.log(`Updating variant: ${variantId} to new weight: ${newWeight}`);

      await shopifyClient.productVariant.update(Number(variantId), {
        weight: Number(newWeight),
      });
    } catch (error) {
      console.error(`Error while updating variant ${variantId}`);
      console.error(error);
    }
  }
};

void run();
