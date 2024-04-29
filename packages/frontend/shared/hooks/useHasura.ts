/* eslint-disable no-restricted-imports */
import { fetchHasura } from '@/clients/hasura';
import { gql } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { HASURA_ROLES } from 'shared-types';
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

export const gql_admin = gql;
export const gql_public = gql;
export const gql_registered_user = gql;
export const gql_b2b_user = gql;
export const gql_me_as_customer = gql;
export const gql_me_as_vendor = gql;
