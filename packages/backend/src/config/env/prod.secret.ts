import { get } from 'env-var';
import { EnvConfigType, Environments } from './types';

const production: EnvConfigType = {
  envName: Environments.PRODUCTION,
  logLevel:
    get('DEBUG').default('false').asString() === 'true' ? 'trace' : 'warn',
  prettyLog: get('DEBUG').default('false').asBool(),
  hostname: 'https://backend.barooders.com',
  backendBaseUrl: 'https://backend.barooders.com',
  frontendBaseUrl: 'https://barooders.com',
  unleashServerApiToken:
    '*:production.8a5678e073f1b218d12f0a75f62805b1ee3c955786be8495c4d24f4d',
  appJwtSecret:
    '25b453894a2501a678c27ec0aa158b5af5de38cc0771e31cfd746861657552ee',
  loginJwtSecret:
    '79574f082940aa36c899b3e54827ef9063733313688c88ed6c8db588fc4175eb98307ec9a5a1d8b7b157d0478260936b2101803b8a4d77568f1299063bb7b124',
  locationId: '63305416853',
  mobileAppPublicationId: 'gid://shopify/Publication/92204138723',
  technicalAccountId: '4276ff9e-a377-42bf-a344-cb991fd4b2e9',
  externalServices: {
    sendgridApiKey:
      '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',
    strapiBaseUrl: 'https://barooders-strapi.herokuapp.com',
    scrapflyApiKey: '9956b6f8eda24d969582554087375881',
    talkjs: {
      apiKey: 'sk_live_iXoA3s2A2vFr2D9LDj487iywAmvw5n7i',
      appId: 'x3kQChsO',
      chatIdEncryptionKey: '29827oiqusdo12374381994776iuOIUHKJSQKDhk987',
      baroodersSupportAccountId: '971e7f58-ed74-4ca1-a115-ffb7c338e924',
    },
    slack: {
      slackBotToken:
        'xoxb-1554389548630-5309647657106-EKsSnQ72AOn43WAqqtBltjHP',
      orderPaidSlackChannelId: 'C02DLMY8WFM',
      salesTeamSlackChannelId: 'C038Z7N3C1H',
      orderCreatedSlackChannelId: 'C05BG84RDJ8',
      orderCanceledSlackChannelId: 'C06AL4A6D9V',
      errorSlackChannelId: 'C05N03ZN9FD',
    },
    floa: {
      apiKey:
        'ZDhBVEJBUk9PREVSU0YtXmFoQ1Q0dGRoQUV0SiFtSUo6V29eZnFibXM5Ml8yTEhHcWFAdCQxdFh2ZDhCNlIhTkZYM1pkcWZLLV5zYQ==',
      eligilityBaseUrl: 'https://eligibility.cb4x.fr',
      paymentgatewayBaseUrl: 'https://paymentgateway.cb4x.fr',
      hmacSecret: 'B1156A13F602CD01FB542160BB6FB4C3F9CCF3A7',
    },
    stripe: {
      secretKey:
        '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',
    },
    typesense: {
      apiKey: 'XMymJqNAreI4NfvPP33FV52D84L71L2m',
      variantsCollection: 'backend_products',
      collectionsCollection: 'backend_collections',
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
      shopifyIntegrationId: '207753',
      webhookSecretKey: 'bec9685d60b446f0bcc17457a56d95f8',
    },
    shopify: {
      shop: 'barooders.myshopify.com',
      shopDns: 'barooders.com',
      apiKey: '6427984b2e3172b1a593ac30c8620bbd',
      apiSecret: '10b8b11763222cfcce45916aeb6175d3',
      accessToken: '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',
      synchroAccessToken: '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',
      customAppApiKey: 'c61d6b5974c73543bb3506e844db6a06',
      customAppApiSecret: '9d1364d0e57d576148583cef788fb5be',
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
      multipassSecret: '17831614353bee06414ded81e0107ad5',
      shopAdminWebhookSecret:
        '3dcaf6ba9b5d5352842541c100533fc464dc0899645bea2f4eb5032de74487d5',
      shopOnlineStorePublicationId: 'gid://shopify/Publication/74635804821',
    },
  },
};

export default production;
