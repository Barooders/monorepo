import { generate } from '@graphql-codegen/cli';
import dotenv from 'dotenv';
import { HASURA_ROLES } from 'shared-types';

dotenv.config();

const getHasuraSecretKey = () =>
  process.env.HASURA_SECRET_KEY ?? 'myadminsecretkey';

const getConfigFromRole = (role: HASURA_ROLES) => {
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
      './shared/**/*.tsx',
      './shared/**/*.ts',
      './web/**/*.tsx',
      './web/**/*.ts',
      '!./shared/hooks/useStorefront.ts',
    ],
    generates: {
      [`./shared/__generated/graphql.${role}.tsx`]: {
        plugins: ['typescript', 'typescript-operations'],
        config: {
          avoidOptionals: true,
          skipTypename: false,
        },
      },
      [`./shared/__generated/graphql.${role}.schema.json`]: {
        plugins: ['introspection'],
      },
    },
  };
};

(async () => {
  Object.values(HASURA_ROLES).forEach(async (role) => {
    await generate(getConfigFromRole(role), true);
  });
})();
