import envConfig from '@config/env/env.config';
import {
  CollectionDocument,
  SearchB2BVariantDocument,
  SearchPublicVariantDocument,
} from '@libs/domain/types';
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

export type TypesensePublicVariantDocument = SearchPublicVariantDocument & {
  id: string;
};
export type TypesenseB2BVariantDocument = SearchB2BVariantDocument & {
  id: string;
};
export type TypesenseCollectionDocument = CollectionDocument & {
  id: string;
};

export const typesensePublicVariantClient = new Client(
  sharedConfig,
).collections<TypesensePublicVariantDocument>(
  envConfig.externalServices.typesense.publicVariantsCollection,
);
export const typesenseB2BVariantClient = new Client(
  sharedConfig,
).collections<TypesenseB2BVariantDocument>(
  envConfig.externalServices.typesense.b2bVariantsCollection,
);

export const typesenseCollectionClient = new Client(
  sharedConfig,
).collections<TypesenseCollectionDocument>(
  envConfig.externalServices.typesense.collectionsCollection,
);
