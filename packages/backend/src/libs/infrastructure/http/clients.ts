import { jsonStringify } from '@libs/helpers/json';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
// eslint-disable-next-line no-restricted-imports
import { merge } from 'lodash';

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
  timeout: 3000,
};

export const createHttpClient = (
  baseUrl: string,
  baseConfig?: AxiosRequestConfig,
) => {
  return async <ResponseType>(path: string, config?: AxiosRequestConfig) => {
    const mergedConfig: AxiosRequestConfig = merge(
      { path: `${baseUrl}${path}` },
      DEFAULT_CONFIG,
      baseConfig,
      config,
    );

    const result = await axios(mergedConfig);

    return result.data as ResponseType;
  };
};
