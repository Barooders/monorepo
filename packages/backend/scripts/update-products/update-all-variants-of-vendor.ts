/* eslint-disable no-console */
import { PrismaClient } from '@libs/domain/prisma.main.client';
import 'dotenv.config';
import { get } from 'env-var';

const prisma = new PrismaClient();

const run = async () => {
  const variants = await prisma.productVariant.findMany({
    where: {
      product: {
        vendorId: '069e023c-5231-4e84-a8e9-c3c78e69ddca',
      },
    },
    include: {
      product: {
        select: {
          shopifyId: true,
        },
      },
    },
  });

  for (const {
    shopifyId: variantShopifyId,
    product: { shopifyId: productShopifyId },
    priceInCents,
  } of variants) {
    const newPriceInCents = Math.floor(Number(priceInCents) * 0.9);

    // const targetCommission = 6;
    // const newPriceInCents = Math.floor(
    //   Number(priceInCents) * (1 + targetCommission / (100 - targetCommission)),
    // );

    try {
      console.log(
        `Updating product ${productShopifyId}, variant: ${variantShopifyId} from (${priceInCents}) to (${newPriceInCents})`,
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
          body: JSON.stringify({
            price: {
              amountInCents: newPriceInCents,
            },
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
