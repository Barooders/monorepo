import dotenv from 'dotenv';

dotenv.config();

const getHasuraSecretKey = () =>
  process.env.HASURA_SECRET_KEY ?? 'myadminsecretkey';

module.exports = {
  schema: {
    [process.env.NEXT_PUBLIC_HASURA_BASE_URL]: {
      headers: {
        'X-Hasura-Admin-Secret': getHasuraSecretKey(),
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
  overwrite: true,
  generates: {
    './shared/__generated/graphql.tsx': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        avoidOptionals: true,
        skipTypename: false,
        scalars: {
          bigint: {
            input: 'number',
            output: 'number',
          },
        },
      },
    },
    './shared/__generated/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export {};
