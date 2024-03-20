export enum Environments {
  PRODUCTION = 'production',
  STAGING = 'staging',
  LOCAL = 'local',
}

export type EnvConfigType = {
  envName: Environments;
  hostname: string;
  backendBaseUrl: string;
  logLevel: string;
  prettyLog: boolean;
  frontendBaseUrl: string;
  unleashServerApiToken: string;
  appJwtSecret: string;
  loginJwtSecret: string;
  locationId: string;
  mobileAppPublicationId: string;
  technicalAccountId: string;
  externalServices: {
    sendgridApiKey: string;
    strapiBaseUrl: string;
    scrapflyApiKey: string;
    talkjs: {
      apiKey: string;
      appId: string;
      chatIdEncryptionKey: string;
      baroodersSupportAccountId: string;
    };
    slack: {
      slackBotToken: string;
      orderPaidSlackChannelId: string;
      orderCreatedSlackChannelId: string;
      salesTeamSlackChannelId: string;
      orderCanceledSlackChannelId: string;
      errorSlackChannelId: string;
    };
    floa: {
      apiKey: string;
      eligilityBaseUrl: string;
      paymentgatewayBaseUrl: string;
      hmacSecret: string;
    };
    stripe: {
      secretKey: string;
    };
    typesense: {
      apiKey: string;
      publicVariantsCollection: string;
      b2bVariantsCollection: string;
      collectionsCollection: string;
    };
    batch: {
      apiKey: string;
    };
    chatGpt: {
      apiKey: string;
    };
    gorgias: {
      basicToken: string;
    };
    sendCloud: {
      basicToken: string;
      shopifyIntegrationId: string;
      webhookSecretKey: string;
    };
    shopify: {
      shop: string;
      shopDns: string;
      apiKey: string;
      apiSecret: string;
      accessToken: string;
      synchroAccessToken: string;
      customAppApiKey: string;
      customAppApiSecret: string;
      customAppScopes: string[];
      multipassSecret: string;
      shopAdminWebhookSecret: string;
      shopOnlineStorePublicationId: string;
    };
  };
};
