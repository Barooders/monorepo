/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import production from '@config/env/prod.secret';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import 'dotenv.config';
import Shopify from 'shopify-api-node';

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'saisie-facile-products.csv';
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

  for (const [productId, owner] of rows) {
    try {
      if (owner === 'b2c') {
        console.log(
          `Skipping product ${productId} because it is a b2c product`,
        );
        continue;
      }

      if (owner !== 'c2c') {
        throw new Error(
          `Will not update product ${productId} because it has an unknown owner: ${owner}`,
        );
      }

      console.log(`Updating product ${productId} with new owner b2c`);
      const productMetafields = await shopifyClient.metafield.list({
        metafield: {
          owner_resource: 'product',
          owner_id: productId,
        },
        limit: 250,
      });

      const ownerMetafield = productMetafields.find(
        ({ key, namespace }) => key === 'owner' && namespace === 'barooders',
      );

      if (!ownerMetafield) {
        console.log(
          `Skipping product ${productId} because it has no owner metafield`,
        );
        continue;
      }

      await shopifyClient.metafield.update(ownerMetafield.id, {
        value: 'b2c',
      });
      console.log(`Updated product ${productId}`);
    } catch (error) {
      console.error(`Error while updating product ${productId}: ${error}`);
    }
  }
};

void run();
