import { get } from 'env-var';
import { EnvConfigType, Environments } from './types';
import { DEFAULT_USER } from 'prisma/seed';

const staging: EnvConfigType = {
  envName: Environments.STAGING,
  logLevel:
    get('DEBUG').default('false').asString() === 'true' ? 'trace' : 'warn',
  prettyLog: get('DEBUG').default('false').asBool(),
  hostname: 'https://backend-staging.barooders.com',
  backendBaseUrl: 'https://backend-staging.barooders.com',
  frontendBaseUrl: 'https://staging.barooders.com',
  unleashServerApiToken:
    '*:development.4e040c2233ff6b04f7e5268df906dc879f86df574d7633976f5be364',
  appJwtSecret:
    '03115fc60a80b0c095272f082620a3fdabfc45834d59ffe9265a2f75c1ffbd84',
  loginJwtSecret:
    '5152fa850c02dc222631cca898ed1485821a70912a6e3649c49076912daa3b62182ba013315915d64f40cddfbb8b58eb5bd11ba225336a6af45bbae07ca873f3',
  locationId: '68533813489',
  technicalAccountId: '52355f01-31c9-4f47-a062-d4a7564d4791',
  mobileAppPublicationId: 'gid://shopify/Publication/94244602097',
  externalServices: {
    sendgridApiKey:
      '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',
    strapiBaseUrl: 'https://barooders-strapi.herokuapp.com',
    scrapflyApiKey: '9956b6f8eda24d969582554087375881',
    talkjs: {
      apiKey: 'sk_test_dssuZgukJxwCsR4nd9l4QxBJr9YmdIB7',
      appId: 'teZDC2o0',
      chatIdEncryptionKey: '68ec307f-41aa-44ba-bece-a6f472458919',
      baroodersSupportAccountId: DEFAULT_USER,
    },
    slack: {
      slackBotToken:
        'xoxb-1554389548630-5309647657106-EKsSnQ72AOn43WAqqtBltjHP',
      orderPaidSlackChannelId: 'C0591UQNLMQ',
      salesTeamSlackChannelId: 'unused_feature',
      orderCreatedSlackChannelId: 'C05C3G903PA',
      orderCanceledSlackChannelId: 'C06B347M1HS',
      errorSlackChannelId: 'C06FL3JFNB0',
    },
    floa: {
      apiKey: 'QkFST09ERVJTOkJBUk9PREVSUzEyMzQq',
      eligilityBaseUrl: 'https://eligibility.integration-cb4x.fr',
      paymentgatewayBaseUrl: 'https://paymentgateway.integration-cb4x.fr',
      hmacSecret: 'B1156A13F602CD01FB542160BB6FB4C3F9CCF3A7',
    },
    stripe: {
      secretKey:
        'sk_test_51J7KkVIo2LjiA3XTqxGMMpLxhjweFajKrggRULSefCJBg9DhxvXjDRYs29e90Ht2emLgzV86T8USpktWKHqYFClL00LzmQO6Mo',
    },
    typesense: {
      apiKey: 'XMymJqNAreI4NfvPP33FV52D84L71L2m',
      variantsCollection: 'staging_backend_products',
      collectionsCollection: 'staging_backend_collections',
    },
    batch: {
      apiKey: '821f8aa17f379fa166aaed56b8a52521',
    },
    chatGpt: {
      apiKey: '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',
    },
    gorgias: {
      basicToken:
        'amVhbi1waGlsaXBwZUBiYXJvb2RlcnMuY29tOmMxNzJhMDYxNDJkZDc2NzYyMmJiMDZiZjQ2MDFjZTc1YjkwMjNiMWFjYzkyOGFjMjU3OWFmOGYzMzYyNmJjZmU=',
    },
    sendCloud: {
      basicToken:
        'YTNjOWUwM2YtOTY4ZC00MDI3LTk2MDYtYjAxNjc2ODdlYzRiOmJlYzk2ODVkNjBiNDQ2ZjBiY2MxNzQ1N2E1NmQ5NWY4',
      shopifyIntegrationId: '362629',
      webhookSecretKey: 'bec9685d60b446f0bcc17457a56d95f8',
    },
    shopify: {
      shop: 'barooders-stagging.myshopify.com',
      shopDns: 'staging.barooders.com',
      apiKey: '6427984b2e3172b1a593ac30c8620bbd',
      apiSecret: '10b8b11763222cfcce45916aeb6175d3',
      accessToken: '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',
      synchroAccessToken: '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',
      customAppApiKey: '6d3b45d6fdc0f0d41e78bdde0dd07139',
      customAppApiSecret: '9a00f615d3b08a3adbc160639da58dce',
      customAppScopes: [
        'read_shipping',
        'read_products',
        'write_products',
        'read_checkouts',
        'write_checkouts',
        'read_orders',
        'read_publications',
        'write_publications',
      ],
      multipassSecret: 'fe193803b66858a1bf5d799822c99bf7',
      shopAdminWebhookSecret:
        '27be0db31aad8de552c3fe633f18dd0d97334f355ab024c0081048723c394dc6',
      shopOnlineStorePublicationId: 'gid://shopify/Publication/81970921713',
    },
  },
};

export default staging;
