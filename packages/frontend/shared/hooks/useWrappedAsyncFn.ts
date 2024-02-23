import * as Sentry from '@sentry/nextjs';
import { DependencyList } from 'react';
import { useAsyncFn } from 'react-use';
import { FunctionReturningPromise } from 'react-use/lib/misc/types';
import { AsyncFnReturn } from 'react-use/lib/useAsyncFn';

type Options = {
  ignoreErrors?: boolean;
};

const useWrappedAsyncFn = <T extends FunctionReturningPromise>(
  fn: T,
  deps?: DependencyList,
  options?: Options,
): AsyncFnReturn<T> => {
  const reactUseAsyncReturn = useAsyncFn(fn, deps);

  const [{ error }] = reactUseAsyncReturn;

  if (error && !options?.ignoreErrors) {
    console.error(error);
    Sentry.captureException(error);
  }

  return reactUseAsyncReturn;
};

export default useWrappedAsyncFn;
