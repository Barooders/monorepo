import { merge } from 'lodash';

class BackendFailureException extends Error {
  readonly path: string;
  readonly name: string;
  readonly statusCode: number;

  constructor(path: string, name: string, message: string, statusCode: number) {
    super(
      `Error calling backend (path: ${path}) because: [${name}] ${message}`,
    );
    this.path = path;
    this.name = name;
    this.statusCode = statusCode;
  }
}

export type FetchConfigType = RequestInit & {
  responseParsing?: 'text' | 'json' | 'buffer';
};

export const createRestClient = (baseUrl: string) => {
  return async <PayloadType>(path: string, config?: FetchConfigType) => {
    const result = await fetch(
      `${baseUrl}${path}`,
      merge(
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
        config,
      ),
    );

    let payload = null;

    try {
      payload = await (config?.responseParsing === 'text'
        ? result.text()
        : config?.responseParsing === 'buffer'
        ? result.arrayBuffer()
        : result.json());
    } catch (e) {
      payload = null;
    }

    if (!result.ok || payload?.statusCode >= 400)
      throw new BackendFailureException(
        path,
        payload.code ?? payload.error ?? 'UNKONWN',
        payload.message ?? 'Some Error occured',
        payload?.statusCode ?? result.status ?? 400,
      );

    return payload as PayloadType;
  };
};
