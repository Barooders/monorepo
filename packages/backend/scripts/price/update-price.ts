/* eslint-disable no-console */
import production from '@config/env/prod.secret';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import 'dotenv.config';
import Shopify from 'shopify-api-node';

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'prices-velosbiterrois.csv';
type ProductTypeToUpdateRow = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

const shopifyClient = new Shopify({
  shopName: 'barooders.myshopify.com',
  accessToken: production.externalServices.shopify.accessToken,
  autoLimit: true,
});

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, PRODUCTS_FILE, {
    from: 2,
  })) as ProductTypeToUpdateRow[];

  for (const [productId] of rows) {
    try {
      console.log(`Updating product ${productId}`);
      const product = await shopifyClient.product.get(Number(productId));
      const variantsWithNewPrice = product.variants.map((variant) => ({
        ...variant,
        price: (Number(variant.price) - 100).toFixed(2),
      }));

      await shopifyClient.product.update(Number(productId), {
        variants: variantsWithNewPrice,
      });
    } catch (error) {
      console.error(`Error while updating product ${productId}`);
      console.error(error);
    }
  }
};

void run();
