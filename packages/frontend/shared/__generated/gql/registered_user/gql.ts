/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  subscription subscribeToOpenedPriceOffer(\n    $productInternalId: String\n    $buyerInternalId: uuid\n  ) {\n    PriceOffer(\n      where: {\n        _and: {\n          product: { id: { _eq: $productInternalId } }\n          buyer: { authUserId: { _eq: $buyerInternalId } }\n          _or: [\n            { status: { _eq: \"PROPOSED\" } }\n            { status: { _eq: \"ACCEPTED\" } }\n          ]\n        }\n      }\n    ) {\n      newPriceInCents\n      id\n      initiatedBy\n      status\n      discountCode\n      product {\n        shopifyId\n      }\n    }\n  }\n": types.SubscribeToOpenedPriceOfferDocument,
    "\n  fragment HandDeliveryOrderLineFragment on OrderLines {\n    order {\n      shopifyId\n    }\n    shippingSolution\n    productVariant {\n      product {\n        id\n      }\n    }\n  }\n": types.HandDeliveryOrderLineFragmentFragmentDoc,
    "\n  query fetchConversationUserDetails($userInternalId: uuid) {\n    Customer(where: { authUserId: { _eq: $userInternalId } }) {\n      purchasedOrders {\n        orderLines {\n          ...HandDeliveryOrderLineFragment\n        }\n      }\n      vendorSoldOrderLines {\n        ...HandDeliveryOrderLineFragment\n      }\n      onlineProducts {\n        id\n      }\n    }\n  }\n": types.FetchConversationUserDetailsDocument,
    "\n  query fetchConversationProductDetails($productInternalId: String) {\n    Product(where: { id: { _eq: $productInternalId } }) {\n      id\n      handle\n      variants {\n        storeB2CVariant {\n          price\n        }\n      }\n      vendorId\n      Vendor {\n        negociationAgreements {\n          maxAmountPercent\n          priority\n          productType\n        }\n      }\n    }\n  }\n": types.FetchConversationProductDetailsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription subscribeToOpenedPriceOffer(\n    $productInternalId: String\n    $buyerInternalId: uuid\n  ) {\n    PriceOffer(\n      where: {\n        _and: {\n          product: { id: { _eq: $productInternalId } }\n          buyer: { authUserId: { _eq: $buyerInternalId } }\n          _or: [\n            { status: { _eq: \"PROPOSED\" } }\n            { status: { _eq: \"ACCEPTED\" } }\n          ]\n        }\n      }\n    ) {\n      newPriceInCents\n      id\n      initiatedBy\n      status\n      discountCode\n      product {\n        shopifyId\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription subscribeToOpenedPriceOffer(\n    $productInternalId: String\n    $buyerInternalId: uuid\n  ) {\n    PriceOffer(\n      where: {\n        _and: {\n          product: { id: { _eq: $productInternalId } }\n          buyer: { authUserId: { _eq: $buyerInternalId } }\n          _or: [\n            { status: { _eq: \"PROPOSED\" } }\n            { status: { _eq: \"ACCEPTED\" } }\n          ]\n        }\n      }\n    ) {\n      newPriceInCents\n      id\n      initiatedBy\n      status\n      discountCode\n      product {\n        shopifyId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HandDeliveryOrderLineFragment on OrderLines {\n    order {\n      shopifyId\n    }\n    shippingSolution\n    productVariant {\n      product {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment HandDeliveryOrderLineFragment on OrderLines {\n    order {\n      shopifyId\n    }\n    shippingSolution\n    productVariant {\n      product {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchConversationUserDetails($userInternalId: uuid) {\n    Customer(where: { authUserId: { _eq: $userInternalId } }) {\n      purchasedOrders {\n        orderLines {\n          ...HandDeliveryOrderLineFragment\n        }\n      }\n      vendorSoldOrderLines {\n        ...HandDeliveryOrderLineFragment\n      }\n      onlineProducts {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchConversationUserDetails($userInternalId: uuid) {\n    Customer(where: { authUserId: { _eq: $userInternalId } }) {\n      purchasedOrders {\n        orderLines {\n          ...HandDeliveryOrderLineFragment\n        }\n      }\n      vendorSoldOrderLines {\n        ...HandDeliveryOrderLineFragment\n      }\n      onlineProducts {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchConversationProductDetails($productInternalId: String) {\n    Product(where: { id: { _eq: $productInternalId } }) {\n      id\n      handle\n      variants {\n        storeB2CVariant {\n          price\n        }\n      }\n      vendorId\n      Vendor {\n        negociationAgreements {\n          maxAmountPercent\n          priority\n          productType\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchConversationProductDetails($productInternalId: String) {\n    Product(where: { id: { _eq: $productInternalId } }) {\n      id\n      handle\n      variants {\n        storeB2CVariant {\n          price\n        }\n      }\n      vendorId\n      Vendor {\n        negociationAgreements {\n          maxAmountPercent\n          priority\n          productType\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;