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
      './shared/**/*.tsx',
      './shared/**/*.ts',
      './web/**/*.tsx',
      './web/**/*.ts',
      '!./shared/hooks/useStorefront.ts',
    ],
    ignoreNoDocuments: true,
    pluckConfig: {
      gqlMagicComment: `typed_for_${role}`,
    },
    generates: {
      [`./shared/__generated/gql/${role}/`]: {
        preset: 'client',
        config: {
          avoidOptionals: true,
          skipTypename: false,
          scalars: {
            bigint: 'number',
          },
        },
        presetConfig: {
          fragmentMasking: false,
        },
      },
    },
  };
};

(async () => {
  for (const role of Object.values(HASURA_ROLES)) {
    console.log(`Generating graphql types for role ${role}`);
    await generate(getConfigFromRole(role), true);
  }
})();
