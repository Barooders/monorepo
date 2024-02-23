/* eslint-disable no-console */
import { PrismaClient } from '@libs/domain/prisma.main.client';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
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

      const orderLines = await prisma.orderLines.findMany({
        where: {
          order: {
            name: orderName,
          },
        },
      });

      if (orderLines.length !== 1)
        throw new Error(`Found ${orderLines.length} order lines`);

      const id = orderLines[0].id;

      const response = await fetch(
        `https://backend.barooders.com/v1/admin/order-lines/${id}/update-status?authorId=script_by_jp`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `Api-Key ${get('PROD_JWT_SECRET')
              .required()
              .asString()}`,
          },
          method: 'POST',
          body: JSON.stringify({
            updatedAt: new Date().toISOString(),
            status: 'PAID_OUT',
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
