export enum ConfigKeys {
  FLOA = 'FLOA',
}

export type ConfigType = FloaConfig | null;

export type FloaConfig = {
  token?: string;
  expiringTimestamp?: number;
  envName?: string;
};
