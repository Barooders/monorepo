import { graphql } from '@/__generated/gql/registered_user';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useUser from './state/useUser';
import { useAuth } from './useAuth';
import { useHasura } from './useHasura';

const LIGHT_SIGNUP_CUSTOMER_MUTATION = /* GraphQL */ /* gql_registered_user */ `
  mutation updateCustomerInfo(
    $userId: uuid!
    $lastName: String!
    $firstName: String!
    $sellerName: String!
    $phoneNumber: String!
  ) {
    update_Customer_by_pk(
      pk_columns: { authUserId: $userId }
      _set: {
        firstName: $firstName
        lastName: $lastName
        sellerName: $sellerName
      }
    ) {
      authUserId
    }
    updateUser(
      _set: { phoneNumber: $phoneNumber }
      pk_columns: { id: $userId }
    ) {
      id
    }
  }
`;

const LIGHT_SIGNUP_AUTH_MUTATION = /* GraphQL */ /* gql_registered_user */ `
  mutation updateDisplayName($userId: uuid, $displayName: String!) {
    updateUsers(
      where: { id: { _eq: $userId } }
      _set: { displayName: $displayName }
    ) {
      affected_rows
    }
  }
`;

const useLightSignup = () => {
  const { loginWithToken } = useAuth();
  const { hasuraToken } = useUser.getState();
  const updateCustomer = useHasura(graphql(LIGHT_SIGNUP_CUSTOMER_MUTATION));
  const updateAuthUser = useHasura(graphql(LIGHT_SIGNUP_AUTH_MUTATION));

  return useWrappedAsyncFn(
    async (variables: {
      userId: string;
      firstName: string;
      lastName: string;
      sellerName: string;
      phoneNumber: string;
    }): Promise<boolean> => {
      await Promise.all([
        updateCustomer(variables),
        updateAuthUser({
          userId: variables.userId,
          displayName: variables.sellerName,
        }),
      ]);
      if (hasuraToken) {
        await loginWithToken(hasuraToken?.refreshToken);
      }
      return true;
    },
  );
};

export default useLightSignup;
