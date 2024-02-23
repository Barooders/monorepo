import { fetchHasura } from '@/clients/hasura';
import { HASURA_ROLES } from '@/config';
import { DocumentNode } from 'graphql';
import { useHasuraToken } from './useHasuraToken';

export const useHasura = <
  ResponseType,
  VariablesType = Record<string, unknown>,
>(
  query: DocumentNode,
  role?: HASURA_ROLES,
): ((variables?: VariablesType) => Promise<ResponseType>) => {
  const { getUpToDateHasuraToken } = useHasuraToken();

  return async (variables) => {
    const hasuraToken = await getUpToDateHasuraToken();

    const headers = new Headers();
    if (hasuraToken) {
      headers.append('Authorization', `Bearer ${hasuraToken.accessToken}`);
      headers.append('X-Hasura-role', role ?? HASURA_ROLES.REGISTERED_USER);
    }

    return await fetchHasura<ResponseType, VariablesType>(query, {
      variables: variables,
      headers,
    });
  };
};
