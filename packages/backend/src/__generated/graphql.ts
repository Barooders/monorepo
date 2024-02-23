export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  CustomerType: any;
  bigint: any;
  jsonb: any;
  numeric: any;
  shopify_Color: any;
  shopify_DateTime: any;
  shopify_Decimal: any;
  shopify_HTML: any;
  shopify_JSON: any;
  shopify_URL: any;
  shopify_UnsignedInt64: any;
  timestamp: any;
  uuid: any;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq: InputMaybe<Scalars['Boolean']>;
  _gt: InputMaybe<Scalars['Boolean']>;
  _gte: InputMaybe<Scalars['Boolean']>;
  _in: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null: InputMaybe<Scalars['Boolean']>;
  _lt: InputMaybe<Scalars['Boolean']>;
  _lte: InputMaybe<Scalars['Boolean']>;
  _neq: InputMaybe<Scalars['Boolean']>;
  _nin: InputMaybe<Array<Scalars['Boolean']>>;
};

/** columns and relationships of "Customer" */
export type Customer = {
  __typename?: 'Customer';
  authUserId: Maybe<Scalars['uuid']>;
  coverPictureShopifyCdnUrl: Maybe<Scalars['String']>;
  createdAt: Scalars['timestamp'];
  description: Maybe<Scalars['String']>;
  firstName: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isPro: Scalars['Boolean'];
  lastName: Maybe<Scalars['String']>;
  products: Shopify_ProductConnection;
  profilePictureShopifyCdnUrl: Maybe<Scalars['String']>;
  rating: Maybe<Scalars['numeric']>;
  sellerName: Maybe<Scalars['String']>;
  shopifyId: Scalars['bigint'];
  type: Scalars['CustomerType'];
  updatedAt: Maybe<Scalars['timestamp']>;
};

/** columns and relationships of "Customer" */
export type CustomerProductsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_ProductSortKeys>;
};

/** Boolean expression to compare columns of type "CustomerType". All fields are combined with logical 'AND'. */
export type CustomerType_Comparison_Exp = {
  _eq: InputMaybe<Scalars['CustomerType']>;
  _gt: InputMaybe<Scalars['CustomerType']>;
  _gte: InputMaybe<Scalars['CustomerType']>;
  _in: InputMaybe<Array<Scalars['CustomerType']>>;
  _is_null: InputMaybe<Scalars['Boolean']>;
  _lt: InputMaybe<Scalars['CustomerType']>;
  _lte: InputMaybe<Scalars['CustomerType']>;
  _neq: InputMaybe<Scalars['CustomerType']>;
  _nin: InputMaybe<Array<Scalars['CustomerType']>>;
};

/** Boolean expression to filter rows from the table "Customer". All fields are combined with a logical 'AND'. */
export type Customer_Bool_Exp = {
  _and: InputMaybe<Array<Customer_Bool_Exp>>;
  _not: InputMaybe<Customer_Bool_Exp>;
  _or: InputMaybe<Array<Customer_Bool_Exp>>;
  authUserId: InputMaybe<Uuid_Comparison_Exp>;
  coverPictureShopifyCdnUrl: InputMaybe<String_Comparison_Exp>;
  createdAt: InputMaybe<Timestamp_Comparison_Exp>;
  description: InputMaybe<String_Comparison_Exp>;
  firstName: InputMaybe<String_Comparison_Exp>;
  id: InputMaybe<String_Comparison_Exp>;
  isPro: InputMaybe<Boolean_Comparison_Exp>;
  lastName: InputMaybe<String_Comparison_Exp>;
  profilePictureShopifyCdnUrl: InputMaybe<String_Comparison_Exp>;
  rating: InputMaybe<Numeric_Comparison_Exp>;
  sellerName: InputMaybe<String_Comparison_Exp>;
  shopifyId: InputMaybe<Bigint_Comparison_Exp>;
  type: InputMaybe<CustomerType_Comparison_Exp>;
  updatedAt: InputMaybe<Timestamp_Comparison_Exp>;
};

/** Ordering options when selecting data from "Customer". */
export type Customer_Order_By = {
  authUserId: InputMaybe<Order_By>;
  coverPictureShopifyCdnUrl: InputMaybe<Order_By>;
  createdAt: InputMaybe<Order_By>;
  description: InputMaybe<Order_By>;
  firstName: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  isPro: InputMaybe<Order_By>;
  lastName: InputMaybe<Order_By>;
  profilePictureShopifyCdnUrl: InputMaybe<Order_By>;
  rating: InputMaybe<Order_By>;
  sellerName: InputMaybe<Order_By>;
  shopifyId: InputMaybe<Order_By>;
  type: InputMaybe<Order_By>;
  updatedAt: InputMaybe<Order_By>;
};

/** select columns of table "Customer" */
export enum Customer_Select_Column {
  /** column name */
  AuthUserId = 'authUserId',
  /** column name */
  CoverPictureShopifyCdnUrl = 'coverPictureShopifyCdnUrl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  FirstName = 'firstName',
  /** column name */
  Id = 'id',
  /** column name */
  IsPro = 'isPro',
  /** column name */
  LastName = 'lastName',
  /** column name */
  ProfilePictureShopifyCdnUrl = 'profilePictureShopifyCdnUrl',
  /** column name */
  Rating = 'rating',
  /** column name */
  SellerName = 'sellerName',
  /** column name */
  ShopifyId = 'shopifyId',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updatedAt',
}

/** Streaming cursor of the table "Customer" */
export type Customer_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Customer_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Customer_Stream_Cursor_Value_Input = {
  authUserId: InputMaybe<Scalars['uuid']>;
  coverPictureShopifyCdnUrl: InputMaybe<Scalars['String']>;
  createdAt: InputMaybe<Scalars['timestamp']>;
  description: InputMaybe<Scalars['String']>;
  firstName: InputMaybe<Scalars['String']>;
  id: InputMaybe<Scalars['String']>;
  isPro: InputMaybe<Scalars['Boolean']>;
  lastName: InputMaybe<Scalars['String']>;
  profilePictureShopifyCdnUrl: InputMaybe<Scalars['String']>;
  rating: InputMaybe<Scalars['numeric']>;
  sellerName: InputMaybe<Scalars['String']>;
  shopifyId: InputMaybe<Scalars['bigint']>;
  type: InputMaybe<Scalars['CustomerType']>;
  updatedAt: InputMaybe<Scalars['timestamp']>;
};

/** Boolean expression to filter rows from the table "Event". All fields are combined with a logical 'AND'. */
export type Event_Bool_Exp = {
  _and: InputMaybe<Array<Event_Bool_Exp>>;
  _not: InputMaybe<Event_Bool_Exp>;
  _or: InputMaybe<Array<Event_Bool_Exp>>;
};

/** unique or primary key constraints on table "Event" */
export enum Event_Constraint {
  /** unique or primary key constraint on columns "id" */
  EventPkey = 'Event_pkey',
}

/** input type for inserting data into table "Event" */
export type Event_Insert_Input = {
  aggregateId: InputMaybe<Scalars['String']>;
  aggregateName: InputMaybe<Scalars['String']>;
  metadata: InputMaybe<Scalars['jsonb']>;
  name: InputMaybe<Scalars['String']>;
  payload: InputMaybe<Scalars['jsonb']>;
};

/** response of any mutation on the table "Event" */
export type Event_Mutation_Response = {
  __typename?: 'Event_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
};

/** on_conflict condition type for table "Event" */
export type Event_On_Conflict = {
  constraint: Event_Constraint;
  update_columns: Array<Event_Update_Column>;
  where: InputMaybe<Event_Bool_Exp>;
};

/** placeholder for update columns of table "Event" (current role has no relevant permissions) */
export enum Event_Update_Column {
  /** placeholder (do not use) */
  Placeholder = '_PLACEHOLDER',
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq: InputMaybe<Scalars['String']>;
  _gt: InputMaybe<Scalars['String']>;
  _gte: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike: InputMaybe<Scalars['String']>;
  _in: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex: InputMaybe<Scalars['String']>;
  _is_null: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like: InputMaybe<Scalars['String']>;
  _lt: InputMaybe<Scalars['String']>;
  _lte: InputMaybe<Scalars['String']>;
  _neq: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike: InputMaybe<Scalars['String']>;
  _nin: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar: InputMaybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq: InputMaybe<Scalars['bigint']>;
  _gt: InputMaybe<Scalars['bigint']>;
  _gte: InputMaybe<Scalars['bigint']>;
  _in: InputMaybe<Array<Scalars['bigint']>>;
  _is_null: InputMaybe<Scalars['Boolean']>;
  _lt: InputMaybe<Scalars['bigint']>;
  _lte: InputMaybe<Scalars['bigint']>;
  _neq: InputMaybe<Scalars['bigint']>;
  _nin: InputMaybe<Array<Scalars['bigint']>>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** insert data into the table: "Event" */
  insert_Event: Maybe<Event_Mutation_Response>;
  shopify: Maybe<ShopifyMutation>;
};

/** mutation root */
export type Mutation_RootInsert_EventArgs = {
  objects: Array<Event_Insert_Input>;
  on_conflict: InputMaybe<Event_On_Conflict>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq: InputMaybe<Scalars['numeric']>;
  _gt: InputMaybe<Scalars['numeric']>;
  _gte: InputMaybe<Scalars['numeric']>;
  _in: InputMaybe<Array<Scalars['numeric']>>;
  _is_null: InputMaybe<Scalars['Boolean']>;
  _lt: InputMaybe<Scalars['numeric']>;
  _lte: InputMaybe<Scalars['numeric']>;
  _neq: InputMaybe<Scalars['numeric']>;
  _nin: InputMaybe<Array<Scalars['numeric']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "Customer" */
  Customer: Array<Customer>;
  /** fetch data from the table: "Customer" using primary key columns */
  Customer_by_pk: Maybe<Customer>;
  shopify: Maybe<ShopifyQueryRoot>;
  /** fetch data from the table: "auth.users" */
  users: Array<Users>;
};

export type Query_RootCustomerArgs = {
  distinct_on: InputMaybe<Array<Customer_Select_Column>>;
  limit: InputMaybe<Scalars['Int']>;
  offset: InputMaybe<Scalars['Int']>;
  order_by: InputMaybe<Array<Customer_Order_By>>;
  where: InputMaybe<Customer_Bool_Exp>;
};

export type Query_RootCustomer_By_PkArgs = {
  id: Scalars['String'];
};

export type Query_RootUsersArgs = {
  distinct_on: InputMaybe<Array<Users_Select_Column>>;
  limit: InputMaybe<Scalars['Int']>;
  offset: InputMaybe<Scalars['Int']>;
  order_by: InputMaybe<Array<Users_Order_By>>;
  where: InputMaybe<Users_Bool_Exp>;
};

export type ShopifyMutation = {
  __typename?: 'shopifyMutation';
  /** Updates the attributes on a cart. */
  cartAttributesUpdate: Maybe<Shopify_CartAttributesUpdatePayload>;
  /**
   * Updates customer information associated with a cart.
   * Buyer identity is used to determine
   * [international pricing](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
   * and should match the customer's shipping address.
   *
   */
  cartBuyerIdentityUpdate: Maybe<Shopify_CartBuyerIdentityUpdatePayload>;
  /** Creates a new cart. */
  cartCreate: Maybe<Shopify_CartCreatePayload>;
  /** Updates the discount codes applied to the cart. */
  cartDiscountCodesUpdate: Maybe<Shopify_CartDiscountCodesUpdatePayload>;
  /** Adds a merchandise line to the cart. */
  cartLinesAdd: Maybe<Shopify_CartLinesAddPayload>;
  /** Removes one or more merchandise lines from the cart. */
  cartLinesRemove: Maybe<Shopify_CartLinesRemovePayload>;
  /** Updates one or more merchandise lines on a cart. */
  cartLinesUpdate: Maybe<Shopify_CartLinesUpdatePayload>;
  /** Updates the note on the cart. */
  cartNoteUpdate: Maybe<Shopify_CartNoteUpdatePayload>;
  /** Update the selected delivery options for a delivery group. */
  cartSelectedDeliveryOptionsUpdate: Maybe<Shopify_CartSelectedDeliveryOptionsUpdatePayload>;
  /** Updates the attributes of a checkout if `allowPartialAddresses` is `true`. */
  checkoutAttributesUpdateV2: Maybe<Shopify_CheckoutAttributesUpdateV2Payload>;
  /** Completes a checkout without providing payment information. You can use this mutation for free items or items whose purchase price is covered by a gift card. */
  checkoutCompleteFree: Maybe<Shopify_CheckoutCompleteFreePayload>;
  /** Completes a checkout using a credit card token from Shopify's card vault. Before you can complete checkouts using CheckoutCompleteWithCreditCardV2, you need to  [_request payment processing_](https://shopify.dev/apps/channels/getting-started#request-payment-processing). */
  checkoutCompleteWithCreditCardV2: Maybe<Shopify_CheckoutCompleteWithCreditCardV2Payload>;
  /** Completes a checkout with a tokenized payment. */
  checkoutCompleteWithTokenizedPaymentV3: Maybe<Shopify_CheckoutCompleteWithTokenizedPaymentV3Payload>;
  /** Creates a new checkout. */
  checkoutCreate: Maybe<Shopify_CheckoutCreatePayload>;
  /** Associates a customer to the checkout. */
  checkoutCustomerAssociateV2: Maybe<Shopify_CheckoutCustomerAssociateV2Payload>;
  /** Disassociates the current checkout customer from the checkout. */
  checkoutCustomerDisassociateV2: Maybe<Shopify_CheckoutCustomerDisassociateV2Payload>;
  /** Applies a discount to an existing checkout using a discount code. */
  checkoutDiscountCodeApplyV2: Maybe<Shopify_CheckoutDiscountCodeApplyV2Payload>;
  /** Removes the applied discounts from an existing checkout. */
  checkoutDiscountCodeRemove: Maybe<Shopify_CheckoutDiscountCodeRemovePayload>;
  /** Updates the email on an existing checkout. */
  checkoutEmailUpdateV2: Maybe<Shopify_CheckoutEmailUpdateV2Payload>;
  /** Removes an applied gift card from the checkout. */
  checkoutGiftCardRemoveV2: Maybe<Shopify_CheckoutGiftCardRemoveV2Payload>;
  /** Appends gift cards to an existing checkout. */
  checkoutGiftCardsAppend: Maybe<Shopify_CheckoutGiftCardsAppendPayload>;
  /** Adds a list of line items to a checkout. */
  checkoutLineItemsAdd: Maybe<Shopify_CheckoutLineItemsAddPayload>;
  /** Removes line items from an existing checkout. */
  checkoutLineItemsRemove: Maybe<Shopify_CheckoutLineItemsRemovePayload>;
  /** Sets a list of line items to a checkout. */
  checkoutLineItemsReplace: Maybe<Shopify_CheckoutLineItemsReplacePayload>;
  /** Updates line items on a checkout. */
  checkoutLineItemsUpdate: Maybe<Shopify_CheckoutLineItemsUpdatePayload>;
  /** Updates the shipping address of an existing checkout. */
  checkoutShippingAddressUpdateV2: Maybe<Shopify_CheckoutShippingAddressUpdateV2Payload>;
  /** Updates the shipping lines on an existing checkout. */
  checkoutShippingLineUpdate: Maybe<Shopify_CheckoutShippingLineUpdatePayload>;
  /**
   * Creates a customer access token.
   * The customer access token is required to modify the customer object in any way.
   *
   */
  customerAccessTokenCreate: Maybe<Shopify_CustomerAccessTokenCreatePayload>;
  /**
   * Creates a customer access token using a
   * [multipass token](https://shopify.dev/api/multipass) instead of email and
   * password. A customer record is created if the customer doesn't exist. If a customer
   * record already exists but the record is disabled, then the customer record is enabled.
   *
   */
  customerAccessTokenCreateWithMultipass: Maybe<Shopify_CustomerAccessTokenCreateWithMultipassPayload>;
  /** Permanently destroys a customer access token. */
  customerAccessTokenDelete: Maybe<Shopify_CustomerAccessTokenDeletePayload>;
  /**
   * Renews a customer access token.
   *
   * Access token renewal must happen *before* a token expires.
   * If a token has already expired, a new one should be created instead via `customerAccessTokenCreate`.
   *
   */
  customerAccessTokenRenew: Maybe<Shopify_CustomerAccessTokenRenewPayload>;
  /** Activates a customer. */
  customerActivate: Maybe<Shopify_CustomerActivatePayload>;
  /** Activates a customer with the activation url received from `customerCreate`. */
  customerActivateByUrl: Maybe<Shopify_CustomerActivateByUrlPayload>;
  /** Creates a new address for a customer. */
  customerAddressCreate: Maybe<Shopify_CustomerAddressCreatePayload>;
  /** Permanently deletes the address of an existing customer. */
  customerAddressDelete: Maybe<Shopify_CustomerAddressDeletePayload>;
  /** Updates the address of an existing customer. */
  customerAddressUpdate: Maybe<Shopify_CustomerAddressUpdatePayload>;
  /** Creates a new customer. */
  customerCreate: Maybe<Shopify_CustomerCreatePayload>;
  /** Updates the default address of an existing customer. */
  customerDefaultAddressUpdate: Maybe<Shopify_CustomerDefaultAddressUpdatePayload>;
  /**
   * Sends a reset password email to the customer. The reset password
   * email contains a reset password URL and token that you can pass to
   * the [`customerResetByUrl`](https://shopify.dev/api/storefront/latest/mutations/customerResetByUrl) or
   * [`customerReset`](https://shopify.dev/api/storefront/latest/mutations/customerReset) mutation to reset the
   * customer password.
   *
   * This mutation is throttled by IP. With authenticated access,
   * you can provide a [`Shopify-Storefront-Buyer-IP`](https://shopify.dev/api/usage/authentication#optional-ip-header) instead of the request IP.
   *
   * Make sure that the value provided to `Shopify-Storefront-Buyer-IP` is trusted. Unthrottled access to this
   * mutation presents a security risk.
   *
   */
  customerRecover: Maybe<Shopify_CustomerRecoverPayload>;
  /**
   * "Resets a customer’s password with the token received from a reset password email. You can send a reset password email with the [`customerRecover`](https://shopify.dev/api/storefront/latest/mutations/customerRecover) mutation."
   *
   */
  customerReset: Maybe<Shopify_CustomerResetPayload>;
  /**
   * "Resets a customer’s password with the reset password URL received from a reset password email. You can send a reset password email with the [`customerRecover`](https://shopify.dev/api/storefront/latest/mutations/customerRecover) mutation."
   *
   */
  customerResetByUrl: Maybe<Shopify_CustomerResetByUrlPayload>;
  /** Updates an existing customer. */
  customerUpdate: Maybe<Shopify_CustomerUpdatePayload>;
};

export type ShopifyMutationCartAttributesUpdateArgs = {
  attributes: Array<Shopify_AttributeInput>;
  cartId: Scalars['ID'];
};

export type ShopifyMutationCartBuyerIdentityUpdateArgs = {
  buyerIdentity: Shopify_CartBuyerIdentityInput;
  cartId: Scalars['ID'];
};

export type ShopifyMutationCartCreateArgs = {
  input: InputMaybe<Shopify_CartInput>;
};

export type ShopifyMutationCartDiscountCodesUpdateArgs = {
  cartId: Scalars['ID'];
  discountCodes: InputMaybe<Array<Scalars['String']>>;
};

export type ShopifyMutationCartLinesAddArgs = {
  cartId: Scalars['ID'];
  lines: Array<Shopify_CartLineInput>;
};

export type ShopifyMutationCartLinesRemoveArgs = {
  cartId: Scalars['ID'];
  lineIds: Array<Scalars['ID']>;
};

export type ShopifyMutationCartLinesUpdateArgs = {
  cartId: Scalars['ID'];
  lines: Array<Shopify_CartLineUpdateInput>;
};

export type ShopifyMutationCartNoteUpdateArgs = {
  cartId: Scalars['ID'];
  note: InputMaybe<Scalars['String']>;
};

export type ShopifyMutationCartSelectedDeliveryOptionsUpdateArgs = {
  cartId: Scalars['ID'];
  selectedDeliveryOptions: Array<Shopify_CartSelectedDeliveryOptionInput>;
};

export type ShopifyMutationCheckoutAttributesUpdateV2Args = {
  checkoutId: Scalars['ID'];
  input: Shopify_CheckoutAttributesUpdateV2Input;
};

export type ShopifyMutationCheckoutCompleteFreeArgs = {
  checkoutId: Scalars['ID'];
};

export type ShopifyMutationCheckoutCompleteWithCreditCardV2Args = {
  checkoutId: Scalars['ID'];
  payment: Shopify_CreditCardPaymentInputV2;
};

export type ShopifyMutationCheckoutCompleteWithTokenizedPaymentV3Args = {
  checkoutId: Scalars['ID'];
  payment: Shopify_TokenizedPaymentInputV3;
};

export type ShopifyMutationCheckoutCreateArgs = {
  input: Shopify_CheckoutCreateInput;
  queueToken: InputMaybe<Scalars['String']>;
};

export type ShopifyMutationCheckoutCustomerAssociateV2Args = {
  checkoutId: Scalars['ID'];
  customerAccessToken: Scalars['String'];
};

export type ShopifyMutationCheckoutCustomerDisassociateV2Args = {
  checkoutId: Scalars['ID'];
};

export type ShopifyMutationCheckoutDiscountCodeApplyV2Args = {
  checkoutId: Scalars['ID'];
  discountCode: Scalars['String'];
};

export type ShopifyMutationCheckoutDiscountCodeRemoveArgs = {
  checkoutId: Scalars['ID'];
};

export type ShopifyMutationCheckoutEmailUpdateV2Args = {
  checkoutId: Scalars['ID'];
  email: Scalars['String'];
};

export type ShopifyMutationCheckoutGiftCardRemoveV2Args = {
  appliedGiftCardId: Scalars['ID'];
  checkoutId: Scalars['ID'];
};

export type ShopifyMutationCheckoutGiftCardsAppendArgs = {
  checkoutId: Scalars['ID'];
  giftCardCodes: Array<Scalars['String']>;
};

export type ShopifyMutationCheckoutLineItemsAddArgs = {
  checkoutId: Scalars['ID'];
  lineItems: Array<Shopify_CheckoutLineItemInput>;
};

export type ShopifyMutationCheckoutLineItemsRemoveArgs = {
  checkoutId: Scalars['ID'];
  lineItemIds: Array<Scalars['ID']>;
};

export type ShopifyMutationCheckoutLineItemsReplaceArgs = {
  checkoutId: Scalars['ID'];
  lineItems: Array<Shopify_CheckoutLineItemInput>;
};

export type ShopifyMutationCheckoutLineItemsUpdateArgs = {
  checkoutId: Scalars['ID'];
  lineItems: Array<Shopify_CheckoutLineItemUpdateInput>;
};

export type ShopifyMutationCheckoutShippingAddressUpdateV2Args = {
  checkoutId: Scalars['ID'];
  shippingAddress: Shopify_MailingAddressInput;
};

export type ShopifyMutationCheckoutShippingLineUpdateArgs = {
  checkoutId: Scalars['ID'];
  shippingRateHandle: Scalars['String'];
};

export type ShopifyMutationCustomerAccessTokenCreateArgs = {
  input: Shopify_CustomerAccessTokenCreateInput;
};

export type ShopifyMutationCustomerAccessTokenCreateWithMultipassArgs = {
  multipassToken: Scalars['String'];
};

export type ShopifyMutationCustomerAccessTokenDeleteArgs = {
  customerAccessToken: Scalars['String'];
};

export type ShopifyMutationCustomerAccessTokenRenewArgs = {
  customerAccessToken: Scalars['String'];
};

export type ShopifyMutationCustomerActivateArgs = {
  id: Scalars['ID'];
  input: Shopify_CustomerActivateInput;
};

export type ShopifyMutationCustomerActivateByUrlArgs = {
  activationUrl: Scalars['shopify_URL'];
  password: Scalars['String'];
};

export type ShopifyMutationCustomerAddressCreateArgs = {
  address: Shopify_MailingAddressInput;
  customerAccessToken: Scalars['String'];
};

export type ShopifyMutationCustomerAddressDeleteArgs = {
  customerAccessToken: Scalars['String'];
  id: Scalars['ID'];
};

export type ShopifyMutationCustomerAddressUpdateArgs = {
  address: Shopify_MailingAddressInput;
  customerAccessToken: Scalars['String'];
  id: Scalars['ID'];
};

export type ShopifyMutationCustomerCreateArgs = {
  input: Shopify_CustomerCreateInput;
};

export type ShopifyMutationCustomerDefaultAddressUpdateArgs = {
  addressId: Scalars['ID'];
  customerAccessToken: Scalars['String'];
};

export type ShopifyMutationCustomerRecoverArgs = {
  email: Scalars['String'];
};

export type ShopifyMutationCustomerResetArgs = {
  id: Scalars['ID'];
  input: Shopify_CustomerResetInput;
};

export type ShopifyMutationCustomerResetByUrlArgs = {
  password: Scalars['String'];
  resetUrl: Scalars['shopify_URL'];
};

export type ShopifyMutationCustomerUpdateArgs = {
  customer: Shopify_CustomerUpdateInput;
  customerAccessToken: Scalars['String'];
};

export type ShopifyQueryRoot = {
  __typename?: 'shopifyQueryRoot';
  /** List of the shop's articles. */
  articles: Shopify_ArticleConnection;
  /** Fetch a specific `Blog` by one of its unique attributes. */
  blog: Maybe<Shopify_Blog>;
  /** Find a blog by its handle. */
  blogByHandle: Maybe<Shopify_Blog>;
  /** List of the shop's blogs. */
  blogs: Shopify_BlogConnection;
  /**
   * Retrieve a cart by its ID. For more information, refer to
   * [Manage a cart with the Storefront API](https://shopify.dev/custom-storefronts/cart/manage).
   *
   */
  cart: Maybe<Shopify_Cart>;
  /** Fetch a specific `Collection` by one of its unique attributes. */
  collection: Maybe<Shopify_Collection>;
  /** Find a collection by its handle. */
  collectionByHandle: Maybe<Shopify_Collection>;
  /** List of the shop’s collections. */
  collections: Shopify_CollectionConnection;
  /** Find a customer by its access token. */
  customer: Maybe<Shopify_Customer>;
  /** Returns the localized experiences configured for the shop. */
  localization: Shopify_Localization;
  /**
   * List of the shop's locations that support in-store pickup.
   *
   * When sorting by distance, you must specify a location via the `near` argument.
   *
   */
  locations: Shopify_LocationConnection;
  /** A storefront menu. */
  menu: Maybe<Shopify_Menu>;
  /** Fetch a specific Metaobject by one of its unique identifiers. */
  metaobject: Maybe<Shopify_Metaobject>;
  /** All active metaobjects for the shop. */
  metaobjects: Shopify_MetaobjectConnection;
  /** Returns a specific node by ID. */
  node: Maybe<Shopify_Node>;
  /** Returns the list of nodes with the given IDs. */
  nodes: Array<Maybe<Shopify_Node>>;
  /** Fetch a specific `Page` by one of its unique attributes. */
  page: Maybe<Shopify_Page>;
  /** Find a page by its handle. */
  pageByHandle: Maybe<Shopify_Page>;
  /** List of the shop's pages. */
  pages: Shopify_PageConnection;
  /** Fetch a specific `Product` by one of its unique attributes. */
  product: Maybe<Shopify_Product>;
  /** Find a product by its handle. */
  productByHandle: Maybe<Shopify_Product>;
  /**
   * Find recommended products related to a given `product_id`.
   * To learn more about how recommendations are generated, see
   * [*Showing product recommendations on product pages*](https://help.shopify.com/themes/development/recommended-products).
   *
   */
  productRecommendations: Maybe<Array<Shopify_Product>>;
  /**
   * Tags added to products.
   * Additional access scope required: unauthenticated_read_product_tags.
   *
   */
  productTags: Shopify_StringConnection;
  /** List of product types for the shop's products that are published to your app. */
  productTypes: Shopify_StringConnection;
  /** List of the shop’s products. */
  products: Shopify_ProductConnection;
  /** The list of public Storefront API versions, including supported, release candidate and unstable versions. */
  publicApiVersions: Array<Shopify_ApiVersion>;
  /** The shop associated with the storefront access token. */
  shop: Shopify_Shop;
  /** A list of redirects for a shop. */
  urlRedirects: Shopify_UrlRedirectConnection;
};

export type ShopifyQueryRootArticlesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  query: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_ArticleSortKeys>;
};

export type ShopifyQueryRootBlogArgs = {
  handle: InputMaybe<Scalars['String']>;
  id: InputMaybe<Scalars['ID']>;
};

export type ShopifyQueryRootBlogByHandleArgs = {
  handle: Scalars['String'];
};

export type ShopifyQueryRootBlogsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  query: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_BlogSortKeys>;
};

export type ShopifyQueryRootCartArgs = {
  id: Scalars['ID'];
};

export type ShopifyQueryRootCollectionArgs = {
  handle: InputMaybe<Scalars['String']>;
  id: InputMaybe<Scalars['ID']>;
};

export type ShopifyQueryRootCollectionByHandleArgs = {
  handle: Scalars['String'];
};

export type ShopifyQueryRootCollectionsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  query: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_CollectionSortKeys>;
};

export type ShopifyQueryRootCustomerArgs = {
  customerAccessToken: Scalars['String'];
};

export type ShopifyQueryRootLocationsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  near: InputMaybe<Shopify_GeoCoordinateInput>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_LocationSortKeys>;
};

export type ShopifyQueryRootMenuArgs = {
  handle: Scalars['String'];
};

export type ShopifyQueryRootMetaobjectArgs = {
  handle: InputMaybe<Shopify_MetaobjectHandleInput>;
  id: InputMaybe<Scalars['ID']>;
};

export type ShopifyQueryRootMetaobjectsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
};

export type ShopifyQueryRootNodeArgs = {
  id: Scalars['ID'];
};

export type ShopifyQueryRootNodesArgs = {
  ids: Array<Scalars['ID']>;
};

export type ShopifyQueryRootPageArgs = {
  handle: InputMaybe<Scalars['String']>;
  id: InputMaybe<Scalars['ID']>;
};

export type ShopifyQueryRootPageByHandleArgs = {
  handle: Scalars['String'];
};

export type ShopifyQueryRootPagesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  query: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_PageSortKeys>;
};

export type ShopifyQueryRootProductArgs = {
  handle: InputMaybe<Scalars['String']>;
  id: InputMaybe<Scalars['ID']>;
};

export type ShopifyQueryRootProductByHandleArgs = {
  handle: Scalars['String'];
};

export type ShopifyQueryRootProductRecommendationsArgs = {
  productId: Scalars['ID'];
};

export type ShopifyQueryRootProductTagsArgs = {
  first: Scalars['Int'];
};

export type ShopifyQueryRootProductTypesArgs = {
  first: Scalars['Int'];
};

export type ShopifyQueryRootProductsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  query: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_ProductSortKeys>;
};

export type ShopifyQueryRootUrlRedirectsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  query: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/**
 * A version of the API, as defined by [Shopify API versioning](https://shopify.dev/api/usage/versioning).
 * Versions are commonly referred to by their handle (for example, `2021-10`).
 *
 */
export type Shopify_ApiVersion = {
  __typename?: 'shopify_ApiVersion';
  /** The human-readable name of the version. */
  displayName: Scalars['String'];
  /** The unique identifier of an ApiVersion. All supported API versions have a date-based (YYYY-MM) or `unstable` handle. */
  handle: Scalars['String'];
  /** Whether the version is actively supported by Shopify. Supported API versions are guaranteed to be stable. Unsupported API versions include unstable, release candidate, and end-of-life versions that are marked as unsupported. For more information, refer to [Versioning](https://shopify.dev/api/usage/versioning). */
  supported: Scalars['Boolean'];
};

/** Details about the gift card used on the checkout. */
export type Shopify_AppliedGiftCard = Shopify_Node & {
  __typename?: 'shopify_AppliedGiftCard';
  /** The amount that was taken from the gift card by applying it. */
  amountUsed: Shopify_MoneyV2;
  /** The amount that was taken from the gift card by applying it. */
  amountUsedV2: Shopify_MoneyV2;
  /** The amount left on the gift card. */
  balance: Shopify_MoneyV2;
  /** The amount left on the gift card. */
  balanceV2: Shopify_MoneyV2;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The last characters of the gift card. */
  lastCharacters: Scalars['String'];
  /** The amount that was applied to the checkout in its currency. */
  presentmentAmountUsed: Shopify_MoneyV2;
};

/** An article in an online store blog. */
export type Shopify_Article = Shopify_HasMetafields &
  Shopify_Node &
  Shopify_OnlineStorePublishable & {
    __typename?: 'shopify_Article';
    /** The article's author. */
    author: Shopify_ArticleAuthor;
    /** The article's author. */
    authorV2: Maybe<Shopify_ArticleAuthor>;
    /** The blog that the article belongs to. */
    blog: Shopify_Blog;
    /** List of comments posted on the article. */
    comments: Shopify_CommentConnection;
    /** Stripped content of the article, single line with HTML tags removed. */
    content: Scalars['String'];
    /** The content of the article, complete with HTML formatting. */
    contentHtml: Scalars['shopify_HTML'];
    /** Stripped excerpt of the article, single line with HTML tags removed. */
    excerpt: Maybe<Scalars['String']>;
    /** The excerpt of the article, complete with HTML formatting. */
    excerptHtml: Maybe<Scalars['shopify_HTML']>;
    /**
     * A human-friendly unique string for the Article automatically generated from its title.
     *
     */
    handle: Scalars['String'];
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** The image associated with the article. */
    image: Maybe<Shopify_Image>;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /**
     * The metafields associated with the resource matching the supplied list of namespaces and keys.
     *
     */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
    onlineStoreUrl: Maybe<Scalars['shopify_URL']>;
    /** The date and time when the article was published. */
    publishedAt: Scalars['shopify_DateTime'];
    /** The article’s SEO information. */
    seo: Maybe<Shopify_Seo>;
    /** A categorization that a article can be tagged with. */
    tags: Array<Scalars['String']>;
    /** The article’s name. */
    title: Scalars['String'];
  };

/** An article in an online store blog. */
export type Shopify_ArticleCommentsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/** An article in an online store blog. */
export type Shopify_ArticleContentArgs = {
  truncateAt: InputMaybe<Scalars['Int']>;
};

/** An article in an online store blog. */
export type Shopify_ArticleExcerptArgs = {
  truncateAt: InputMaybe<Scalars['Int']>;
};

/** An article in an online store blog. */
export type Shopify_ArticleMetafieldArgs = {
  key: Scalars['String'];
  namespace: Scalars['String'];
};

/** An article in an online store blog. */
export type Shopify_ArticleMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** The author of an article. */
export type Shopify_ArticleAuthor = {
  __typename?: 'shopify_ArticleAuthor';
  /** The author's bio. */
  bio: Maybe<Scalars['String']>;
  /** The author’s email. */
  email: Scalars['String'];
  /** The author's first name. */
  firstName: Scalars['String'];
  /** The author's last name. */
  lastName: Scalars['String'];
  /** The author's full name. */
  name: Scalars['String'];
};

/**
 * An auto-generated type for paginating through multiple Articles.
 *
 */
export type Shopify_ArticleConnection = {
  __typename?: 'shopify_ArticleConnection';
  /** A list of edges. */
  edges: Array<Shopify_ArticleEdge>;
  /** A list of the nodes contained in ArticleEdge. */
  nodes: Array<Shopify_Article>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one Article and a cursor during pagination.
 *
 */
export type Shopify_ArticleEdge = {
  __typename?: 'shopify_ArticleEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of ArticleEdge. */
  node: Shopify_Article;
};

/** The set of valid sort keys for the Article query. */
export enum Shopify_ArticleSortKeys {
  /** Sort by the `author` value. */
  Author = 'AUTHOR',
  /** Sort by the `blog_title` value. */
  BlogTitle = 'BLOG_TITLE',
  /** Sort by the `id` value. */
  Id = 'ID',
  /** Sort by the `published_at` value. */
  PublishedAt = 'PUBLISHED_AT',
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  Relevance = 'RELEVANCE',
  /** Sort by the `title` value. */
  Title = 'TITLE',
  /** Sort by the `updated_at` value. */
  UpdatedAt = 'UPDATED_AT',
}

/** Represents a generic custom attribute. */
export type Shopify_Attribute = {
  __typename?: 'shopify_Attribute';
  /** Key or name of the attribute. */
  key: Scalars['String'];
  /** Value of the attribute. */
  value: Maybe<Scalars['String']>;
};

/** Specifies the input fields required for an attribute. */
export type Shopify_AttributeInput = {
  /** Key or name of the attribute. */
  key: Scalars['String'];
  /** Value of the attribute. */
  value: Scalars['String'];
};

/**
 * Automatic discount applications capture the intentions of a discount that was automatically applied.
 *
 */
export type Shopify_AutomaticDiscountApplication =
  Shopify_DiscountApplication & {
    __typename?: 'shopify_AutomaticDiscountApplication';
    /** The method by which the discount's value is allocated to its entitled items. */
    allocationMethod: Shopify_DiscountApplicationAllocationMethod;
    /** Which lines of targetType that the discount is allocated over. */
    targetSelection: Shopify_DiscountApplicationTargetSelection;
    /** The type of line that the discount is applicable towards. */
    targetType: Shopify_DiscountApplicationTargetType;
    /** The title of the application. */
    title: Scalars['String'];
    /** The value of the discount application. */
    value: Shopify_PricingValue;
  };

/** A collection of available shipping rates for a checkout. */
export type Shopify_AvailableShippingRates = {
  __typename?: 'shopify_AvailableShippingRates';
  /**
   * Whether or not the shipping rates are ready.
   * The `shippingRates` field is `null` when this value is `false`.
   * This field should be polled until its value becomes `true`.
   *
   */
  ready: Scalars['Boolean'];
  /** The fetched shipping rates. `null` until the `ready` field is `true`. */
  shippingRates: Maybe<Array<Shopify_ShippingRate>>;
};

/** An online store blog. */
export type Shopify_Blog = Shopify_HasMetafields &
  Shopify_Node &
  Shopify_OnlineStorePublishable & {
    __typename?: 'shopify_Blog';
    /** Find an article by its handle. */
    articleByHandle: Maybe<Shopify_Article>;
    /** List of the blog's articles. */
    articles: Shopify_ArticleConnection;
    /** The authors who have contributed to the blog. */
    authors: Array<Shopify_ArticleAuthor>;
    /**
     * A human-friendly unique string for the Blog automatically generated from its title.
     *
     */
    handle: Scalars['String'];
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /**
     * The metafields associated with the resource matching the supplied list of namespaces and keys.
     *
     */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
    onlineStoreUrl: Maybe<Scalars['shopify_URL']>;
    /** The blog's SEO information. */
    seo: Maybe<Shopify_Seo>;
    /** The blogs’s title. */
    title: Scalars['String'];
  };

/** An online store blog. */
export type Shopify_BlogArticleByHandleArgs = {
  handle: Scalars['String'];
};

/** An online store blog. */
export type Shopify_BlogArticlesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  query: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_ArticleSortKeys>;
};

/** An online store blog. */
export type Shopify_BlogMetafieldArgs = {
  key: Scalars['String'];
  namespace: Scalars['String'];
};

/** An online store blog. */
export type Shopify_BlogMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/**
 * An auto-generated type for paginating through multiple Blogs.
 *
 */
export type Shopify_BlogConnection = {
  __typename?: 'shopify_BlogConnection';
  /** A list of edges. */
  edges: Array<Shopify_BlogEdge>;
  /** A list of the nodes contained in BlogEdge. */
  nodes: Array<Shopify_Blog>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one Blog and a cursor during pagination.
 *
 */
export type Shopify_BlogEdge = {
  __typename?: 'shopify_BlogEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of BlogEdge. */
  node: Shopify_Blog;
};

/** The set of valid sort keys for the Blog query. */
export enum Shopify_BlogSortKeys {
  /** Sort by the `handle` value. */
  Handle = 'HANDLE',
  /** Sort by the `id` value. */
  Id = 'ID',
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  Relevance = 'RELEVANCE',
  /** Sort by the `title` value. */
  Title = 'TITLE',
}

/**
 * The store's branding configuration.
 *
 */
export type Shopify_Brand = {
  __typename?: 'shopify_Brand';
  /** The colors of the store's brand. */
  colors: Shopify_BrandColors;
  /** The store's cover image. */
  coverImage: Maybe<Shopify_MediaImage>;
  /** The store's default logo. */
  logo: Maybe<Shopify_MediaImage>;
  /** The store's short description. */
  shortDescription: Maybe<Scalars['String']>;
  /** The store's slogan. */
  slogan: Maybe<Scalars['String']>;
  /** The store's preferred logo for square UI elements. */
  squareLogo: Maybe<Shopify_MediaImage>;
};

/**
 * A group of related colors for the shop's brand.
 *
 */
export type Shopify_BrandColorGroup = {
  __typename?: 'shopify_BrandColorGroup';
  /** The background color. */
  background: Maybe<Scalars['shopify_Color']>;
  /** The foreground color. */
  foreground: Maybe<Scalars['shopify_Color']>;
};

/**
 * The colors of the shop's brand.
 *
 */
export type Shopify_BrandColors = {
  __typename?: 'shopify_BrandColors';
  /** The shop's primary brand colors. */
  primary: Array<Shopify_BrandColorGroup>;
  /** The shop's secondary brand colors. */
  secondary: Array<Shopify_BrandColorGroup>;
};

/** Card brand, such as Visa or Mastercard, which can be used for payments. */
export enum Shopify_CardBrand {
  /** American Express. */
  AmericanExpress = 'AMERICAN_EXPRESS',
  /** Diners Club. */
  DinersClub = 'DINERS_CLUB',
  /** Discover. */
  Discover = 'DISCOVER',
  /** JCB. */
  Jcb = 'JCB',
  /** Mastercard. */
  Mastercard = 'MASTERCARD',
  /** Visa. */
  Visa = 'VISA',
}

/**
 * A cart represents the merchandise that a buyer intends to purchase,
 * and the estimated cost associated with the cart. Learn how to
 * [interact with a cart](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
 * during a customer's session.
 *
 */
export type Shopify_Cart = Shopify_Node & {
  __typename?: 'shopify_Cart';
  /** An attribute associated with the cart. */
  attribute: Maybe<Shopify_Attribute>;
  /** The attributes associated with the cart. Attributes are represented as key-value pairs. */
  attributes: Array<Shopify_Attribute>;
  /** Information about the buyer that is interacting with the cart. */
  buyerIdentity: Shopify_CartBuyerIdentity;
  /** The URL of the checkout for the cart. */
  checkoutUrl: Scalars['shopify_URL'];
  /** The estimated costs that the buyer will pay at checkout. The costs are subject to change and changes will be reflected at checkout. The `cost` field uses the `buyerIdentity` field to determine [international pricing](https://shopify.dev/custom-storefronts/internationalization/international-pricing). */
  cost: Shopify_CartCost;
  /** The date and time when the cart was created. */
  createdAt: Scalars['shopify_DateTime'];
  /**
   * The delivery groups available for the cart, based on the buyer identity default
   * delivery address preference or the default address of the logged-in customer.
   *
   */
  deliveryGroups: Shopify_CartDeliveryGroupConnection;
  /** The discounts that have been applied to the entire cart. */
  discountAllocations: Array<Shopify_CartDiscountAllocation>;
  /**
   * The case-insensitive discount codes that the customer added at checkout.
   *
   */
  discountCodes: Array<Shopify_CartDiscountCode>;
  /**
   * The estimated costs that the buyer will pay at checkout.
   * The estimated costs are subject to change and changes will be reflected at checkout.
   * The `estimatedCost` field uses the `buyerIdentity` field to determine
   * [international pricing](https://shopify.dev/custom-storefronts/internationalization/international-pricing).
   *
   */
  estimatedCost: Shopify_CartEstimatedCost;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** A list of lines containing information about the items the customer intends to purchase. */
  lines: Shopify_CartLineConnection;
  /** A note that is associated with the cart. For example, the note can be a personalized message to the buyer. */
  note: Maybe<Scalars['String']>;
  /** The total number of items in the cart. */
  totalQuantity: Scalars['Int'];
  /** The date and time when the cart was updated. */
  updatedAt: Scalars['shopify_DateTime'];
};

/**
 * A cart represents the merchandise that a buyer intends to purchase,
 * and the estimated cost associated with the cart. Learn how to
 * [interact with a cart](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
 * during a customer's session.
 *
 */
export type Shopify_CartAttributeArgs = {
  key: Scalars['String'];
};

/**
 * A cart represents the merchandise that a buyer intends to purchase,
 * and the estimated cost associated with the cart. Learn how to
 * [interact with a cart](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
 * during a customer's session.
 *
 */
export type Shopify_CartDeliveryGroupsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/**
 * A cart represents the merchandise that a buyer intends to purchase,
 * and the estimated cost associated with the cart. Learn how to
 * [interact with a cart](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
 * during a customer's session.
 *
 */
export type Shopify_CartLinesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/** Return type for `cartAttributesUpdate` mutation. */
export type Shopify_CartAttributesUpdatePayload = {
  __typename?: 'shopify_CartAttributesUpdatePayload';
  /** The updated cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/** The discounts automatically applied to the cart line based on prerequisites that have been met. */
export type Shopify_CartAutomaticDiscountAllocation =
  Shopify_CartDiscountAllocation & {
    __typename?: 'shopify_CartAutomaticDiscountAllocation';
    /** The discounted amount that has been applied to the cart line. */
    discountedAmount: Shopify_MoneyV2;
    /** The title of the allocated discount. */
    title: Scalars['String'];
  };

/** Represents information about the buyer that is interacting with the cart. */
export type Shopify_CartBuyerIdentity = {
  __typename?: 'shopify_CartBuyerIdentity';
  /** The country where the buyer is located. */
  countryCode: Maybe<Shopify_CountryCode>;
  /** The customer account associated with the cart. */
  customer: Maybe<Shopify_Customer>;
  /**
   * An ordered set of delivery addresses tied to the buyer that is interacting with the cart.
   * The rank of the preferences is determined by the order of the addresses in the array. Preferences
   * can be used to populate relevant fields in the checkout flow.
   *
   */
  deliveryAddressPreferences: Array<Shopify_DeliveryAddress>;
  /** The email address of the buyer that is interacting with the cart. */
  email: Maybe<Scalars['String']>;
  /** The phone number of the buyer that is interacting with the cart. */
  phone: Maybe<Scalars['String']>;
};

/**
 * Specifies the input fields to update the buyer information associated with a cart.
 * Buyer identity is used to determine
 * [international pricing](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
 * and should match the customer's shipping address.
 *
 */
export type Shopify_CartBuyerIdentityInput = {
  /** The country where the buyer is located. */
  countryCode: InputMaybe<Shopify_CountryCode>;
  /** The access token used to identify the customer associated with the cart. */
  customerAccessToken: InputMaybe<Scalars['String']>;
  /**
   * An ordered set of delivery addresses tied to the buyer that is interacting with the cart.
   * The rank of the preferences is determined by the order of the addresses in the array. Preferences
   * can be used to populate relevant fields in the checkout flow.
   *
   */
  deliveryAddressPreferences: InputMaybe<Array<Shopify_DeliveryAddressInput>>;
  /** The email address of the buyer that is interacting with the cart. */
  email: InputMaybe<Scalars['String']>;
  /** The phone number of the buyer that is interacting with the cart. */
  phone: InputMaybe<Scalars['String']>;
};

/** Return type for `cartBuyerIdentityUpdate` mutation. */
export type Shopify_CartBuyerIdentityUpdatePayload = {
  __typename?: 'shopify_CartBuyerIdentityUpdatePayload';
  /** The updated cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/** The discount that has been applied to the cart line using a discount code. */
export type Shopify_CartCodeDiscountAllocation =
  Shopify_CartDiscountAllocation & {
    __typename?: 'shopify_CartCodeDiscountAllocation';
    /** The code used to apply the discount. */
    code: Scalars['String'];
    /** The discounted amount that has been applied to the cart line. */
    discountedAmount: Shopify_MoneyV2;
  };

/**
 * The costs that the buyer will pay at checkout.
 * The cart cost uses [`CartBuyerIdentity`](https://shopify.dev/api/storefront/reference/cart/cartbuyeridentity) to determine
 * [international pricing](https://shopify.dev/custom-storefronts/internationalization/international-pricing).
 *
 */
export type Shopify_CartCost = {
  __typename?: 'shopify_CartCost';
  /** The estimated amount, before taxes and discounts, for the customer to pay at checkout. The checkout charge amount doesn't include any deferred payments that'll be paid at a later date. If the cart has no deferred payments, then the checkout charge amount is equivalent to `subtotalAmount`. */
  checkoutChargeAmount: Shopify_MoneyV2;
  /** The amount, before taxes and cart-level discounts, for the customer to pay. */
  subtotalAmount: Shopify_MoneyV2;
  /** Whether the subtotal amount is estimated. */
  subtotalAmountEstimated: Scalars['Boolean'];
  /** The total amount for the customer to pay. */
  totalAmount: Shopify_MoneyV2;
  /** Whether the total amount is estimated. */
  totalAmountEstimated: Scalars['Boolean'];
  /** The duty amount for the customer to pay at checkout. */
  totalDutyAmount: Maybe<Shopify_MoneyV2>;
  /** Whether the total duty amount is estimated. */
  totalDutyAmountEstimated: Scalars['Boolean'];
  /** The tax amount for the customer to pay at checkout. */
  totalTaxAmount: Maybe<Shopify_MoneyV2>;
  /** Whether the total tax amount is estimated. */
  totalTaxAmountEstimated: Scalars['Boolean'];
};

/** Return type for `cartCreate` mutation. */
export type Shopify_CartCreatePayload = {
  __typename?: 'shopify_CartCreatePayload';
  /** The new cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/** The discounts automatically applied to the cart line based on prerequisites that have been met. */
export type Shopify_CartCustomDiscountAllocation =
  Shopify_CartDiscountAllocation & {
    __typename?: 'shopify_CartCustomDiscountAllocation';
    /** The discounted amount that has been applied to the cart line. */
    discountedAmount: Shopify_MoneyV2;
    /** The title of the allocated discount. */
    title: Scalars['String'];
  };

/** Information about the options available for one or more line items to be delivered to a specific address. */
export type Shopify_CartDeliveryGroup = {
  __typename?: 'shopify_CartDeliveryGroup';
  /** A list of cart lines for the delivery group. */
  cartLines: Shopify_CartLineConnection;
  /** The destination address for the delivery group. */
  deliveryAddress: Shopify_MailingAddress;
  /** The delivery options available for the delivery group. */
  deliveryOptions: Array<Shopify_CartDeliveryOption>;
  /** The ID for the delivery group. */
  id: Scalars['ID'];
  /** The selected delivery option for the delivery group. */
  selectedDeliveryOption: Maybe<Shopify_CartDeliveryOption>;
};

/** Information about the options available for one or more line items to be delivered to a specific address. */
export type Shopify_CartDeliveryGroupCartLinesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/**
 * An auto-generated type for paginating through multiple CartDeliveryGroups.
 *
 */
export type Shopify_CartDeliveryGroupConnection = {
  __typename?: 'shopify_CartDeliveryGroupConnection';
  /** A list of edges. */
  edges: Array<Shopify_CartDeliveryGroupEdge>;
  /** A list of the nodes contained in CartDeliveryGroupEdge. */
  nodes: Array<Shopify_CartDeliveryGroup>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one CartDeliveryGroup and a cursor during pagination.
 *
 */
export type Shopify_CartDeliveryGroupEdge = {
  __typename?: 'shopify_CartDeliveryGroupEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of CartDeliveryGroupEdge. */
  node: Shopify_CartDeliveryGroup;
};

/** Information about a delivery option. */
export type Shopify_CartDeliveryOption = {
  __typename?: 'shopify_CartDeliveryOption';
  /** The code of the delivery option. */
  code: Maybe<Scalars['String']>;
  /** The method for the delivery option. */
  deliveryMethodType: Shopify_DeliveryMethodType;
  /** The description of the delivery option. */
  description: Maybe<Scalars['String']>;
  /** The estimated cost for the delivery option. */
  estimatedCost: Shopify_MoneyV2;
  /** The unique identifier of the delivery option. */
  handle: Scalars['String'];
  /** The title of the delivery option. */
  title: Maybe<Scalars['String']>;
};

/** The discounts that have been applied to the cart line. */
export type Shopify_CartDiscountAllocation = {
  /** The discounted amount that has been applied to the cart line. */
  discountedAmount: Shopify_MoneyV2;
};

/** The discount codes applied to the cart. */
export type Shopify_CartDiscountCode = {
  __typename?: 'shopify_CartDiscountCode';
  /** Whether the discount code is applicable to the cart's current contents. */
  applicable: Scalars['Boolean'];
  /** The code for the discount. */
  code: Scalars['String'];
};

/** Return type for `cartDiscountCodesUpdate` mutation. */
export type Shopify_CartDiscountCodesUpdatePayload = {
  __typename?: 'shopify_CartDiscountCodesUpdatePayload';
  /** The updated cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/** Possible error codes that can be returned by `CartUserError`. */
export enum Shopify_CartErrorCode {
  /** The input value is invalid. */
  Invalid = 'INVALID',
  /** Merchandise line was not found in cart. */
  InvalidMerchandiseLine = 'INVALID_MERCHANDISE_LINE',
  /** The input value should be less than the maximum value allowed. */
  LessThan = 'LESS_THAN',
  /** Missing discount code. */
  MissingDiscountCode = 'MISSING_DISCOUNT_CODE',
  /** Missing note. */
  MissingNote = 'MISSING_NOTE',
}

/**
 * The estimated costs that the buyer will pay at checkout.
 * The estimated cost uses
 * [`CartBuyerIdentity`](https://shopify.dev/api/storefront/reference/cart/cartbuyeridentity)
 * to determine
 * [international pricing](https://shopify.dev/custom-storefronts/internationalization/international-pricing).
 *
 */
export type Shopify_CartEstimatedCost = {
  __typename?: 'shopify_CartEstimatedCost';
  /** The estimated amount, before taxes and discounts, for the customer to pay at checkout. The checkout charge amount doesn't include any deferred payments that'll be paid at a later date. If the cart has no deferred payments, then the checkout charge amount is equivalent to`subtotal_amount`. */
  checkoutChargeAmount: Shopify_MoneyV2;
  /** The estimated amount, before taxes and discounts, for the customer to pay. */
  subtotalAmount: Shopify_MoneyV2;
  /** The estimated total amount for the customer to pay. */
  totalAmount: Shopify_MoneyV2;
  /** The estimated duty amount for the customer to pay at checkout. */
  totalDutyAmount: Maybe<Shopify_MoneyV2>;
  /** The estimated tax amount for the customer to pay at checkout. */
  totalTaxAmount: Maybe<Shopify_MoneyV2>;
};

/** Specifies the input fields to create a cart. */
export type Shopify_CartInput = {
  /** An array of key-value pairs that contains additional information about the cart. */
  attributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /**
   * The customer associated with the cart. Used to determine [international pricing]
   * (https://shopify.dev/custom-storefronts/internationalization/international-pricing).
   * Buyer identity should match the customer's shipping address.
   *
   */
  buyerIdentity: InputMaybe<Shopify_CartBuyerIdentityInput>;
  /**
   * The case-insensitive discount codes that the customer added at checkout.
   *
   */
  discountCodes: InputMaybe<Array<Scalars['String']>>;
  /** A list of merchandise lines to add to the cart. */
  lines: InputMaybe<Array<Shopify_CartLineInput>>;
  /** A note that is associated with the cart. For example, the note can be a personalized message to the buyer. */
  note: InputMaybe<Scalars['String']>;
};

/** Represents information about the merchandise in the cart. */
export type Shopify_CartLine = Shopify_Node & {
  __typename?: 'shopify_CartLine';
  /** An attribute associated with the cart line. */
  attribute: Maybe<Shopify_Attribute>;
  /** The attributes associated with the cart line. Attributes are represented as key-value pairs. */
  attributes: Array<Shopify_Attribute>;
  /** The cost of the merchandise that the buyer will pay for at checkout. The costs are subject to change and changes will be reflected at checkout. */
  cost: Shopify_CartLineCost;
  /** The discounts that have been applied to the cart line. */
  discountAllocations: Array<Shopify_CartDiscountAllocation>;
  /** The estimated cost of the merchandise that the buyer will pay for at checkout. The estimated costs are subject to change and changes will be reflected at checkout. */
  estimatedCost: Shopify_CartLineEstimatedCost;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The merchandise that the buyer intends to purchase. */
  merchandise: Shopify_Merchandise;
  /** The quantity of the merchandise that the customer intends to purchase. */
  quantity: Scalars['Int'];
  /** The selling plan associated with the cart line and the effect that each selling plan has on variants when they're purchased. */
  sellingPlanAllocation: Maybe<Shopify_SellingPlanAllocation>;
};

/** Represents information about the merchandise in the cart. */
export type Shopify_CartLineAttributeArgs = {
  key: Scalars['String'];
};

/**
 * An auto-generated type for paginating through multiple CartLines.
 *
 */
export type Shopify_CartLineConnection = {
  __typename?: 'shopify_CartLineConnection';
  /** A list of edges. */
  edges: Array<Shopify_CartLineEdge>;
  /** A list of the nodes contained in CartLineEdge. */
  nodes: Array<Shopify_CartLine>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/** The cost of the merchandise line that the buyer will pay at checkout. */
export type Shopify_CartLineCost = {
  __typename?: 'shopify_CartLineCost';
  /** The amount of the merchandise line. */
  amountPerQuantity: Shopify_MoneyV2;
  /** The compare at amount of the merchandise line. */
  compareAtAmountPerQuantity: Maybe<Shopify_MoneyV2>;
  /** The cost of the merchandise line before line-level discounts. */
  subtotalAmount: Shopify_MoneyV2;
  /** The total cost of the merchandise line. */
  totalAmount: Shopify_MoneyV2;
};

/**
 * An auto-generated type which holds one CartLine and a cursor during pagination.
 *
 */
export type Shopify_CartLineEdge = {
  __typename?: 'shopify_CartLineEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of CartLineEdge. */
  node: Shopify_CartLine;
};

/** The estimated cost of the merchandise line that the buyer will pay at checkout. */
export type Shopify_CartLineEstimatedCost = {
  __typename?: 'shopify_CartLineEstimatedCost';
  /** The amount of the merchandise line. */
  amount: Shopify_MoneyV2;
  /** The compare at amount of the merchandise line. */
  compareAtAmount: Maybe<Shopify_MoneyV2>;
  /** The estimated cost of the merchandise line before discounts. */
  subtotalAmount: Shopify_MoneyV2;
  /** The estimated total cost of the merchandise line. */
  totalAmount: Shopify_MoneyV2;
};

/** Specifies the input fields to create a merchandise line on a cart. */
export type Shopify_CartLineInput = {
  /** An array of key-value pairs that contains additional information about the merchandise line. */
  attributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The identifier of the merchandise that the buyer intends to purchase. */
  merchandiseId: Scalars['ID'];
  /** The quantity of the merchandise. */
  quantity: InputMaybe<Scalars['Int']>;
  /** The identifier of the selling plan that the merchandise is being purchased with. */
  sellingPlanId: InputMaybe<Scalars['ID']>;
};

/** Specifies the input fields to update a line item on a cart. */
export type Shopify_CartLineUpdateInput = {
  /** An array of key-value pairs that contains additional information about the merchandise line. */
  attributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The identifier of the merchandise line. */
  id: Scalars['ID'];
  /** The identifier of the merchandise for the line item. */
  merchandiseId: InputMaybe<Scalars['ID']>;
  /** The quantity of the line item. */
  quantity: InputMaybe<Scalars['Int']>;
  /** The identifier of the selling plan that the merchandise is being purchased with. */
  sellingPlanId: InputMaybe<Scalars['ID']>;
};

/** Return type for `cartLinesAdd` mutation. */
export type Shopify_CartLinesAddPayload = {
  __typename?: 'shopify_CartLinesAddPayload';
  /** The updated cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/** Return type for `cartLinesRemove` mutation. */
export type Shopify_CartLinesRemovePayload = {
  __typename?: 'shopify_CartLinesRemovePayload';
  /** The updated cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/** Return type for `cartLinesUpdate` mutation. */
export type Shopify_CartLinesUpdatePayload = {
  __typename?: 'shopify_CartLinesUpdatePayload';
  /** The updated cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/** Return type for `cartNoteUpdate` mutation. */
export type Shopify_CartNoteUpdatePayload = {
  __typename?: 'shopify_CartNoteUpdatePayload';
  /** The updated cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/**
 * The input fields for updating the selected delivery options for a delivery group.
 *
 */
export type Shopify_CartSelectedDeliveryOptionInput = {
  /** The ID of the cart delivery group. */
  deliveryGroupId: Scalars['ID'];
  /** The handle of the selected delivery option. */
  deliveryOptionHandle: Scalars['String'];
};

/** Return type for `cartSelectedDeliveryOptionsUpdate` mutation. */
export type Shopify_CartSelectedDeliveryOptionsUpdatePayload = {
  __typename?: 'shopify_CartSelectedDeliveryOptionsUpdatePayload';
  /** The updated cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/** Represents an error that happens during execution of a cart mutation. */
export type Shopify_CartUserError = Shopify_DisplayableError & {
  __typename?: 'shopify_CartUserError';
  /** The error code. */
  code: Maybe<Shopify_CartErrorCode>;
  /** The path to the input field that caused the error. */
  field: Maybe<Array<Scalars['String']>>;
  /** The error message. */
  message: Scalars['String'];
};

/** A container for all the information required to checkout items and pay. */
export type Shopify_Checkout = Shopify_Node & {
  __typename?: 'shopify_Checkout';
  /** The gift cards used on the checkout. */
  appliedGiftCards: Array<Shopify_AppliedGiftCard>;
  /**
   * The available shipping rates for this Checkout.
   * Should only be used when checkout `requiresShipping` is `true` and
   * the shipping address is valid.
   *
   */
  availableShippingRates: Maybe<Shopify_AvailableShippingRates>;
  /** The identity of the customer associated with the checkout. */
  buyerIdentity: Shopify_CheckoutBuyerIdentity;
  /** The date and time when the checkout was completed. */
  completedAt: Maybe<Scalars['shopify_DateTime']>;
  /** The date and time when the checkout was created. */
  createdAt: Scalars['shopify_DateTime'];
  /** The currency code for the checkout. */
  currencyCode: Shopify_CurrencyCode;
  /** A list of extra information that is added to the checkout. */
  customAttributes: Array<Shopify_Attribute>;
  /** Discounts that have been applied on the checkout. */
  discountApplications: Shopify_DiscountApplicationConnection;
  /** The email attached to this checkout. */
  email: Maybe<Scalars['String']>;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** A list of line item objects, each one containing information about an item in the checkout. */
  lineItems: Shopify_CheckoutLineItemConnection;
  /** The sum of all the prices of all the items in the checkout. Duties, taxes, shipping and discounts excluded. */
  lineItemsSubtotalPrice: Shopify_MoneyV2;
  /** The note associated with the checkout. */
  note: Maybe<Scalars['String']>;
  /** The resulting order from a paid checkout. */
  order: Maybe<Shopify_Order>;
  /** The Order Status Page for this Checkout, null when checkout is not completed. */
  orderStatusUrl: Maybe<Scalars['shopify_URL']>;
  /** The amount left to be paid. This is equal to the cost of the line items, taxes, and shipping, minus discounts and gift cards. */
  paymentDue: Shopify_MoneyV2;
  /** The amount left to be paid. This is equal to the cost of the line items, duties, taxes, and shipping, minus discounts and gift cards. */
  paymentDueV2: Shopify_MoneyV2;
  /**
   * Whether or not the Checkout is ready and can be completed. Checkouts may
   * have asynchronous operations that can take time to finish. If you want
   * to complete a checkout or ensure all the fields are populated and up to
   * date, polling is required until the value is true.
   *
   */
  ready: Scalars['Boolean'];
  /** States whether or not the fulfillment requires shipping. */
  requiresShipping: Scalars['Boolean'];
  /** The shipping address to where the line items will be shipped. */
  shippingAddress: Maybe<Shopify_MailingAddress>;
  /**
   * The discounts that have been allocated onto the shipping line by discount applications.
   *
   */
  shippingDiscountAllocations: Array<Shopify_DiscountAllocation>;
  /** Once a shipping rate is selected by the customer it is transitioned to a `shipping_line` object. */
  shippingLine: Maybe<Shopify_ShippingRate>;
  /** The price at checkout before shipping and taxes. */
  subtotalPrice: Shopify_MoneyV2;
  /** The price at checkout before duties, shipping, and taxes. */
  subtotalPriceV2: Shopify_MoneyV2;
  /** Whether the checkout is tax exempt. */
  taxExempt: Scalars['Boolean'];
  /** Whether taxes are included in the line item and shipping line prices. */
  taxesIncluded: Scalars['Boolean'];
  /** The sum of all the duties applied to the line items in the checkout. */
  totalDuties: Maybe<Shopify_MoneyV2>;
  /** The sum of all the prices of all the items in the checkout, including taxes and duties. */
  totalPrice: Shopify_MoneyV2;
  /** The sum of all the prices of all the items in the checkout, including taxes and duties. */
  totalPriceV2: Shopify_MoneyV2;
  /** The sum of all the taxes applied to the line items and shipping lines in the checkout. */
  totalTax: Shopify_MoneyV2;
  /** The sum of all the taxes applied to the line items and shipping lines in the checkout. */
  totalTaxV2: Shopify_MoneyV2;
  /** The date and time when the checkout was last updated. */
  updatedAt: Scalars['shopify_DateTime'];
  /** The url pointing to the checkout accessible from the web. */
  webUrl: Scalars['shopify_URL'];
};

/** A container for all the information required to checkout items and pay. */
export type Shopify_CheckoutDiscountApplicationsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/** A container for all the information required to checkout items and pay. */
export type Shopify_CheckoutLineItemsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/** Specifies the fields required to update a checkout's attributes. */
export type Shopify_CheckoutAttributesUpdateV2Input = {
  /**
   * Allows setting partial addresses on a Checkout, skipping the full validation of attributes.
   * The required attributes are city, province, and country.
   * Full validation of the addresses is still done at completion time. Defaults to `false` with
   * each operation.
   *
   */
  allowPartialAddresses: InputMaybe<Scalars['Boolean']>;
  /** A list of extra information that is added to the checkout. */
  customAttributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The text of an optional note that a shop owner can attach to the checkout. */
  note: InputMaybe<Scalars['String']>;
};

/** Return type for `checkoutAttributesUpdateV2` mutation. */
export type Shopify_CheckoutAttributesUpdateV2Payload = {
  __typename?: 'shopify_CheckoutAttributesUpdateV2Payload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** The identity of the customer associated with the checkout. */
export type Shopify_CheckoutBuyerIdentity = {
  __typename?: 'shopify_CheckoutBuyerIdentity';
  /** The country code for the checkout. For example, `CA`. */
  countryCode: Maybe<Shopify_CountryCode>;
};

/** Specifies the identity of the customer associated with the checkout. */
export type Shopify_CheckoutBuyerIdentityInput = {
  /**
   * The country code of one of the shop's
   * [enabled countries](https://help.shopify.com/en/manual/payments/shopify-payments/multi-currency/setup).
   * For example, `CA`. Including this field creates a checkout in the specified country's currency.
   *
   */
  countryCode: Shopify_CountryCode;
};

/** Return type for `checkoutCompleteFree` mutation. */
export type Shopify_CheckoutCompleteFreePayload = {
  __typename?: 'shopify_CheckoutCompleteFreePayload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutCompleteWithCreditCardV2` mutation. */
export type Shopify_CheckoutCompleteWithCreditCardV2Payload = {
  __typename?: 'shopify_CheckoutCompleteWithCreditCardV2Payload';
  /** The checkout on which the payment was applied. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** A representation of the attempted payment. */
  payment: Maybe<Shopify_Payment>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutCompleteWithTokenizedPaymentV3` mutation. */
export type Shopify_CheckoutCompleteWithTokenizedPaymentV3Payload = {
  __typename?: 'shopify_CheckoutCompleteWithTokenizedPaymentV3Payload';
  /** The checkout on which the payment was applied. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** A representation of the attempted payment. */
  payment: Maybe<Shopify_Payment>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Specifies the fields required to create a checkout. */
export type Shopify_CheckoutCreateInput = {
  /**
   * Allows setting partial addresses on a Checkout, skipping the full validation of attributes.
   * The required attributes are city, province, and country.
   * Full validation of addresses is still done at completion time. Defaults to `null`.
   *
   */
  allowPartialAddresses: InputMaybe<Scalars['Boolean']>;
  /** The identity of the customer associated with the checkout. */
  buyerIdentity: InputMaybe<Shopify_CheckoutBuyerIdentityInput>;
  /** A list of extra information that is added to the checkout. */
  customAttributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The email with which the customer wants to checkout. */
  email: InputMaybe<Scalars['String']>;
  /** A list of line item objects, each one containing information about an item in the checkout. */
  lineItems: InputMaybe<Array<Shopify_CheckoutLineItemInput>>;
  /** The text of an optional note that a shop owner can attach to the checkout. */
  note: InputMaybe<Scalars['String']>;
  /** The shipping address to where the line items will be shipped. */
  shippingAddress: InputMaybe<Shopify_MailingAddressInput>;
};

/** Return type for `checkoutCreate` mutation. */
export type Shopify_CheckoutCreatePayload = {
  __typename?: 'shopify_CheckoutCreatePayload';
  /** The new checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The checkout queue token. Available only to selected stores. */
  queueToken: Maybe<Scalars['String']>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutCustomerAssociateV2` mutation. */
export type Shopify_CheckoutCustomerAssociateV2Payload = {
  __typename?: 'shopify_CheckoutCustomerAssociateV2Payload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The associated customer object. */
  customer: Maybe<Shopify_Customer>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutCustomerDisassociateV2` mutation. */
export type Shopify_CheckoutCustomerDisassociateV2Payload = {
  __typename?: 'shopify_CheckoutCustomerDisassociateV2Payload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutDiscountCodeApplyV2` mutation. */
export type Shopify_CheckoutDiscountCodeApplyV2Payload = {
  __typename?: 'shopify_CheckoutDiscountCodeApplyV2Payload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutDiscountCodeRemove` mutation. */
export type Shopify_CheckoutDiscountCodeRemovePayload = {
  __typename?: 'shopify_CheckoutDiscountCodeRemovePayload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutEmailUpdateV2` mutation. */
export type Shopify_CheckoutEmailUpdateV2Payload = {
  __typename?: 'shopify_CheckoutEmailUpdateV2Payload';
  /** The checkout object with the updated email. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Possible error codes that can be returned by `CheckoutUserError`. */
export enum Shopify_CheckoutErrorCode {
  /** Checkout is already completed. */
  AlreadyCompleted = 'ALREADY_COMPLETED',
  /** Input email contains an invalid domain name. */
  BadDomain = 'BAD_DOMAIN',
  /** The input value is blank. */
  Blank = 'BLANK',
  /** Cart does not meet discount requirements notice. */
  CartDoesNotMeetDiscountRequirementsNotice = 'CART_DOES_NOT_MEET_DISCOUNT_REQUIREMENTS_NOTICE',
  /** Customer already used once per customer discount notice. */
  CustomerAlreadyUsedOncePerCustomerDiscountNotice = 'CUSTOMER_ALREADY_USED_ONCE_PER_CUSTOMER_DISCOUNT_NOTICE',
  /** Discount already applied. */
  DiscountAlreadyApplied = 'DISCOUNT_ALREADY_APPLIED',
  /** Discount code isn't working right now. Please contact us for help. */
  DiscountCodeApplicationFailed = 'DISCOUNT_CODE_APPLICATION_FAILED',
  /** Discount disabled. */
  DiscountDisabled = 'DISCOUNT_DISABLED',
  /** Discount expired. */
  DiscountExpired = 'DISCOUNT_EXPIRED',
  /** Discount limit reached. */
  DiscountLimitReached = 'DISCOUNT_LIMIT_REACHED',
  /** Discount not found. */
  DiscountNotFound = 'DISCOUNT_NOT_FOUND',
  /** Checkout is already completed. */
  Empty = 'EMPTY',
  /** Queue token has expired. */
  ExpiredQueueToken = 'EXPIRED_QUEUE_TOKEN',
  /** Gift card has already been applied. */
  GiftCardAlreadyApplied = 'GIFT_CARD_ALREADY_APPLIED',
  /** Gift card code is invalid. */
  GiftCardCodeInvalid = 'GIFT_CARD_CODE_INVALID',
  /** Gift card currency does not match checkout currency. */
  GiftCardCurrencyMismatch = 'GIFT_CARD_CURRENCY_MISMATCH',
  /** Gift card has no funds left. */
  GiftCardDepleted = 'GIFT_CARD_DEPLETED',
  /** Gift card is disabled. */
  GiftCardDisabled = 'GIFT_CARD_DISABLED',
  /** Gift card is expired. */
  GiftCardExpired = 'GIFT_CARD_EXPIRED',
  /** Gift card was not found. */
  GiftCardNotFound = 'GIFT_CARD_NOT_FOUND',
  /** Gift card cannot be applied to a checkout that contains a gift card. */
  GiftCardUnusable = 'GIFT_CARD_UNUSABLE',
  /** The input value should be greater than or equal to the minimum value allowed. */
  GreaterThanOrEqualTo = 'GREATER_THAN_OR_EQUAL_TO',
  /** Higher value discount applied. */
  HigherValueDiscountApplied = 'HIGHER_VALUE_DISCOUNT_APPLIED',
  /** The input value is invalid. */
  Invalid = 'INVALID',
  /** Cannot specify country and presentment currency code. */
  InvalidCountryAndCurrency = 'INVALID_COUNTRY_AND_CURRENCY',
  /** Input Zip is invalid for country provided. */
  InvalidForCountry = 'INVALID_FOR_COUNTRY',
  /** Input Zip is invalid for country and province provided. */
  InvalidForCountryAndProvince = 'INVALID_FOR_COUNTRY_AND_PROVINCE',
  /** Invalid province in country. */
  InvalidProvinceInCountry = 'INVALID_PROVINCE_IN_COUNTRY',
  /** Queue token is invalid. */
  InvalidQueueToken = 'INVALID_QUEUE_TOKEN',
  /** Invalid region in country. */
  InvalidRegionInCountry = 'INVALID_REGION_IN_COUNTRY',
  /** Invalid state in country. */
  InvalidStateInCountry = 'INVALID_STATE_IN_COUNTRY',
  /** The input value should be less than the maximum value allowed. */
  LessThan = 'LESS_THAN',
  /** The input value should be less than or equal to the maximum value allowed. */
  LessThanOrEqualTo = 'LESS_THAN_OR_EQUAL_TO',
  /** Line item was not found in checkout. */
  LineItemNotFound = 'LINE_ITEM_NOT_FOUND',
  /** Checkout is locked. */
  Locked = 'LOCKED',
  /** Maximum number of discount codes limit reached. */
  MaximumDiscountCodeLimitReached = 'MAXIMUM_DISCOUNT_CODE_LIMIT_REACHED',
  /** Missing payment input. */
  MissingPaymentInput = 'MISSING_PAYMENT_INPUT',
  /** Not enough in stock. */
  NotEnoughInStock = 'NOT_ENOUGH_IN_STOCK',
  /** Input value is not supported. */
  NotSupported = 'NOT_SUPPORTED',
  /** The input value needs to be blank. */
  Present = 'PRESENT',
  /** Shipping rate expired. */
  ShippingRateExpired = 'SHIPPING_RATE_EXPIRED',
  /** Throttled during checkout. */
  ThrottledDuringCheckout = 'THROTTLED_DURING_CHECKOUT',
  /** The input value is too long. */
  TooLong = 'TOO_LONG',
  /** The amount of the payment does not match the value to be paid. */
  TotalPriceMismatch = 'TOTAL_PRICE_MISMATCH',
  /** Unable to apply discount. */
  UnableToApply = 'UNABLE_TO_APPLY',
}

/** Return type for `checkoutGiftCardRemoveV2` mutation. */
export type Shopify_CheckoutGiftCardRemoveV2Payload = {
  __typename?: 'shopify_CheckoutGiftCardRemoveV2Payload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutGiftCardsAppend` mutation. */
export type Shopify_CheckoutGiftCardsAppendPayload = {
  __typename?: 'shopify_CheckoutGiftCardsAppendPayload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** A single line item in the checkout, grouped by variant and attributes. */
export type Shopify_CheckoutLineItem = Shopify_Node & {
  __typename?: 'shopify_CheckoutLineItem';
  /** Extra information in the form of an array of Key-Value pairs about the line item. */
  customAttributes: Array<Shopify_Attribute>;
  /** The discounts that have been allocated onto the checkout line item by discount applications. */
  discountAllocations: Array<Shopify_DiscountAllocation>;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The quantity of the line item. */
  quantity: Scalars['Int'];
  /** Title of the line item. Defaults to the product's title. */
  title: Scalars['String'];
  /** Unit price of the line item. */
  unitPrice: Maybe<Shopify_MoneyV2>;
  /** Product variant of the line item. */
  variant: Maybe<Shopify_ProductVariant>;
};

/**
 * An auto-generated type for paginating through multiple CheckoutLineItems.
 *
 */
export type Shopify_CheckoutLineItemConnection = {
  __typename?: 'shopify_CheckoutLineItemConnection';
  /** A list of edges. */
  edges: Array<Shopify_CheckoutLineItemEdge>;
  /** A list of the nodes contained in CheckoutLineItemEdge. */
  nodes: Array<Shopify_CheckoutLineItem>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one CheckoutLineItem and a cursor during pagination.
 *
 */
export type Shopify_CheckoutLineItemEdge = {
  __typename?: 'shopify_CheckoutLineItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of CheckoutLineItemEdge. */
  node: Shopify_CheckoutLineItem;
};

/** Specifies the input fields to create a line item on a checkout. */
export type Shopify_CheckoutLineItemInput = {
  /** Extra information in the form of an array of Key-Value pairs about the line item. */
  customAttributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The quantity of the line item. */
  quantity: Scalars['Int'];
  /** The identifier of the product variant for the line item. */
  variantId: Scalars['ID'];
};

/** Specifies the input fields to update a line item on the checkout. */
export type Shopify_CheckoutLineItemUpdateInput = {
  /** Extra information in the form of an array of Key-Value pairs about the line item. */
  customAttributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The identifier of the line item. */
  id: InputMaybe<Scalars['ID']>;
  /** The quantity of the line item. */
  quantity: InputMaybe<Scalars['Int']>;
  /** The variant identifier of the line item. */
  variantId: InputMaybe<Scalars['ID']>;
};

/** Return type for `checkoutLineItemsAdd` mutation. */
export type Shopify_CheckoutLineItemsAddPayload = {
  __typename?: 'shopify_CheckoutLineItemsAddPayload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutLineItemsRemove` mutation. */
export type Shopify_CheckoutLineItemsRemovePayload = {
  __typename?: 'shopify_CheckoutLineItemsRemovePayload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutLineItemsReplace` mutation. */
export type Shopify_CheckoutLineItemsReplacePayload = {
  __typename?: 'shopify_CheckoutLineItemsReplacePayload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CheckoutUserError>;
};

/** Return type for `checkoutLineItemsUpdate` mutation. */
export type Shopify_CheckoutLineItemsUpdatePayload = {
  __typename?: 'shopify_CheckoutLineItemsUpdatePayload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutShippingAddressUpdateV2` mutation. */
export type Shopify_CheckoutShippingAddressUpdateV2Payload = {
  __typename?: 'shopify_CheckoutShippingAddressUpdateV2Payload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `checkoutShippingLineUpdate` mutation. */
export type Shopify_CheckoutShippingLineUpdatePayload = {
  __typename?: 'shopify_CheckoutShippingLineUpdatePayload';
  /** The updated checkout object. */
  checkout: Maybe<Shopify_Checkout>;
  /** The list of errors that occurred from executing the mutation. */
  checkoutUserErrors: Array<Shopify_CheckoutUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Represents an error that happens during execution of a checkout mutation. */
export type Shopify_CheckoutUserError = Shopify_DisplayableError & {
  __typename?: 'shopify_CheckoutUserError';
  /** The error code. */
  code: Maybe<Shopify_CheckoutErrorCode>;
  /** The path to the input field that caused the error. */
  field: Maybe<Array<Scalars['String']>>;
  /** The error message. */
  message: Scalars['String'];
};

/** A collection represents a grouping of products that a shop owner can create to organize them or make their shops easier to browse. */
export type Shopify_Collection = Shopify_HasMetafields &
  Shopify_Node &
  Shopify_OnlineStorePublishable & {
    __typename?: 'shopify_Collection';
    /** Stripped description of the collection, single line with HTML tags removed. */
    description: Scalars['String'];
    /** The description of the collection, complete with HTML formatting. */
    descriptionHtml: Scalars['shopify_HTML'];
    /**
     * A human-friendly unique string for the collection automatically generated from its title.
     * Limit of 255 characters.
     *
     */
    handle: Scalars['String'];
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** Image associated with the collection. */
    image: Maybe<Shopify_Image>;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /**
     * The metafields associated with the resource matching the supplied list of namespaces and keys.
     *
     */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
    onlineStoreUrl: Maybe<Scalars['shopify_URL']>;
    /** List of products in the collection. */
    products: Shopify_ProductConnection;
    /** The collection's SEO information. */
    seo: Shopify_Seo;
    /** The collection’s name. Limit of 255 characters. */
    title: Scalars['String'];
    /** The date and time when the collection was last modified. */
    updatedAt: Scalars['shopify_DateTime'];
  };

/** A collection represents a grouping of products that a shop owner can create to organize them or make their shops easier to browse. */
export type Shopify_CollectionDescriptionArgs = {
  truncateAt: InputMaybe<Scalars['Int']>;
};

/** A collection represents a grouping of products that a shop owner can create to organize them or make their shops easier to browse. */
export type Shopify_CollectionMetafieldArgs = {
  key: Scalars['String'];
  namespace: Scalars['String'];
};

/** A collection represents a grouping of products that a shop owner can create to organize them or make their shops easier to browse. */
export type Shopify_CollectionMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** A collection represents a grouping of products that a shop owner can create to organize them or make their shops easier to browse. */
export type Shopify_CollectionProductsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  filters: InputMaybe<Array<Shopify_ProductFilter>>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_ProductCollectionSortKeys>;
};

/**
 * An auto-generated type for paginating through multiple Collections.
 *
 */
export type Shopify_CollectionConnection = {
  __typename?: 'shopify_CollectionConnection';
  /** A list of edges. */
  edges: Array<Shopify_CollectionEdge>;
  /** A list of the nodes contained in CollectionEdge. */
  nodes: Array<Shopify_Collection>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one Collection and a cursor during pagination.
 *
 */
export type Shopify_CollectionEdge = {
  __typename?: 'shopify_CollectionEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of CollectionEdge. */
  node: Shopify_Collection;
};

/** The set of valid sort keys for the Collection query. */
export enum Shopify_CollectionSortKeys {
  /** Sort by the `id` value. */
  Id = 'ID',
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  Relevance = 'RELEVANCE',
  /** Sort by the `title` value. */
  Title = 'TITLE',
  /** Sort by the `updated_at` value. */
  UpdatedAt = 'UPDATED_AT',
}

/** A comment on an article. */
export type Shopify_Comment = Shopify_Node & {
  __typename?: 'shopify_Comment';
  /** The comment’s author. */
  author: Shopify_CommentAuthor;
  /** Stripped content of the comment, single line with HTML tags removed. */
  content: Scalars['String'];
  /** The content of the comment, complete with HTML formatting. */
  contentHtml: Scalars['shopify_HTML'];
  /** A globally-unique identifier. */
  id: Scalars['ID'];
};

/** A comment on an article. */
export type Shopify_CommentContentArgs = {
  truncateAt: InputMaybe<Scalars['Int']>;
};

/** The author of a comment. */
export type Shopify_CommentAuthor = {
  __typename?: 'shopify_CommentAuthor';
  /** The author's email. */
  email: Scalars['String'];
  /** The author’s name. */
  name: Scalars['String'];
};

/**
 * An auto-generated type for paginating through multiple Comments.
 *
 */
export type Shopify_CommentConnection = {
  __typename?: 'shopify_CommentConnection';
  /** A list of edges. */
  edges: Array<Shopify_CommentEdge>;
  /** A list of the nodes contained in CommentEdge. */
  nodes: Array<Shopify_Comment>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one Comment and a cursor during pagination.
 *
 */
export type Shopify_CommentEdge = {
  __typename?: 'shopify_CommentEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of CommentEdge. */
  node: Shopify_Comment;
};

/** A country. */
export type Shopify_Country = {
  __typename?: 'shopify_Country';
  /** The languages available for the country. */
  availableLanguages: Array<Shopify_Language>;
  /** The currency of the country. */
  currency: Shopify_Currency;
  /** The ISO code of the country. */
  isoCode: Shopify_CountryCode;
  /** The name of the country. */
  name: Scalars['String'];
  /** The unit system used in the country. */
  unitSystem: Shopify_UnitSystem;
};

/**
 * The code designating a country/region, which generally follows ISO 3166-1 alpha-2 guidelines.
 * If a territory doesn't have a country code value in the `CountryCode` enum, then it might be considered a subdivision
 * of another country. For example, the territories associated with Spain are represented by the country code `ES`,
 * and the territories associated with the United States of America are represented by the country code `US`.
 *
 */
export enum Shopify_CountryCode {
  /** Ascension Island. */
  Ac = 'AC',
  /** Andorra. */
  Ad = 'AD',
  /** United Arab Emirates. */
  Ae = 'AE',
  /** Afghanistan. */
  Af = 'AF',
  /** Antigua & Barbuda. */
  Ag = 'AG',
  /** Anguilla. */
  Ai = 'AI',
  /** Albania. */
  Al = 'AL',
  /** Armenia. */
  Am = 'AM',
  /** Netherlands Antilles. */
  An = 'AN',
  /** Angola. */
  Ao = 'AO',
  /** Argentina. */
  Ar = 'AR',
  /** Austria. */
  At = 'AT',
  /** Australia. */
  Au = 'AU',
  /** Aruba. */
  Aw = 'AW',
  /** Åland Islands. */
  Ax = 'AX',
  /** Azerbaijan. */
  Az = 'AZ',
  /** Bosnia & Herzegovina. */
  Ba = 'BA',
  /** Barbados. */
  Bb = 'BB',
  /** Bangladesh. */
  Bd = 'BD',
  /** Belgium. */
  Be = 'BE',
  /** Burkina Faso. */
  Bf = 'BF',
  /** Bulgaria. */
  Bg = 'BG',
  /** Bahrain. */
  Bh = 'BH',
  /** Burundi. */
  Bi = 'BI',
  /** Benin. */
  Bj = 'BJ',
  /** St. Barthélemy. */
  Bl = 'BL',
  /** Bermuda. */
  Bm = 'BM',
  /** Brunei. */
  Bn = 'BN',
  /** Bolivia. */
  Bo = 'BO',
  /** Caribbean Netherlands. */
  Bq = 'BQ',
  /** Brazil. */
  Br = 'BR',
  /** Bahamas. */
  Bs = 'BS',
  /** Bhutan. */
  Bt = 'BT',
  /** Bouvet Island. */
  Bv = 'BV',
  /** Botswana. */
  Bw = 'BW',
  /** Belarus. */
  By = 'BY',
  /** Belize. */
  Bz = 'BZ',
  /** Canada. */
  Ca = 'CA',
  /** Cocos (Keeling) Islands. */
  Cc = 'CC',
  /** Congo - Kinshasa. */
  Cd = 'CD',
  /** Central African Republic. */
  Cf = 'CF',
  /** Congo - Brazzaville. */
  Cg = 'CG',
  /** Switzerland. */
  Ch = 'CH',
  /** Côte d’Ivoire. */
  Ci = 'CI',
  /** Cook Islands. */
  Ck = 'CK',
  /** Chile. */
  Cl = 'CL',
  /** Cameroon. */
  Cm = 'CM',
  /** China. */
  Cn = 'CN',
  /** Colombia. */
  Co = 'CO',
  /** Costa Rica. */
  Cr = 'CR',
  /** Cuba. */
  Cu = 'CU',
  /** Cape Verde. */
  Cv = 'CV',
  /** Curaçao. */
  Cw = 'CW',
  /** Christmas Island. */
  Cx = 'CX',
  /** Cyprus. */
  Cy = 'CY',
  /** Czechia. */
  Cz = 'CZ',
  /** Germany. */
  De = 'DE',
  /** Djibouti. */
  Dj = 'DJ',
  /** Denmark. */
  Dk = 'DK',
  /** Dominica. */
  Dm = 'DM',
  /** Dominican Republic. */
  Do = 'DO',
  /** Algeria. */
  Dz = 'DZ',
  /** Ecuador. */
  Ec = 'EC',
  /** Estonia. */
  Ee = 'EE',
  /** Egypt. */
  Eg = 'EG',
  /** Western Sahara. */
  Eh = 'EH',
  /** Eritrea. */
  Er = 'ER',
  /** Spain. */
  Es = 'ES',
  /** Ethiopia. */
  Et = 'ET',
  /** Finland. */
  Fi = 'FI',
  /** Fiji. */
  Fj = 'FJ',
  /** Falkland Islands. */
  Fk = 'FK',
  /** Faroe Islands. */
  Fo = 'FO',
  /** France. */
  Fr = 'FR',
  /** Gabon. */
  Ga = 'GA',
  /** United Kingdom. */
  Gb = 'GB',
  /** Grenada. */
  Gd = 'GD',
  /** Georgia. */
  Ge = 'GE',
  /** French Guiana. */
  Gf = 'GF',
  /** Guernsey. */
  Gg = 'GG',
  /** Ghana. */
  Gh = 'GH',
  /** Gibraltar. */
  Gi = 'GI',
  /** Greenland. */
  Gl = 'GL',
  /** Gambia. */
  Gm = 'GM',
  /** Guinea. */
  Gn = 'GN',
  /** Guadeloupe. */
  Gp = 'GP',
  /** Equatorial Guinea. */
  Gq = 'GQ',
  /** Greece. */
  Gr = 'GR',
  /** South Georgia & South Sandwich Islands. */
  Gs = 'GS',
  /** Guatemala. */
  Gt = 'GT',
  /** Guinea-Bissau. */
  Gw = 'GW',
  /** Guyana. */
  Gy = 'GY',
  /** Hong Kong SAR. */
  Hk = 'HK',
  /** Heard & McDonald Islands. */
  Hm = 'HM',
  /** Honduras. */
  Hn = 'HN',
  /** Croatia. */
  Hr = 'HR',
  /** Haiti. */
  Ht = 'HT',
  /** Hungary. */
  Hu = 'HU',
  /** Indonesia. */
  Id = 'ID',
  /** Ireland. */
  Ie = 'IE',
  /** Israel. */
  Il = 'IL',
  /** Isle of Man. */
  Im = 'IM',
  /** India. */
  In = 'IN',
  /** British Indian Ocean Territory. */
  Io = 'IO',
  /** Iraq. */
  Iq = 'IQ',
  /** Iran. */
  Ir = 'IR',
  /** Iceland. */
  Is = 'IS',
  /** Italy. */
  It = 'IT',
  /** Jersey. */
  Je = 'JE',
  /** Jamaica. */
  Jm = 'JM',
  /** Jordan. */
  Jo = 'JO',
  /** Japan. */
  Jp = 'JP',
  /** Kenya. */
  Ke = 'KE',
  /** Kyrgyzstan. */
  Kg = 'KG',
  /** Cambodia. */
  Kh = 'KH',
  /** Kiribati. */
  Ki = 'KI',
  /** Comoros. */
  Km = 'KM',
  /** St. Kitts & Nevis. */
  Kn = 'KN',
  /** North Korea. */
  Kp = 'KP',
  /** South Korea. */
  Kr = 'KR',
  /** Kuwait. */
  Kw = 'KW',
  /** Cayman Islands. */
  Ky = 'KY',
  /** Kazakhstan. */
  Kz = 'KZ',
  /** Laos. */
  La = 'LA',
  /** Lebanon. */
  Lb = 'LB',
  /** St. Lucia. */
  Lc = 'LC',
  /** Liechtenstein. */
  Li = 'LI',
  /** Sri Lanka. */
  Lk = 'LK',
  /** Liberia. */
  Lr = 'LR',
  /** Lesotho. */
  Ls = 'LS',
  /** Lithuania. */
  Lt = 'LT',
  /** Luxembourg. */
  Lu = 'LU',
  /** Latvia. */
  Lv = 'LV',
  /** Libya. */
  Ly = 'LY',
  /** Morocco. */
  Ma = 'MA',
  /** Monaco. */
  Mc = 'MC',
  /** Moldova. */
  Md = 'MD',
  /** Montenegro. */
  Me = 'ME',
  /** St. Martin. */
  Mf = 'MF',
  /** Madagascar. */
  Mg = 'MG',
  /** North Macedonia. */
  Mk = 'MK',
  /** Mali. */
  Ml = 'ML',
  /** Myanmar (Burma). */
  Mm = 'MM',
  /** Mongolia. */
  Mn = 'MN',
  /** Macao SAR. */
  Mo = 'MO',
  /** Martinique. */
  Mq = 'MQ',
  /** Mauritania. */
  Mr = 'MR',
  /** Montserrat. */
  Ms = 'MS',
  /** Malta. */
  Mt = 'MT',
  /** Mauritius. */
  Mu = 'MU',
  /** Maldives. */
  Mv = 'MV',
  /** Malawi. */
  Mw = 'MW',
  /** Mexico. */
  Mx = 'MX',
  /** Malaysia. */
  My = 'MY',
  /** Mozambique. */
  Mz = 'MZ',
  /** Namibia. */
  Na = 'NA',
  /** New Caledonia. */
  Nc = 'NC',
  /** Niger. */
  Ne = 'NE',
  /** Norfolk Island. */
  Nf = 'NF',
  /** Nigeria. */
  Ng = 'NG',
  /** Nicaragua. */
  Ni = 'NI',
  /** Netherlands. */
  Nl = 'NL',
  /** Norway. */
  No = 'NO',
  /** Nepal. */
  Np = 'NP',
  /** Nauru. */
  Nr = 'NR',
  /** Niue. */
  Nu = 'NU',
  /** New Zealand. */
  Nz = 'NZ',
  /** Oman. */
  Om = 'OM',
  /** Panama. */
  Pa = 'PA',
  /** Peru. */
  Pe = 'PE',
  /** French Polynesia. */
  Pf = 'PF',
  /** Papua New Guinea. */
  Pg = 'PG',
  /** Philippines. */
  Ph = 'PH',
  /** Pakistan. */
  Pk = 'PK',
  /** Poland. */
  Pl = 'PL',
  /** St. Pierre & Miquelon. */
  Pm = 'PM',
  /** Pitcairn Islands. */
  Pn = 'PN',
  /** Palestinian Territories. */
  Ps = 'PS',
  /** Portugal. */
  Pt = 'PT',
  /** Paraguay. */
  Py = 'PY',
  /** Qatar. */
  Qa = 'QA',
  /** Réunion. */
  Re = 'RE',
  /** Romania. */
  Ro = 'RO',
  /** Serbia. */
  Rs = 'RS',
  /** Russia. */
  Ru = 'RU',
  /** Rwanda. */
  Rw = 'RW',
  /** Saudi Arabia. */
  Sa = 'SA',
  /** Solomon Islands. */
  Sb = 'SB',
  /** Seychelles. */
  Sc = 'SC',
  /** Sudan. */
  Sd = 'SD',
  /** Sweden. */
  Se = 'SE',
  /** Singapore. */
  Sg = 'SG',
  /** St. Helena. */
  Sh = 'SH',
  /** Slovenia. */
  Si = 'SI',
  /** Svalbard & Jan Mayen. */
  Sj = 'SJ',
  /** Slovakia. */
  Sk = 'SK',
  /** Sierra Leone. */
  Sl = 'SL',
  /** San Marino. */
  Sm = 'SM',
  /** Senegal. */
  Sn = 'SN',
  /** Somalia. */
  So = 'SO',
  /** Suriname. */
  Sr = 'SR',
  /** South Sudan. */
  Ss = 'SS',
  /** São Tomé & Príncipe. */
  St = 'ST',
  /** El Salvador. */
  Sv = 'SV',
  /** Sint Maarten. */
  Sx = 'SX',
  /** Syria. */
  Sy = 'SY',
  /** Eswatini. */
  Sz = 'SZ',
  /** Tristan da Cunha. */
  Ta = 'TA',
  /** Turks & Caicos Islands. */
  Tc = 'TC',
  /** Chad. */
  Td = 'TD',
  /** French Southern Territories. */
  Tf = 'TF',
  /** Togo. */
  Tg = 'TG',
  /** Thailand. */
  Th = 'TH',
  /** Tajikistan. */
  Tj = 'TJ',
  /** Tokelau. */
  Tk = 'TK',
  /** Timor-Leste. */
  Tl = 'TL',
  /** Turkmenistan. */
  Tm = 'TM',
  /** Tunisia. */
  Tn = 'TN',
  /** Tonga. */
  To = 'TO',
  /** Turkey. */
  Tr = 'TR',
  /** Trinidad & Tobago. */
  Tt = 'TT',
  /** Tuvalu. */
  Tv = 'TV',
  /** Taiwan. */
  Tw = 'TW',
  /** Tanzania. */
  Tz = 'TZ',
  /** Ukraine. */
  Ua = 'UA',
  /** Uganda. */
  Ug = 'UG',
  /** U.S. Outlying Islands. */
  Um = 'UM',
  /** United States. */
  Us = 'US',
  /** Uruguay. */
  Uy = 'UY',
  /** Uzbekistan. */
  Uz = 'UZ',
  /** Vatican City. */
  Va = 'VA',
  /** St. Vincent & Grenadines. */
  Vc = 'VC',
  /** Venezuela. */
  Ve = 'VE',
  /** British Virgin Islands. */
  Vg = 'VG',
  /** Vietnam. */
  Vn = 'VN',
  /** Vanuatu. */
  Vu = 'VU',
  /** Wallis & Futuna. */
  Wf = 'WF',
  /** Samoa. */
  Ws = 'WS',
  /** Kosovo. */
  Xk = 'XK',
  /** Yemen. */
  Ye = 'YE',
  /** Mayotte. */
  Yt = 'YT',
  /** South Africa. */
  Za = 'ZA',
  /** Zambia. */
  Zm = 'ZM',
  /** Zimbabwe. */
  Zw = 'ZW',
  /** Unknown Region. */
  Zz = 'ZZ',
}

/** Credit card information used for a payment. */
export type Shopify_CreditCard = {
  __typename?: 'shopify_CreditCard';
  /** The brand of the credit card. */
  brand: Maybe<Scalars['String']>;
  /** The expiry month of the credit card. */
  expiryMonth: Maybe<Scalars['Int']>;
  /** The expiry year of the credit card. */
  expiryYear: Maybe<Scalars['Int']>;
  /** The credit card's BIN number. */
  firstDigits: Maybe<Scalars['String']>;
  /** The first name of the card holder. */
  firstName: Maybe<Scalars['String']>;
  /** The last 4 digits of the credit card. */
  lastDigits: Maybe<Scalars['String']>;
  /** The last name of the card holder. */
  lastName: Maybe<Scalars['String']>;
  /** The masked credit card number with only the last 4 digits displayed. */
  maskedNumber: Maybe<Scalars['String']>;
};

/**
 * Specifies the fields required to complete a checkout with
 * a Shopify vaulted credit card payment.
 *
 */
export type Shopify_CreditCardPaymentInputV2 = {
  /** The billing address for the payment. */
  billingAddress: Shopify_MailingAddressInput;
  /** A unique client generated key used to avoid duplicate charges. When a duplicate payment is found, the original is returned instead of creating a new one. For more information, refer to [Idempotent requests](https://shopify.dev/api/usage/idempotent-requests). */
  idempotencyKey: Scalars['String'];
  /** The amount and currency of the payment. */
  paymentAmount: Shopify_MoneyInput;
  /** Executes the payment in test mode if possible. Defaults to `false`. */
  test: InputMaybe<Scalars['Boolean']>;
  /** The ID returned by Shopify's Card Vault. */
  vaultId: Scalars['String'];
};

/** The part of the image that should remain after cropping. */
export enum Shopify_CropRegion {
  /** Keep the bottom of the image. */
  Bottom = 'BOTTOM',
  /** Keep the center of the image. */
  Center = 'CENTER',
  /** Keep the left of the image. */
  Left = 'LEFT',
  /** Keep the right of the image. */
  Right = 'RIGHT',
  /** Keep the top of the image. */
  Top = 'TOP',
}

/** A currency. */
export type Shopify_Currency = {
  __typename?: 'shopify_Currency';
  /** The ISO code of the currency. */
  isoCode: Shopify_CurrencyCode;
  /** The name of the currency. */
  name: Scalars['String'];
  /** The symbol of the currency. */
  symbol: Scalars['String'];
};

/**
 * The three-letter currency codes that represent the world currencies used in stores. These include standard ISO 4217 codes, legacy codes,
 * and non-standard codes.
 *
 */
export enum Shopify_CurrencyCode {
  /** United Arab Emirates Dirham (AED). */
  Aed = 'AED',
  /** Afghan Afghani (AFN). */
  Afn = 'AFN',
  /** Albanian Lek (ALL). */
  All = 'ALL',
  /** Armenian Dram (AMD). */
  Amd = 'AMD',
  /** Netherlands Antillean Guilder. */
  Ang = 'ANG',
  /** Angolan Kwanza (AOA). */
  Aoa = 'AOA',
  /** Argentine Pesos (ARS). */
  Ars = 'ARS',
  /** Australian Dollars (AUD). */
  Aud = 'AUD',
  /** Aruban Florin (AWG). */
  Awg = 'AWG',
  /** Azerbaijani Manat (AZN). */
  Azn = 'AZN',
  /** Bosnia and Herzegovina Convertible Mark (BAM). */
  Bam = 'BAM',
  /** Barbadian Dollar (BBD). */
  Bbd = 'BBD',
  /** Bangladesh Taka (BDT). */
  Bdt = 'BDT',
  /** Bulgarian Lev (BGN). */
  Bgn = 'BGN',
  /** Bahraini Dinar (BHD). */
  Bhd = 'BHD',
  /** Burundian Franc (BIF). */
  Bif = 'BIF',
  /** Bermudian Dollar (BMD). */
  Bmd = 'BMD',
  /** Brunei Dollar (BND). */
  Bnd = 'BND',
  /** Bolivian Boliviano (BOB). */
  Bob = 'BOB',
  /** Brazilian Real (BRL). */
  Brl = 'BRL',
  /** Bahamian Dollar (BSD). */
  Bsd = 'BSD',
  /** Bhutanese Ngultrum (BTN). */
  Btn = 'BTN',
  /** Botswana Pula (BWP). */
  Bwp = 'BWP',
  /** Belarusian Ruble (BYN). */
  Byn = 'BYN',
  /** Belarusian Ruble (BYR). */
  Byr = 'BYR',
  /** Belize Dollar (BZD). */
  Bzd = 'BZD',
  /** Canadian Dollars (CAD). */
  Cad = 'CAD',
  /** Congolese franc (CDF). */
  Cdf = 'CDF',
  /** Swiss Francs (CHF). */
  Chf = 'CHF',
  /** Chilean Peso (CLP). */
  Clp = 'CLP',
  /** Chinese Yuan Renminbi (CNY). */
  Cny = 'CNY',
  /** Colombian Peso (COP). */
  Cop = 'COP',
  /** Costa Rican Colones (CRC). */
  Crc = 'CRC',
  /** Cape Verdean escudo (CVE). */
  Cve = 'CVE',
  /** Czech Koruny (CZK). */
  Czk = 'CZK',
  /** Djiboutian Franc (DJF). */
  Djf = 'DJF',
  /** Danish Kroner (DKK). */
  Dkk = 'DKK',
  /** Dominican Peso (DOP). */
  Dop = 'DOP',
  /** Algerian Dinar (DZD). */
  Dzd = 'DZD',
  /** Egyptian Pound (EGP). */
  Egp = 'EGP',
  /** Eritrean Nakfa (ERN). */
  Ern = 'ERN',
  /** Ethiopian Birr (ETB). */
  Etb = 'ETB',
  /** Euro (EUR). */
  Eur = 'EUR',
  /** Fijian Dollars (FJD). */
  Fjd = 'FJD',
  /** Falkland Islands Pounds (FKP). */
  Fkp = 'FKP',
  /** United Kingdom Pounds (GBP). */
  Gbp = 'GBP',
  /** Georgian Lari (GEL). */
  Gel = 'GEL',
  /** Ghanaian Cedi (GHS). */
  Ghs = 'GHS',
  /** Gibraltar Pounds (GIP). */
  Gip = 'GIP',
  /** Gambian Dalasi (GMD). */
  Gmd = 'GMD',
  /** Guinean Franc (GNF). */
  Gnf = 'GNF',
  /** Guatemalan Quetzal (GTQ). */
  Gtq = 'GTQ',
  /** Guyanese Dollar (GYD). */
  Gyd = 'GYD',
  /** Hong Kong Dollars (HKD). */
  Hkd = 'HKD',
  /** Honduran Lempira (HNL). */
  Hnl = 'HNL',
  /** Croatian Kuna (HRK). */
  Hrk = 'HRK',
  /** Haitian Gourde (HTG). */
  Htg = 'HTG',
  /** Hungarian Forint (HUF). */
  Huf = 'HUF',
  /** Indonesian Rupiah (IDR). */
  Idr = 'IDR',
  /** Israeli New Shekel (NIS). */
  Ils = 'ILS',
  /** Indian Rupees (INR). */
  Inr = 'INR',
  /** Iraqi Dinar (IQD). */
  Iqd = 'IQD',
  /** Iranian Rial (IRR). */
  Irr = 'IRR',
  /** Icelandic Kronur (ISK). */
  Isk = 'ISK',
  /** Jersey Pound. */
  Jep = 'JEP',
  /** Jamaican Dollars (JMD). */
  Jmd = 'JMD',
  /** Jordanian Dinar (JOD). */
  Jod = 'JOD',
  /** Japanese Yen (JPY). */
  Jpy = 'JPY',
  /** Kenyan Shilling (KES). */
  Kes = 'KES',
  /** Kyrgyzstani Som (KGS). */
  Kgs = 'KGS',
  /** Cambodian Riel. */
  Khr = 'KHR',
  /** Kiribati Dollar (KID). */
  Kid = 'KID',
  /** Comorian Franc (KMF). */
  Kmf = 'KMF',
  /** South Korean Won (KRW). */
  Krw = 'KRW',
  /** Kuwaiti Dinar (KWD). */
  Kwd = 'KWD',
  /** Cayman Dollars (KYD). */
  Kyd = 'KYD',
  /** Kazakhstani Tenge (KZT). */
  Kzt = 'KZT',
  /** Laotian Kip (LAK). */
  Lak = 'LAK',
  /** Lebanese Pounds (LBP). */
  Lbp = 'LBP',
  /** Sri Lankan Rupees (LKR). */
  Lkr = 'LKR',
  /** Liberian Dollar (LRD). */
  Lrd = 'LRD',
  /** Lesotho Loti (LSL). */
  Lsl = 'LSL',
  /** Lithuanian Litai (LTL). */
  Ltl = 'LTL',
  /** Latvian Lati (LVL). */
  Lvl = 'LVL',
  /** Libyan Dinar (LYD). */
  Lyd = 'LYD',
  /** Moroccan Dirham. */
  Mad = 'MAD',
  /** Moldovan Leu (MDL). */
  Mdl = 'MDL',
  /** Malagasy Ariary (MGA). */
  Mga = 'MGA',
  /** Macedonia Denar (MKD). */
  Mkd = 'MKD',
  /** Burmese Kyat (MMK). */
  Mmk = 'MMK',
  /** Mongolian Tugrik. */
  Mnt = 'MNT',
  /** Macanese Pataca (MOP). */
  Mop = 'MOP',
  /** Mauritanian Ouguiya (MRU). */
  Mru = 'MRU',
  /** Mauritian Rupee (MUR). */
  Mur = 'MUR',
  /** Maldivian Rufiyaa (MVR). */
  Mvr = 'MVR',
  /** Malawian Kwacha (MWK). */
  Mwk = 'MWK',
  /** Mexican Pesos (MXN). */
  Mxn = 'MXN',
  /** Malaysian Ringgits (MYR). */
  Myr = 'MYR',
  /** Mozambican Metical. */
  Mzn = 'MZN',
  /** Namibian Dollar. */
  Nad = 'NAD',
  /** Nigerian Naira (NGN). */
  Ngn = 'NGN',
  /** Nicaraguan Córdoba (NIO). */
  Nio = 'NIO',
  /** Norwegian Kroner (NOK). */
  Nok = 'NOK',
  /** Nepalese Rupee (NPR). */
  Npr = 'NPR',
  /** New Zealand Dollars (NZD). */
  Nzd = 'NZD',
  /** Omani Rial (OMR). */
  Omr = 'OMR',
  /** Panamian Balboa (PAB). */
  Pab = 'PAB',
  /** Peruvian Nuevo Sol (PEN). */
  Pen = 'PEN',
  /** Papua New Guinean Kina (PGK). */
  Pgk = 'PGK',
  /** Philippine Peso (PHP). */
  Php = 'PHP',
  /** Pakistani Rupee (PKR). */
  Pkr = 'PKR',
  /** Polish Zlotych (PLN). */
  Pln = 'PLN',
  /** Paraguayan Guarani (PYG). */
  Pyg = 'PYG',
  /** Qatari Rial (QAR). */
  Qar = 'QAR',
  /** Romanian Lei (RON). */
  Ron = 'RON',
  /** Serbian dinar (RSD). */
  Rsd = 'RSD',
  /** Russian Rubles (RUB). */
  Rub = 'RUB',
  /** Rwandan Franc (RWF). */
  Rwf = 'RWF',
  /** Saudi Riyal (SAR). */
  Sar = 'SAR',
  /** Solomon Islands Dollar (SBD). */
  Sbd = 'SBD',
  /** Seychellois Rupee (SCR). */
  Scr = 'SCR',
  /** Sudanese Pound (SDG). */
  Sdg = 'SDG',
  /** Swedish Kronor (SEK). */
  Sek = 'SEK',
  /** Singapore Dollars (SGD). */
  Sgd = 'SGD',
  /** Saint Helena Pounds (SHP). */
  Shp = 'SHP',
  /** Sierra Leonean Leone (SLL). */
  Sll = 'SLL',
  /** Somali Shilling (SOS). */
  Sos = 'SOS',
  /** Surinamese Dollar (SRD). */
  Srd = 'SRD',
  /** South Sudanese Pound (SSP). */
  Ssp = 'SSP',
  /** Sao Tome And Principe Dobra (STD). */
  Std = 'STD',
  /** Sao Tome And Principe Dobra (STN). */
  Stn = 'STN',
  /** Syrian Pound (SYP). */
  Syp = 'SYP',
  /** Swazi Lilangeni (SZL). */
  Szl = 'SZL',
  /** Thai baht (THB). */
  Thb = 'THB',
  /** Tajikistani Somoni (TJS). */
  Tjs = 'TJS',
  /** Turkmenistani Manat (TMT). */
  Tmt = 'TMT',
  /** Tunisian Dinar (TND). */
  Tnd = 'TND',
  /** Tongan Pa'anga (TOP). */
  Top = 'TOP',
  /** Turkish Lira (TRY). */
  Try = 'TRY',
  /** Trinidad and Tobago Dollars (TTD). */
  Ttd = 'TTD',
  /** Taiwan Dollars (TWD). */
  Twd = 'TWD',
  /** Tanzanian Shilling (TZS). */
  Tzs = 'TZS',
  /** Ukrainian Hryvnia (UAH). */
  Uah = 'UAH',
  /** Ugandan Shilling (UGX). */
  Ugx = 'UGX',
  /** United States Dollars (USD). */
  Usd = 'USD',
  /** Uruguayan Pesos (UYU). */
  Uyu = 'UYU',
  /** Uzbekistan som (UZS). */
  Uzs = 'UZS',
  /** Venezuelan Bolivares (VED). */
  Ved = 'VED',
  /** Venezuelan Bolivares (VEF). */
  Vef = 'VEF',
  /** Venezuelan Bolivares (VES). */
  Ves = 'VES',
  /** Vietnamese đồng (VND). */
  Vnd = 'VND',
  /** Vanuatu Vatu (VUV). */
  Vuv = 'VUV',
  /** Samoan Tala (WST). */
  Wst = 'WST',
  /** Central African CFA Franc (XAF). */
  Xaf = 'XAF',
  /** East Caribbean Dollar (XCD). */
  Xcd = 'XCD',
  /** West African CFA franc (XOF). */
  Xof = 'XOF',
  /** CFP Franc (XPF). */
  Xpf = 'XPF',
  /** Unrecognized currency. */
  Xxx = 'XXX',
  /** Yemeni Rial (YER). */
  Yer = 'YER',
  /** South African Rand (ZAR). */
  Zar = 'ZAR',
  /** Zambian Kwacha (ZMW). */
  Zmw = 'ZMW',
}

/** A customer represents a customer account with the shop. Customer accounts store contact information for the customer, saving logged-in customers the trouble of having to provide it at every checkout. */
export type Shopify_Customer = Shopify_HasMetafields & {
  __typename?: 'shopify_Customer';
  /** Indicates whether the customer has consented to be sent marketing material via email. */
  acceptsMarketing: Scalars['Boolean'];
  /** A list of addresses for the customer. */
  addresses: Shopify_MailingAddressConnection;
  /** The date and time when the customer was created. */
  createdAt: Scalars['shopify_DateTime'];
  /** The customer’s default address. */
  defaultAddress: Maybe<Shopify_MailingAddress>;
  /** The customer’s name, email or phone number. */
  displayName: Scalars['String'];
  /** The customer’s email address. */
  email: Maybe<Scalars['String']>;
  /** The customer’s first name. */
  firstName: Maybe<Scalars['String']>;
  /** A unique identifier for the customer. */
  id: Scalars['ID'];
  /** The customer's most recently updated, incomplete checkout. */
  lastIncompleteCheckout: Maybe<Shopify_Checkout>;
  /** The customer’s last name. */
  lastName: Maybe<Scalars['String']>;
  /** Returns a metafield found by namespace and key. */
  metafield: Maybe<Shopify_Metafield>;
  /**
   * The metafields associated with the resource matching the supplied list of namespaces and keys.
   *
   */
  metafields: Array<Maybe<Shopify_Metafield>>;
  /** The number of orders that the customer has made at the store in their lifetime. */
  numberOfOrders: Scalars['shopify_UnsignedInt64'];
  /** The orders associated with the customer. */
  orders: Shopify_OrderConnection;
  /** The customer’s phone number. */
  phone: Maybe<Scalars['String']>;
  /**
   * A comma separated list of tags that have been added to the customer.
   * Additional access scope required: unauthenticated_read_customer_tags.
   *
   */
  tags: Array<Scalars['String']>;
  /** The date and time when the customer information was updated. */
  updatedAt: Scalars['shopify_DateTime'];
};

/** A customer represents a customer account with the shop. Customer accounts store contact information for the customer, saving logged-in customers the trouble of having to provide it at every checkout. */
export type Shopify_CustomerAddressesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/** A customer represents a customer account with the shop. Customer accounts store contact information for the customer, saving logged-in customers the trouble of having to provide it at every checkout. */
export type Shopify_CustomerMetafieldArgs = {
  key: Scalars['String'];
  namespace: Scalars['String'];
};

/** A customer represents a customer account with the shop. Customer accounts store contact information for the customer, saving logged-in customers the trouble of having to provide it at every checkout. */
export type Shopify_CustomerMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** A customer represents a customer account with the shop. Customer accounts store contact information for the customer, saving logged-in customers the trouble of having to provide it at every checkout. */
export type Shopify_CustomerOrdersArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  query: InputMaybe<Scalars['String']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_OrderSortKeys>;
};

/** A CustomerAccessToken represents the unique token required to make modifications to the customer object. */
export type Shopify_CustomerAccessToken = {
  __typename?: 'shopify_CustomerAccessToken';
  /** The customer’s access token. */
  accessToken: Scalars['String'];
  /** The date and time when the customer access token expires. */
  expiresAt: Scalars['shopify_DateTime'];
};

/** Specifies the input fields required to create a customer access token. */
export type Shopify_CustomerAccessTokenCreateInput = {
  /** The email associated to the customer. */
  email: Scalars['String'];
  /** The login password to be used by the customer. */
  password: Scalars['String'];
};

/** Return type for `customerAccessTokenCreate` mutation. */
export type Shopify_CustomerAccessTokenCreatePayload = {
  __typename?: 'shopify_CustomerAccessTokenCreatePayload';
  /** The newly created customer access token object. */
  customerAccessToken: Maybe<Shopify_CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `customerAccessTokenCreateWithMultipass` mutation. */
export type Shopify_CustomerAccessTokenCreateWithMultipassPayload = {
  __typename?: 'shopify_CustomerAccessTokenCreateWithMultipassPayload';
  /** An access token object associated with the customer. */
  customerAccessToken: Maybe<Shopify_CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
};

/** Return type for `customerAccessTokenDelete` mutation. */
export type Shopify_CustomerAccessTokenDeletePayload = {
  __typename?: 'shopify_CustomerAccessTokenDeletePayload';
  /** The destroyed access token. */
  deletedAccessToken: Maybe<Scalars['String']>;
  /** ID of the destroyed customer access token. */
  deletedCustomerAccessTokenId: Maybe<Scalars['String']>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `customerAccessTokenRenew` mutation. */
export type Shopify_CustomerAccessTokenRenewPayload = {
  __typename?: 'shopify_CustomerAccessTokenRenewPayload';
  /** The renewed customer access token object. */
  customerAccessToken: Maybe<Shopify_CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `customerActivateByUrl` mutation. */
export type Shopify_CustomerActivateByUrlPayload = {
  __typename?: 'shopify_CustomerActivateByUrlPayload';
  /** The customer that was activated. */
  customer: Maybe<Shopify_Customer>;
  /** A new customer access token for the customer. */
  customerAccessToken: Maybe<Shopify_CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
};

/** Specifies the input fields required to activate a customer. */
export type Shopify_CustomerActivateInput = {
  /** The activation token required to activate the customer. */
  activationToken: Scalars['String'];
  /** New password that will be set during activation. */
  password: Scalars['String'];
};

/** Return type for `customerActivate` mutation. */
export type Shopify_CustomerActivatePayload = {
  __typename?: 'shopify_CustomerActivatePayload';
  /** The customer object. */
  customer: Maybe<Shopify_Customer>;
  /** A newly created customer access token object for the customer. */
  customerAccessToken: Maybe<Shopify_CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `customerAddressCreate` mutation. */
export type Shopify_CustomerAddressCreatePayload = {
  __typename?: 'shopify_CustomerAddressCreatePayload';
  /** The new customer address object. */
  customerAddress: Maybe<Shopify_MailingAddress>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `customerAddressDelete` mutation. */
export type Shopify_CustomerAddressDeletePayload = {
  __typename?: 'shopify_CustomerAddressDeletePayload';
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** ID of the deleted customer address. */
  deletedCustomerAddressId: Maybe<Scalars['String']>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `customerAddressUpdate` mutation. */
export type Shopify_CustomerAddressUpdatePayload = {
  __typename?: 'shopify_CustomerAddressUpdatePayload';
  /** The customer’s updated mailing address. */
  customerAddress: Maybe<Shopify_MailingAddress>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** The fields required to create a new customer. */
export type Shopify_CustomerCreateInput = {
  /** Indicates whether the customer has consented to be sent marketing material via email. */
  acceptsMarketing: InputMaybe<Scalars['Boolean']>;
  /** The customer’s email. */
  email: Scalars['String'];
  /** The customer’s first name. */
  firstName: InputMaybe<Scalars['String']>;
  /** The customer’s last name. */
  lastName: InputMaybe<Scalars['String']>;
  /** The login password used by the customer. */
  password: Scalars['String'];
  /**
   * A unique phone number for the customer.
   *
   * Formatted using E.164 standard. For example, _+16135551111_.
   *
   */
  phone: InputMaybe<Scalars['String']>;
};

/** Return type for `customerCreate` mutation. */
export type Shopify_CustomerCreatePayload = {
  __typename?: 'shopify_CustomerCreatePayload';
  /** The created customer object. */
  customer: Maybe<Shopify_Customer>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `customerDefaultAddressUpdate` mutation. */
export type Shopify_CustomerDefaultAddressUpdatePayload = {
  __typename?: 'shopify_CustomerDefaultAddressUpdatePayload';
  /** The updated customer object. */
  customer: Maybe<Shopify_Customer>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Possible error codes that can be returned by `CustomerUserError`. */
export enum Shopify_CustomerErrorCode {
  /** Customer already enabled. */
  AlreadyEnabled = 'ALREADY_ENABLED',
  /** Input email contains an invalid domain name. */
  BadDomain = 'BAD_DOMAIN',
  /** The input value is blank. */
  Blank = 'BLANK',
  /** Input contains HTML tags. */
  ContainsHtmlTags = 'CONTAINS_HTML_TAGS',
  /** Input contains URL. */
  ContainsUrl = 'CONTAINS_URL',
  /** Customer is disabled. */
  CustomerDisabled = 'CUSTOMER_DISABLED',
  /** The input value is invalid. */
  Invalid = 'INVALID',
  /** Multipass token is not valid. */
  InvalidMultipassRequest = 'INVALID_MULTIPASS_REQUEST',
  /** Address does not exist. */
  NotFound = 'NOT_FOUND',
  /** Input password starts or ends with whitespace. */
  PasswordStartsOrEndsWithWhitespace = 'PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE',
  /** The input value is already taken. */
  Taken = 'TAKEN',
  /** Invalid activation token. */
  TokenInvalid = 'TOKEN_INVALID',
  /** The input value is too long. */
  TooLong = 'TOO_LONG',
  /** The input value is too short. */
  TooShort = 'TOO_SHORT',
  /** Unidentified customer. */
  UnidentifiedCustomer = 'UNIDENTIFIED_CUSTOMER',
}

/** Return type for `customerRecover` mutation. */
export type Shopify_CustomerRecoverPayload = {
  __typename?: 'shopify_CustomerRecoverPayload';
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Return type for `customerResetByUrl` mutation. */
export type Shopify_CustomerResetByUrlPayload = {
  __typename?: 'shopify_CustomerResetByUrlPayload';
  /** The customer object which was reset. */
  customer: Maybe<Shopify_Customer>;
  /** A newly created customer access token object for the customer. */
  customerAccessToken: Maybe<Shopify_CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Specifies the fields required to reset a customer’s password. */
export type Shopify_CustomerResetInput = {
  /** New password that will be set as part of the reset password process. */
  password: Scalars['String'];
  /** The reset token required to reset the customer’s password. */
  resetToken: Scalars['String'];
};

/** Return type for `customerReset` mutation. */
export type Shopify_CustomerResetPayload = {
  __typename?: 'shopify_CustomerResetPayload';
  /** The customer object which was reset. */
  customer: Maybe<Shopify_Customer>;
  /** A newly created customer access token object for the customer. */
  customerAccessToken: Maybe<Shopify_CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Specifies the fields required to update the Customer information. */
export type Shopify_CustomerUpdateInput = {
  /** Indicates whether the customer has consented to be sent marketing material via email. */
  acceptsMarketing: InputMaybe<Scalars['Boolean']>;
  /** The customer’s email. */
  email: InputMaybe<Scalars['String']>;
  /** The customer’s first name. */
  firstName: InputMaybe<Scalars['String']>;
  /** The customer’s last name. */
  lastName: InputMaybe<Scalars['String']>;
  /** The login password used by the customer. */
  password: InputMaybe<Scalars['String']>;
  /**
   * A unique phone number for the customer.
   *
   * Formatted using E.164 standard. For example, _+16135551111_. To remove the phone number, specify `null`.
   *
   */
  phone: InputMaybe<Scalars['String']>;
};

/** Return type for `customerUpdate` mutation. */
export type Shopify_CustomerUpdatePayload = {
  __typename?: 'shopify_CustomerUpdatePayload';
  /** The updated customer object. */
  customer: Maybe<Shopify_Customer>;
  /**
   * The newly created customer access token. If the customer's password is updated, all previous access tokens
   * (including the one used to perform this mutation) become invalid, and a new token is generated.
   *
   */
  customerAccessToken: Maybe<Shopify_CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<Shopify_CustomerUserError>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_UserError>;
};

/** Represents an error that happens during execution of a customer mutation. */
export type Shopify_CustomerUserError = Shopify_DisplayableError & {
  __typename?: 'shopify_CustomerUserError';
  /** The error code. */
  code: Maybe<Shopify_CustomerErrorCode>;
  /** The path to the input field that caused the error. */
  field: Maybe<Array<Scalars['String']>>;
  /** The error message. */
  message: Scalars['String'];
};

/** A delivery address of the buyer that is interacting with the cart. */
export type Shopify_DeliveryAddress = Shopify_MailingAddress;

/**
 * The input fields for delivery address preferences.
 *
 */
export type Shopify_DeliveryAddressInput = {
  /** A delivery address preference of a buyer that is interacting with the cart. */
  deliveryAddress: InputMaybe<Shopify_MailingAddressInput>;
};

/** List of different delivery method types. */
export enum Shopify_DeliveryMethodType {
  /** Local Delivery. */
  Local = 'LOCAL',
  /** None. */
  None = 'NONE',
  /** Shipping to a Pickup Point. */
  PickupPoint = 'PICKUP_POINT',
  /** Local Pickup. */
  PickUp = 'PICK_UP',
  /** Retail. */
  Retail = 'RETAIL',
  /** Shipping. */
  Shipping = 'SHIPPING',
}

/** Digital wallet, such as Apple Pay, which can be used for accelerated checkouts. */
export enum Shopify_DigitalWallet {
  /** Android Pay. */
  AndroidPay = 'ANDROID_PAY',
  /** Apple Pay. */
  ApplePay = 'APPLE_PAY',
  /** Google Pay. */
  GooglePay = 'GOOGLE_PAY',
  /** Shopify Pay. */
  ShopifyPay = 'SHOPIFY_PAY',
}

/**
 * An amount discounting the line that has been allocated by a discount.
 *
 */
export type Shopify_DiscountAllocation = {
  __typename?: 'shopify_DiscountAllocation';
  /** Amount of discount allocated. */
  allocatedAmount: Shopify_MoneyV2;
  /** The discount this allocated amount originated from. */
  discountApplication: Shopify_DiscountApplication;
};

/**
 * Discount applications capture the intentions of a discount source at
 * the time of application.
 *
 */
export type Shopify_DiscountApplication = {
  /** The method by which the discount's value is allocated to its entitled items. */
  allocationMethod: Shopify_DiscountApplicationAllocationMethod;
  /** Which lines of targetType that the discount is allocated over. */
  targetSelection: Shopify_DiscountApplicationTargetSelection;
  /** The type of line that the discount is applicable towards. */
  targetType: Shopify_DiscountApplicationTargetType;
  /** The value of the discount application. */
  value: Shopify_PricingValue;
};

/** The method by which the discount's value is allocated onto its entitled lines. */
export enum Shopify_DiscountApplicationAllocationMethod {
  /** The value is spread across all entitled lines. */
  Across = 'ACROSS',
  /** The value is applied onto every entitled line. */
  Each = 'EACH',
  /** The value is specifically applied onto a particular line. */
  One = 'ONE',
}

/**
 * An auto-generated type for paginating through multiple DiscountApplications.
 *
 */
export type Shopify_DiscountApplicationConnection = {
  __typename?: 'shopify_DiscountApplicationConnection';
  /** A list of edges. */
  edges: Array<Shopify_DiscountApplicationEdge>;
  /** A list of the nodes contained in DiscountApplicationEdge. */
  nodes: Array<Shopify_DiscountApplication>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one DiscountApplication and a cursor during pagination.
 *
 */
export type Shopify_DiscountApplicationEdge = {
  __typename?: 'shopify_DiscountApplicationEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of DiscountApplicationEdge. */
  node: Shopify_DiscountApplication;
};

/**
 * The lines on the order to which the discount is applied, of the type defined by
 * the discount application's `targetType`. For example, the value `ENTITLED`, combined with a `targetType` of
 * `LINE_ITEM`, applies the discount on all line items that are entitled to the discount.
 * The value `ALL`, combined with a `targetType` of `SHIPPING_LINE`, applies the discount on all shipping lines.
 *
 */
export enum Shopify_DiscountApplicationTargetSelection {
  /** The discount is allocated onto all the lines. */
  All = 'ALL',
  /** The discount is allocated onto only the lines that it's entitled for. */
  Entitled = 'ENTITLED',
  /** The discount is allocated onto explicitly chosen lines. */
  Explicit = 'EXPLICIT',
}

/**
 * The type of line (i.e. line item or shipping line) on an order that the discount is applicable towards.
 *
 */
export enum Shopify_DiscountApplicationTargetType {
  /** The discount applies onto line items. */
  LineItem = 'LINE_ITEM',
  /** The discount applies onto shipping lines. */
  ShippingLine = 'SHIPPING_LINE',
}

/**
 * Discount code applications capture the intentions of a discount code at
 * the time that it is applied.
 *
 */
export type Shopify_DiscountCodeApplication = Shopify_DiscountApplication & {
  __typename?: 'shopify_DiscountCodeApplication';
  /** The method by which the discount's value is allocated to its entitled items. */
  allocationMethod: Shopify_DiscountApplicationAllocationMethod;
  /** Specifies whether the discount code was applied successfully. */
  applicable: Scalars['Boolean'];
  /** The string identifying the discount code that was used at the time of application. */
  code: Scalars['String'];
  /** Which lines of targetType that the discount is allocated over. */
  targetSelection: Shopify_DiscountApplicationTargetSelection;
  /** The type of line that the discount is applicable towards. */
  targetType: Shopify_DiscountApplicationTargetType;
  /** The value of the discount application. */
  value: Shopify_PricingValue;
};

/** Represents an error in the input of a mutation. */
export type Shopify_DisplayableError = {
  /** The path to the input field that caused the error. */
  field: Maybe<Array<Scalars['String']>>;
  /** The error message. */
  message: Scalars['String'];
};

/** Represents a web address. */
export type Shopify_Domain = {
  __typename?: 'shopify_Domain';
  /** The host name of the domain (eg: `example.com`). */
  host: Scalars['String'];
  /** Whether SSL is enabled or not. */
  sslEnabled: Scalars['Boolean'];
  /** The URL of the domain (eg: `https://example.com`). */
  url: Scalars['shopify_URL'];
};

/** Represents a video hosted outside of Shopify. */
export type Shopify_ExternalVideo = Shopify_Media &
  Shopify_Node & {
    __typename?: 'shopify_ExternalVideo';
    /** A word or phrase to share the nature or contents of a media. */
    alt: Maybe<Scalars['String']>;
    /** The embed URL of the video for the respective host. */
    embedUrl: Scalars['shopify_URL'];
    /** The URL. */
    embeddedUrl: Scalars['shopify_URL'];
    /** The host of the external video. */
    host: Shopify_MediaHost;
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** The media content type. */
    mediaContentType: Shopify_MediaContentType;
    /** The origin URL of the video on the respective host. */
    originUrl: Scalars['shopify_URL'];
    /** The preview image for the media. */
    previewImage: Maybe<Shopify_Image>;
  };

/** A filter that is supported on the parent field. */
export type Shopify_Filter = {
  __typename?: 'shopify_Filter';
  /** A unique identifier. */
  id: Scalars['String'];
  /** A human-friendly string for this filter. */
  label: Scalars['String'];
  /** An enumeration that denotes the type of data this filter represents. */
  type: Shopify_FilterType;
  /** The list of values for this filter. */
  values: Array<Shopify_FilterValue>;
};

/**
 * The type of data that the filter group represents.
 *
 * For more information, refer to [Filter products in a collection with the Storefront API]
 * (https://shopify.dev/custom-storefronts/products-collections/filter-products).
 *
 */
export enum Shopify_FilterType {
  /** A boolean value. */
  Boolean = 'BOOLEAN',
  /** A list of selectable values. */
  List = 'LIST',
  /** A range of prices. */
  PriceRange = 'PRICE_RANGE',
}

/** A selectable value within a filter. */
export type Shopify_FilterValue = {
  __typename?: 'shopify_FilterValue';
  /** The number of results that match this filter value. */
  count: Scalars['Int'];
  /** A unique identifier. */
  id: Scalars['String'];
  /**
   * An input object that can be used to filter by this value on the parent field.
   *
   * The value is provided as a helper for building dynamic filtering UI. For example, if you have a list of selected `FilterValue` objects, you can combine their respective `input` values to use in a subsequent query.
   *
   */
  input: Scalars['shopify_JSON'];
  /** A human-friendly string for this filter value. */
  label: Scalars['String'];
};

/** Represents a single fulfillment in an order. */
export type Shopify_Fulfillment = {
  __typename?: 'shopify_Fulfillment';
  /** List of the fulfillment's line items. */
  fulfillmentLineItems: Shopify_FulfillmentLineItemConnection;
  /** The name of the tracking company. */
  trackingCompany: Maybe<Scalars['String']>;
  /**
   * Tracking information associated with the fulfillment,
   * such as the tracking number and tracking URL.
   *
   */
  trackingInfo: Array<Shopify_FulfillmentTrackingInfo>;
};

/** Represents a single fulfillment in an order. */
export type Shopify_FulfillmentFulfillmentLineItemsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/** Represents a single fulfillment in an order. */
export type Shopify_FulfillmentTrackingInfoArgs = {
  first: InputMaybe<Scalars['Int']>;
};

/** Represents a single line item in a fulfillment. There is at most one fulfillment line item for each order line item. */
export type Shopify_FulfillmentLineItem = {
  __typename?: 'shopify_FulfillmentLineItem';
  /** The associated order's line item. */
  lineItem: Shopify_OrderLineItem;
  /** The amount fulfilled in this fulfillment. */
  quantity: Scalars['Int'];
};

/**
 * An auto-generated type for paginating through multiple FulfillmentLineItems.
 *
 */
export type Shopify_FulfillmentLineItemConnection = {
  __typename?: 'shopify_FulfillmentLineItemConnection';
  /** A list of edges. */
  edges: Array<Shopify_FulfillmentLineItemEdge>;
  /** A list of the nodes contained in FulfillmentLineItemEdge. */
  nodes: Array<Shopify_FulfillmentLineItem>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one FulfillmentLineItem and a cursor during pagination.
 *
 */
export type Shopify_FulfillmentLineItemEdge = {
  __typename?: 'shopify_FulfillmentLineItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of FulfillmentLineItemEdge. */
  node: Shopify_FulfillmentLineItem;
};

/** Tracking information associated with the fulfillment. */
export type Shopify_FulfillmentTrackingInfo = {
  __typename?: 'shopify_FulfillmentTrackingInfo';
  /** The tracking number of the fulfillment. */
  number: Maybe<Scalars['String']>;
  /** The URL to track the fulfillment. */
  url: Maybe<Scalars['shopify_URL']>;
};

/** The generic file resource lets you manage files in a merchant’s store. Generic files include any file that doesn’t fit into a designated type such as image or video. Example: PDF, JSON. */
export type Shopify_GenericFile = Shopify_Node & {
  __typename?: 'shopify_GenericFile';
  /** A word or phrase to indicate the contents of a file. */
  alt: Maybe<Scalars['String']>;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The MIME type of the file. */
  mimeType: Maybe<Scalars['String']>;
  /** The size of the original file in bytes. */
  originalFileSize: Maybe<Scalars['Int']>;
  /** The preview image for the file. */
  previewImage: Maybe<Shopify_Image>;
  /** The URL of the file. */
  url: Maybe<Scalars['shopify_URL']>;
};

/** Used to specify a geographical location. */
export type Shopify_GeoCoordinateInput = {
  /** The coordinate's latitude value. */
  latitude: Scalars['Float'];
  /** The coordinate's longitude value. */
  longitude: Scalars['Float'];
};

/** Represents information about the metafields associated to the specified resource. */
export type Shopify_HasMetafields = {
  /** Returns a metafield found by namespace and key. */
  metafield: Maybe<Shopify_Metafield>;
  /**
   * The metafields associated with the resource matching the supplied list of namespaces and keys.
   *
   */
  metafields: Array<Maybe<Shopify_Metafield>>;
};

/** Represents information about the metafields associated to the specified resource. */
export type Shopify_HasMetafieldsMetafieldArgs = {
  key: Scalars['String'];
  namespace: Scalars['String'];
};

/** Represents information about the metafields associated to the specified resource. */
export type Shopify_HasMetafieldsMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** Identifies a metafield on an owner resource by namespace and key. */
export type Shopify_HasMetafieldsIdentifier = {
  /** The identifier for the metafield. */
  key: Scalars['String'];
  /** A container for a set of metafields. */
  namespace: Scalars['String'];
};

/** Represents an image resource. */
export type Shopify_Image = {
  __typename?: 'shopify_Image';
  /** A word or phrase to share the nature or contents of an image. */
  altText: Maybe<Scalars['String']>;
  /** The original height of the image in pixels. Returns `null` if the image is not hosted by Shopify. */
  height: Maybe<Scalars['Int']>;
  /** A unique identifier for the image. */
  id: Maybe<Scalars['ID']>;
  /**
   * The location of the original image as a URL.
   *
   * If there are any existing transformations in the original source URL, they will remain and not be stripped.
   *
   */
  originalSrc: Scalars['shopify_URL'];
  /** The location of the image as a URL. */
  src: Scalars['shopify_URL'];
  /**
   * The location of the transformed image as a URL.
   *
   * All transformation arguments are considered "best-effort". If they can be applied to an image, they will be.
   * Otherwise any transformations which an image type does not support will be ignored.
   *
   */
  transformedSrc: Scalars['shopify_URL'];
  /**
   * The location of the image as a URL.
   *
   * If no transform options are specified, then the original image will be preserved including any pre-applied transforms.
   *
   * All transformation options are considered "best-effort". Any transformation that the original image type doesn't support will be ignored.
   *
   * If you need multiple variations of the same image, then you can use [GraphQL aliases](https://graphql.org/learn/queries/#aliases).
   *
   */
  url: Scalars['shopify_URL'];
  /** The original width of the image in pixels. Returns `null` if the image is not hosted by Shopify. */
  width: Maybe<Scalars['Int']>;
};

/** Represents an image resource. */
export type Shopify_ImageTransformedSrcArgs = {
  crop: InputMaybe<Shopify_CropRegion>;
  maxHeight: InputMaybe<Scalars['Int']>;
  maxWidth: InputMaybe<Scalars['Int']>;
  preferredContentType: InputMaybe<Shopify_ImageContentType>;
  scale?: InputMaybe<Scalars['Int']>;
};

/** Represents an image resource. */
export type Shopify_ImageUrlArgs = {
  transform: InputMaybe<Shopify_ImageTransformInput>;
};

/**
 * An auto-generated type for paginating through multiple Images.
 *
 */
export type Shopify_ImageConnection = {
  __typename?: 'shopify_ImageConnection';
  /** A list of edges. */
  edges: Array<Shopify_ImageEdge>;
  /** A list of the nodes contained in ImageEdge. */
  nodes: Array<Shopify_Image>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/** List of supported image content types. */
export enum Shopify_ImageContentType {
  /** A JPG image. */
  Jpg = 'JPG',
  /** A PNG image. */
  Png = 'PNG',
  /** A WEBP image. */
  Webp = 'WEBP',
}

/**
 * An auto-generated type which holds one Image and a cursor during pagination.
 *
 */
export type Shopify_ImageEdge = {
  __typename?: 'shopify_ImageEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of ImageEdge. */
  node: Shopify_Image;
};

/**
 * The available options for transforming an image.
 *
 * All transformation options are considered best effort. Any transformation that the original image type doesn't support will be ignored.
 *
 */
export type Shopify_ImageTransformInput = {
  /**
   * The region of the image to remain after cropping.
   * Must be used in conjunction with the `maxWidth` and/or `maxHeight` fields, where the `maxWidth` and `maxHeight` aren't equal.
   * The `crop` argument should coincide with the smaller value. A smaller `maxWidth` indicates a `LEFT` or `RIGHT` crop, while
   * a smaller `maxHeight` indicates a `TOP` or `BOTTOM` crop. For example, `{ maxWidth: 5, maxHeight: 10, crop: LEFT }` will result
   * in an image with a width of 5 and height of 10, where the right side of the image is removed.
   *
   */
  crop: InputMaybe<Shopify_CropRegion>;
  /**
   * Image height in pixels between 1 and 5760.
   *
   */
  maxHeight: InputMaybe<Scalars['Int']>;
  /**
   * Image width in pixels between 1 and 5760.
   *
   */
  maxWidth: InputMaybe<Scalars['Int']>;
  /**
   * Convert the source image into the preferred content type.
   * Supported conversions: `.svg` to `.png`, any file type to `.jpg`, and any file type to `.webp`.
   *
   */
  preferredContentType: InputMaybe<Shopify_ImageContentType>;
  /**
   * Image size multiplier for high-resolution retina displays. Must be within 1..3.
   *
   */
  scale: InputMaybe<Scalars['Int']>;
};

/** A language. */
export type Shopify_Language = {
  __typename?: 'shopify_Language';
  /** The name of the language in the language itself. If the language uses capitalization, it is capitalized for a mid-sentence position. */
  endonymName: Scalars['String'];
  /** The ISO code. */
  isoCode: Shopify_LanguageCode;
  /** The name of the language in the current language. */
  name: Scalars['String'];
};

/** ISO 639-1 language codes supported by Shopify. */
export enum Shopify_LanguageCode {
  /** Afrikaans. */
  Af = 'AF',
  /** Akan. */
  Ak = 'AK',
  /** Amharic. */
  Am = 'AM',
  /** Arabic. */
  Ar = 'AR',
  /** Assamese. */
  As = 'AS',
  /** Azerbaijani. */
  Az = 'AZ',
  /** Belarusian. */
  Be = 'BE',
  /** Bulgarian. */
  Bg = 'BG',
  /** Bambara. */
  Bm = 'BM',
  /** Bangla. */
  Bn = 'BN',
  /** Tibetan. */
  Bo = 'BO',
  /** Breton. */
  Br = 'BR',
  /** Bosnian. */
  Bs = 'BS',
  /** Catalan. */
  Ca = 'CA',
  /** Chechen. */
  Ce = 'CE',
  /** Czech. */
  Cs = 'CS',
  /** Church Slavic. */
  Cu = 'CU',
  /** Welsh. */
  Cy = 'CY',
  /** Danish. */
  Da = 'DA',
  /** German. */
  De = 'DE',
  /** Dzongkha. */
  Dz = 'DZ',
  /** Ewe. */
  Ee = 'EE',
  /** Greek. */
  El = 'EL',
  /** English. */
  En = 'EN',
  /** Esperanto. */
  Eo = 'EO',
  /** Spanish. */
  Es = 'ES',
  /** Estonian. */
  Et = 'ET',
  /** Basque. */
  Eu = 'EU',
  /** Persian. */
  Fa = 'FA',
  /** Fulah. */
  Ff = 'FF',
  /** Finnish. */
  Fi = 'FI',
  /** Faroese. */
  Fo = 'FO',
  /** French. */
  Fr = 'FR',
  /** Western Frisian. */
  Fy = 'FY',
  /** Irish. */
  Ga = 'GA',
  /** Scottish Gaelic. */
  Gd = 'GD',
  /** Galician. */
  Gl = 'GL',
  /** Gujarati. */
  Gu = 'GU',
  /** Manx. */
  Gv = 'GV',
  /** Hausa. */
  Ha = 'HA',
  /** Hebrew. */
  He = 'HE',
  /** Hindi. */
  Hi = 'HI',
  /** Croatian. */
  Hr = 'HR',
  /** Hungarian. */
  Hu = 'HU',
  /** Armenian. */
  Hy = 'HY',
  /** Interlingua. */
  Ia = 'IA',
  /** Indonesian. */
  Id = 'ID',
  /** Igbo. */
  Ig = 'IG',
  /** Sichuan Yi. */
  Ii = 'II',
  /** Icelandic. */
  Is = 'IS',
  /** Italian. */
  It = 'IT',
  /** Japanese. */
  Ja = 'JA',
  /** Javanese. */
  Jv = 'JV',
  /** Georgian. */
  Ka = 'KA',
  /** Kikuyu. */
  Ki = 'KI',
  /** Kazakh. */
  Kk = 'KK',
  /** Kalaallisut. */
  Kl = 'KL',
  /** Khmer. */
  Km = 'KM',
  /** Kannada. */
  Kn = 'KN',
  /** Korean. */
  Ko = 'KO',
  /** Kashmiri. */
  Ks = 'KS',
  /** Kurdish. */
  Ku = 'KU',
  /** Cornish. */
  Kw = 'KW',
  /** Kyrgyz. */
  Ky = 'KY',
  /** Luxembourgish. */
  Lb = 'LB',
  /** Ganda. */
  Lg = 'LG',
  /** Lingala. */
  Ln = 'LN',
  /** Lao. */
  Lo = 'LO',
  /** Lithuanian. */
  Lt = 'LT',
  /** Luba-Katanga. */
  Lu = 'LU',
  /** Latvian. */
  Lv = 'LV',
  /** Malagasy. */
  Mg = 'MG',
  /** Māori. */
  Mi = 'MI',
  /** Macedonian. */
  Mk = 'MK',
  /** Malayalam. */
  Ml = 'ML',
  /** Mongolian. */
  Mn = 'MN',
  /** Marathi. */
  Mr = 'MR',
  /** Malay. */
  Ms = 'MS',
  /** Maltese. */
  Mt = 'MT',
  /** Burmese. */
  My = 'MY',
  /** Norwegian (Bokmål). */
  Nb = 'NB',
  /** North Ndebele. */
  Nd = 'ND',
  /** Nepali. */
  Ne = 'NE',
  /** Dutch. */
  Nl = 'NL',
  /** Norwegian Nynorsk. */
  Nn = 'NN',
  /** Norwegian. */
  No = 'NO',
  /** Oromo. */
  Om = 'OM',
  /** Odia. */
  Or = 'OR',
  /** Ossetic. */
  Os = 'OS',
  /** Punjabi. */
  Pa = 'PA',
  /** Polish. */
  Pl = 'PL',
  /** Pashto. */
  Ps = 'PS',
  /** Portuguese. */
  Pt = 'PT',
  /** Portuguese (Brazil). */
  PtBr = 'PT_BR',
  /** Portuguese (Portugal). */
  PtPt = 'PT_PT',
  /** Quechua. */
  Qu = 'QU',
  /** Romansh. */
  Rm = 'RM',
  /** Rundi. */
  Rn = 'RN',
  /** Romanian. */
  Ro = 'RO',
  /** Russian. */
  Ru = 'RU',
  /** Kinyarwanda. */
  Rw = 'RW',
  /** Sindhi. */
  Sd = 'SD',
  /** Northern Sami. */
  Se = 'SE',
  /** Sango. */
  Sg = 'SG',
  /** Sinhala. */
  Si = 'SI',
  /** Slovak. */
  Sk = 'SK',
  /** Slovenian. */
  Sl = 'SL',
  /** Shona. */
  Sn = 'SN',
  /** Somali. */
  So = 'SO',
  /** Albanian. */
  Sq = 'SQ',
  /** Serbian. */
  Sr = 'SR',
  /** Sundanese. */
  Su = 'SU',
  /** Swedish. */
  Sv = 'SV',
  /** Swahili. */
  Sw = 'SW',
  /** Tamil. */
  Ta = 'TA',
  /** Telugu. */
  Te = 'TE',
  /** Tajik. */
  Tg = 'TG',
  /** Thai. */
  Th = 'TH',
  /** Tigrinya. */
  Ti = 'TI',
  /** Turkmen. */
  Tk = 'TK',
  /** Tongan. */
  To = 'TO',
  /** Turkish. */
  Tr = 'TR',
  /** Tatar. */
  Tt = 'TT',
  /** Uyghur. */
  Ug = 'UG',
  /** Ukrainian. */
  Uk = 'UK',
  /** Urdu. */
  Ur = 'UR',
  /** Uzbek. */
  Uz = 'UZ',
  /** Vietnamese. */
  Vi = 'VI',
  /** Volapük. */
  Vo = 'VO',
  /** Wolof. */
  Wo = 'WO',
  /** Xhosa. */
  Xh = 'XH',
  /** Yiddish. */
  Yi = 'YI',
  /** Yoruba. */
  Yo = 'YO',
  /** Chinese. */
  Zh = 'ZH',
  /** Chinese (Simplified). */
  ZhCn = 'ZH_CN',
  /** Chinese (Traditional). */
  ZhTw = 'ZH_TW',
  /** Zulu. */
  Zu = 'ZU',
}

/** Information about the localized experiences configured for the shop. */
export type Shopify_Localization = {
  __typename?: 'shopify_Localization';
  /** The list of countries with enabled localized experiences. */
  availableCountries: Array<Shopify_Country>;
  /** The list of languages available for the active country. */
  availableLanguages: Array<Shopify_Language>;
  /** The country of the active localized experience. Use the `@inContext` directive to change this value. */
  country: Shopify_Country;
  /** The language of the active localized experience. Use the `@inContext` directive to change this value. */
  language: Shopify_Language;
};

/** Represents a location where product inventory is held. */
export type Shopify_Location = Shopify_Node & {
  __typename?: 'shopify_Location';
  /** The address of the location. */
  address: Shopify_LocationAddress;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The name of the location. */
  name: Scalars['String'];
};

/**
 * Represents the address of a location.
 *
 */
export type Shopify_LocationAddress = {
  __typename?: 'shopify_LocationAddress';
  /** The first line of the address for the location. */
  address1: Maybe<Scalars['String']>;
  /** The second line of the address for the location. */
  address2: Maybe<Scalars['String']>;
  /** The city of the location. */
  city: Maybe<Scalars['String']>;
  /** The country of the location. */
  country: Maybe<Scalars['String']>;
  /** The country code of the location. */
  countryCode: Maybe<Scalars['String']>;
  /** A formatted version of the address for the location. */
  formatted: Array<Scalars['String']>;
  /** The latitude coordinates of the location. */
  latitude: Maybe<Scalars['Float']>;
  /** The longitude coordinates of the location. */
  longitude: Maybe<Scalars['Float']>;
  /** The phone number of the location. */
  phone: Maybe<Scalars['String']>;
  /** The province of the location. */
  province: Maybe<Scalars['String']>;
  /**
   * The code for the province, state, or district of the address of the location.
   *
   */
  provinceCode: Maybe<Scalars['String']>;
  /** The ZIP code of the location. */
  zip: Maybe<Scalars['String']>;
};

/**
 * An auto-generated type for paginating through multiple Locations.
 *
 */
export type Shopify_LocationConnection = {
  __typename?: 'shopify_LocationConnection';
  /** A list of edges. */
  edges: Array<Shopify_LocationEdge>;
  /** A list of the nodes contained in LocationEdge. */
  nodes: Array<Shopify_Location>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one Location and a cursor during pagination.
 *
 */
export type Shopify_LocationEdge = {
  __typename?: 'shopify_LocationEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of LocationEdge. */
  node: Shopify_Location;
};

/** The set of valid sort keys for the Location query. */
export enum Shopify_LocationSortKeys {
  /** Sort by the `city` value. */
  City = 'CITY',
  /** Sort by the `distance` value. */
  Distance = 'DISTANCE',
  /** Sort by the `id` value. */
  Id = 'ID',
  /** Sort by the `name` value. */
  Name = 'NAME',
}

/** Represents a mailing address for customers and shipping. */
export type Shopify_MailingAddress = Shopify_Node & {
  __typename?: 'shopify_MailingAddress';
  /** The first line of the address. Typically the street address or PO Box number. */
  address1: Maybe<Scalars['String']>;
  /**
   * The second line of the address. Typically the number of the apartment, suite, or unit.
   *
   */
  address2: Maybe<Scalars['String']>;
  /**
   * The name of the city, district, village, or town.
   *
   */
  city: Maybe<Scalars['String']>;
  /**
   * The name of the customer's company or organization.
   *
   */
  company: Maybe<Scalars['String']>;
  /**
   * The name of the country.
   *
   */
  country: Maybe<Scalars['String']>;
  /**
   * The two-letter code for the country of the address.
   *
   * For example, US.
   *
   */
  countryCode: Maybe<Scalars['String']>;
  /**
   * The two-letter code for the country of the address.
   *
   * For example, US.
   *
   */
  countryCodeV2: Maybe<Shopify_CountryCode>;
  /** The first name of the customer. */
  firstName: Maybe<Scalars['String']>;
  /** A formatted version of the address, customized by the provided arguments. */
  formatted: Array<Scalars['String']>;
  /** A comma-separated list of the values for city, province, and country. */
  formattedArea: Maybe<Scalars['String']>;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The last name of the customer. */
  lastName: Maybe<Scalars['String']>;
  /** The latitude coordinate of the customer address. */
  latitude: Maybe<Scalars['Float']>;
  /** The longitude coordinate of the customer address. */
  longitude: Maybe<Scalars['Float']>;
  /**
   * The full name of the customer, based on firstName and lastName.
   *
   */
  name: Maybe<Scalars['String']>;
  /**
   * A unique phone number for the customer.
   *
   * Formatted using E.164 standard. For example, _+16135551111_.
   *
   */
  phone: Maybe<Scalars['String']>;
  /** The region of the address, such as the province, state, or district. */
  province: Maybe<Scalars['String']>;
  /**
   * The two-letter code for the region.
   *
   * For example, ON.
   *
   */
  provinceCode: Maybe<Scalars['String']>;
  /** The zip or postal code of the address. */
  zip: Maybe<Scalars['String']>;
};

/** Represents a mailing address for customers and shipping. */
export type Shopify_MailingAddressFormattedArgs = {
  withCompany?: InputMaybe<Scalars['Boolean']>;
  withName?: InputMaybe<Scalars['Boolean']>;
};

/**
 * An auto-generated type for paginating through multiple MailingAddresses.
 *
 */
export type Shopify_MailingAddressConnection = {
  __typename?: 'shopify_MailingAddressConnection';
  /** A list of edges. */
  edges: Array<Shopify_MailingAddressEdge>;
  /** A list of the nodes contained in MailingAddressEdge. */
  nodes: Array<Shopify_MailingAddress>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one MailingAddress and a cursor during pagination.
 *
 */
export type Shopify_MailingAddressEdge = {
  __typename?: 'shopify_MailingAddressEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of MailingAddressEdge. */
  node: Shopify_MailingAddress;
};

/** Specifies the fields accepted to create or update a mailing address. */
export type Shopify_MailingAddressInput = {
  /**
   * The first line of the address. Typically the street address or PO Box number.
   *
   */
  address1: InputMaybe<Scalars['String']>;
  /**
   * The second line of the address. Typically the number of the apartment, suite, or unit.
   *
   */
  address2: InputMaybe<Scalars['String']>;
  /**
   * The name of the city, district, village, or town.
   *
   */
  city: InputMaybe<Scalars['String']>;
  /**
   * The name of the customer's company or organization.
   *
   */
  company: InputMaybe<Scalars['String']>;
  /** The name of the country. */
  country: InputMaybe<Scalars['String']>;
  /** The first name of the customer. */
  firstName: InputMaybe<Scalars['String']>;
  /** The last name of the customer. */
  lastName: InputMaybe<Scalars['String']>;
  /**
   * A unique phone number for the customer.
   *
   * Formatted using E.164 standard. For example, _+16135551111_.
   *
   */
  phone: InputMaybe<Scalars['String']>;
  /** The region of the address, such as the province, state, or district. */
  province: InputMaybe<Scalars['String']>;
  /** The zip or postal code of the address. */
  zip: InputMaybe<Scalars['String']>;
};

/**
 * Manual discount applications capture the intentions of a discount that was manually created.
 *
 */
export type Shopify_ManualDiscountApplication = Shopify_DiscountApplication & {
  __typename?: 'shopify_ManualDiscountApplication';
  /** The method by which the discount's value is allocated to its entitled items. */
  allocationMethod: Shopify_DiscountApplicationAllocationMethod;
  /** The description of the application. */
  description: Maybe<Scalars['String']>;
  /** Which lines of targetType that the discount is allocated over. */
  targetSelection: Shopify_DiscountApplicationTargetSelection;
  /** The type of line that the discount is applicable towards. */
  targetType: Shopify_DiscountApplicationTargetType;
  /** The title of the application. */
  title: Scalars['String'];
  /** The value of the discount application. */
  value: Shopify_PricingValue;
};

/** Represents a media interface. */
export type Shopify_Media = {
  /** A word or phrase to share the nature or contents of a media. */
  alt: Maybe<Scalars['String']>;
  /** The media content type. */
  mediaContentType: Shopify_MediaContentType;
  /** The preview image for the media. */
  previewImage: Maybe<Shopify_Image>;
};

/**
 * An auto-generated type for paginating through multiple Media.
 *
 */
export type Shopify_MediaConnection = {
  __typename?: 'shopify_MediaConnection';
  /** A list of edges. */
  edges: Array<Shopify_MediaEdge>;
  /** A list of the nodes contained in MediaEdge. */
  nodes: Array<Shopify_Media>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/** The possible content types for a media object. */
export enum Shopify_MediaContentType {
  /** An externally hosted video. */
  ExternalVideo = 'EXTERNAL_VIDEO',
  /** A Shopify hosted image. */
  Image = 'IMAGE',
  /** A 3d model. */
  Model_3D = 'MODEL_3D',
  /** A Shopify hosted video. */
  Video = 'VIDEO',
}

/**
 * An auto-generated type which holds one Media and a cursor during pagination.
 *
 */
export type Shopify_MediaEdge = {
  __typename?: 'shopify_MediaEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of MediaEdge. */
  node: Shopify_Media;
};

/** Host for a Media Resource. */
export enum Shopify_MediaHost {
  /** Host for Vimeo embedded videos. */
  Vimeo = 'VIMEO',
  /** Host for YouTube embedded videos. */
  Youtube = 'YOUTUBE',
}

/** Represents a Shopify hosted image. */
export type Shopify_MediaImage = Shopify_Media &
  Shopify_Node & {
    __typename?: 'shopify_MediaImage';
    /** A word or phrase to share the nature or contents of a media. */
    alt: Maybe<Scalars['String']>;
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** The image for the media. */
    image: Maybe<Shopify_Image>;
    /** The media content type. */
    mediaContentType: Shopify_MediaContentType;
    /** The preview image for the media. */
    previewImage: Maybe<Shopify_Image>;
  };

/**
 * A menu used for navigation within a storefront.
 *
 */
export type Shopify_Menu = Shopify_Node & {
  __typename?: 'shopify_Menu';
  /** The menu's handle. */
  handle: Scalars['String'];
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The menu's child items. */
  items: Array<Shopify_MenuItem>;
  /** The count of items on the menu. */
  itemsCount: Scalars['Int'];
  /** The menu's title. */
  title: Scalars['String'];
};

/**
 * A menu item within a parent menu.
 *
 */
export type Shopify_MenuItem = Shopify_Node & {
  __typename?: 'shopify_MenuItem';
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The menu item's child items. */
  items: Array<Shopify_MenuItem>;
  /** The ID of the linked resource. */
  resourceId: Maybe<Scalars['ID']>;
  /** The menu item's tags to filter a collection. */
  tags: Array<Scalars['String']>;
  /** The menu item's title. */
  title: Scalars['String'];
  /** The menu item's type. */
  type: Shopify_MenuItemType;
  /** The menu item's URL. */
  url: Maybe<Scalars['shopify_URL']>;
};

/** A menu item type. */
export enum Shopify_MenuItemType {
  /** An article link. */
  Article = 'ARTICLE',
  /** A blog link. */
  Blog = 'BLOG',
  /** A catalog link. */
  Catalog = 'CATALOG',
  /** A collection link. */
  Collection = 'COLLECTION',
  /** A collection link. */
  Collections = 'COLLECTIONS',
  /** A frontpage link. */
  Frontpage = 'FRONTPAGE',
  /** An http link. */
  Http = 'HTTP',
  /** A page link. */
  Page = 'PAGE',
  /** A product link. */
  Product = 'PRODUCT',
  /** A search link. */
  Search = 'SEARCH',
  /** A shop policy link. */
  ShopPolicy = 'SHOP_POLICY',
}

/** The merchandise to be purchased at checkout. */
export type Shopify_Merchandise = Shopify_ProductVariant;

/**
 * Metafields represent custom metadata attached to a resource. Metafields can be sorted into namespaces and are
 * comprised of keys, values, and value types.
 *
 */
export type Shopify_Metafield = Shopify_Node & {
  __typename?: 'shopify_Metafield';
  /** The date and time when the storefront metafield was created. */
  createdAt: Scalars['shopify_DateTime'];
  /** The description of a metafield. */
  description: Maybe<Scalars['String']>;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The key name for a metafield. */
  key: Scalars['String'];
  /** The namespace for a metafield. */
  namespace: Scalars['String'];
  /** The parent object that the metafield belongs to. */
  parentResource: Shopify_MetafieldParentResource;
  /** Returns a reference object if the metafield definition's type is a resource reference. */
  reference: Maybe<Shopify_MetafieldReference>;
  /** A list of reference objects if the metafield's type is a resource reference list. */
  references: Maybe<Shopify_MetafieldReferenceConnection>;
  /**
   * The type name of the metafield.
   * See the list of [supported types](https://shopify.dev/apps/metafields/definitions/types).
   *
   */
  type: Scalars['String'];
  /** The date and time when the storefront metafield was updated. */
  updatedAt: Scalars['shopify_DateTime'];
  /** The value of a metafield. */
  value: Scalars['String'];
};

/**
 * Metafields represent custom metadata attached to a resource. Metafields can be sorted into namespaces and are
 * comprised of keys, values, and value types.
 *
 */
export type Shopify_MetafieldReferencesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

/**
 * A filter used to view a subset of products in a collection matching a specific metafield value.
 *
 * Only the following metafield types are currently supported:
 * - `number_integer`
 * - `number_decimal`
 * - `single_line_text_field`
 * - `boolean` as of 2022-04.
 *
 */
export type Shopify_MetafieldFilter = {
  /** The key of the metafield to filter on. */
  key: Scalars['String'];
  /** The namespace of the metafield to filter on. */
  namespace: Scalars['String'];
  /** The value of the metafield. */
  value: Scalars['String'];
};

/** A resource that the metafield belongs to. */
export type Shopify_MetafieldParentResource =
  | Shopify_Article
  | Shopify_Blog
  | Shopify_Collection
  | Shopify_Customer
  | Shopify_Order
  | Shopify_Page
  | Shopify_Product
  | Shopify_ProductVariant
  | Shopify_Shop;

/**
 * Returns the resource which is being referred to by a metafield.
 *
 */
export type Shopify_MetafieldReference =
  | Shopify_Collection
  | Shopify_GenericFile
  | Shopify_MediaImage
  | Shopify_Metaobject
  | Shopify_Page
  | Shopify_Product
  | Shopify_ProductVariant
  | Shopify_Video;

/**
 * An auto-generated type for paginating through multiple MetafieldReferences.
 *
 */
export type Shopify_MetafieldReferenceConnection = {
  __typename?: 'shopify_MetafieldReferenceConnection';
  /** A list of edges. */
  edges: Array<Shopify_MetafieldReferenceEdge>;
  /** A list of the nodes contained in MetafieldReferenceEdge. */
  nodes: Array<Shopify_MetafieldReference>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one MetafieldReference and a cursor during pagination.
 *
 */
export type Shopify_MetafieldReferenceEdge = {
  __typename?: 'shopify_MetafieldReferenceEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of MetafieldReferenceEdge. */
  node: Shopify_MetafieldReference;
};

/** An instance of a user-defined model based on a MetaobjectDefinition. */
export type Shopify_Metaobject = Shopify_Node & {
  __typename?: 'shopify_Metaobject';
  /** Accesses a field of the object by key. */
  field: Maybe<Shopify_MetaobjectField>;
  /**
   * All object fields with defined values.
   * Omitted object keys can be assumed null, and no guarantees are made about field order.
   *
   */
  fields: Array<Shopify_MetaobjectField>;
  /** The unique handle of the metaobject. Useful as a custom ID. */
  handle: Scalars['String'];
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The type of the metaobject. Defines the namespace of its associated metafields. */
  type: Scalars['String'];
  /** The date and time when the metaobject was last updated. */
  updatedAt: Scalars['shopify_DateTime'];
};

/** An instance of a user-defined model based on a MetaobjectDefinition. */
export type Shopify_MetaobjectFieldArgs = {
  key: Scalars['String'];
};

/**
 * An auto-generated type for paginating through multiple Metaobjects.
 *
 */
export type Shopify_MetaobjectConnection = {
  __typename?: 'shopify_MetaobjectConnection';
  /** A list of edges. */
  edges: Array<Shopify_MetaobjectEdge>;
  /** A list of the nodes contained in MetaobjectEdge. */
  nodes: Array<Shopify_Metaobject>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one Metaobject and a cursor during pagination.
 *
 */
export type Shopify_MetaobjectEdge = {
  __typename?: 'shopify_MetaobjectEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of MetaobjectEdge. */
  node: Shopify_Metaobject;
};

/** Provides the value of a Metaobject field. */
export type Shopify_MetaobjectField = {
  __typename?: 'shopify_MetaobjectField';
  /** The field key. */
  key: Scalars['String'];
  /** A referenced object if the field type is a resource reference. */
  reference: Maybe<Shopify_MetafieldReference>;
  /** A list of referenced objects if the field type is a resource reference list. */
  references: Maybe<Shopify_MetafieldReferenceConnection>;
  /**
   * The type name of the field.
   * See the list of [supported types](https://shopify.dev/apps/metafields/definitions/types).
   *
   */
  type: Scalars['String'];
  /** The field value. */
  value: Maybe<Scalars['String']>;
};

/** Provides the value of a Metaobject field. */
export type Shopify_MetaobjectFieldReferencesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

/** The input fields used to retrieve a metaobject by handle. */
export type Shopify_MetaobjectHandleInput = {
  /** The handle of the metaobject. */
  handle: Scalars['String'];
  /** The type of the metaobject. */
  type: Scalars['String'];
};

/** Represents a Shopify hosted 3D model. */
export type Shopify_Model3d = Shopify_Media &
  Shopify_Node & {
    __typename?: 'shopify_Model3d';
    /** A word or phrase to share the nature or contents of a media. */
    alt: Maybe<Scalars['String']>;
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** The media content type. */
    mediaContentType: Shopify_MediaContentType;
    /** The preview image for the media. */
    previewImage: Maybe<Shopify_Image>;
    /** The sources for a 3d model. */
    sources: Array<Shopify_Model3dSource>;
  };

/** Represents a source for a Shopify hosted 3d model. */
export type Shopify_Model3dSource = {
  __typename?: 'shopify_Model3dSource';
  /** The filesize of the 3d model. */
  filesize: Scalars['Int'];
  /** The format of the 3d model. */
  format: Scalars['String'];
  /** The MIME type of the 3d model. */
  mimeType: Scalars['String'];
  /** The URL of the 3d model. */
  url: Scalars['String'];
};

/** Specifies the fields for a monetary value with currency. */
export type Shopify_MoneyInput = {
  /** Decimal money amount. */
  amount: Scalars['shopify_Decimal'];
  /** Currency of the money. */
  currencyCode: Shopify_CurrencyCode;
};

/**
 * A monetary value with currency.
 *
 */
export type Shopify_MoneyV2 = {
  __typename?: 'shopify_MoneyV2';
  /** Decimal money amount. */
  amount: Scalars['shopify_Decimal'];
  /** Currency of the money. */
  currencyCode: Shopify_CurrencyCode;
};

/**
 * An object with an ID field to support global identification, in accordance with the
 * [Relay specification](https://relay.dev/graphql/objectidentification.htm#sec-Node-Interface).
 * This interface is used by the [node](https://shopify.dev/api/admin-graphql/unstable/queries/node)
 * and [nodes](https://shopify.dev/api/admin-graphql/unstable/queries/nodes) queries.
 *
 */
export type Shopify_Node = {
  /** A globally-unique identifier. */
  id: Scalars['ID'];
};

/** Represents a resource that can be published to the Online Store sales channel. */
export type Shopify_OnlineStorePublishable = {
  /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
  onlineStoreUrl: Maybe<Scalars['shopify_URL']>;
};

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_Order = Shopify_HasMetafields &
  Shopify_Node & {
    __typename?: 'shopify_Order';
    /** The reason for the order's cancellation. Returns `null` if the order wasn't canceled. */
    cancelReason: Maybe<Shopify_OrderCancelReason>;
    /** The date and time when the order was canceled. Returns null if the order wasn't canceled. */
    canceledAt: Maybe<Scalars['shopify_DateTime']>;
    /** The code of the currency used for the payment. */
    currencyCode: Shopify_CurrencyCode;
    /** The subtotal of line items and their discounts, excluding line items that have been removed. Does not contain order-level discounts, duties, shipping costs, or shipping discounts. Taxes are not included unless the order is a taxes-included order. */
    currentSubtotalPrice: Shopify_MoneyV2;
    /** The total cost of duties for the order, including refunds. */
    currentTotalDuties: Maybe<Shopify_MoneyV2>;
    /** The total amount of the order, including duties, taxes and discounts, minus amounts for line items that have been removed. */
    currentTotalPrice: Shopify_MoneyV2;
    /** The total of all taxes applied to the order, excluding taxes for returned line items. */
    currentTotalTax: Shopify_MoneyV2;
    /** A list of the custom attributes added to the order. */
    customAttributes: Array<Shopify_Attribute>;
    /** The locale code in which this specific order happened. */
    customerLocale: Maybe<Scalars['String']>;
    /** The unique URL that the customer can use to access the order. */
    customerUrl: Maybe<Scalars['shopify_URL']>;
    /** Discounts that have been applied on the order. */
    discountApplications: Shopify_DiscountApplicationConnection;
    /** Whether the order has had any edits applied or not. */
    edited: Scalars['Boolean'];
    /** The customer's email address. */
    email: Maybe<Scalars['String']>;
    /** The financial status of the order. */
    financialStatus: Maybe<Shopify_OrderFinancialStatus>;
    /** The fulfillment status for the order. */
    fulfillmentStatus: Shopify_OrderFulfillmentStatus;
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** List of the order’s line items. */
    lineItems: Shopify_OrderLineItemConnection;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /**
     * The metafields associated with the resource matching the supplied list of namespaces and keys.
     *
     */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /**
     * Unique identifier for the order that appears on the order.
     * For example, _#1000_ or _Store1001.
     *
     */
    name: Scalars['String'];
    /** A unique numeric identifier for the order for use by shop owner and customer. */
    orderNumber: Scalars['Int'];
    /** The total cost of duties charged at checkout. */
    originalTotalDuties: Maybe<Shopify_MoneyV2>;
    /** The total price of the order before any applied edits. */
    originalTotalPrice: Shopify_MoneyV2;
    /** The customer's phone number for receiving SMS notifications. */
    phone: Maybe<Scalars['String']>;
    /**
     * The date and time when the order was imported.
     * This value can be set to dates in the past when importing from other systems.
     * If no value is provided, it will be auto-generated based on current date and time.
     *
     */
    processedAt: Scalars['shopify_DateTime'];
    /** The address to where the order will be shipped. */
    shippingAddress: Maybe<Shopify_MailingAddress>;
    /**
     * The discounts that have been allocated onto the shipping line by discount applications.
     *
     */
    shippingDiscountAllocations: Array<Shopify_DiscountAllocation>;
    /** The unique URL for the order's status page. */
    statusUrl: Scalars['shopify_URL'];
    /** Price of the order before shipping and taxes. */
    subtotalPrice: Maybe<Shopify_MoneyV2>;
    /** Price of the order before duties, shipping and taxes. */
    subtotalPriceV2: Maybe<Shopify_MoneyV2>;
    /** List of the order’s successful fulfillments. */
    successfulFulfillments: Maybe<Array<Shopify_Fulfillment>>;
    /** The sum of all the prices of all the items in the order, duties, taxes and discounts included (must be positive). */
    totalPrice: Shopify_MoneyV2;
    /** The sum of all the prices of all the items in the order, duties, taxes and discounts included (must be positive). */
    totalPriceV2: Shopify_MoneyV2;
    /** The total amount that has been refunded. */
    totalRefunded: Shopify_MoneyV2;
    /** The total amount that has been refunded. */
    totalRefundedV2: Shopify_MoneyV2;
    /** The total cost of shipping. */
    totalShippingPrice: Shopify_MoneyV2;
    /** The total cost of shipping. */
    totalShippingPriceV2: Shopify_MoneyV2;
    /** The total cost of taxes. */
    totalTax: Maybe<Shopify_MoneyV2>;
    /** The total cost of taxes. */
    totalTaxV2: Maybe<Shopify_MoneyV2>;
  };

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_OrderDiscountApplicationsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_OrderLineItemsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_OrderMetafieldArgs = {
  key: Scalars['String'];
  namespace: Scalars['String'];
};

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_OrderMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_OrderSuccessfulFulfillmentsArgs = {
  first: InputMaybe<Scalars['Int']>;
};

/** Represents the reason for the order's cancellation. */
export enum Shopify_OrderCancelReason {
  /** The customer wanted to cancel the order. */
  Customer = 'CUSTOMER',
  /** Payment was declined. */
  Declined = 'DECLINED',
  /** The order was fraudulent. */
  Fraud = 'FRAUD',
  /** There was insufficient inventory. */
  Inventory = 'INVENTORY',
  /** The order was canceled for an unlisted reason. */
  Other = 'OTHER',
}

/**
 * An auto-generated type for paginating through multiple Orders.
 *
 */
export type Shopify_OrderConnection = {
  __typename?: 'shopify_OrderConnection';
  /** A list of edges. */
  edges: Array<Shopify_OrderEdge>;
  /** A list of the nodes contained in OrderEdge. */
  nodes: Array<Shopify_Order>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
  /** The total count of Orders. */
  totalCount: Scalars['shopify_UnsignedInt64'];
};

/**
 * An auto-generated type which holds one Order and a cursor during pagination.
 *
 */
export type Shopify_OrderEdge = {
  __typename?: 'shopify_OrderEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of OrderEdge. */
  node: Shopify_Order;
};

/** Represents the order's current financial status. */
export enum Shopify_OrderFinancialStatus {
  /** Displayed as **Authorized**. */
  Authorized = 'AUTHORIZED',
  /** Displayed as **Paid**. */
  Paid = 'PAID',
  /** Displayed as **Partially paid**. */
  PartiallyPaid = 'PARTIALLY_PAID',
  /** Displayed as **Partially refunded**. */
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
  /** Displayed as **Pending**. */
  Pending = 'PENDING',
  /** Displayed as **Refunded**. */
  Refunded = 'REFUNDED',
  /** Displayed as **Voided**. */
  Voided = 'VOIDED',
}

/** Represents the order's aggregated fulfillment status for display purposes. */
export enum Shopify_OrderFulfillmentStatus {
  /** Displayed as **Fulfilled**. All of the items in the order have been fulfilled. */
  Fulfilled = 'FULFILLED',
  /** Displayed as **In progress**. Some of the items in the order have been fulfilled, or a request for fulfillment has been sent to the fulfillment service. */
  InProgress = 'IN_PROGRESS',
  /** Displayed as **On hold**. All of the unfulfilled items in this order are on hold. */
  OnHold = 'ON_HOLD',
  /** Displayed as **Open**. None of the items in the order have been fulfilled. Replaced by "UNFULFILLED" status. */
  Open = 'OPEN',
  /** Displayed as **Partially fulfilled**. Some of the items in the order have been fulfilled. */
  PartiallyFulfilled = 'PARTIALLY_FULFILLED',
  /** Displayed as **Pending fulfillment**. A request for fulfillment of some items awaits a response from the fulfillment service. Replaced by "IN_PROGRESS" status. */
  PendingFulfillment = 'PENDING_FULFILLMENT',
  /** Displayed as **Restocked**. All of the items in the order have been restocked. Replaced by "UNFULFILLED" status. */
  Restocked = 'RESTOCKED',
  /** Displayed as **Scheduled**. All of the unfulfilled items in this order are scheduled for fulfillment at later time. */
  Scheduled = 'SCHEDULED',
  /** Displayed as **Unfulfilled**. None of the items in the order have been fulfilled. */
  Unfulfilled = 'UNFULFILLED',
}

/** Represents a single line in an order. There is one line item for each distinct product variant. */
export type Shopify_OrderLineItem = {
  __typename?: 'shopify_OrderLineItem';
  /** The number of entries associated to the line item minus the items that have been removed. */
  currentQuantity: Scalars['Int'];
  /** List of custom attributes associated to the line item. */
  customAttributes: Array<Shopify_Attribute>;
  /** The discounts that have been allocated onto the order line item by discount applications. */
  discountAllocations: Array<Shopify_DiscountAllocation>;
  /** The total price of the line item, including discounts, and displayed in the presentment currency. */
  discountedTotalPrice: Shopify_MoneyV2;
  /** The total price of the line item, not including any discounts. The total price is calculated using the original unit price multiplied by the quantity, and it is displayed in the presentment currency. */
  originalTotalPrice: Shopify_MoneyV2;
  /** The number of products variants associated to the line item. */
  quantity: Scalars['Int'];
  /** The title of the product combined with title of the variant. */
  title: Scalars['String'];
  /** The product variant object associated to the line item. */
  variant: Maybe<Shopify_ProductVariant>;
};

/**
 * An auto-generated type for paginating through multiple OrderLineItems.
 *
 */
export type Shopify_OrderLineItemConnection = {
  __typename?: 'shopify_OrderLineItemConnection';
  /** A list of edges. */
  edges: Array<Shopify_OrderLineItemEdge>;
  /** A list of the nodes contained in OrderLineItemEdge. */
  nodes: Array<Shopify_OrderLineItem>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one OrderLineItem and a cursor during pagination.
 *
 */
export type Shopify_OrderLineItemEdge = {
  __typename?: 'shopify_OrderLineItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of OrderLineItemEdge. */
  node: Shopify_OrderLineItem;
};

/** The set of valid sort keys for the Order query. */
export enum Shopify_OrderSortKeys {
  /** Sort by the `id` value. */
  Id = 'ID',
  /** Sort by the `processed_at` value. */
  ProcessedAt = 'PROCESSED_AT',
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  Relevance = 'RELEVANCE',
  /** Sort by the `total_price` value. */
  TotalPrice = 'TOTAL_PRICE',
}

/** Shopify merchants can create pages to hold static HTML content. Each Page object represents a custom page on the online store. */
export type Shopify_Page = Shopify_HasMetafields &
  Shopify_Node &
  Shopify_OnlineStorePublishable & {
    __typename?: 'shopify_Page';
    /** The description of the page, complete with HTML formatting. */
    body: Scalars['shopify_HTML'];
    /** Summary of the page body. */
    bodySummary: Scalars['String'];
    /** The timestamp of the page creation. */
    createdAt: Scalars['shopify_DateTime'];
    /** A human-friendly unique string for the page automatically generated from its title. */
    handle: Scalars['String'];
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /**
     * The metafields associated with the resource matching the supplied list of namespaces and keys.
     *
     */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
    onlineStoreUrl: Maybe<Scalars['shopify_URL']>;
    /** The page's SEO information. */
    seo: Maybe<Shopify_Seo>;
    /** The title of the page. */
    title: Scalars['String'];
    /** The timestamp of the latest page update. */
    updatedAt: Scalars['shopify_DateTime'];
  };

/** Shopify merchants can create pages to hold static HTML content. Each Page object represents a custom page on the online store. */
export type Shopify_PageMetafieldArgs = {
  key: Scalars['String'];
  namespace: Scalars['String'];
};

/** Shopify merchants can create pages to hold static HTML content. Each Page object represents a custom page on the online store. */
export type Shopify_PageMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/**
 * An auto-generated type for paginating through multiple Pages.
 *
 */
export type Shopify_PageConnection = {
  __typename?: 'shopify_PageConnection';
  /** A list of edges. */
  edges: Array<Shopify_PageEdge>;
  /** A list of the nodes contained in PageEdge. */
  nodes: Array<Shopify_Page>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one Page and a cursor during pagination.
 *
 */
export type Shopify_PageEdge = {
  __typename?: 'shopify_PageEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of PageEdge. */
  node: Shopify_Page;
};

/**
 * Returns information about pagination in a connection, in accordance with the
 * [Relay specification](https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo).
 * For more information, please read our [GraphQL Pagination Usage Guide](https://shopify.dev/api/usage/pagination-graphql).
 *
 */
export type Shopify_PageInfo = {
  __typename?: 'shopify_PageInfo';
  /** The cursor corresponding to the last node in edges. */
  endCursor: Maybe<Scalars['String']>;
  /** Whether there are more pages to fetch following the current page. */
  hasNextPage: Scalars['Boolean'];
  /** Whether there are any pages prior to the current page. */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor corresponding to the first node in edges. */
  startCursor: Maybe<Scalars['String']>;
};

/** The set of valid sort keys for the Page query. */
export enum Shopify_PageSortKeys {
  /** Sort by the `id` value. */
  Id = 'ID',
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  Relevance = 'RELEVANCE',
  /** Sort by the `title` value. */
  Title = 'TITLE',
  /** Sort by the `updated_at` value. */
  UpdatedAt = 'UPDATED_AT',
}

/** A payment applied to a checkout. */
export type Shopify_Payment = Shopify_Node & {
  __typename?: 'shopify_Payment';
  /** The amount of the payment. */
  amount: Shopify_MoneyV2;
  /** The amount of the payment. */
  amountV2: Shopify_MoneyV2;
  /** The billing address for the payment. */
  billingAddress: Maybe<Shopify_MailingAddress>;
  /** The checkout to which the payment belongs. */
  checkout: Shopify_Checkout;
  /** The credit card used for the payment in the case of direct payments. */
  creditCard: Maybe<Shopify_CreditCard>;
  /** A message describing a processing error during asynchronous processing. */
  errorMessage: Maybe<Scalars['String']>;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /**
   * A client-side generated token to identify a payment and perform idempotent operations.
   * For more information, refer to
   * [Idempotent requests](https://shopify.dev/api/usage/idempotent-requests).
   *
   */
  idempotencyKey: Maybe<Scalars['String']>;
  /** The URL where the customer needs to be redirected so they can complete the 3D Secure payment flow. */
  nextActionUrl: Maybe<Scalars['shopify_URL']>;
  /** Whether the payment is still processing asynchronously. */
  ready: Scalars['Boolean'];
  /** A flag to indicate if the payment is to be done in test mode for gateways that support it. */
  test: Scalars['Boolean'];
  /** The actual transaction recorded by Shopify after having processed the payment with the gateway. */
  transaction: Maybe<Shopify_Transaction>;
};

/** Settings related to payments. */
export type Shopify_PaymentSettings = {
  __typename?: 'shopify_PaymentSettings';
  /** List of the card brands which the shop accepts. */
  acceptedCardBrands: Array<Shopify_CardBrand>;
  /** The url pointing to the endpoint to vault credit cards. */
  cardVaultUrl: Scalars['shopify_URL'];
  /** The country where the shop is located. */
  countryCode: Shopify_CountryCode;
  /** The three-letter code for the shop's primary currency. */
  currencyCode: Shopify_CurrencyCode;
  /** A list of enabled currencies (ISO 4217 format) that the shop accepts. Merchants can enable currencies from their Shopify Payments settings in the Shopify admin. */
  enabledPresentmentCurrencies: Array<Shopify_CurrencyCode>;
  /** The shop’s Shopify Payments account id. */
  shopifyPaymentsAccountId: Maybe<Scalars['String']>;
  /** List of the digital wallets which the shop supports. */
  supportedDigitalWallets: Array<Shopify_DigitalWallet>;
};

/** The valid values for the types of payment token. */
export enum Shopify_PaymentTokenType {
  /** Apple Pay token type. */
  ApplePay = 'APPLE_PAY',
  /** Google Pay token type. */
  GooglePay = 'GOOGLE_PAY',
  /** Shopify Pay token type. */
  ShopifyPay = 'SHOPIFY_PAY',
  /** Stripe token type. */
  StripeVaultToken = 'STRIPE_VAULT_TOKEN',
  /** Vault payment token type. */
  Vault = 'VAULT',
}

/** A filter used to view a subset of products in a collection matching a specific price range. */
export type Shopify_PriceRangeFilter = {
  /** The maximum price in the range. Empty indicates no max price. */
  max: InputMaybe<Scalars['Float']>;
  /** The minimum price in the range. Defaults to zero. */
  min: InputMaybe<Scalars['Float']>;
};

/** The value of the percentage pricing object. */
export type Shopify_PricingPercentageValue = {
  __typename?: 'shopify_PricingPercentageValue';
  /** The percentage value of the object. */
  percentage: Scalars['Float'];
};

/** The price value (fixed or percentage) for a discount application. */
export type Shopify_PricingValue =
  | Shopify_MoneyV2
  | Shopify_PricingPercentageValue;

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_Product = Shopify_HasMetafields &
  Shopify_Node &
  Shopify_OnlineStorePublishable & {
    __typename?: 'shopify_Product';
    /** Indicates if at least one product variant is available for sale. */
    availableForSale: Scalars['Boolean'];
    /** List of collections a product belongs to. */
    collections: Shopify_CollectionConnection;
    /** The compare at price of the product across all variants. */
    compareAtPriceRange: Shopify_ProductPriceRange;
    /** The date and time when the product was created. */
    createdAt: Scalars['shopify_DateTime'];
    /** Stripped description of the product, single line with HTML tags removed. */
    description: Scalars['String'];
    /** The description of the product, complete with HTML formatting. */
    descriptionHtml: Scalars['shopify_HTML'];
    /**
     * The featured image for the product.
     *
     * This field is functionally equivalent to `images(first: 1)`.
     *
     */
    featuredImage: Maybe<Shopify_Image>;
    /**
     * A human-friendly unique string for the Product automatically generated from its title.
     * They are used by the Liquid templating language to refer to objects.
     *
     */
    handle: Scalars['String'];
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** List of images associated with the product. */
    images: Shopify_ImageConnection;
    /** Whether the product is a gift card. */
    isGiftCard: Scalars['Boolean'];
    /** The media associated with the product. */
    media: Shopify_MediaConnection;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /**
     * The metafields associated with the resource matching the supplied list of namespaces and keys.
     *
     */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
    onlineStoreUrl: Maybe<Scalars['shopify_URL']>;
    /** List of product options. */
    options: Array<Shopify_ProductOption>;
    /** The price range. */
    priceRange: Shopify_ProductPriceRange;
    /** A categorization that a product can be tagged with, commonly used for filtering and searching. */
    productType: Scalars['String'];
    /** The date and time when the product was published to the channel. */
    publishedAt: Scalars['shopify_DateTime'];
    /** Whether the product can only be purchased with a selling plan. */
    requiresSellingPlan: Scalars['Boolean'];
    /** A list of a product's available selling plan groups. A selling plan group represents a selling method. For example, 'Subscribe and save' is a selling method where customers pay for goods or services per delivery. A selling plan group contains individual selling plans. */
    sellingPlanGroups: Shopify_SellingPlanGroupConnection;
    /** The product's SEO information. */
    seo: Shopify_Seo;
    /**
     * A comma separated list of tags that have been added to the product.
     * Additional access scope required for private apps: unauthenticated_read_product_tags.
     *
     */
    tags: Array<Scalars['String']>;
    /** The product’s title. */
    title: Scalars['String'];
    /** The total quantity of inventory in stock for this Product. */
    totalInventory: Maybe<Scalars['Int']>;
    /**
     * The date and time when the product was last modified.
     * A product's `updatedAt` value can change for different reasons. For example, if an order
     * is placed for a product that has inventory tracking set up, then the inventory adjustment
     * is counted as an update.
     *
     */
    updatedAt: Scalars['shopify_DateTime'];
    /**
     * Find a product’s variant based on its selected options.
     * This is useful for converting a user’s selection of product options into a single matching variant.
     * If there is not a variant for the selected options, `null` will be returned.
     *
     */
    variantBySelectedOptions: Maybe<Shopify_ProductVariant>;
    /** List of the product’s variants. */
    variants: Shopify_ProductVariantConnection;
    /** The product’s vendor name. */
    vendor: Scalars['String'];
  };

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_ProductCollectionsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_ProductDescriptionArgs = {
  truncateAt: InputMaybe<Scalars['Int']>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_ProductImagesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_ProductImageSortKeys>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_ProductMediaArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_ProductMediaSortKeys>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_ProductMetafieldArgs = {
  key: Scalars['String'];
  namespace: Scalars['String'];
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_ProductMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_ProductOptionsArgs = {
  first: InputMaybe<Scalars['Int']>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_ProductSellingPlanGroupsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_ProductVariantBySelectedOptionsArgs = {
  selectedOptions: Array<Shopify_SelectedOptionInput>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
 */
export type Shopify_ProductVariantsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
  sortKey?: InputMaybe<Shopify_ProductVariantSortKeys>;
};

/** The set of valid sort keys for the ProductCollection query. */
export enum Shopify_ProductCollectionSortKeys {
  /** Sort by the `best-selling` value. */
  BestSelling = 'BEST_SELLING',
  /** Sort by the `collection-default` value. */
  CollectionDefault = 'COLLECTION_DEFAULT',
  /** Sort by the `created` value. */
  Created = 'CREATED',
  /** Sort by the `id` value. */
  Id = 'ID',
  /** Sort by the `manual` value. */
  Manual = 'MANUAL',
  /** Sort by the `price` value. */
  Price = 'PRICE',
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  Relevance = 'RELEVANCE',
  /** Sort by the `title` value. */
  Title = 'TITLE',
}

/**
 * An auto-generated type for paginating through multiple Products.
 *
 */
export type Shopify_ProductConnection = {
  __typename?: 'shopify_ProductConnection';
  /** A list of edges. */
  edges: Array<Shopify_ProductEdge>;
  /** A list of available filters. */
  filters: Array<Shopify_Filter>;
  /** A list of the nodes contained in ProductEdge. */
  nodes: Array<Shopify_Product>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one Product and a cursor during pagination.
 *
 */
export type Shopify_ProductEdge = {
  __typename?: 'shopify_ProductEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of ProductEdge. */
  node: Shopify_Product;
};

/** A filter used to view a subset of products in a collection. */
export type Shopify_ProductFilter = {
  /** Filter on if the product is available for sale. */
  available: InputMaybe<Scalars['Boolean']>;
  /** A range of prices to filter with-in. */
  price: InputMaybe<Shopify_PriceRangeFilter>;
  /** A product metafield to filter on. */
  productMetafield: InputMaybe<Shopify_MetafieldFilter>;
  /** The product type to filter on. */
  productType: InputMaybe<Scalars['String']>;
  /** The product vendor to filter on. */
  productVendor: InputMaybe<Scalars['String']>;
  /** A product tag to filter on. */
  tag: InputMaybe<Scalars['String']>;
  /** A variant metafield to filter on. */
  variantMetafield: InputMaybe<Shopify_MetafieldFilter>;
  /** A variant option to filter on. */
  variantOption: InputMaybe<Shopify_VariantOptionFilter>;
};

/** The set of valid sort keys for the ProductImage query. */
export enum Shopify_ProductImageSortKeys {
  /** Sort by the `created_at` value. */
  CreatedAt = 'CREATED_AT',
  /** Sort by the `id` value. */
  Id = 'ID',
  /** Sort by the `position` value. */
  Position = 'POSITION',
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  Relevance = 'RELEVANCE',
}

/** The set of valid sort keys for the ProductMedia query. */
export enum Shopify_ProductMediaSortKeys {
  /** Sort by the `id` value. */
  Id = 'ID',
  /** Sort by the `position` value. */
  Position = 'POSITION',
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  Relevance = 'RELEVANCE',
}

/**
 * Product property names like "Size", "Color", and "Material" that the customers can select.
 * Variants are selected based on permutations of these options.
 * 255 characters limit each.
 *
 */
export type Shopify_ProductOption = Shopify_Node & {
  __typename?: 'shopify_ProductOption';
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The product option’s name. */
  name: Scalars['String'];
  /** The corresponding value to the product option name. */
  values: Array<Scalars['String']>;
};

/** The price range of the product. */
export type Shopify_ProductPriceRange = {
  __typename?: 'shopify_ProductPriceRange';
  /** The highest variant's price. */
  maxVariantPrice: Shopify_MoneyV2;
  /** The lowest variant's price. */
  minVariantPrice: Shopify_MoneyV2;
};

/** The set of valid sort keys for the Product query. */
export enum Shopify_ProductSortKeys {
  /** Sort by the `best_selling` value. */
  BestSelling = 'BEST_SELLING',
  /** Sort by the `created_at` value. */
  CreatedAt = 'CREATED_AT',
  /** Sort by the `id` value. */
  Id = 'ID',
  /** Sort by the `price` value. */
  Price = 'PRICE',
  /** Sort by the `product_type` value. */
  ProductType = 'PRODUCT_TYPE',
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  Relevance = 'RELEVANCE',
  /** Sort by the `title` value. */
  Title = 'TITLE',
  /** Sort by the `updated_at` value. */
  UpdatedAt = 'UPDATED_AT',
  /** Sort by the `vendor` value. */
  Vendor = 'VENDOR',
}

/** A product variant represents a different version of a product, such as differing sizes or differing colors. */
export type Shopify_ProductVariant = Shopify_HasMetafields &
  Shopify_Node & {
    __typename?: 'shopify_ProductVariant';
    /** Indicates if the product variant is available for sale. */
    availableForSale: Scalars['Boolean'];
    /** The barcode (for example, ISBN, UPC, or GTIN) associated with the variant. */
    barcode: Maybe<Scalars['String']>;
    /** The compare at price of the variant. This can be used to mark a variant as on sale, when `compareAtPrice` is higher than `price`. */
    compareAtPrice: Maybe<Shopify_MoneyV2>;
    /** The compare at price of the variant. This can be used to mark a variant as on sale, when `compareAtPriceV2` is higher than `priceV2`. */
    compareAtPriceV2: Maybe<Shopify_MoneyV2>;
    /** Whether a product is out of stock but still available for purchase (used for backorders). */
    currentlyNotInStock: Scalars['Boolean'];
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /**
     * Image associated with the product variant. This field falls back to the product image if no image is available.
     *
     */
    image: Maybe<Shopify_Image>;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /**
     * The metafields associated with the resource matching the supplied list of namespaces and keys.
     *
     */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The product variant’s price. */
    price: Shopify_MoneyV2;
    /** The product variant’s price. */
    priceV2: Shopify_MoneyV2;
    /** The product object that the product variant belongs to. */
    product: Shopify_Product;
    /** The total sellable quantity of the variant for online sales channels. */
    quantityAvailable: Maybe<Scalars['Int']>;
    /** Whether a customer needs to provide a shipping address when placing an order for the product variant. */
    requiresShipping: Scalars['Boolean'];
    /** List of product options applied to the variant. */
    selectedOptions: Array<Shopify_SelectedOption>;
    /** Represents an association between a variant and a selling plan. Selling plan allocations describe which selling plans are available for each variant, and what their impact is on pricing. */
    sellingPlanAllocations: Shopify_SellingPlanAllocationConnection;
    /** The SKU (stock keeping unit) associated with the variant. */
    sku: Maybe<Scalars['String']>;
    /** The in-store pickup availability of this variant by location. */
    storeAvailability: Shopify_StoreAvailabilityConnection;
    /** The product variant’s title. */
    title: Scalars['String'];
    /** The unit price value for the variant based on the variant's measurement. */
    unitPrice: Maybe<Shopify_MoneyV2>;
    /** The unit price measurement for the variant. */
    unitPriceMeasurement: Maybe<Shopify_UnitPriceMeasurement>;
    /** The weight of the product variant in the unit system specified with `weight_unit`. */
    weight: Maybe<Scalars['Float']>;
    /** Unit of measurement for weight. */
    weightUnit: Shopify_WeightUnit;
  };

/** A product variant represents a different version of a product, such as differing sizes or differing colors. */
export type Shopify_ProductVariantMetafieldArgs = {
  key: Scalars['String'];
  namespace: Scalars['String'];
};

/** A product variant represents a different version of a product, such as differing sizes or differing colors. */
export type Shopify_ProductVariantMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** A product variant represents a different version of a product, such as differing sizes or differing colors. */
export type Shopify_ProductVariantSellingPlanAllocationsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/** A product variant represents a different version of a product, such as differing sizes or differing colors. */
export type Shopify_ProductVariantStoreAvailabilityArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  near: InputMaybe<Shopify_GeoCoordinateInput>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/**
 * An auto-generated type for paginating through multiple ProductVariants.
 *
 */
export type Shopify_ProductVariantConnection = {
  __typename?: 'shopify_ProductVariantConnection';
  /** A list of edges. */
  edges: Array<Shopify_ProductVariantEdge>;
  /** A list of the nodes contained in ProductVariantEdge. */
  nodes: Array<Shopify_ProductVariant>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one ProductVariant and a cursor during pagination.
 *
 */
export type Shopify_ProductVariantEdge = {
  __typename?: 'shopify_ProductVariantEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of ProductVariantEdge. */
  node: Shopify_ProductVariant;
};

/** The set of valid sort keys for the ProductVariant query. */
export enum Shopify_ProductVariantSortKeys {
  /** Sort by the `id` value. */
  Id = 'ID',
  /** Sort by the `position` value. */
  Position = 'POSITION',
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  Relevance = 'RELEVANCE',
  /** Sort by the `sku` value. */
  Sku = 'SKU',
  /** Sort by the `title` value. */
  Title = 'TITLE',
}

/** SEO information. */
export type Shopify_Seo = {
  __typename?: 'shopify_SEO';
  /** The meta description. */
  description: Maybe<Scalars['String']>;
  /** The SEO title. */
  title: Maybe<Scalars['String']>;
};

/**
 * Script discount applications capture the intentions of a discount that
 * was created by a Shopify Script.
 *
 */
export type Shopify_ScriptDiscountApplication = Shopify_DiscountApplication & {
  __typename?: 'shopify_ScriptDiscountApplication';
  /** The method by which the discount's value is allocated to its entitled items. */
  allocationMethod: Shopify_DiscountApplicationAllocationMethod;
  /** Which lines of targetType that the discount is allocated over. */
  targetSelection: Shopify_DiscountApplicationTargetSelection;
  /** The type of line that the discount is applicable towards. */
  targetType: Shopify_DiscountApplicationTargetType;
  /** The title of the application as defined by the Script. */
  title: Scalars['String'];
  /** The value of the discount application. */
  value: Shopify_PricingValue;
};

/**
 * Properties used by customers to select a product variant.
 * Products can have multiple options, like different sizes or colors.
 *
 */
export type Shopify_SelectedOption = {
  __typename?: 'shopify_SelectedOption';
  /** The product option’s name. */
  name: Scalars['String'];
  /** The product option’s value. */
  value: Scalars['String'];
};

/** Specifies the input fields required for a selected option. */
export type Shopify_SelectedOptionInput = {
  /** The product option’s name. */
  name: Scalars['String'];
  /** The product option’s value. */
  value: Scalars['String'];
};

/** Represents how products and variants can be sold and purchased. */
export type Shopify_SellingPlan = {
  __typename?: 'shopify_SellingPlan';
  /** The initial payment due for the purchase. */
  checkoutCharge: Shopify_SellingPlanCheckoutCharge;
  /** The description of the selling plan. */
  description: Maybe<Scalars['String']>;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** The name of the selling plan. For example, '6 weeks of prepaid granola, delivered weekly'. */
  name: Scalars['String'];
  /** The selling plan options available in the drop-down list in the storefront. For example, 'Delivery every week' or 'Delivery every 2 weeks' specifies the delivery frequency options for the product. Individual selling plans contribute their options to the associated selling plan group. For example, a selling plan group might have an option called `option1: Delivery every`. One selling plan in that group could contribute `option1: 2 weeks` with the pricing for that option, and another selling plan could contribute `option1: 4 weeks`, with different pricing. */
  options: Array<Shopify_SellingPlanOption>;
  /** The price adjustments that a selling plan makes when a variant is purchased with a selling plan. */
  priceAdjustments: Array<Shopify_SellingPlanPriceAdjustment>;
  /** Whether purchasing the selling plan will result in multiple deliveries. */
  recurringDeliveries: Scalars['Boolean'];
};

/** Represents an association between a variant and a selling plan. Selling plan allocations describe the options offered for each variant, and the price of the variant when purchased with a selling plan. */
export type Shopify_SellingPlanAllocation = {
  __typename?: 'shopify_SellingPlanAllocation';
  /** The checkout charge amount due for the purchase. */
  checkoutChargeAmount: Shopify_MoneyV2;
  /** A list of price adjustments, with a maximum of two. When there are two, the first price adjustment goes into effect at the time of purchase, while the second one starts after a certain number of orders. A price adjustment represents how a selling plan affects pricing when a variant is purchased with a selling plan. Prices display in the customer's currency if the shop is configured for it. */
  priceAdjustments: Array<Shopify_SellingPlanAllocationPriceAdjustment>;
  /** The remaining balance charge amount due for the purchase. */
  remainingBalanceChargeAmount: Shopify_MoneyV2;
  /** A representation of how products and variants can be sold and purchased. For example, an individual selling plan could be '6 weeks of prepaid granola, delivered weekly'. */
  sellingPlan: Shopify_SellingPlan;
};

/**
 * An auto-generated type for paginating through multiple SellingPlanAllocations.
 *
 */
export type Shopify_SellingPlanAllocationConnection = {
  __typename?: 'shopify_SellingPlanAllocationConnection';
  /** A list of edges. */
  edges: Array<Shopify_SellingPlanAllocationEdge>;
  /** A list of the nodes contained in SellingPlanAllocationEdge. */
  nodes: Array<Shopify_SellingPlanAllocation>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one SellingPlanAllocation and a cursor during pagination.
 *
 */
export type Shopify_SellingPlanAllocationEdge = {
  __typename?: 'shopify_SellingPlanAllocationEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of SellingPlanAllocationEdge. */
  node: Shopify_SellingPlanAllocation;
};

/** The resulting prices for variants when they're purchased with a specific selling plan. */
export type Shopify_SellingPlanAllocationPriceAdjustment = {
  __typename?: 'shopify_SellingPlanAllocationPriceAdjustment';
  /** The price of the variant when it's purchased without a selling plan for the same number of deliveries. For example, if a customer purchases 6 deliveries of $10.00 granola separately, then the price is 6 x $10.00 = $60.00. */
  compareAtPrice: Shopify_MoneyV2;
  /** The effective price for a single delivery. For example, for a prepaid subscription plan that includes 6 deliveries at the price of $48.00, the per delivery price is $8.00. */
  perDeliveryPrice: Shopify_MoneyV2;
  /** The price of the variant when it's purchased with a selling plan For example, for a prepaid subscription plan that includes 6 deliveries of $10.00 granola, where the customer gets 20% off, the price is 6 x $10.00 x 0.80 = $48.00. */
  price: Shopify_MoneyV2;
  /** The resulting price per unit for the variant associated with the selling plan. If the variant isn't sold by quantity or measurement, then this field returns `null`. */
  unitPrice: Maybe<Shopify_MoneyV2>;
};

/** The initial payment due for the purchase. */
export type Shopify_SellingPlanCheckoutCharge = {
  __typename?: 'shopify_SellingPlanCheckoutCharge';
  /** The charge type for the checkout charge. */
  type: Shopify_SellingPlanCheckoutChargeType;
  /** The charge value for the checkout charge. */
  value: Shopify_SellingPlanCheckoutChargeValue;
};

/** The percentage value of the price used for checkout charge. */
export type Shopify_SellingPlanCheckoutChargePercentageValue = {
  __typename?: 'shopify_SellingPlanCheckoutChargePercentageValue';
  /** The percentage value of the price used for checkout charge. */
  percentage: Scalars['Float'];
};

/** The checkout charge when the full amount isn't charged at checkout. */
export enum Shopify_SellingPlanCheckoutChargeType {
  /** The checkout charge is a percentage of the product or variant price. */
  Percentage = 'PERCENTAGE',
  /** The checkout charge is a fixed price amount. */
  Price = 'PRICE',
}

/** The portion of the price to be charged at checkout. */
export type Shopify_SellingPlanCheckoutChargeValue =
  | Shopify_MoneyV2
  | Shopify_SellingPlanCheckoutChargePercentageValue;

/**
 * An auto-generated type for paginating through multiple SellingPlans.
 *
 */
export type Shopify_SellingPlanConnection = {
  __typename?: 'shopify_SellingPlanConnection';
  /** A list of edges. */
  edges: Array<Shopify_SellingPlanEdge>;
  /** A list of the nodes contained in SellingPlanEdge. */
  nodes: Array<Shopify_SellingPlan>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one SellingPlan and a cursor during pagination.
 *
 */
export type Shopify_SellingPlanEdge = {
  __typename?: 'shopify_SellingPlanEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of SellingPlanEdge. */
  node: Shopify_SellingPlan;
};

/** A fixed amount that's deducted from the original variant price. For example, $10.00 off. */
export type Shopify_SellingPlanFixedAmountPriceAdjustment = {
  __typename?: 'shopify_SellingPlanFixedAmountPriceAdjustment';
  /** The money value of the price adjustment. */
  adjustmentAmount: Shopify_MoneyV2;
};

/** A fixed price adjustment for a variant that's purchased with a selling plan. */
export type Shopify_SellingPlanFixedPriceAdjustment = {
  __typename?: 'shopify_SellingPlanFixedPriceAdjustment';
  /** A new price of the variant when it's purchased with the selling plan. */
  price: Shopify_MoneyV2;
};

/** Represents a selling method. For example, 'Subscribe and save' is a selling method where customers pay for goods or services per delivery. A selling plan group contains individual selling plans. */
export type Shopify_SellingPlanGroup = {
  __typename?: 'shopify_SellingPlanGroup';
  /** A display friendly name for the app that created the selling plan group. */
  appName: Maybe<Scalars['String']>;
  /** The name of the selling plan group. */
  name: Scalars['String'];
  /** Represents the selling plan options available in the drop-down list in the storefront. For example, 'Delivery every week' or 'Delivery every 2 weeks' specifies the delivery frequency options for the product. */
  options: Array<Shopify_SellingPlanGroupOption>;
  /** A list of selling plans in a selling plan group. A selling plan is a representation of how products and variants can be sold and purchased. For example, an individual selling plan could be '6 weeks of prepaid granola, delivered weekly'. */
  sellingPlans: Shopify_SellingPlanConnection;
};

/** Represents a selling method. For example, 'Subscribe and save' is a selling method where customers pay for goods or services per delivery. A selling plan group contains individual selling plans. */
export type Shopify_SellingPlanGroupSellingPlansArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  reverse?: InputMaybe<Scalars['Boolean']>;
};

/**
 * An auto-generated type for paginating through multiple SellingPlanGroups.
 *
 */
export type Shopify_SellingPlanGroupConnection = {
  __typename?: 'shopify_SellingPlanGroupConnection';
  /** A list of edges. */
  edges: Array<Shopify_SellingPlanGroupEdge>;
  /** A list of the nodes contained in SellingPlanGroupEdge. */
  nodes: Array<Shopify_SellingPlanGroup>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one SellingPlanGroup and a cursor during pagination.
 *
 */
export type Shopify_SellingPlanGroupEdge = {
  __typename?: 'shopify_SellingPlanGroupEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of SellingPlanGroupEdge. */
  node: Shopify_SellingPlanGroup;
};

/**
 * Represents an option on a selling plan group that's available in the drop-down list in the storefront.
 *
 * Individual selling plans contribute their options to the associated selling plan group. For example, a selling plan group might have an option called `option1: Delivery every`. One selling plan in that group could contribute `option1: 2 weeks` with the pricing for that option, and another selling plan could contribute `option1: 4 weeks`, with different pricing.
 */
export type Shopify_SellingPlanGroupOption = {
  __typename?: 'shopify_SellingPlanGroupOption';
  /** The name of the option. For example, 'Delivery every'. */
  name: Scalars['String'];
  /** The values for the options specified by the selling plans in the selling plan group. For example, '1 week', '2 weeks', '3 weeks'. */
  values: Array<Scalars['String']>;
};

/** An option provided by a Selling Plan. */
export type Shopify_SellingPlanOption = {
  __typename?: 'shopify_SellingPlanOption';
  /** The name of the option (ie "Delivery every"). */
  name: Maybe<Scalars['String']>;
  /** The value of the option (ie "Month"). */
  value: Maybe<Scalars['String']>;
};

/** A percentage amount that's deducted from the original variant price. For example, 10% off. */
export type Shopify_SellingPlanPercentagePriceAdjustment = {
  __typename?: 'shopify_SellingPlanPercentagePriceAdjustment';
  /** The percentage value of the price adjustment. */
  adjustmentPercentage: Scalars['Int'];
};

/** Represents by how much the price of a variant associated with a selling plan is adjusted. Each variant can have up to two price adjustments. If a variant has multiple price adjustments, then the first price adjustment applies when the variant is initially purchased. The second price adjustment applies after a certain number of orders (specified by the `orderCount` field) are made. If a selling plan doesn't have any price adjustments, then the unadjusted price of the variant is the effective price. */
export type Shopify_SellingPlanPriceAdjustment = {
  __typename?: 'shopify_SellingPlanPriceAdjustment';
  /** The type of price adjustment. An adjustment value can have one of three types: percentage, amount off, or a new price. */
  adjustmentValue: Shopify_SellingPlanPriceAdjustmentValue;
  /** The number of orders that the price adjustment applies to. If the price adjustment always applies, then this field is `null`. */
  orderCount: Maybe<Scalars['Int']>;
};

/** Represents by how much the price of a variant associated with a selling plan is adjusted. Each variant can have up to two price adjustments. */
export type Shopify_SellingPlanPriceAdjustmentValue =
  | Shopify_SellingPlanFixedAmountPriceAdjustment
  | Shopify_SellingPlanFixedPriceAdjustment
  | Shopify_SellingPlanPercentagePriceAdjustment;

/** A shipping rate to be applied to a checkout. */
export type Shopify_ShippingRate = {
  __typename?: 'shopify_ShippingRate';
  /** Human-readable unique identifier for this shipping rate. */
  handle: Scalars['String'];
  /** Price of this shipping rate. */
  price: Shopify_MoneyV2;
  /** Price of this shipping rate. */
  priceV2: Shopify_MoneyV2;
  /** Title of this shipping rate. */
  title: Scalars['String'];
};

/** Shop represents a collection of the general settings and information about the shop. */
export type Shopify_Shop = Shopify_HasMetafields &
  Shopify_Node & {
    __typename?: 'shopify_Shop';
    /** The shop's branding configuration. */
    brand: Maybe<Shopify_Brand>;
    /** A description of the shop. */
    description: Maybe<Scalars['String']>;
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /**
     * The metafields associated with the resource matching the supplied list of namespaces and keys.
     *
     */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** A string representing the way currency is formatted when the currency isn’t specified. */
    moneyFormat: Scalars['String'];
    /** The shop’s name. */
    name: Scalars['String'];
    /** Settings related to payments. */
    paymentSettings: Shopify_PaymentSettings;
    /** The primary domain of the shop’s Online Store. */
    primaryDomain: Shopify_Domain;
    /** The shop’s privacy policy. */
    privacyPolicy: Maybe<Shopify_ShopPolicy>;
    /** The shop’s refund policy. */
    refundPolicy: Maybe<Shopify_ShopPolicy>;
    /** The shop’s shipping policy. */
    shippingPolicy: Maybe<Shopify_ShopPolicy>;
    /** Countries that the shop ships to. */
    shipsToCountries: Array<Shopify_CountryCode>;
    /** The shop’s subscription policy. */
    subscriptionPolicy: Maybe<Shopify_ShopPolicyWithDefault>;
    /** The shop’s terms of service. */
    termsOfService: Maybe<Shopify_ShopPolicy>;
  };

/** Shop represents a collection of the general settings and information about the shop. */
export type Shopify_ShopMetafieldArgs = {
  key: Scalars['String'];
  namespace: Scalars['String'];
};

/** Shop represents a collection of the general settings and information about the shop. */
export type Shopify_ShopMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** Policy that a merchant has configured for their store, such as their refund or privacy policy. */
export type Shopify_ShopPolicy = Shopify_Node & {
  __typename?: 'shopify_ShopPolicy';
  /** Policy text, maximum size of 64kb. */
  body: Scalars['String'];
  /** Policy’s handle. */
  handle: Scalars['String'];
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** Policy’s title. */
  title: Scalars['String'];
  /** Public URL to the policy. */
  url: Scalars['shopify_URL'];
};

/**
 * A policy for the store that comes with a default value, such as a subscription policy.
 * If the merchant hasn't configured a policy for their store, then the policy will return the default value.
 * Otherwise, the policy will return the merchant-configured value.
 *
 */
export type Shopify_ShopPolicyWithDefault = {
  __typename?: 'shopify_ShopPolicyWithDefault';
  /** The text of the policy. Maximum size: 64KB. */
  body: Scalars['String'];
  /** The handle of the policy. */
  handle: Scalars['String'];
  /** The unique identifier of the policy. A default policy doesn't have an ID. */
  id: Maybe<Scalars['ID']>;
  /** The title of the policy. */
  title: Scalars['String'];
  /** Public URL to the policy. */
  url: Scalars['shopify_URL'];
};

/**
 * The availability of a product variant at a particular location.
 * Local pick-up must be enabled in the  store's shipping settings, otherwise this will return an empty result.
 *
 */
export type Shopify_StoreAvailability = {
  __typename?: 'shopify_StoreAvailability';
  /** Whether the product variant is in-stock at this location. */
  available: Scalars['Boolean'];
  /** The location where this product variant is stocked at. */
  location: Shopify_Location;
  /** Returns the estimated amount of time it takes for pickup to be ready (Example: Usually ready in 24 hours). */
  pickUpTime: Scalars['String'];
};

/**
 * An auto-generated type for paginating through multiple StoreAvailabilities.
 *
 */
export type Shopify_StoreAvailabilityConnection = {
  __typename?: 'shopify_StoreAvailabilityConnection';
  /** A list of edges. */
  edges: Array<Shopify_StoreAvailabilityEdge>;
  /** A list of the nodes contained in StoreAvailabilityEdge. */
  nodes: Array<Shopify_StoreAvailability>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one StoreAvailability and a cursor during pagination.
 *
 */
export type Shopify_StoreAvailabilityEdge = {
  __typename?: 'shopify_StoreAvailabilityEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of StoreAvailabilityEdge. */
  node: Shopify_StoreAvailability;
};

/**
 * An auto-generated type for paginating through a list of Strings.
 *
 */
export type Shopify_StringConnection = {
  __typename?: 'shopify_StringConnection';
  /** A list of edges. */
  edges: Array<Shopify_StringEdge>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one String and a cursor during pagination.
 *
 */
export type Shopify_StringEdge = {
  __typename?: 'shopify_StringEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of StringEdge. */
  node: Scalars['String'];
};

/**
 * Specifies the fields required to complete a checkout with
 * a tokenized payment.
 *
 */
export type Shopify_TokenizedPaymentInputV3 = {
  /** The billing address for the payment. */
  billingAddress: Shopify_MailingAddressInput;
  /** A unique client generated key used to avoid duplicate charges. When a duplicate payment is found, the original is returned instead of creating a new one. For more information, refer to [Idempotent requests](https://shopify.dev/api/usage/idempotent-requests). */
  idempotencyKey: Scalars['String'];
  /** Public Hash Key used for AndroidPay payments only. */
  identifier: InputMaybe<Scalars['String']>;
  /** The amount and currency of the payment. */
  paymentAmount: Shopify_MoneyInput;
  /** A simple string or JSON containing the required payment data for the tokenized payment. */
  paymentData: Scalars['String'];
  /** Whether to execute the payment in test mode, if possible. Test mode is not supported in production stores. Defaults to `false`. */
  test: InputMaybe<Scalars['Boolean']>;
  /** The type of payment token. */
  type: Shopify_PaymentTokenType;
};

/** An object representing exchange of money for a product or service. */
export type Shopify_Transaction = {
  __typename?: 'shopify_Transaction';
  /** The amount of money that the transaction was for. */
  amount: Shopify_MoneyV2;
  /** The amount of money that the transaction was for. */
  amountV2: Shopify_MoneyV2;
  /** The kind of the transaction. */
  kind: Shopify_TransactionKind;
  /** The status of the transaction. */
  status: Shopify_TransactionStatus;
  /** The status of the transaction. */
  statusV2: Maybe<Shopify_TransactionStatus>;
  /** Whether the transaction was done in test mode or not. */
  test: Scalars['Boolean'];
};

/** The different kinds of order transactions. */
export enum Shopify_TransactionKind {
  /**
   * An amount reserved against the cardholder's funding source.
   * Money does not change hands until the authorization is captured.
   *
   */
  Authorization = 'AUTHORIZATION',
  /** A transfer of the money that was reserved during the authorization stage. */
  Capture = 'CAPTURE',
  /** Money returned to the customer when they have paid too much. */
  Change = 'CHANGE',
  /** An authorization for a payment taken with an EMV credit card reader. */
  EmvAuthorization = 'EMV_AUTHORIZATION',
  /** An authorization and capture performed together in a single step. */
  Sale = 'SALE',
}

/** Transaction statuses describe the status of a transaction. */
export enum Shopify_TransactionStatus {
  /** There was an error while processing the transaction. */
  Error = 'ERROR',
  /** The transaction failed. */
  Failure = 'FAILURE',
  /** The transaction is pending. */
  Pending = 'PENDING',
  /** The transaction succeeded. */
  Success = 'SUCCESS',
}

/**
 * The measurement used to calculate a unit price for a product variant (e.g. $9.99 / 100ml).
 *
 */
export type Shopify_UnitPriceMeasurement = {
  __typename?: 'shopify_UnitPriceMeasurement';
  /** The type of unit of measurement for the unit price measurement. */
  measuredType: Maybe<Shopify_UnitPriceMeasurementMeasuredType>;
  /** The quantity unit for the unit price measurement. */
  quantityUnit: Maybe<Shopify_UnitPriceMeasurementMeasuredUnit>;
  /** The quantity value for the unit price measurement. */
  quantityValue: Scalars['Float'];
  /** The reference unit for the unit price measurement. */
  referenceUnit: Maybe<Shopify_UnitPriceMeasurementMeasuredUnit>;
  /** The reference value for the unit price measurement. */
  referenceValue: Scalars['Int'];
};

/** The accepted types of unit of measurement. */
export enum Shopify_UnitPriceMeasurementMeasuredType {
  /** Unit of measurements representing areas. */
  Area = 'AREA',
  /** Unit of measurements representing lengths. */
  Length = 'LENGTH',
  /** Unit of measurements representing volumes. */
  Volume = 'VOLUME',
  /** Unit of measurements representing weights. */
  Weight = 'WEIGHT',
}

/** The valid units of measurement for a unit price measurement. */
export enum Shopify_UnitPriceMeasurementMeasuredUnit {
  /** 100 centiliters equals 1 liter. */
  Cl = 'CL',
  /** 100 centimeters equals 1 meter. */
  Cm = 'CM',
  /** Metric system unit of weight. */
  G = 'G',
  /** 1 kilogram equals 1000 grams. */
  Kg = 'KG',
  /** Metric system unit of volume. */
  L = 'L',
  /** Metric system unit of length. */
  M = 'M',
  /** Metric system unit of area. */
  M2 = 'M2',
  /** 1 cubic meter equals 1000 liters. */
  M3 = 'M3',
  /** 1000 milligrams equals 1 gram. */
  Mg = 'MG',
  /** 1000 milliliters equals 1 liter. */
  Ml = 'ML',
  /** 1000 millimeters equals 1 meter. */
  Mm = 'MM',
}

/** Systems of weights and measures. */
export enum Shopify_UnitSystem {
  /** Imperial system of weights and measures. */
  ImperialSystem = 'IMPERIAL_SYSTEM',
  /** Metric system of weights and measures. */
  MetricSystem = 'METRIC_SYSTEM',
}

/** A redirect on the online store. */
export type Shopify_UrlRedirect = Shopify_Node & {
  __typename?: 'shopify_UrlRedirect';
  /** The ID of the URL redirect. */
  id: Scalars['ID'];
  /** The old path to be redirected from. When the user visits this path, they'll be redirected to the target location. */
  path: Scalars['String'];
  /** The target location where the user will be redirected to. */
  target: Scalars['String'];
};

/**
 * An auto-generated type for paginating through multiple UrlRedirects.
 *
 */
export type Shopify_UrlRedirectConnection = {
  __typename?: 'shopify_UrlRedirectConnection';
  /** A list of edges. */
  edges: Array<Shopify_UrlRedirectEdge>;
  /** A list of the nodes contained in UrlRedirectEdge. */
  nodes: Array<Shopify_UrlRedirect>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one UrlRedirect and a cursor during pagination.
 *
 */
export type Shopify_UrlRedirectEdge = {
  __typename?: 'shopify_UrlRedirectEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of UrlRedirectEdge. */
  node: Shopify_UrlRedirect;
};

/** Represents an error in the input of a mutation. */
export type Shopify_UserError = Shopify_DisplayableError & {
  __typename?: 'shopify_UserError';
  /** The path to the input field that caused the error. */
  field: Maybe<Array<Scalars['String']>>;
  /** The error message. */
  message: Scalars['String'];
};

/** A filter used to view a subset of products in a collection matching a specific variant option. */
export type Shopify_VariantOptionFilter = {
  /** The name of the variant option to filter on. */
  name: Scalars['String'];
  /** The value of the variant option to filter on. */
  value: Scalars['String'];
};

/** Represents a Shopify hosted video. */
export type Shopify_Video = Shopify_Media &
  Shopify_Node & {
    __typename?: 'shopify_Video';
    /** A word or phrase to share the nature or contents of a media. */
    alt: Maybe<Scalars['String']>;
    /** A globally-unique identifier. */
    id: Scalars['ID'];
    /** The media content type. */
    mediaContentType: Shopify_MediaContentType;
    /** The preview image for the media. */
    previewImage: Maybe<Shopify_Image>;
    /** The sources for a video. */
    sources: Array<Shopify_VideoSource>;
  };

/** Represents a source for a Shopify hosted video. */
export type Shopify_VideoSource = {
  __typename?: 'shopify_VideoSource';
  /** The format of the video source. */
  format: Scalars['String'];
  /** The height of the video. */
  height: Scalars['Int'];
  /** The video MIME type. */
  mimeType: Scalars['String'];
  /** The URL of the video. */
  url: Scalars['String'];
  /** The width of the video. */
  width: Scalars['Int'];
};

/** Units of measurement for weight. */
export enum Shopify_WeightUnit {
  /** Metric system unit of mass. */
  Grams = 'GRAMS',
  /** 1 kilogram equals 1000 grams. */
  Kilograms = 'KILOGRAMS',
  /** Imperial system unit of mass. */
  Ounces = 'OUNCES',
  /** 1 pound equals 16 ounces. */
  Pounds = 'POUNDS',
}

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "Customer" */
  Customer: Array<Customer>;
  /** fetch data from the table: "Customer" using primary key columns */
  Customer_by_pk: Maybe<Customer>;
  /** fetch data from the table in a streaming manner: "Customer" */
  Customer_stream: Array<Customer>;
  /** fetch data from the table: "auth.users" */
  users: Array<Users>;
  /** fetch data from the table in a streaming manner: "auth.users" */
  users_stream: Array<Users>;
};

export type Subscription_RootCustomerArgs = {
  distinct_on: InputMaybe<Array<Customer_Select_Column>>;
  limit: InputMaybe<Scalars['Int']>;
  offset: InputMaybe<Scalars['Int']>;
  order_by: InputMaybe<Array<Customer_Order_By>>;
  where: InputMaybe<Customer_Bool_Exp>;
};

export type Subscription_RootCustomer_By_PkArgs = {
  id: Scalars['String'];
};

export type Subscription_RootCustomer_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Customer_Stream_Cursor_Input>>;
  where: InputMaybe<Customer_Bool_Exp>;
};

export type Subscription_RootUsersArgs = {
  distinct_on: InputMaybe<Array<Users_Select_Column>>;
  limit: InputMaybe<Scalars['Int']>;
  offset: InputMaybe<Scalars['Int']>;
  order_by: InputMaybe<Array<Users_Order_By>>;
  where: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where: InputMaybe<Users_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq: InputMaybe<Scalars['timestamp']>;
  _gt: InputMaybe<Scalars['timestamp']>;
  _gte: InputMaybe<Scalars['timestamp']>;
  _in: InputMaybe<Array<Scalars['timestamp']>>;
  _is_null: InputMaybe<Scalars['Boolean']>;
  _lt: InputMaybe<Scalars['timestamp']>;
  _lte: InputMaybe<Scalars['timestamp']>;
  _neq: InputMaybe<Scalars['timestamp']>;
  _nin: InputMaybe<Array<Scalars['timestamp']>>;
};

/** columns and relationships of "auth.users" */
export type Users = {
  __typename?: 'users';
  avatarUrl: Scalars['String'];
  /** An object relationship */
  customer: Maybe<Customer>;
  displayName: Scalars['String'];
};

/** Boolean expression to filter rows from the table "auth.users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and: InputMaybe<Array<Users_Bool_Exp>>;
  _not: InputMaybe<Users_Bool_Exp>;
  _or: InputMaybe<Array<Users_Bool_Exp>>;
  avatarUrl: InputMaybe<String_Comparison_Exp>;
  customer: InputMaybe<Customer_Bool_Exp>;
  displayName: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "auth.users". */
export type Users_Order_By = {
  avatarUrl: InputMaybe<Order_By>;
  customer: InputMaybe<Customer_Order_By>;
  displayName: InputMaybe<Order_By>;
};

/** select columns of table "auth.users" */
export enum Users_Select_Column {
  /** column name */
  AvatarUrl = 'avatarUrl',
  /** column name */
  DisplayName = 'displayName',
}

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  avatarUrl: InputMaybe<Scalars['String']>;
  displayName: InputMaybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq: InputMaybe<Scalars['uuid']>;
  _gt: InputMaybe<Scalars['uuid']>;
  _gte: InputMaybe<Scalars['uuid']>;
  _in: InputMaybe<Array<Scalars['uuid']>>;
  _is_null: InputMaybe<Scalars['Boolean']>;
  _lt: InputMaybe<Scalars['uuid']>;
  _lte: InputMaybe<Scalars['uuid']>;
  _neq: InputMaybe<Scalars['uuid']>;
  _nin: InputMaybe<Array<Scalars['uuid']>>;
};

export type GetCollectionProductsQueryVariables = Exact<{
  collectionId: InputMaybe<Scalars['ID']>;
  maxProducts: InputMaybe<Scalars['Int']>;
  nextCursor: InputMaybe<Scalars['String']>;
}>;

export type GetCollectionProductsQuery = {
  __typename?: 'query_root';
  shopify: {
    __typename?: 'shopifyQueryRoot';
    collection: {
      __typename?: 'shopify_Collection';
      products: {
        __typename?: 'shopify_ProductConnection';
        pageInfo: {
          __typename?: 'shopify_PageInfo';
          endCursor: string | null;
          hasNextPage: boolean;
        };
        nodes: Array<{
          __typename?: 'shopify_Product';
          id: string;
          handle: string;
          metafield: { __typename?: 'shopify_Metafield'; value: string } | null;
        }>;
      };
    } | null;
  } | null;
};
