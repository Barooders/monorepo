/* eslint-disable no-console */
import production from '@config/env/prod.secret';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import 'dotenv.config';
import Shopify from 'shopify-api-node';

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'bikes-needing-tag-cleaning.csv';
type ProductNeedingTagCleaning = [string];

const shopifyClient = new Shopify({
  shopName: 'barooders.myshopify.com',
  accessToken: production.externalServices.shopify.accessToken,
  autoLimit: true,
});

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, PRODUCTS_FILE, {
    from: 2,
  })) as ProductNeedingTagCleaning[];

  for (const [productId] of rows) {
    try {
      const productIdNumber = Number(productId);
      const product = await shopifyClient.product.get(productIdNumber);
      console.log(`🚀 ${productId} - BEFORE: ${product.tags}`);
      const tags = product.tags
        .split(',')
        .map((tag) => tag.trim())
        .reduce((acc: string[], tag) => {
          const [key, value] = tag.split(':');

          if (!key || !value) return acc;

          return [...acc, `${key.trim().toLowerCase()}:${value.trim()}`];
        }, [])
        .join(', ');

      await shopifyClient.product.update(productIdNumber, {
        tags,
      });

      console.log(`🚀 ${productId} -  AFTER: ${tags}`);
    } catch (e) {
      console.error(`💥 ${JSON.stringify(e)}`);
    }
  }
};

void run();
