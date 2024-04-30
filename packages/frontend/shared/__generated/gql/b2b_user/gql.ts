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
    "\n  query fetchProductForNewOffer($productId: String!) {\n    dbt_store_base_product(where: { id: { _eq: $productId } }) {\n      variants {\n        variant {\n          inventory_quantity\n          title\n        }\n        b2bVariant {\n          price\n        }\n      }\n      bundlePrices {\n        unit_price_in_cents\n        min_quantity\n      }\n      exposedProduct: product {\n        title\n        total_quantity\n      }\n    }\n  }\n": types.FetchProductForNewOfferDocument,
    "\n  query fetchB2BProduct($productInternalId: String) {\n    dbt_store_base_product(where: { id: { _eq: $productInternalId } }) {\n      id\n      shopifyId\n      exposedProduct: product {\n        model\n        description\n        numberOfViews\n        brand\n        handle\n        id\n        productType\n        title\n      }\n      b2bProduct {\n        largest_bundle_price_in_cents\n      }\n      images(limit: 10) {\n        src\n      }\n      variants(limit: 10) {\n        exposedVariant: variant {\n          title\n          condition\n          inventory_quantity\n        }\n        b2bVariant {\n          price\n          compare_at_price\n        }\n      }\n      tags {\n        tag\n        value\n      }\n      vendorId\n    }\n  }\n": types.FetchB2BProductDocument,
    "\n  query fetchPriceOffers {\n    PriceOffer(order_by: { createdAt: desc }) {\n      id\n      buyerId\n      includedBuyerCommissionPercentage\n      createdAt\n      publicNote\n      quantity\n      status\n      product {\n        storeExposedProduct {\n          brand\n          productType\n          size\n          firstImage\n        }\n      }\n      newPriceInCents\n      productId\n    }\n  }\n": types.FetchPriceOffersDocument,
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
export function graphql(source: "\n  query fetchProductForNewOffer($productId: String!) {\n    dbt_store_base_product(where: { id: { _eq: $productId } }) {\n      variants {\n        variant {\n          inventory_quantity\n          title\n        }\n        b2bVariant {\n          price\n        }\n      }\n      bundlePrices {\n        unit_price_in_cents\n        min_quantity\n      }\n      exposedProduct: product {\n        title\n        total_quantity\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchProductForNewOffer($productId: String!) {\n    dbt_store_base_product(where: { id: { _eq: $productId } }) {\n      variants {\n        variant {\n          inventory_quantity\n          title\n        }\n        b2bVariant {\n          price\n        }\n      }\n      bundlePrices {\n        unit_price_in_cents\n        min_quantity\n      }\n      exposedProduct: product {\n        title\n        total_quantity\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchB2BProduct($productInternalId: String) {\n    dbt_store_base_product(where: { id: { _eq: $productInternalId } }) {\n      id\n      shopifyId\n      exposedProduct: product {\n        model\n        description\n        numberOfViews\n        brand\n        handle\n        id\n        productType\n        title\n      }\n      b2bProduct {\n        largest_bundle_price_in_cents\n      }\n      images(limit: 10) {\n        src\n      }\n      variants(limit: 10) {\n        exposedVariant: variant {\n          title\n          condition\n          inventory_quantity\n        }\n        b2bVariant {\n          price\n          compare_at_price\n        }\n      }\n      tags {\n        tag\n        value\n      }\n      vendorId\n    }\n  }\n"): (typeof documents)["\n  query fetchB2BProduct($productInternalId: String) {\n    dbt_store_base_product(where: { id: { _eq: $productInternalId } }) {\n      id\n      shopifyId\n      exposedProduct: product {\n        model\n        description\n        numberOfViews\n        brand\n        handle\n        id\n        productType\n        title\n      }\n      b2bProduct {\n        largest_bundle_price_in_cents\n      }\n      images(limit: 10) {\n        src\n      }\n      variants(limit: 10) {\n        exposedVariant: variant {\n          title\n          condition\n          inventory_quantity\n        }\n        b2bVariant {\n          price\n          compare_at_price\n        }\n      }\n      tags {\n        tag\n        value\n      }\n      vendorId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchPriceOffers {\n    PriceOffer(order_by: { createdAt: desc }) {\n      id\n      buyerId\n      includedBuyerCommissionPercentage\n      createdAt\n      publicNote\n      quantity\n      status\n      product {\n        storeExposedProduct {\n          brand\n          productType\n          size\n          firstImage\n        }\n      }\n      newPriceInCents\n      productId\n    }\n  }\n"): (typeof documents)["\n  query fetchPriceOffers {\n    PriceOffer(order_by: { createdAt: desc }) {\n      id\n      buyerId\n      includedBuyerCommissionPercentage\n      createdAt\n      publicNote\n      quantity\n      status\n      product {\n        storeExposedProduct {\n          brand\n          productType\n          size\n          firstImage\n        }\n      }\n      newPriceInCents\n      productId\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;