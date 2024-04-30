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
  '\n  query fetchPurchases {\n    Customer(limit: 1) {\n      purchasedOrders(order_by: { createdAt: desc }) {\n        id\n        name\n        status\n        createdAt\n        totalPriceInCents\n        orderLines {\n          brand: productBrand\n          productType\n          handle: productHandle\n          size: productSize\n          condition: variantCondition\n          gender: productGender\n          modelYear: productModelYear\n          name\n          productImage\n        }\n      }\n    }\n  }\n':
    types.FetchPurchasesDocument,
  '\n  query fetchAccountPageCustomerData($maxItems: Int) {\n    Customer(limit: 1) {\n      lastName\n      firstName\n      sellerName\n      isPro\n      profilePictureShopifyCdnUrl\n      createdAt\n      favorites(\n        limit: $maxItems\n        order_by: { createdAt: desc }\n        where: {\n          product: {\n            status: { _eq: "ACTIVE" }\n            variants: { quantity: { _gte: 1 } }\n          }\n        }\n      ) {\n        product {\n          storeProduct: storeExposedProduct {\n            firstImage\n            handle\n            productType\n            size\n            gender\n            modelYear\n            brand\n            product {\n              variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {\n                variant {\n                  condition\n                }\n                b2cVariant {\n                  price\n                }\n              }\n            }\n          }\n        }\n      }\n      purchasedOrders(limit: $maxItems, order_by: { createdAt: desc }) {\n        id\n        totalPriceInCents\n        name\n        status\n        orderLines {\n          name\n          productBrand\n          productImage\n        }\n      }\n    }\n  }\n':
    types.FetchAccountPageCustomerDataDocument,
  '\n  query fetchCustomer {\n    Customer {\n      chatId\n      sellerName\n    }\n  }\n':
    types.FetchCustomerDocument,
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
export function graphql(
  source: '\n  query fetchPurchases {\n    Customer(limit: 1) {\n      purchasedOrders(order_by: { createdAt: desc }) {\n        id\n        name\n        status\n        createdAt\n        totalPriceInCents\n        orderLines {\n          brand: productBrand\n          productType\n          handle: productHandle\n          size: productSize\n          condition: variantCondition\n          gender: productGender\n          modelYear: productModelYear\n          name\n          productImage\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query fetchPurchases {\n    Customer(limit: 1) {\n      purchasedOrders(order_by: { createdAt: desc }) {\n        id\n        name\n        status\n        createdAt\n        totalPriceInCents\n        orderLines {\n          brand: productBrand\n          productType\n          handle: productHandle\n          size: productSize\n          condition: variantCondition\n          gender: productGender\n          modelYear: productModelYear\n          name\n          productImage\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query fetchAccountPageCustomerData($maxItems: Int) {\n    Customer(limit: 1) {\n      lastName\n      firstName\n      sellerName\n      isPro\n      profilePictureShopifyCdnUrl\n      createdAt\n      favorites(\n        limit: $maxItems\n        order_by: { createdAt: desc }\n        where: {\n          product: {\n            status: { _eq: "ACTIVE" }\n            variants: { quantity: { _gte: 1 } }\n          }\n        }\n      ) {\n        product {\n          storeProduct: storeExposedProduct {\n            firstImage\n            handle\n            productType\n            size\n            gender\n            modelYear\n            brand\n            product {\n              variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {\n                variant {\n                  condition\n                }\n                b2cVariant {\n                  price\n                }\n              }\n            }\n          }\n        }\n      }\n      purchasedOrders(limit: $maxItems, order_by: { createdAt: desc }) {\n        id\n        totalPriceInCents\n        name\n        status\n        orderLines {\n          name\n          productBrand\n          productImage\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query fetchAccountPageCustomerData($maxItems: Int) {\n    Customer(limit: 1) {\n      lastName\n      firstName\n      sellerName\n      isPro\n      profilePictureShopifyCdnUrl\n      createdAt\n      favorites(\n        limit: $maxItems\n        order_by: { createdAt: desc }\n        where: {\n          product: {\n            status: { _eq: "ACTIVE" }\n            variants: { quantity: { _gte: 1 } }\n          }\n        }\n      ) {\n        product {\n          storeProduct: storeExposedProduct {\n            firstImage\n            handle\n            productType\n            size\n            gender\n            modelYear\n            brand\n            product {\n              variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {\n                variant {\n                  condition\n                }\n                b2cVariant {\n                  price\n                }\n              }\n            }\n          }\n        }\n      }\n      purchasedOrders(limit: $maxItems, order_by: { createdAt: desc }) {\n        id\n        totalPriceInCents\n        name\n        status\n        orderLines {\n          name\n          productBrand\n          productImage\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query fetchCustomer {\n    Customer {\n      chatId\n      sellerName\n    }\n  }\n',
): (typeof documents)['\n  query fetchCustomer {\n    Customer {\n      chatId\n      sellerName\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
