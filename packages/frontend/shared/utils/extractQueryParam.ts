import isArray from 'lodash/isArray';

export const extractQueryParam = (
  queryParam: string | string[] | undefined,
): string =>
  queryParam ? (isArray(queryParam) ? queryParam[0] : queryParam) : '';
