export enum Environments {
  PRODUCTION = 'production',
  STAGING = 'staging',
  LOCAL = 'local',
}

export type EnvironmentsType = {
  s3: {
    s3Url: string;
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  authentication: {
    jwtSecret: string;
    cookieSecret: string;
  };
  database: {
    url: string;
    ssl: boolean;
  };
  redis: {
    url: string;
  };
  cors: string[];
  sendgrid: {
    apiKey: string;
    from: string;
  };
  paypal: {
    isSandbox: boolean;
    clientId: string;
    clientSecret: string;
    authWebhookId: string;
  };
  stripe: {
    apiKey: string;
    webhookSecret: string;
  };
};
