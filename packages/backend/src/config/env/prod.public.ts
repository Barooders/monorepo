import { get } from 'env-var';
import { EnvPublicConfig, Environments } from './types';

const productionPublicConfig: EnvPublicConfig = {
  envName: Environments.PRODUCTION,
  logLevel:
    get('DEBUG').default('false').asString() === 'true' ? 'trace' : 'warn',
  prettyLog: get('DEBUG').default('false').asBool(),
  hostname: 'https://backend.barooders.com',
  backendBaseUrl: 'https://backend.barooders.com',
  frontendBaseUrl: 'https://barooders.com',
  locationId: '63305416853',
  mobileAppPublicationId: 'gid://shopify/Publication/92204138723',
  technicalAccountId: '4276ff9e-a377-42bf-a344-cb991fd4b2e9',
};

export default productionPublicConfig;
