export enum Environments {
  PRODUCTION = 'production',
  STAGING = 'staging',
  LOCAL = 'local',
}

export type EnvSecretConfig = {
  unleashServerApiToken: string;
  appJwtSecret: string;
  appScriptsSecret: string;
  loginJwtSecret: string;
  basicAuth: {
    username: string;
    password: string;
  };
  externalServices: {
    sendgridApiKey: string;
    scrapflyApiKey: string;
    commandHandler: {
      endpoint: string;
      bearerToken: string;
    };
    talkjs: {
      apiKey: string;
      appId: string;
      chatIdEncryptionKey: string;
      baroodersSupportAccountId: string;
    };
    slack: {
      slackBotToken: string;
      b2bSlackChannelId: string;
      orderPaidSlackChannelId: string;
      orderCreatedSlackChannelId: string;
      salesTeamSlackChannelId: string;
      orderCanceledSlackChannelId: string;
      errorSlackChannelId: string;
    };
    metabase: {
      secretKey: string;
    };
    floa: {
      apiKey: string;
      eligilityBaseUrl: string;
      paymentgatewayBaseUrl: string;
      hmacSecret: string;
    };
    klaviyo?: { apiKey: string };
    airtable?: {
      secretApiToken: string;
      appId: string;
    };
    stripe: {
      secretKey: string;
    };
    typesense: {
      apiKey: string;
      publicVariantsCollection: string;
      b2bVariantsCollection: string;
      collectionsCollection: string;
      productModelsCollection: string;
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
    strapi: {
      baseUrl: string;
      apiToken: string;
    };
  };
};

export type EnvPublicConfig = {
  envName: Environments;
  hostname: string;
  backendBaseUrl: string;
  logLevel: string;
  prettyLog: boolean;
  frontendBaseUrl: string;
  locationId: string;
  mobileAppPublicationId: string;
  technicalAccountId: string;
  isSentryEnabled: boolean;
};

export type EnvCronConfig = {
  cronJobs: {
    cron: string;
    command: string;
  }[];
};

export type EnvConfig = EnvSecretConfig & EnvPublicConfig & EnvCronConfig;
