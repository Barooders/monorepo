import { fetchStorefront } from '@/clients/storefront';
import { gql } from '@apollo/client'; // eslint-disable-line no-restricted-imports
import { DocumentNode } from 'graphql';

const useStorefront = <ResponseType, VariablesType = Record<string, unknown>>(
  query: DocumentNode,
): ((variables?: VariablesType) => Promise<ResponseType>) => {
  return async (variables) => {
    const headers = new Headers();
    headers.append(
      'X-Shopify-Storefront-Access-Token',
      process.env.NEXT_PUBLIC_STOREFRONT_PUBLIC_TOKEN,
    );

    return await fetchStorefront<ResponseType, VariablesType>(query, {
      variables: variables,
      headers,
    });
  };
};

export const CREATE_CHECKOUT = gql`
  mutation createCheckout($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        message
      }
    }
  }
`;

export const ASSOCIATE_CHECKOUT = gql`
  mutation checkoutCustomerAssociateV2(
    $checkoutId: ID!
    $customerAccessToken: String!
  ) {
    checkoutCustomerAssociateV2(
      checkoutId: $checkoutId
      customerAccessToken: $customerAccessToken
    ) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        message
      }
    }
  }
`;

export const GET_STOREFRONT_TOKEN_FROM_MULTIPASS = gql`
  mutation customerAccessTokenCreateWithMultipass($multipassToken: String!) {
    customerAccessTokenCreateWithMultipass(multipassToken: $multipassToken) {
      customerAccessToken {
        accessToken
      }
    }
  }
`;

export default useStorefront;
