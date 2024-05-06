import { get } from 'env-var';
import { EnvPublicConfig, Environments } from './types';

const stagingPublicConfig: EnvPublicConfig = {
  envName: Environments.STAGING,
  logLevel:
    get('DEBUG').default('false').asString() === 'true' ? 'trace' : 'info',
  prettyLog: get('DEBUG').default('false').asBool(),
  hostname: 'https://backend-staging.barooders.com',
  backendBaseUrl: 'https://backend-staging.barooders.com',
  frontendBaseUrl: 'https://staging.barooders.com',
  locationId: '68533813489',
  technicalAccountId: '52355f01-31c9-4f47-a062-d4a7564d4791',
  mobileAppPublicationId: 'gid://shopify/Publication/94244602097',
  isSentryEnabled: false,
};

export default stagingPublicConfig;
