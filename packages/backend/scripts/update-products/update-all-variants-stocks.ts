/* eslint-disable no-console */
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import { jsonStringify } from '@libs/helpers/json';
import 'dotenv.config';
import { get } from 'env-var';

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'update-stocks.csv';
type ProductId = [string, string, string];

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, PRODUCTS_FILE, {
    from: 2,
  })) as ProductId[];

  for (const [variantShopifyId, productShopifyId, stock] of rows) {
    try {
      console.log(
        `Updating product ${productShopifyId}, variant: ${variantShopifyId} to stock: ${stock}`,
      );

      const response = await fetch(
        `https://backend.barooders.com/v1/admin/products/${productShopifyId}/variants/${variantShopifyId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `Api-Key ${get('PROD_JWT_SECRET')
              .required()
              .asString()}`,
          },
          method: 'PATCH',
          body: jsonStringify({
            quantity: Number(stock),
          }),
        },
      );
      if (response.status > 300)
        throw new Error(jsonStringify(await response.json()));
    } catch (error) {
      console.log(error);
    }
  }
};

void run();
