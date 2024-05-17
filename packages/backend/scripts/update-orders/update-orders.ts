/* eslint-disable no-console */
import { PrismaClient } from '@libs/domain/prisma.main.client';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import { jsonStringify } from '@libs/helpers/json';
import 'dotenv.config';
import { get } from 'env-var';

const prisma = new PrismaClient();

const DATA_FOLDER = `${__dirname}/data`;
const ORDERS_FILE = 'orders.csv';
type OrderId = [string];

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, ORDERS_FILE, {
    from: 2,
  })) as OrderId[];

  for (const [orderName] of rows) {
    try {
      console.log(`Updating order ${orderName}`);

      const { id } = await prisma.order.findUniqueOrThrow({
        where: {
          name: orderName,
        },
      });

      const response = await fetch(
        `https://backend.barooders.com/v1/admin/orders/${id}/update-status?authorId=script_by_jp`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `Api-Key ${get('PROD_JWT_SECRET')
              .required()
              .asString()}`,
          },
          method: 'POST',
          body: jsonStringify({
            updatedAt: new Date().toISOString(),
            status: 'PAID_OUT',
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
