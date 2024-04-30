import { fetchHasura } from '@/clients/hasura';
import { TypedDocumentNode } from '@apollo/client';
import { HASURA_ROLES } from 'shared-types';
import { useHasuraToken } from './useHasuraToken';

export const useHasura = <ResponseType, VariablesType>(
  query: TypedDocumentNode<ResponseType, VariablesType>,
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

    return await fetchHasura(query, {
      variables: variables,
      headers,
    });
  };
};
