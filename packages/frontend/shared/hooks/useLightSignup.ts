import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { gql } from '@apollo/client';
import useUser from './state/useUser';
import { useAuth } from './useAuth';
import { useHasura } from './useHasura';

const LIGHT_SIGNUP_CUSTOMER_MUTATION = gql`
  mutation updateCustomerInfo(
    $userId: uuid
    $lastName: String!
    $firstName: String!
    $sellerName: String!
    $phoneNumber: String!
  ) {
    update_Customer(
      where: { authUserId: { _eq: $userId } }
      _set: {
        firstName: $firstName
        lastName: $lastName
        sellerName: $sellerName
        phoneNumber: $phoneNumber
      }
    ) {
      affected_rows
    }
  }
`;

const LIGHT_SIGNUP_AUTH_MUTATION = gql`
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
  const updateCustomer = useHasura<{
    update_Customer_by_pk: {
      affected_rows: number;
    };
  }>(LIGHT_SIGNUP_CUSTOMER_MUTATION);
  const updateAuthUser = useHasura<{
    updateUsers: {
      affected_rows: number;
    };
  }>(LIGHT_SIGNUP_AUTH_MUTATION);

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
