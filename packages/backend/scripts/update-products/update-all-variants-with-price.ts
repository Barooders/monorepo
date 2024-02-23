/* eslint-disable no-console */
import { PrismaClient } from '@libs/domain/prisma.main.client';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import { jsonStringify } from '@libs/helpers/json';
import 'dotenv.config';
import { get } from 'env-var';

const prisma = new PrismaClient();

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'update-prices.csv';
type ProductId = [string, string];

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, PRODUCTS_FILE, {
    from: 2,
  })) as ProductId[];

  for (const [amountInEur, productShopifyId] of rows) {
    const variants = await prisma.productVariant.findMany({
      where: {
        product: {
          shopifyId: Number(productShopifyId),
        },
      },
    });
    for (const { shopifyId: variantShopifyId } of variants) {
      try {
        console.log(
          `Updating product ${productShopifyId}, variant: ${variantShopifyId}`,
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
              price: {
                amountInCents: Math.floor(Number(amountInEur) * 100),
              },
            }),
          },
        );
        if (response.status > 300)
          throw new Error(jsonStringify(await response.json()));
      } catch (error) {
        console.log(error);
      }
    }
  }
};

void run();
