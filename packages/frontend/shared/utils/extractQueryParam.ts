import isArray from 'lodash/isArray';

export const extractQueryParam = (
  queryParam: string | string[] | undefined,
): string =>
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  queryParam ? (isArray(queryParam) ? queryParam[0] : queryParam) : '';
