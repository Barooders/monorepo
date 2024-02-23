import staging from './staging.secret';
import { EnvConfigType, Environments } from './types';

const local: EnvConfigType = {
  envName: Environments.LOCAL,
  logLevel: 'trace',
  prettyLog: true,
  hostname: 'http://localhost:3000',
  backendBaseUrl: 'http://localhost:3000',
  appJwtSecret:
    '03115fc60a80b0c095272f082620a3fdabfc45834d59ffe9265a2f75c1ffbd84',
  frontendBaseUrl: 'https://barooders.com',
  technicalAccountId: 'a2c381be-84ec-4b6c-b819-410988bd3ae8',
  locationId: '68533813489',
  loginJwtSecret:
    '5152fa850c02dc222631cca898ed1485821a70912a6e3649c49076912daa3b62182ba013315915d64f40cddfbb8b58eb5bd11ba225336a6af45bbae07ca873f3',
  unleashServerApiToken:
    '*:development.4e040c2233ff6b04f7e5268df906dc879f86df574d7633976f5be364',
  mobileAppPublicationId: 'gid://shopify/Publication/94244602097',
  externalServices: staging.externalServices,
};

export default local;
