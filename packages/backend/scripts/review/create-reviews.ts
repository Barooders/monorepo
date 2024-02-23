/* eslint-disable no-console */
import { PrismaClient } from '@libs/domain/prisma.main.client';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import 'dotenv.config';

const prisma = new PrismaClient();

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'vendors.csv';
type Vendor = [string, number];

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, PRODUCTS_FILE, {
    from: 2,
  })) as Vendor[];

  for (const [authUserId, numberOfReviews] of rows) {
    console.log(numberOfReviews);
    await Promise.all(
      [...Array(Number(numberOfReviews))].map(async () => {
        console.log('Creating review for vendor', authUserId);
        await prisma.vendorReview.create({
          data: {
            vendor: {
              connect: {
                authUserId,
              },
            },
            review: {
              create: {
                rating: Math.random() < 0.6 ? 5 : 4,
                title: '',
                content: 'Vente réalisée avec succès',
                customerId: '4276ff9e-a377-42bf-a344-cb991fd4b2e9',
                authorNickname: 'Anonyme',
              },
            },
          },
        });
      }),
    );
  }
};

void run();
