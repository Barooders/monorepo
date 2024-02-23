import envConfig from '@config/env/env.config';
import { CollectionDocument, SearchVariantDocument } from '@libs/domain/types';
import { Client } from 'typesense';

const sharedConfig = {
  nodes: [
    {
      host: '56bmiavw9gt0qkf3p.a1.typesense.net',
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: envConfig.externalServices.typesense.apiKey,
  connectionTimeoutSeconds: 2,
};

export type TypesenseVariantDocument = SearchVariantDocument & { id: string };
export type TypesenseCollectionDocument = CollectionDocument & {
  id: string;
};

export const typesenseVariantClient = new Client(
  sharedConfig,
).collections<TypesenseVariantDocument>(
  envConfig.externalServices.typesense.variantsCollection,
);

export const typesenseCollectionClient = new Client(
  sharedConfig,
).collections<TypesenseCollectionDocument>(
  envConfig.externalServices.typesense.collectionsCollection,
);
