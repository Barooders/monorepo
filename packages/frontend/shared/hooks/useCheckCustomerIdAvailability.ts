import { graphql } from '@/__generated/gql/registered_user';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { useHasura } from './useHasura';

const EXISTING_CUSTOMER_QUERY = /* GraphQL */ /* gql_registered_user */ `
  query checkExistingCustomer($customerId: String) {
    Customer(where: { sellerName: { _eq: $customerId } }) {
      authUserId
    }
  }
`;

export const FORBIDDEN_SELLERNAME_REGEX =
  /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]|\s$/;

export const useCheckCustomerIdAvailability = () => {
  const checkCustomerIdAvailability = useHasura(
    graphql(EXISTING_CUSTOMER_QUERY),
  );
  const dictionnary = getDictionary('fr');

  return useWrappedAsyncFn(async (customerId: string): Promise<boolean> => {
    if (FORBIDDEN_SELLERNAME_REGEX.test(customerId)) {
      throw new Error(
        dictionnary.components.sellerNameInput.errors.forbiddenCharacters,
      );
    }

    const data = await checkCustomerIdAvailability({ customerId });
    if (data.Customer.length > 0) {
      throw new Error(
        dictionnary.components.sellerNameInput.errors.idAlreadExists,
      );
    }
    return true;
  });
};
