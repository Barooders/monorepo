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
    "\n  subscription fetchOrderData($orderId: String) {\n    Order(where: { id: { _eq: $orderId } }) {\n      name\n      createdAt\n      shippingAddressAddress1\n      shippingAddressAddress2\n      shippingAddressCity\n      shippingAddressCountry\n      shippingAddressPhone\n      shippingAddressFirstName\n      shippingAddressLastName\n      shippingAddressZip\n      status\n      orderLines {\n        brand: productBrand\n        variantName: name\n        productType\n        modelYear: productModelYear\n        size: productSize\n        condition: variantCondition\n        handle: productHandle\n        productImage\n        priceInCents\n        shippingSolution\n        id\n        fulfillmentOrder {\n          id\n          fulfillments {\n            trackingUrl\n          }\n          status\n        }\n      }\n    }\n  }\n": types.FetchOrderDataDocument,
    "\n  query fetchSavedSearches {\n    SavedSearch {\n      id\n      name\n      type\n      resultsUrl\n      FacetFilters {\n        facetName\n        label\n        value\n      }\n      NumericFilters {\n        facetName\n        operator\n        value\n      }\n      SearchAlert {\n        isActive\n      }\n    }\n  }\n": types.FetchSavedSearchesDocument,
    "\n  query getProduct($productInternalId: String!) {\n    dbt_store_base_product(where: { id: { _eq: $productInternalId } }) {\n      shopifyId\n      variants(\n        limit: 1\n        where: { variant: { inventory_quantity: { _gt: 0 } } }\n      ) {\n        b2cVariant {\n          price\n        }\n      }\n    }\n  }\n": types.GetProductDocument,
    "\n  query fetchOpenedB2BPriceOffers {\n    PriceOffer(\n      where: {\n        _and: {\n          salesChannelName: { _eq: \"B2B\" }\n          _or: [\n            { status: { _eq: \"PROPOSED\" } }\n            { status: { _eq: \"ACCEPTED\" } }\n          ]\n        }\n      }\n    ) {\n      productId\n    }\n  }\n": types.FetchOpenedB2BPriceOffersDocument,
    "\n  query checkExistingCustomer($customerId: String) {\n    Customer(where: { sellerName: { _eq: $customerId } }) {\n      authUserId\n    }\n  }\n": types.CheckExistingCustomerDocument,
    "\n  query fetchFavoriteProducts {\n    FavoriteProducts {\n      productId\n    }\n  }\n": types.FetchFavoriteProductsDocument,
    "\n  mutation addFavoriteProduct($customerId: uuid!, $productId: bigint) {\n    insert_FavoriteProducts_one(\n      object: { customerId: $customerId, productId: $productId }\n    ) {\n      id\n    }\n  }\n": types.AddFavoriteProductDocument,
    "\n  mutation removeFavoriteProducts($customerId: uuid!, $productId: bigint) {\n    delete_FavoriteProducts(\n      where: {\n        _and: {\n          customerId: { _eq: $customerId }\n          productId: { _eq: $productId }\n        }\n      }\n    ) {\n      affected_rows\n    }\n  }\n": types.RemoveFavoriteProductsDocument,
    "\n  mutation updateCustomerInfo(\n    $userId: uuid!\n    $lastName: String!\n    $firstName: String!\n    $sellerName: String!\n    $phoneNumber: String!\n  ) {\n    update_Customer_by_pk(\n      pk_columns: { authUserId: $userId }\n      _set: {\n        firstName: $firstName\n        lastName: $lastName\n        sellerName: $sellerName\n      }\n    ) {\n      authUserId\n    }\n    updateUser(\n      _set: { phoneNumber: $phoneNumber }\n      pk_columns: { id: $userId }\n    ) {\n      id\n    }\n  }\n": types.UpdateCustomerInfoDocument,
    "\n  mutation updateDisplayName($userId: uuid, $displayName: String!) {\n    updateUsers(\n      where: { id: { _eq: $userId } }\n      _set: { displayName: $displayName }\n    ) {\n      affected_rows\n    }\n  }\n": types.UpdateDisplayNameDocument,
    "\n  subscription FetchB2BSavedSearchByName($searchName: String) {\n    SavedSearch(\n      limit: 1\n      order_by: { createdAt: desc }\n      where: { type: { _eq: \"B2B_MAIN_PAGE\" }, name: { _eq: $searchName } }\n    ) {\n      id\n      FacetFilters {\n        value\n        facetName\n      }\n      NumericFilters {\n        facetName\n        operator\n        value\n      }\n      query\n      SearchAlert {\n        isActive\n      }\n    }\n  }\n": types.FetchB2BSavedSearchByNameDocument,
    "\n  query FetchB2BSavedSearchByUrl($resultsUrl: String) {\n    SavedSearch(\n      limit: 1\n      order_by: { createdAt: desc }\n      where: {\n        type: { _eq: \"B2B_MAIN_PAGE\" }\n        resultsUrl: { _eq: $resultsUrl }\n      }\n    ) {\n      id\n      FacetFilters {\n        value\n        facetName\n      }\n      NumericFilters {\n        facetName\n        operator\n        value\n      }\n      query\n      SearchAlert {\n        isActive\n      }\n    }\n  }\n": types.FetchB2BSavedSearchByUrlDocument,
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription fetchOrderData($orderId: String) {\n    Order(where: { id: { _eq: $orderId } }) {\n      name\n      createdAt\n      shippingAddressAddress1\n      shippingAddressAddress2\n      shippingAddressCity\n      shippingAddressCountry\n      shippingAddressPhone\n      shippingAddressFirstName\n      shippingAddressLastName\n      shippingAddressZip\n      status\n      orderLines {\n        brand: productBrand\n        variantName: name\n        productType\n        modelYear: productModelYear\n        size: productSize\n        condition: variantCondition\n        handle: productHandle\n        productImage\n        priceInCents\n        shippingSolution\n        id\n        fulfillmentOrder {\n          id\n          fulfillments {\n            trackingUrl\n          }\n          status\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription fetchOrderData($orderId: String) {\n    Order(where: { id: { _eq: $orderId } }) {\n      name\n      createdAt\n      shippingAddressAddress1\n      shippingAddressAddress2\n      shippingAddressCity\n      shippingAddressCountry\n      shippingAddressPhone\n      shippingAddressFirstName\n      shippingAddressLastName\n      shippingAddressZip\n      status\n      orderLines {\n        brand: productBrand\n        variantName: name\n        productType\n        modelYear: productModelYear\n        size: productSize\n        condition: variantCondition\n        handle: productHandle\n        productImage\n        priceInCents\n        shippingSolution\n        id\n        fulfillmentOrder {\n          id\n          fulfillments {\n            trackingUrl\n          }\n          status\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchSavedSearches {\n    SavedSearch {\n      id\n      name\n      type\n      resultsUrl\n      FacetFilters {\n        facetName\n        label\n        value\n      }\n      NumericFilters {\n        facetName\n        operator\n        value\n      }\n      SearchAlert {\n        isActive\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchSavedSearches {\n    SavedSearch {\n      id\n      name\n      type\n      resultsUrl\n      FacetFilters {\n        facetName\n        label\n        value\n      }\n      NumericFilters {\n        facetName\n        operator\n        value\n      }\n      SearchAlert {\n        isActive\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getProduct($productInternalId: String!) {\n    dbt_store_base_product(where: { id: { _eq: $productInternalId } }) {\n      shopifyId\n      variants(\n        limit: 1\n        where: { variant: { inventory_quantity: { _gt: 0 } } }\n      ) {\n        b2cVariant {\n          price\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getProduct($productInternalId: String!) {\n    dbt_store_base_product(where: { id: { _eq: $productInternalId } }) {\n      shopifyId\n      variants(\n        limit: 1\n        where: { variant: { inventory_quantity: { _gt: 0 } } }\n      ) {\n        b2cVariant {\n          price\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchOpenedB2BPriceOffers {\n    PriceOffer(\n      where: {\n        _and: {\n          salesChannelName: { _eq: \"B2B\" }\n          _or: [\n            { status: { _eq: \"PROPOSED\" } }\n            { status: { _eq: \"ACCEPTED\" } }\n          ]\n        }\n      }\n    ) {\n      productId\n    }\n  }\n"): (typeof documents)["\n  query fetchOpenedB2BPriceOffers {\n    PriceOffer(\n      where: {\n        _and: {\n          salesChannelName: { _eq: \"B2B\" }\n          _or: [\n            { status: { _eq: \"PROPOSED\" } }\n            { status: { _eq: \"ACCEPTED\" } }\n          ]\n        }\n      }\n    ) {\n      productId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query checkExistingCustomer($customerId: String) {\n    Customer(where: { sellerName: { _eq: $customerId } }) {\n      authUserId\n    }\n  }\n"): (typeof documents)["\n  query checkExistingCustomer($customerId: String) {\n    Customer(where: { sellerName: { _eq: $customerId } }) {\n      authUserId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchFavoriteProducts {\n    FavoriteProducts {\n      productId\n    }\n  }\n"): (typeof documents)["\n  query fetchFavoriteProducts {\n    FavoriteProducts {\n      productId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addFavoriteProduct($customerId: uuid!, $productId: bigint) {\n    insert_FavoriteProducts_one(\n      object: { customerId: $customerId, productId: $productId }\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation addFavoriteProduct($customerId: uuid!, $productId: bigint) {\n    insert_FavoriteProducts_one(\n      object: { customerId: $customerId, productId: $productId }\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeFavoriteProducts($customerId: uuid!, $productId: bigint) {\n    delete_FavoriteProducts(\n      where: {\n        _and: {\n          customerId: { _eq: $customerId }\n          productId: { _eq: $productId }\n        }\n      }\n    ) {\n      affected_rows\n    }\n  }\n"): (typeof documents)["\n  mutation removeFavoriteProducts($customerId: uuid!, $productId: bigint) {\n    delete_FavoriteProducts(\n      where: {\n        _and: {\n          customerId: { _eq: $customerId }\n          productId: { _eq: $productId }\n        }\n      }\n    ) {\n      affected_rows\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateCustomerInfo(\n    $userId: uuid!\n    $lastName: String!\n    $firstName: String!\n    $sellerName: String!\n    $phoneNumber: String!\n  ) {\n    update_Customer_by_pk(\n      pk_columns: { authUserId: $userId }\n      _set: {\n        firstName: $firstName\n        lastName: $lastName\n        sellerName: $sellerName\n      }\n    ) {\n      authUserId\n    }\n    updateUser(\n      _set: { phoneNumber: $phoneNumber }\n      pk_columns: { id: $userId }\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation updateCustomerInfo(\n    $userId: uuid!\n    $lastName: String!\n    $firstName: String!\n    $sellerName: String!\n    $phoneNumber: String!\n  ) {\n    update_Customer_by_pk(\n      pk_columns: { authUserId: $userId }\n      _set: {\n        firstName: $firstName\n        lastName: $lastName\n        sellerName: $sellerName\n      }\n    ) {\n      authUserId\n    }\n    updateUser(\n      _set: { phoneNumber: $phoneNumber }\n      pk_columns: { id: $userId }\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateDisplayName($userId: uuid, $displayName: String!) {\n    updateUsers(\n      where: { id: { _eq: $userId } }\n      _set: { displayName: $displayName }\n    ) {\n      affected_rows\n    }\n  }\n"): (typeof documents)["\n  mutation updateDisplayName($userId: uuid, $displayName: String!) {\n    updateUsers(\n      where: { id: { _eq: $userId } }\n      _set: { displayName: $displayName }\n    ) {\n      affected_rows\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription FetchB2BSavedSearchByName($searchName: String) {\n    SavedSearch(\n      limit: 1\n      order_by: { createdAt: desc }\n      where: { type: { _eq: \"B2B_MAIN_PAGE\" }, name: { _eq: $searchName } }\n    ) {\n      id\n      FacetFilters {\n        value\n        facetName\n      }\n      NumericFilters {\n        facetName\n        operator\n        value\n      }\n      query\n      SearchAlert {\n        isActive\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription FetchB2BSavedSearchByName($searchName: String) {\n    SavedSearch(\n      limit: 1\n      order_by: { createdAt: desc }\n      where: { type: { _eq: \"B2B_MAIN_PAGE\" }, name: { _eq: $searchName } }\n    ) {\n      id\n      FacetFilters {\n        value\n        facetName\n      }\n      NumericFilters {\n        facetName\n        operator\n        value\n      }\n      query\n      SearchAlert {\n        isActive\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchB2BSavedSearchByUrl($resultsUrl: String) {\n    SavedSearch(\n      limit: 1\n      order_by: { createdAt: desc }\n      where: {\n        type: { _eq: \"B2B_MAIN_PAGE\" }\n        resultsUrl: { _eq: $resultsUrl }\n      }\n    ) {\n      id\n      FacetFilters {\n        value\n        facetName\n      }\n      NumericFilters {\n        facetName\n        operator\n        value\n      }\n      query\n      SearchAlert {\n        isActive\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchB2BSavedSearchByUrl($resultsUrl: String) {\n    SavedSearch(\n      limit: 1\n      order_by: { createdAt: desc }\n      where: {\n        type: { _eq: \"B2B_MAIN_PAGE\" }\n        resultsUrl: { _eq: $resultsUrl }\n      }\n    ) {\n      id\n      FacetFilters {\n        value\n        facetName\n      }\n      NumericFilters {\n        facetName\n        operator\n        value\n      }\n      query\n      SearchAlert {\n        isActive\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;