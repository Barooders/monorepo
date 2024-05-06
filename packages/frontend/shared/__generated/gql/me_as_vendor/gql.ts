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
    "\n  query fetchNegociationAgreement($vendorId: uuid) {\n    NegociationAgreement(where: { vendorId: { _eq: $vendorId } }) {\n      id\n      maxAmountPercent\n    }\n    Customer(where: { authUserId: { _eq: $vendorId } }) {\n      user {\n        phoneNumber\n      }\n    }\n  }\n": types.FetchNegociationAgreementDocument,
    "\n  query fetchOnlineProducts {\n    Customer(limit: 1) {\n      onlineProducts(\n        order_by: { createdAt: desc }\n        where: {\n          variants: { quantity: { _gte: 1 } }\n          status: { _neq: \"ARCHIVED\" }\n          salesChannels: { salesChannelName: { _eq: \"PUBLIC\" } }\n        }\n      ) {\n        status\n        shopifyId\n        storeProduct: storeExposedProduct {\n          handle\n          productType\n          numberOfViews\n          size\n          product {\n            variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {\n              variant {\n                condition\n              }\n              b2cVariant {\n                price\n              }\n            }\n          }\n          gender\n          modelYear\n          brand\n          firstImage\n        }\n      }\n    }\n  }\n": types.FetchOnlineProductsDocument,
    "\n  query fetchSoldOrderLines {\n    Customer(limit: 1) {\n      vendorSoldOrderLines(\n        order_by: { createdAt: desc }\n        where: { order: { status: { _neq: \"CREATED\" } } }\n      ) {\n        priceInCents\n        order {\n          id\n          status\n          name\n          createdAt\n        }\n        brand: productBrand\n        productType\n        handle: productHandle\n        size: productSize\n        condition: variantCondition\n        gender: productGender\n        modelYear: productModelYear\n        productImage\n      }\n    }\n  }\n": types.FetchSoldOrderLinesDocument,
    "\n  query fetchAccountPageVendorData($maxItems: Int) {\n    Customer(limit: 1) {\n      onlineProducts(\n        limit: $maxItems\n        order_by: { createdAt: desc }\n        where: {\n          variants: { quantity: { _gte: 1 } }\n          status: { _neq: \"ARCHIVED\" }\n          salesChannels: { salesChannelName: { _eq: \"PUBLIC\" } }\n        }\n      ) {\n        storeProduct: storeExposedProduct {\n          firstImage\n          handle\n          productType\n          size\n          gender\n          modelYear\n          brand\n          product {\n            variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {\n              variant {\n                condition\n              }\n              b2cVariant {\n                price\n              }\n            }\n          }\n        }\n      }\n      vendorSoldOrderLines(\n        order_by: { createdAt: desc }\n        where: { order: { status: { _neq: \"CREATED\" } } }\n        limit: $maxItems\n      ) {\n        priceInCents\n        name\n        order {\n          id\n          status\n          name\n        }\n        productBrand\n        productImage\n      }\n    }\n  }\n": types.FetchAccountPageVendorDataDocument,
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
export function graphql(source: "\n  query fetchNegociationAgreement($vendorId: uuid) {\n    NegociationAgreement(where: { vendorId: { _eq: $vendorId } }) {\n      id\n      maxAmountPercent\n    }\n    Customer(where: { authUserId: { _eq: $vendorId } }) {\n      user {\n        phoneNumber\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchNegociationAgreement($vendorId: uuid) {\n    NegociationAgreement(where: { vendorId: { _eq: $vendorId } }) {\n      id\n      maxAmountPercent\n    }\n    Customer(where: { authUserId: { _eq: $vendorId } }) {\n      user {\n        phoneNumber\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchOnlineProducts {\n    Customer(limit: 1) {\n      onlineProducts(\n        order_by: { createdAt: desc }\n        where: {\n          variants: { quantity: { _gte: 1 } }\n          status: { _neq: \"ARCHIVED\" }\n          salesChannels: { salesChannelName: { _eq: \"PUBLIC\" } }\n        }\n      ) {\n        status\n        shopifyId\n        storeProduct: storeExposedProduct {\n          handle\n          productType\n          numberOfViews\n          size\n          product {\n            variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {\n              variant {\n                condition\n              }\n              b2cVariant {\n                price\n              }\n            }\n          }\n          gender\n          modelYear\n          brand\n          firstImage\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchOnlineProducts {\n    Customer(limit: 1) {\n      onlineProducts(\n        order_by: { createdAt: desc }\n        where: {\n          variants: { quantity: { _gte: 1 } }\n          status: { _neq: \"ARCHIVED\" }\n          salesChannels: { salesChannelName: { _eq: \"PUBLIC\" } }\n        }\n      ) {\n        status\n        shopifyId\n        storeProduct: storeExposedProduct {\n          handle\n          productType\n          numberOfViews\n          size\n          product {\n            variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {\n              variant {\n                condition\n              }\n              b2cVariant {\n                price\n              }\n            }\n          }\n          gender\n          modelYear\n          brand\n          firstImage\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchSoldOrderLines {\n    Customer(limit: 1) {\n      vendorSoldOrderLines(\n        order_by: { createdAt: desc }\n        where: { order: { status: { _neq: \"CREATED\" } } }\n      ) {\n        priceInCents\n        order {\n          id\n          status\n          name\n          createdAt\n        }\n        brand: productBrand\n        productType\n        handle: productHandle\n        size: productSize\n        condition: variantCondition\n        gender: productGender\n        modelYear: productModelYear\n        productImage\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchSoldOrderLines {\n    Customer(limit: 1) {\n      vendorSoldOrderLines(\n        order_by: { createdAt: desc }\n        where: { order: { status: { _neq: \"CREATED\" } } }\n      ) {\n        priceInCents\n        order {\n          id\n          status\n          name\n          createdAt\n        }\n        brand: productBrand\n        productType\n        handle: productHandle\n        size: productSize\n        condition: variantCondition\n        gender: productGender\n        modelYear: productModelYear\n        productImage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchAccountPageVendorData($maxItems: Int) {\n    Customer(limit: 1) {\n      onlineProducts(\n        limit: $maxItems\n        order_by: { createdAt: desc }\n        where: {\n          variants: { quantity: { _gte: 1 } }\n          status: { _neq: \"ARCHIVED\" }\n          salesChannels: { salesChannelName: { _eq: \"PUBLIC\" } }\n        }\n      ) {\n        storeProduct: storeExposedProduct {\n          firstImage\n          handle\n          productType\n          size\n          gender\n          modelYear\n          brand\n          product {\n            variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {\n              variant {\n                condition\n              }\n              b2cVariant {\n                price\n              }\n            }\n          }\n        }\n      }\n      vendorSoldOrderLines(\n        order_by: { createdAt: desc }\n        where: { order: { status: { _neq: \"CREATED\" } } }\n        limit: $maxItems\n      ) {\n        priceInCents\n        name\n        order {\n          id\n          status\n          name\n        }\n        productBrand\n        productImage\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchAccountPageVendorData($maxItems: Int) {\n    Customer(limit: 1) {\n      onlineProducts(\n        limit: $maxItems\n        order_by: { createdAt: desc }\n        where: {\n          variants: { quantity: { _gte: 1 } }\n          status: { _neq: \"ARCHIVED\" }\n          salesChannels: { salesChannelName: { _eq: \"PUBLIC\" } }\n        }\n      ) {\n        storeProduct: storeExposedProduct {\n          firstImage\n          handle\n          productType\n          size\n          gender\n          modelYear\n          brand\n          product {\n            variants(order_by: { b2cVariant: { price: asc } }, limit: 1) {\n              variant {\n                condition\n              }\n              b2cVariant {\n                price\n              }\n            }\n          }\n        }\n      }\n      vendorSoldOrderLines(\n        order_by: { createdAt: desc }\n        where: { order: { status: { _neq: \"CREATED\" } } }\n        limit: $maxItems\n      ) {\n        priceInCents\n        name\n        order {\n          id\n          status\n          name\n        }\n        productBrand\n        productImage\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;