import { jsonStringify } from '@libs/helpers/json';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { merge } from 'shared-types';

export class BackendFailureException extends Error {
  readonly path: string;
  readonly name: string;
  readonly statusCode: number;

  constructor(path: string, name: string, message: string, statusCode: number) {
    super(
      `Error calling backend (path: ${path}) because: [${jsonStringify(
        name,
      )}] ${message}`,
    );
    this.path = path;
    this.name = name;
    this.statusCode = statusCode;
  }
}

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
