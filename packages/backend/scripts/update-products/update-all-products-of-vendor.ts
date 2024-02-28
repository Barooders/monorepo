/* eslint-disable no-console */
import { PrismaClient } from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import 'dotenv.config';
import { get } from 'env-var';

const prisma = new PrismaClient();

const run = async () => {
  const products = await prisma.product.findMany({
    where: {
      vendorId: '7e5c2537-8fc2-400e-90b2-3c66a864ca7d',
      status: {
        not: 'ARCHIVED',
      },
      createdAt: {
        lte: new Date('2024-02-27'),
      },
    },
  });

  for (const { shopifyId: productShopifyId } of products) {
    try {
      console.log(`Updating product ${productShopifyId}`);

      const response = await fetch(
        `https://backend.barooders.com/v1/admin/products/${productShopifyId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `Api-Key ${get('PROD_JWT_SECRET')
              .required()
              .asString()}`,
          },
          method: 'PATCH',
          body: jsonStringify({
            status: 'ARCHIVED',
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
