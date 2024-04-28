import { generate } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config();

const getHasuraSecretKey = () =>
  process.env.HASURA_SECRET_KEY ?? 'myadminsecretkey';

if (!process.env.NEXT_PUBLIC_HASURA_BASE_URL)
  throw new Error('Missing HASURA_BASE_URL');

const config = {
  schema: {
    [process.env.NEXT_PUBLIC_HASURA_BASE_URL]: {
      headers: {
        'X-Hasura-Admin-Secret': getHasuraSecretKey(),
        'X-Hasura-Role': 'admin',
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
    './shared/__generated/graphql.admin.tsx': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        avoidOptionals: true,
        skipTypename: false,
      },
    },
    './shared/__generated/graphql.admin.schema.json': {
      plugins: ['introspection'],
    },
  },
};

(async () => {
  await generate(config, true);
})();
