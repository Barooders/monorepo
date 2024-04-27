import dotenv from 'dotenv';
import { IGraphQLConfig } from 'graphql-config';

dotenv.config();

const getHasuraSecretKey = () =>
  process.env.HASURA_SECRET_KEY ?? 'myadminsecretkey';

const config: IGraphQLConfig = {
  projects: {
    admin: {
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
      extensions: {
        codegen: {
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
        },
      },
    },
  },
};

export default config;
