import envConfig from '@config/env/env.config';

export const chatConfig = {
  chatIdEncryptionKey: envConfig.externalServices.talkjs.chatIdEncryptionKey,
  talkJSApiKey: envConfig.externalServices.talkjs.apiKey,
  talkJSAppId: envConfig.externalServices.talkjs.appId,
};
