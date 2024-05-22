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
    "\n  query fetchProductNotation($productInternalId: String!) {\n    Product(where: { id: { _eq: $productInternalId } }) {\n      manualNotation\n      source\n      sourceUrl\n    }\n    dbt_store_product_for_analytics(\n      where: { id: { _eq: $productInternalId } }\n    ) {\n      created_at\n      vendor_notation\n      calculated_notation\n      calculated_notation_beta\n      orders_count\n      favorites_count\n    }\n  }\n": types.FetchProductNotationDocument,
    "\n  query fetchProductHitData($productInternalId: String) {\n    Product(where: { id: { _eq: $productInternalId } }) {\n      manualNotation\n    }\n    dbt_store_product_for_analytics(\n      where: { id: { _eq: $productInternalId } }\n    ) {\n      notation\n      calculated_notation\n      created_at\n      calculated_scoring\n    }\n  }\n": types.FetchProductHitDataDocument,
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
export function graphql(source: "\n  query fetchProductNotation($productInternalId: String!) {\n    Product(where: { id: { _eq: $productInternalId } }) {\n      manualNotation\n      source\n      sourceUrl\n    }\n    dbt_store_product_for_analytics(\n      where: { id: { _eq: $productInternalId } }\n    ) {\n      created_at\n      vendor_notation\n      calculated_notation\n      calculated_notation_beta\n      orders_count\n      favorites_count\n    }\n  }\n"): (typeof documents)["\n  query fetchProductNotation($productInternalId: String!) {\n    Product(where: { id: { _eq: $productInternalId } }) {\n      manualNotation\n      source\n      sourceUrl\n    }\n    dbt_store_product_for_analytics(\n      where: { id: { _eq: $productInternalId } }\n    ) {\n      created_at\n      vendor_notation\n      calculated_notation\n      calculated_notation_beta\n      orders_count\n      favorites_count\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchProductHitData($productInternalId: String) {\n    Product(where: { id: { _eq: $productInternalId } }) {\n      manualNotation\n    }\n    dbt_store_product_for_analytics(\n      where: { id: { _eq: $productInternalId } }\n    ) {\n      notation\n      calculated_notation\n      created_at\n      calculated_scoring\n    }\n  }\n"): (typeof documents)["\n  query fetchProductHitData($productInternalId: String) {\n    Product(where: { id: { _eq: $productInternalId } }) {\n      manualNotation\n    }\n    dbt_store_product_for_analytics(\n      where: { id: { _eq: $productInternalId } }\n    ) {\n      notation\n      calculated_notation\n      created_at\n      calculated_scoring\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;