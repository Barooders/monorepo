import { CodegenConfig, generate } from '@graphql-codegen/cli';
import dotenv from 'dotenv';
import { HASURA_ROLES } from 'shared-types';

dotenv.config();

const getHasuraSecretKey = () =>
  process.env.HASURA_SECRET_KEY ?? 'myadminsecretkey';

const getConfigFromRole = (role: HASURA_ROLES): CodegenConfig => {
  if (!process.env.NEXT_PUBLIC_HASURA_BASE_URL)
    throw new Error('Missing HASURA_BASE_URL');

  return {
    schema: {
      [process.env.NEXT_PUBLIC_HASURA_BASE_URL]: {
        headers: {
          'X-Hasura-Admin-Secret': getHasuraSecretKey(),
          'X-Hasura-Role': role,
        },
      },
    },
    documents: [
      './shared/clients/discounts.ts',
    ],
    generates: {
      [`./shared/__generated/${role}/`]: {
        preset: 'client',
      },
    },
  };
};

(async () => {
  Object.values(HASURA_ROLES).forEach(async (role) => {
    if (role !== HASURA_ROLES.PUBLIC) return;
    console.log(`Generating graphql types for role ${role}`);
    await generate(getConfigFromRole(role), true);
  });
})();
