export enum Environments {
  PRODUCTION = 'production',
  // STAGING = 'staging',
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
};
