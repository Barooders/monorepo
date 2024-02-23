import { PrismaClient } from '@libs/domain/prisma.main.client';
import { extractRowsFromCSVFile, fromRowsToObject } from '@libs/helpers/csv';
import * as fs from 'fs';

const prisma = new PrismaClient();
const DATA_FOLDER = `${__dirname}/data`;
const HASURA_AUTH_URL = 'http://localhost:4000';

const startTime = Date.now();

const MATRIXIFY_FILE = 'Customers.csv';

const used_file = MATRIXIFY_FILE;

type ExtractedCustomerFromMatrixify = {
  id: string;
  email: string;
  createdAt: string;
  password: string;
};

type HasuraAuthSignupResponse = {
  mfa: {
    ticket: string;
  };
  session: {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    user: {
      activeMfaType: string;
      avatarUrl: string;
      createdAt: string;
      defaultRole: string;
      displayName: string;
      email: string;
      emailVerified: boolean;
      id: string;
      isAnonymous: boolean;
      locale: string;
      metadata: {
        firstName: string;
        lastName: string;
      };
      phoneNumber: string;
      phoneNumberVerified: boolean;
      roles: string[];
    };
  };
};

const signupOnHasuraAuth = async (
  email: string,
  password: string,
  createdAt: string,
): Promise<HasuraAuthSignupResponse> => {
  const response = await fetch(`${HASURA_AUTH_URL}/signup/email-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      options: {
        allowedRoles: ['registered_user', 'public', 'me'],
        defaultRole: 'registered_user',
        locale: 'fr',
        metadata: {
          createdOnShopifyAt: createdAt,
        },
      },
      password,
    }),
  });
  return await response.json();
};

const createCustomerAccountFromMatrixify = async (
  extractedCustomer: ExtractedCustomerFromMatrixify,
): Promise<{ status: string; authUserId: string; newPassword: string }> => {
  const existingCustomer = await prisma.customer.findUnique({
    where: { shopifyId: Number(extractedCustomer.id) },
  });

  const password = (Math.random() + 1).toString(36).substring(2);

  const result = await signupOnHasuraAuth(
    extractedCustomer.email,
    password,
    extractedCustomer.createdAt,
  );

  const authUserId = result.session.user.id;

  if (!existingCustomer) throw new Error('No customer found');

  const updatedCustomer = await prisma.customer.update({
    where: { authUserId: existingCustomer.authUserId },
    data: { authUserId },
  });

  if (!updatedCustomer || !updatedCustomer.authUserId)
    throw new Error('Customer not updated');

  return {
    status: 'success',
    authUserId: updatedCustomer.authUserId,
    newPassword: password,
  };
};

const run = async () => {
  const headers = (
    await extractRowsFromCSVFile(DATA_FOLDER, used_file, {
      from: 1,
      to: 1,
    })
  )[0];
  const rows = await extractRowsFromCSVFile(DATA_FOLDER, used_file, {
    from: 2,
  });

  const customers = fromRowsToObject(
    headers,
    rows,
  ) as ExtractedCustomerFromMatrixify[];

  let counter = 1;

  for (const customer of customers) {
    // eslint-disable-next-line no-console
    console.log(`${counter}/${customers.length}: ${customer.email}`);
    try {
      fs.appendFileSync(
        `${DATA_FOLDER}/log.${startTime}`,
        `${JSON.stringify(
          await createCustomerAccountFromMatrixify(customer),
        )}\n`,
      );
    } catch {
      // eslint-disable-next-line no-console
      console.log(`ERROR FOR ${customer.email}`);
    }
    counter++;
  }
};

run();
