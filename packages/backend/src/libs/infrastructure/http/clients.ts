import { jsonStringify } from '@libs/helpers/json';
import { merge } from 'lodash';

export class BackendFailureException extends Error {
  readonly path: string;
  readonly name: string;
  readonly statusCode: number;

  constructor(path: string, name: string, message: string, statusCode: number) {
    super(
      `Error calling backend (path: ${path}) because: [${jsonStringify(name)}] ${message}`,
    );
    this.path = path;
    this.name = name;
    this.statusCode = statusCode;
  }
}

export type FetchConfigType = RequestInit & {
  responseParsing?: 'text' | 'json' | 'buffer';
};

export const createHttpClient = (
  baseUrl: string,
  baseConfig?: FetchConfigType,
) => {
  return async <ResponseType>(path: string, config?: FetchConfigType) => {
    const mergedConfig = merge(baseConfig, config);
    let payload = null;
    let result: Response | null = null;

    try {
      result = await fetch(
        `${baseUrl}${path}`,
        merge(
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
          mergedConfig,
        ),
      );

      payload = await (mergedConfig?.responseParsing === 'text'
        ? result.text()
        : mergedConfig?.responseParsing === 'buffer'
          ? result.arrayBuffer()
          : result.json());
    } catch (e) {
      payload = null;
    }

    if (!result?.ok || payload?.statusCode >= 400)
      throw new BackendFailureException(
        path,
        payload?.code ?? payload?.error ?? 'UNKONWN',
        payload?.message ?? 'Some Error occured',
        payload?.statusCode ?? result?.status ?? 400,
      );

    return payload as ResponseType;
  };
};
