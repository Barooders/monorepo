import { EnvPublicConfig, Environments } from './types';

const localPublicConfig: EnvPublicConfig = {
  envName: Environments.LOCAL,
  logLevel: 'trace',
  prettyLog: true,
  hostname: 'http://localhost:3000',
  backendBaseUrl: 'http://localhost:3000',
  frontendBaseUrl: 'https://barooders.com',
  technicalAccountId: 'a2c381be-84ec-4b6c-b819-410988bd3ae8',
  mobileAppPublicationId: 'gid://shopify/Publication/94244602097',
  locationId: '68533813489',
  isSentryEnabled: false,
};

export default localPublicConfig;
