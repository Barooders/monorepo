import { gql } from '@apollo/client'; // eslint-disable-line no-restricted-imports
import * as AdminTypes from './graphql.admin';
import * as B2BUserTypes from './graphql.b2b_user';
import * as MeAsCustomerTypes from './graphql.me_as_customer';
import * as MeAsVendorTypes from './graphql.me_as_vendor';
import * as PublicTypes from './graphql.public';
import * as RegisteredUserTypes from './graphql.registered_user';

export type {
  AdminTypes,
  B2BUserTypes,
  MeAsCustomerTypes,
  MeAsVendorTypes,
  PublicTypes,
  RegisteredUserTypes,
};

export const gql_admin = gql;
export const gql_public = gql;
export const gql_registered_user = gql;
export const gql_me_as_customer = gql;
export const gql_me_as_vendor = gql;
export const gql_b2b_user = gql;
