import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { merge } from './merge';

const DEFAULT_CONFIG = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  timeout: 15_000,
};

export const createHttpClient = (
  baseUrl: string,
  baseConfig?: AxiosRequestConfig,
) => {
  return async <ResponseType>(path: string, config?: AxiosRequestConfig) => {
    const urlConfig: AxiosRequestConfig = { url: `${baseUrl}${path}` };
    const mergedConfig = merge(urlConfig, DEFAULT_CONFIG, baseConfig, config);

    const result = await axios(mergedConfig);

    return result.data as ResponseType;
  };
};
