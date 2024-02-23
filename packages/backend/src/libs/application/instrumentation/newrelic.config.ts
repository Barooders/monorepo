/* eslint-disable import/no-named-as-default-member */
import * as MainClient from '@libs/domain/prisma.main.client';
import * as StoreClient from '@libs/domain/prisma.store.client';
import newrelic from 'newrelic';

export const initClients = () => {
  newrelic.instrumentLoadedModule('@prisma/client', MainClient);
  newrelic.instrumentLoadedModule('@prisma/client', StoreClient);
};
