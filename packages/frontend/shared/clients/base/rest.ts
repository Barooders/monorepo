import { BackendFailureException } from '@/exception/backend-failure.exception';

export type FetchConfigType = RequestInit & {
  responseParsing?: 'text' | 'json' | 'buffer';
};

export const createRestClient = (baseUrl: string) => {
  return async <PayloadType>(path: string, config?: FetchConfigType) => {
    const result = await fetch(`${baseUrl}${path}`, {
      cache: 'no-store',
      ...config,
    });

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

    // ! On backend side, Next seems to transform status code from 404 to 200
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
