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
    "\n  query getAvailableDiscounts($discountTitles: [String!]) {\n    dbt_store_discount(where: { title: { _in: $discountTitles } }) {\n      collection {\n        collection_internal_id\n      }\n      ends_at\n      starts_at\n      id\n      value\n      value_type\n      code\n      title\n      min_amount\n    }\n  }\n": types.GetAvailableDiscountsDocument,
    "\n  query fetchVariant($internalId: String!) {\n    ProductVariant(where: { id: { _eq: $internalId } }) {\n      medusaId\n      shopifyId\n    }\n  }\n": types.FetchVariantDocument,
    "\n  fragment ProductCardFields on dbt_store_exposed_product {\n    product {\n      id\n      collections {\n        collection_id\n      }\n      merchantItemId: merchant_item_id\n      variants(limit: 30) {\n        id\n        exposedVariant: variant {\n          inventory_quantity\n          option1Name\n          option1\n          option2Name\n          option2\n          option3Name\n          option3\n          condition\n          isRefurbished\n        }\n        b2cVariant {\n          price\n          compare_at_price\n        }\n      }\n      tags {\n        tag\n        value\n      }\n      images(limit: 30, order_by: { position: asc }) {\n        alt\n        src\n        height\n        width\n      }\n    }\n    handle\n    vendor\n    title\n    description\n    productType\n    numberOfViews\n    status\n  }\n": types.ProductCardFieldsFragmentDoc,
    "\n  fragment VendorDetails on Customer {\n    isPro\n    sellerName\n    shipmentTimeframe\n    profilePictureShopifyCdnUrl\n    createdAt\n    authUserId\n    VendorReviews {\n      ...ReviewsFields\n    }\n    negociationAgreements {\n      maxAmountPercent\n    }\n  }\n": types.VendorDetailsFragmentDoc,
    "\n  query fetchProducts(\n    $productInternalIds: [String!]\n    $productHandles: [String!]\n  ) {\n    Product(\n      where: {\n        _or: [\n          { id: { _in: $productInternalIds } }\n          { handle: { _in: $productHandles } }\n        ]\n      }\n    ) {\n      storeExposedProduct {\n        ...ProductCardFields\n      }\n\n      Vendor {\n        ...VendorDetails\n      }\n    }\n  }\n": types.FetchProductsDocument,
    "\n  fragment ReviewsFields on VendorReview {\n    Review {\n      content\n      createdAt\n      id\n      rating\n      title\n      authorNickname\n      Customer {\n        createdAt\n        sellerName\n        profilePictureShopifyCdnUrl\n      }\n    }\n  }\n": types.ReviewsFieldsFragmentDoc,
    "\n  query fetchCollectionPageData(\n    $collectionHandle: String!\n    $vendorSellerName: String!\n  ) {\n    Collection(where: { handle: { _eq: $collectionHandle } }) {\n      id\n      handle\n      type\n      description\n      title\n      featuredImageSrc\n      seoTitle\n      seoDescription\n      parentCollection {\n        shortName\n        handle\n        id\n        title\n        childCollections {\n          handle\n          shortName\n          id\n          title\n        }\n        parentCollection {\n          shortName\n          handle\n          id\n          title\n          parentCollection {\n            shortName\n            handle\n            id\n            title\n          }\n        }\n      }\n      childCollections {\n        shortName\n        handle\n        title\n        featuredImageSrc\n      }\n    }\n    vendorData: Customer(\n      where: {\n        _and: [\n          { sellerName: { _eq: $vendorSellerName } }\n          { sellerName: { _neq: \"\" } }\n        ]\n      }\n    ) {\n      sellerName\n      coverPictureShopifyCdnUrl\n      description\n      profilePictureShopifyCdnUrl\n      VendorReviews {\n        ...ReviewsFields\n      }\n    }\n  }\n": types.FetchCollectionPageDataDocument,
    "\n  query fetchProductMetadata($productHandle: String) {\n    shopify {\n      product(handle: $productHandle) {\n        productType\n        featuredImage {\n          src\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n      }\n    }\n  }\n": types.FetchProductMetadataDocument,
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
export function graphql(source: "\n  query getAvailableDiscounts($discountTitles: [String!]) {\n    dbt_store_discount(where: { title: { _in: $discountTitles } }) {\n      collection {\n        collection_internal_id\n      }\n      ends_at\n      starts_at\n      id\n      value\n      value_type\n      code\n      title\n      min_amount\n    }\n  }\n"): (typeof documents)["\n  query getAvailableDiscounts($discountTitles: [String!]) {\n    dbt_store_discount(where: { title: { _in: $discountTitles } }) {\n      collection {\n        collection_internal_id\n      }\n      ends_at\n      starts_at\n      id\n      value\n      value_type\n      code\n      title\n      min_amount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchVariant($internalId: String!) {\n    ProductVariant(where: { id: { _eq: $internalId } }) {\n      medusaId\n      shopifyId\n    }\n  }\n"): (typeof documents)["\n  query fetchVariant($internalId: String!) {\n    ProductVariant(where: { id: { _eq: $internalId } }) {\n      medusaId\n      shopifyId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProductCardFields on dbt_store_exposed_product {\n    product {\n      id\n      collections {\n        collection_id\n      }\n      merchantItemId: merchant_item_id\n      variants(limit: 30) {\n        id\n        exposedVariant: variant {\n          inventory_quantity\n          option1Name\n          option1\n          option2Name\n          option2\n          option3Name\n          option3\n          condition\n          isRefurbished\n        }\n        b2cVariant {\n          price\n          compare_at_price\n        }\n      }\n      tags {\n        tag\n        value\n      }\n      images(limit: 30, order_by: { position: asc }) {\n        alt\n        src\n        height\n        width\n      }\n    }\n    handle\n    vendor\n    title\n    description\n    productType\n    numberOfViews\n    status\n  }\n"): (typeof documents)["\n  fragment ProductCardFields on dbt_store_exposed_product {\n    product {\n      id\n      collections {\n        collection_id\n      }\n      merchantItemId: merchant_item_id\n      variants(limit: 30) {\n        id\n        exposedVariant: variant {\n          inventory_quantity\n          option1Name\n          option1\n          option2Name\n          option2\n          option3Name\n          option3\n          condition\n          isRefurbished\n        }\n        b2cVariant {\n          price\n          compare_at_price\n        }\n      }\n      tags {\n        tag\n        value\n      }\n      images(limit: 30, order_by: { position: asc }) {\n        alt\n        src\n        height\n        width\n      }\n    }\n    handle\n    vendor\n    title\n    description\n    productType\n    numberOfViews\n    status\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment VendorDetails on Customer {\n    isPro\n    sellerName\n    shipmentTimeframe\n    profilePictureShopifyCdnUrl\n    createdAt\n    authUserId\n    VendorReviews {\n      ...ReviewsFields\n    }\n    negociationAgreements {\n      maxAmountPercent\n    }\n  }\n"): (typeof documents)["\n  fragment VendorDetails on Customer {\n    isPro\n    sellerName\n    shipmentTimeframe\n    profilePictureShopifyCdnUrl\n    createdAt\n    authUserId\n    VendorReviews {\n      ...ReviewsFields\n    }\n    negociationAgreements {\n      maxAmountPercent\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchProducts(\n    $productInternalIds: [String!]\n    $productHandles: [String!]\n  ) {\n    Product(\n      where: {\n        _or: [\n          { id: { _in: $productInternalIds } }\n          { handle: { _in: $productHandles } }\n        ]\n      }\n    ) {\n      storeExposedProduct {\n        ...ProductCardFields\n      }\n\n      Vendor {\n        ...VendorDetails\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchProducts(\n    $productInternalIds: [String!]\n    $productHandles: [String!]\n  ) {\n    Product(\n      where: {\n        _or: [\n          { id: { _in: $productInternalIds } }\n          { handle: { _in: $productHandles } }\n        ]\n      }\n    ) {\n      storeExposedProduct {\n        ...ProductCardFields\n      }\n\n      Vendor {\n        ...VendorDetails\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ReviewsFields on VendorReview {\n    Review {\n      content\n      createdAt\n      id\n      rating\n      title\n      authorNickname\n      Customer {\n        createdAt\n        sellerName\n        profilePictureShopifyCdnUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ReviewsFields on VendorReview {\n    Review {\n      content\n      createdAt\n      id\n      rating\n      title\n      authorNickname\n      Customer {\n        createdAt\n        sellerName\n        profilePictureShopifyCdnUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchCollectionPageData(\n    $collectionHandle: String!\n    $vendorSellerName: String!\n  ) {\n    Collection(where: { handle: { _eq: $collectionHandle } }) {\n      id\n      handle\n      type\n      description\n      title\n      featuredImageSrc\n      seoTitle\n      seoDescription\n      parentCollection {\n        shortName\n        handle\n        id\n        title\n        childCollections {\n          handle\n          shortName\n          id\n          title\n        }\n        parentCollection {\n          shortName\n          handle\n          id\n          title\n          parentCollection {\n            shortName\n            handle\n            id\n            title\n          }\n        }\n      }\n      childCollections {\n        shortName\n        handle\n        title\n        featuredImageSrc\n      }\n    }\n    vendorData: Customer(\n      where: {\n        _and: [\n          { sellerName: { _eq: $vendorSellerName } }\n          { sellerName: { _neq: \"\" } }\n        ]\n      }\n    ) {\n      sellerName\n      coverPictureShopifyCdnUrl\n      description\n      profilePictureShopifyCdnUrl\n      VendorReviews {\n        ...ReviewsFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchCollectionPageData(\n    $collectionHandle: String!\n    $vendorSellerName: String!\n  ) {\n    Collection(where: { handle: { _eq: $collectionHandle } }) {\n      id\n      handle\n      type\n      description\n      title\n      featuredImageSrc\n      seoTitle\n      seoDescription\n      parentCollection {\n        shortName\n        handle\n        id\n        title\n        childCollections {\n          handle\n          shortName\n          id\n          title\n        }\n        parentCollection {\n          shortName\n          handle\n          id\n          title\n          parentCollection {\n            shortName\n            handle\n            id\n            title\n          }\n        }\n      }\n      childCollections {\n        shortName\n        handle\n        title\n        featuredImageSrc\n      }\n    }\n    vendorData: Customer(\n      where: {\n        _and: [\n          { sellerName: { _eq: $vendorSellerName } }\n          { sellerName: { _neq: \"\" } }\n        ]\n      }\n    ) {\n      sellerName\n      coverPictureShopifyCdnUrl\n      description\n      profilePictureShopifyCdnUrl\n      VendorReviews {\n        ...ReviewsFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchProductMetadata($productHandle: String) {\n    shopify {\n      product(handle: $productHandle) {\n        productType\n        featuredImage {\n          src\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchProductMetadata($productHandle: String) {\n    shopify {\n      product(handle: $productHandle) {\n        productType\n        featuredImage {\n          src\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;