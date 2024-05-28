/* eslint-disable no-console */
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import 'dotenv.config';
import { get } from 'env-var';

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'to-archive.csv';
type ProductId = [string];

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, PRODUCTS_FILE, {
    from: 2,
  })) as ProductId[];

  for (const [productInternalId] of rows) {
    try {
      console.log(`Updating product ${productInternalId}`);

      const response = await fetch(
        `https://backend.barooders.com/v1/admin/products/${productInternalId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `Api-Key ${get('PROD_JWT_SECRET')
              .required()
              .asString()}`,
          },
          method: 'PATCH',
          body: JSON.stringify({
            status: 'ARCHIVED',
          }),
        },
      );
      if (response.status > 300)
        throw new Error(JSON.stringify(await response.json()));
    } catch (error) {
      console.log(error);
    }
  }
};

void run();
