import { TypedDocumentNode } from '@apollo/client';
import { getOperationName } from '@apollo/client/utilities';
import * as Sentry from '@sentry/nextjs';
import { print } from 'graphql';
import uniqBy from 'lodash/uniqBy';

export const createGraphQLClient =
  (baseUrl: string, defaultHeaders?: Headers) =>
  async <TResult, TVariables>(
    query: TypedDocumentNode<TResult, TVariables>,
    { variables, headers }: { variables?: TVariables; headers?: Headers },
  ): Promise<TResult> => {
    const transaction = Sentry.getCurrentHub().getScope().getTransaction();
    let span;
    if (transaction) {
      span = transaction.startChild({
        op: 'graphql.query',
        description: getOperationName(query) ?? 'Anonymous query',
      });
    }

    const headerEntries = uniqBy(
      [
        ...(headers ? headers.entries() : []),
        ...(defaultHeaders ? defaultHeaders.entries() : []),
        ['Content-Type', 'application/json'],
      ],
      (entry: [string, string]) => entry[0],
    );

    const promise = fetch(baseUrl, {
      method: 'POST',
      headers: new Headers(headerEntries),
      body: JSON.stringify({ query: print(query), variables }),
      cache: 'no-store',
    });

    const result = await promise;

    const { data, errors } = await result.json();

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (errors) {
      if (span) {
        span.setStatus('unknown_error');
        span.finish();
      }

      throw errors;
    }

    if (span) {
      span.setStatus('ok');
      span.finish();
    }

    return data;
  };
