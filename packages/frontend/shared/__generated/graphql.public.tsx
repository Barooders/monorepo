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
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AggregateName: { input: any; output: any };
  CollectionType: { input: any; output: any };
  Condition: { input: any; output: any };
  EventName: { input: any; output: any };
  PaymentSolutionCode: { input: any; output: any };
  PaymentStatusType: { input: any; output: any };
  ProductStatus: { input: any; output: any };
  ShipmentTimeframe: { input: any; output: any };
  ShippingType: { input: any; output: any };
  bigint: { input: number; output: number };
  float8: { input: any; output: any };
  jsonb: { input: any; output: any };
  shopify_Color: { input: any; output: any };
  shopify_DateTime: { input: any; output: any };
  shopify_Decimal: { input: any; output: any };
  shopify_HTML: { input: any; output: any };
  shopify_JSON: { input: any; output: any };
  shopify_URL: { input: any; output: any };
  shopify_UnsignedInt64: { input: any; output: any };
  timestamp: { input: any; output: any };
  timestamptz: { input: any; output: any };
  uuid: { input: any; output: any };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq: InputMaybe<Scalars['Boolean']['input']>;
  _gt: InputMaybe<Scalars['Boolean']['input']>;
  _gte: InputMaybe<Scalars['Boolean']['input']>;
  _in: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['Boolean']['input']>;
  _lte: InputMaybe<Scalars['Boolean']['input']>;
  _neq: InputMaybe<Scalars['Boolean']['input']>;
  _nin: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** columns and relationships of "Checkout" */
export type Checkout = {
  __typename?: 'Checkout';
  /** An array relationship */
  Checkout_Payments: Array<Payment>;
  id: Scalars['String']['output'];
};

/** columns and relationships of "Checkout" */
export type CheckoutCheckout_PaymentsArgs = {
  distinct_on: InputMaybe<Array<Payment_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Payment_Order_By>>;
  where: InputMaybe<Payment_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "Checkout". All fields are combined with a logical 'AND'. */
export type Checkout_Bool_Exp = {
  Checkout_Payments: InputMaybe<Payment_Bool_Exp>;
  _and: InputMaybe<Array<Checkout_Bool_Exp>>;
  _not: InputMaybe<Checkout_Bool_Exp>;
  _or: InputMaybe<Array<Checkout_Bool_Exp>>;
  id: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "Checkout". */
export type Checkout_Order_By = {
  Checkout_Payments_aggregate: InputMaybe<Payment_Aggregate_Order_By>;
  id: InputMaybe<Order_By>;
};

/** select columns of table "Checkout" */
export enum Checkout_Select_Column {
  /** column name */
  Id = 'id',
}

/** Streaming cursor of the table "Checkout" */
export type Checkout_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Checkout_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Checkout_Stream_Cursor_Value_Input = {
  id: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "Collection" */
export type Collection = {
  __typename?: 'Collection';
  /** An array relationship */
  childCollections: Array<Collection>;
  description: Maybe<Scalars['String']['output']>;
  featuredImageSrc: Maybe<Scalars['String']['output']>;
  handle: Scalars['String']['output'];
  id: Scalars['String']['output'];
  /** An object relationship */
  parentCollection: Maybe<Collection>;
  parentCollectionId: Maybe<Scalars['String']['output']>;
  seoDescription: Maybe<Scalars['String']['output']>;
  seoTitle: Maybe<Scalars['String']['output']>;
  shopifyCollection: Maybe<Shopify_Collection>;
  shopifyId: Scalars['String']['output'];
  shortName: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
  type: Maybe<Scalars['CollectionType']['output']>;
};

/** columns and relationships of "Collection" */
export type CollectionChildCollectionsArgs = {
  distinct_on: InputMaybe<Array<Collection_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Collection_Order_By>>;
  where: InputMaybe<Collection_Bool_Exp>;
};

/** Boolean expression to compare columns of type "CollectionType". All fields are combined with logical 'AND'. */
export type CollectionType_Comparison_Exp = {
  _eq: InputMaybe<Scalars['CollectionType']['input']>;
  _gt: InputMaybe<Scalars['CollectionType']['input']>;
  _gte: InputMaybe<Scalars['CollectionType']['input']>;
  _in: InputMaybe<Array<Scalars['CollectionType']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['CollectionType']['input']>;
  _lte: InputMaybe<Scalars['CollectionType']['input']>;
  _neq: InputMaybe<Scalars['CollectionType']['input']>;
  _nin: InputMaybe<Array<Scalars['CollectionType']['input']>>;
};

/** order by aggregate values of table "Collection" */
export type Collection_Aggregate_Order_By = {
  count: InputMaybe<Order_By>;
  max: InputMaybe<Collection_Max_Order_By>;
  min: InputMaybe<Collection_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "Collection". All fields are combined with a logical 'AND'. */
export type Collection_Bool_Exp = {
  _and: InputMaybe<Array<Collection_Bool_Exp>>;
  _not: InputMaybe<Collection_Bool_Exp>;
  _or: InputMaybe<Array<Collection_Bool_Exp>>;
  childCollections: InputMaybe<Collection_Bool_Exp>;
  description: InputMaybe<String_Comparison_Exp>;
  featuredImageSrc: InputMaybe<String_Comparison_Exp>;
  handle: InputMaybe<String_Comparison_Exp>;
  id: InputMaybe<String_Comparison_Exp>;
  parentCollection: InputMaybe<Collection_Bool_Exp>;
  parentCollectionId: InputMaybe<String_Comparison_Exp>;
  seoDescription: InputMaybe<String_Comparison_Exp>;
  seoTitle: InputMaybe<String_Comparison_Exp>;
  shopifyId: InputMaybe<String_Comparison_Exp>;
  shortName: InputMaybe<String_Comparison_Exp>;
  title: InputMaybe<String_Comparison_Exp>;
  type: InputMaybe<CollectionType_Comparison_Exp>;
};

/** order by max() on columns of table "Collection" */
export type Collection_Max_Order_By = {
  description: InputMaybe<Order_By>;
  featuredImageSrc: InputMaybe<Order_By>;
  handle: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  parentCollectionId: InputMaybe<Order_By>;
  seoDescription: InputMaybe<Order_By>;
  seoTitle: InputMaybe<Order_By>;
  shopifyId: InputMaybe<Order_By>;
  shortName: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
  type: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Collection" */
export type Collection_Min_Order_By = {
  description: InputMaybe<Order_By>;
  featuredImageSrc: InputMaybe<Order_By>;
  handle: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  parentCollectionId: InputMaybe<Order_By>;
  seoDescription: InputMaybe<Order_By>;
  seoTitle: InputMaybe<Order_By>;
  shopifyId: InputMaybe<Order_By>;
  shortName: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
  type: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Collection". */
export type Collection_Order_By = {
  childCollections_aggregate: InputMaybe<Collection_Aggregate_Order_By>;
  description: InputMaybe<Order_By>;
  featuredImageSrc: InputMaybe<Order_By>;
  handle: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  parentCollection: InputMaybe<Collection_Order_By>;
  parentCollectionId: InputMaybe<Order_By>;
  seoDescription: InputMaybe<Order_By>;
  seoTitle: InputMaybe<Order_By>;
  shopifyId: InputMaybe<Order_By>;
  shortName: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
  type: InputMaybe<Order_By>;
};

/** select columns of table "Collection" */
export enum Collection_Select_Column {
  /** column name */
  Description = 'description',
  /** column name */
  FeaturedImageSrc = 'featuredImageSrc',
  /** column name */
  Handle = 'handle',
  /** column name */
  Id = 'id',
  /** column name */
  ParentCollectionId = 'parentCollectionId',
  /** column name */
  SeoDescription = 'seoDescription',
  /** column name */
  SeoTitle = 'seoTitle',
  /** column name */
  ShopifyId = 'shopifyId',
  /** column name */
  ShortName = 'shortName',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
}

/** Streaming cursor of the table "Collection" */
export type Collection_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Collection_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Collection_Stream_Cursor_Value_Input = {
  description: InputMaybe<Scalars['String']['input']>;
  featuredImageSrc: InputMaybe<Scalars['String']['input']>;
  handle: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  parentCollectionId: InputMaybe<Scalars['String']['input']>;
  seoDescription: InputMaybe<Scalars['String']['input']>;
  seoTitle: InputMaybe<Scalars['String']['input']>;
  shopifyId: InputMaybe<Scalars['String']['input']>;
  shortName: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  type: InputMaybe<Scalars['CollectionType']['input']>;
};

/** Boolean expression to compare columns of type "Condition". All fields are combined with logical 'AND'. */
export type Condition_Comparison_Exp = {
  _eq: InputMaybe<Scalars['Condition']['input']>;
  _gt: InputMaybe<Scalars['Condition']['input']>;
  _gte: InputMaybe<Scalars['Condition']['input']>;
  _in: InputMaybe<Array<Scalars['Condition']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['Condition']['input']>;
  _lte: InputMaybe<Scalars['Condition']['input']>;
  _neq: InputMaybe<Scalars['Condition']['input']>;
  _nin: InputMaybe<Array<Scalars['Condition']['input']>>;
};

/** columns and relationships of "Customer" */
export type Customer = {
  __typename?: 'Customer';
  /** An array relationship */
  PublishedReviews: Array<Review>;
  /** An array relationship */
  VendorReviews: Array<VendorReview>;
  authUserId: Scalars['uuid']['output'];
  coverPictureShopifyCdnUrl: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['timestamp']['output'];
  description: Maybe<Scalars['String']['output']>;
  firstName: Maybe<Scalars['String']['output']>;
  isPro: Scalars['Boolean']['output'];
  lastName: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  negociationAgreements: Array<NegociationAgreement>;
  /** An array relationship */
  onlineProducts: Array<Product>;
  profilePictureShopifyCdnUrl: Maybe<Scalars['String']['output']>;
  sellerName: Maybe<Scalars['String']['output']>;
  shipmentTimeframe: Maybe<Scalars['ShipmentTimeframe']['output']>;
  shopifyId: Scalars['bigint']['output'];
  updatedAt: Maybe<Scalars['timestamp']['output']>;
  usedShipping: Scalars['ShippingType']['output'];
  /** An object relationship */
  user: Maybe<Users>;
};

/** columns and relationships of "Customer" */
export type CustomerPublishedReviewsArgs = {
  distinct_on: InputMaybe<Array<Review_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Review_Order_By>>;
  where: InputMaybe<Review_Bool_Exp>;
};

/** columns and relationships of "Customer" */
export type CustomerVendorReviewsArgs = {
  distinct_on: InputMaybe<Array<VendorReview_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<VendorReview_Order_By>>;
  where: InputMaybe<VendorReview_Bool_Exp>;
};

/** columns and relationships of "Customer" */
export type CustomerNegociationAgreementsArgs = {
  distinct_on: InputMaybe<Array<NegociationAgreement_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<NegociationAgreement_Order_By>>;
  where: InputMaybe<NegociationAgreement_Bool_Exp>;
};

/** columns and relationships of "Customer" */
export type CustomerOnlineProductsArgs = {
  distinct_on: InputMaybe<Array<Product_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Product_Order_By>>;
  where: InputMaybe<Product_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "Customer". All fields are combined with a logical 'AND'. */
export type Customer_Bool_Exp = {
  PublishedReviews: InputMaybe<Review_Bool_Exp>;
  VendorReviews: InputMaybe<VendorReview_Bool_Exp>;
  _and: InputMaybe<Array<Customer_Bool_Exp>>;
  _not: InputMaybe<Customer_Bool_Exp>;
  _or: InputMaybe<Array<Customer_Bool_Exp>>;
  authUserId: InputMaybe<Uuid_Comparison_Exp>;
  coverPictureShopifyCdnUrl: InputMaybe<String_Comparison_Exp>;
  createdAt: InputMaybe<Timestamp_Comparison_Exp>;
  description: InputMaybe<String_Comparison_Exp>;
  firstName: InputMaybe<String_Comparison_Exp>;
  isPro: InputMaybe<Boolean_Comparison_Exp>;
  lastName: InputMaybe<String_Comparison_Exp>;
  negociationAgreements: InputMaybe<NegociationAgreement_Bool_Exp>;
  onlineProducts: InputMaybe<Product_Bool_Exp>;
  profilePictureShopifyCdnUrl: InputMaybe<String_Comparison_Exp>;
  sellerName: InputMaybe<String_Comparison_Exp>;
  shipmentTimeframe: InputMaybe<ShipmentTimeframe_Comparison_Exp>;
  shopifyId: InputMaybe<Bigint_Comparison_Exp>;
  updatedAt: InputMaybe<Timestamp_Comparison_Exp>;
  usedShipping: InputMaybe<ShippingType_Comparison_Exp>;
  user: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "Customer". */
export type Customer_Order_By = {
  PublishedReviews_aggregate: InputMaybe<Review_Aggregate_Order_By>;
  VendorReviews_aggregate: InputMaybe<VendorReview_Aggregate_Order_By>;
  authUserId: InputMaybe<Order_By>;
  coverPictureShopifyCdnUrl: InputMaybe<Order_By>;
  createdAt: InputMaybe<Order_By>;
  description: InputMaybe<Order_By>;
  firstName: InputMaybe<Order_By>;
  isPro: InputMaybe<Order_By>;
  lastName: InputMaybe<Order_By>;
  negociationAgreements_aggregate: InputMaybe<NegociationAgreement_Aggregate_Order_By>;
  onlineProducts_aggregate: InputMaybe<Product_Aggregate_Order_By>;
  profilePictureShopifyCdnUrl: InputMaybe<Order_By>;
  sellerName: InputMaybe<Order_By>;
  shipmentTimeframe: InputMaybe<Order_By>;
  shopifyId: InputMaybe<Order_By>;
  updatedAt: InputMaybe<Order_By>;
  usedShipping: InputMaybe<Order_By>;
  user: InputMaybe<Users_Order_By>;
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
  IsPro = 'isPro',
  /** column name */
  LastName = 'lastName',
  /** column name */
  ProfilePictureShopifyCdnUrl = 'profilePictureShopifyCdnUrl',
  /** column name */
  SellerName = 'sellerName',
  /** column name */
  ShipmentTimeframe = 'shipmentTimeframe',
  /** column name */
  ShopifyId = 'shopifyId',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UsedShipping = 'usedShipping',
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
  authUserId: InputMaybe<Scalars['uuid']['input']>;
  coverPictureShopifyCdnUrl: InputMaybe<Scalars['String']['input']>;
  createdAt: InputMaybe<Scalars['timestamp']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  isPro: InputMaybe<Scalars['Boolean']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  profilePictureShopifyCdnUrl: InputMaybe<Scalars['String']['input']>;
  sellerName: InputMaybe<Scalars['String']['input']>;
  shipmentTimeframe: InputMaybe<Scalars['ShipmentTimeframe']['input']>;
  shopifyId: InputMaybe<Scalars['bigint']['input']>;
  updatedAt: InputMaybe<Scalars['timestamp']['input']>;
  usedShipping: InputMaybe<Scalars['ShippingType']['input']>;
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
  aggregateId: InputMaybe<Scalars['String']['input']>;
  aggregateName: InputMaybe<Scalars['AggregateName']['input']>;
  metadata: InputMaybe<Scalars['jsonb']['input']>;
  name: InputMaybe<Scalars['EventName']['input']>;
  payload: InputMaybe<Scalars['jsonb']['input']>;
};

/** response of any mutation on the table "Event" */
export type Event_Mutation_Response = {
  __typename?: 'Event_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
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

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq: InputMaybe<Scalars['Int']['input']>;
  _gt: InputMaybe<Scalars['Int']['input']>;
  _gte: InputMaybe<Scalars['Int']['input']>;
  _in: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['Int']['input']>;
  _lte: InputMaybe<Scalars['Int']['input']>;
  _neq: InputMaybe<Scalars['Int']['input']>;
  _nin: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** columns and relationships of "NegociationAgreement" */
export type NegociationAgreement = {
  __typename?: 'NegociationAgreement';
  id: Scalars['String']['output'];
  maxAmountPercent: Scalars['Int']['output'];
  priority: Scalars['Int']['output'];
  productType: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  vendor: Customer;
  vendorId: Scalars['uuid']['output'];
};

/** order by aggregate values of table "NegociationAgreement" */
export type NegociationAgreement_Aggregate_Order_By = {
  avg: InputMaybe<NegociationAgreement_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<NegociationAgreement_Max_Order_By>;
  min: InputMaybe<NegociationAgreement_Min_Order_By>;
  stddev: InputMaybe<NegociationAgreement_Stddev_Order_By>;
  stddev_pop: InputMaybe<NegociationAgreement_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<NegociationAgreement_Stddev_Samp_Order_By>;
  sum: InputMaybe<NegociationAgreement_Sum_Order_By>;
  var_pop: InputMaybe<NegociationAgreement_Var_Pop_Order_By>;
  var_samp: InputMaybe<NegociationAgreement_Var_Samp_Order_By>;
  variance: InputMaybe<NegociationAgreement_Variance_Order_By>;
};

/** order by avg() on columns of table "NegociationAgreement" */
export type NegociationAgreement_Avg_Order_By = {
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "NegociationAgreement". All fields are combined with a logical 'AND'. */
export type NegociationAgreement_Bool_Exp = {
  _and: InputMaybe<Array<NegociationAgreement_Bool_Exp>>;
  _not: InputMaybe<NegociationAgreement_Bool_Exp>;
  _or: InputMaybe<Array<NegociationAgreement_Bool_Exp>>;
  id: InputMaybe<String_Comparison_Exp>;
  maxAmountPercent: InputMaybe<Int_Comparison_Exp>;
  priority: InputMaybe<Int_Comparison_Exp>;
  productType: InputMaybe<String_Comparison_Exp>;
  vendor: InputMaybe<Customer_Bool_Exp>;
  vendorId: InputMaybe<Uuid_Comparison_Exp>;
};

/** order by max() on columns of table "NegociationAgreement" */
export type NegociationAgreement_Max_Order_By = {
  id: InputMaybe<Order_By>;
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
  productType: InputMaybe<Order_By>;
  vendorId: InputMaybe<Order_By>;
};

/** order by min() on columns of table "NegociationAgreement" */
export type NegociationAgreement_Min_Order_By = {
  id: InputMaybe<Order_By>;
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
  productType: InputMaybe<Order_By>;
  vendorId: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "NegociationAgreement". */
export type NegociationAgreement_Order_By = {
  id: InputMaybe<Order_By>;
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
  productType: InputMaybe<Order_By>;
  vendor: InputMaybe<Customer_Order_By>;
  vendorId: InputMaybe<Order_By>;
};

/** select columns of table "NegociationAgreement" */
export enum NegociationAgreement_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MaxAmountPercent = 'maxAmountPercent',
  /** column name */
  Priority = 'priority',
  /** column name */
  ProductType = 'productType',
  /** column name */
  VendorId = 'vendorId',
}

/** order by stddev() on columns of table "NegociationAgreement" */
export type NegociationAgreement_Stddev_Order_By = {
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "NegociationAgreement" */
export type NegociationAgreement_Stddev_Pop_Order_By = {
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "NegociationAgreement" */
export type NegociationAgreement_Stddev_Samp_Order_By = {
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "NegociationAgreement" */
export type NegociationAgreement_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: NegociationAgreement_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type NegociationAgreement_Stream_Cursor_Value_Input = {
  id: InputMaybe<Scalars['String']['input']>;
  maxAmountPercent: InputMaybe<Scalars['Int']['input']>;
  priority: InputMaybe<Scalars['Int']['input']>;
  productType: InputMaybe<Scalars['String']['input']>;
  vendorId: InputMaybe<Scalars['uuid']['input']>;
};

/** order by sum() on columns of table "NegociationAgreement" */
export type NegociationAgreement_Sum_Order_By = {
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "NegociationAgreement" */
export type NegociationAgreement_Var_Pop_Order_By = {
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "NegociationAgreement" */
export type NegociationAgreement_Var_Samp_Order_By = {
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "NegociationAgreement" */
export type NegociationAgreement_Variance_Order_By = {
  maxAmountPercent: InputMaybe<Order_By>;
  priority: InputMaybe<Order_By>;
};

/** columns and relationships of "Payment" */
export type Payment = {
  __typename?: 'Payment';
  /** An object relationship */
  Payment_Checkout: Checkout;
  checkoutId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  paymentSolutionCode: Scalars['PaymentSolutionCode']['output'];
  status: Scalars['PaymentStatusType']['output'];
  token: Maybe<Scalars['String']['output']>;
};

/** Boolean expression to compare columns of type "PaymentSolutionCode". All fields are combined with logical 'AND'. */
export type PaymentSolutionCode_Comparison_Exp = {
  _eq: InputMaybe<Scalars['PaymentSolutionCode']['input']>;
  _gt: InputMaybe<Scalars['PaymentSolutionCode']['input']>;
  _gte: InputMaybe<Scalars['PaymentSolutionCode']['input']>;
  _in: InputMaybe<Array<Scalars['PaymentSolutionCode']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['PaymentSolutionCode']['input']>;
  _lte: InputMaybe<Scalars['PaymentSolutionCode']['input']>;
  _neq: InputMaybe<Scalars['PaymentSolutionCode']['input']>;
  _nin: InputMaybe<Array<Scalars['PaymentSolutionCode']['input']>>;
};

/** Boolean expression to compare columns of type "PaymentStatusType". All fields are combined with logical 'AND'. */
export type PaymentStatusType_Comparison_Exp = {
  _eq: InputMaybe<Scalars['PaymentStatusType']['input']>;
  _gt: InputMaybe<Scalars['PaymentStatusType']['input']>;
  _gte: InputMaybe<Scalars['PaymentStatusType']['input']>;
  _in: InputMaybe<Array<Scalars['PaymentStatusType']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['PaymentStatusType']['input']>;
  _lte: InputMaybe<Scalars['PaymentStatusType']['input']>;
  _neq: InputMaybe<Scalars['PaymentStatusType']['input']>;
  _nin: InputMaybe<Array<Scalars['PaymentStatusType']['input']>>;
};

/** order by aggregate values of table "Payment" */
export type Payment_Aggregate_Order_By = {
  count: InputMaybe<Order_By>;
  max: InputMaybe<Payment_Max_Order_By>;
  min: InputMaybe<Payment_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "Payment". All fields are combined with a logical 'AND'. */
export type Payment_Bool_Exp = {
  Payment_Checkout: InputMaybe<Checkout_Bool_Exp>;
  _and: InputMaybe<Array<Payment_Bool_Exp>>;
  _not: InputMaybe<Payment_Bool_Exp>;
  _or: InputMaybe<Array<Payment_Bool_Exp>>;
  checkoutId: InputMaybe<String_Comparison_Exp>;
  id: InputMaybe<String_Comparison_Exp>;
  paymentSolutionCode: InputMaybe<PaymentSolutionCode_Comparison_Exp>;
  status: InputMaybe<PaymentStatusType_Comparison_Exp>;
  token: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "Payment" */
export type Payment_Max_Order_By = {
  checkoutId: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  paymentSolutionCode: InputMaybe<Order_By>;
  status: InputMaybe<Order_By>;
  token: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Payment" */
export type Payment_Min_Order_By = {
  checkoutId: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  paymentSolutionCode: InputMaybe<Order_By>;
  status: InputMaybe<Order_By>;
  token: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Payment". */
export type Payment_Order_By = {
  Payment_Checkout: InputMaybe<Checkout_Order_By>;
  checkoutId: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  paymentSolutionCode: InputMaybe<Order_By>;
  status: InputMaybe<Order_By>;
  token: InputMaybe<Order_By>;
};

/** select columns of table "Payment" */
export enum Payment_Select_Column {
  /** column name */
  CheckoutId = 'checkoutId',
  /** column name */
  Id = 'id',
  /** column name */
  PaymentSolutionCode = 'paymentSolutionCode',
  /** column name */
  Status = 'status',
  /** column name */
  Token = 'token',
}

/** Streaming cursor of the table "Payment" */
export type Payment_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payment_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payment_Stream_Cursor_Value_Input = {
  checkoutId: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  paymentSolutionCode: InputMaybe<Scalars['PaymentSolutionCode']['input']>;
  status: InputMaybe<Scalars['PaymentStatusType']['input']>;
  token: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "Product" */
export type Product = {
  __typename?: 'Product';
  /** An object relationship */
  Vendor: Customer;
  createdAt: Scalars['timestamp']['output'];
  handle: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  productType: Maybe<Scalars['String']['output']>;
  shopifyId: Scalars['bigint']['output'];
  status: Scalars['ProductStatus']['output'];
  /** An object relationship */
  storeExposedProduct: Maybe<Dbt_Store_Exposed_Product>;
  /** An array relationship */
  variants: Array<ProductVariant>;
  vendorId: Scalars['uuid']['output'];
};

/** columns and relationships of "Product" */
export type ProductVariantsArgs = {
  distinct_on: InputMaybe<Array<ProductVariant_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ProductVariant_Order_By>>;
  where: InputMaybe<ProductVariant_Bool_Exp>;
};

/** Boolean expression to compare columns of type "ProductStatus". All fields are combined with logical 'AND'. */
export type ProductStatus_Comparison_Exp = {
  _eq: InputMaybe<Scalars['ProductStatus']['input']>;
  _gt: InputMaybe<Scalars['ProductStatus']['input']>;
  _gte: InputMaybe<Scalars['ProductStatus']['input']>;
  _in: InputMaybe<Array<Scalars['ProductStatus']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['ProductStatus']['input']>;
  _lte: InputMaybe<Scalars['ProductStatus']['input']>;
  _neq: InputMaybe<Scalars['ProductStatus']['input']>;
  _nin: InputMaybe<Array<Scalars['ProductStatus']['input']>>;
};

/** columns and relationships of "ProductVariant" */
export type ProductVariant = {
  __typename?: 'ProductVariant';
  condition: Maybe<Scalars['Condition']['output']>;
  createdAt: Scalars['timestamp']['output'];
  id: Scalars['String']['output'];
  /** An object relationship */
  product: Product;
  productId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  /** An object relationship */
  storeB2CVariant: Maybe<Dbt_Store_B2c_Product_Variant>;
  /** An object relationship */
  storeExposedVariant: Maybe<Dbt_Store_Exposed_Product_Variant>;
};

/** order by aggregate values of table "ProductVariant" */
export type ProductVariant_Aggregate_Order_By = {
  avg: InputMaybe<ProductVariant_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<ProductVariant_Max_Order_By>;
  min: InputMaybe<ProductVariant_Min_Order_By>;
  stddev: InputMaybe<ProductVariant_Stddev_Order_By>;
  stddev_pop: InputMaybe<ProductVariant_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<ProductVariant_Stddev_Samp_Order_By>;
  sum: InputMaybe<ProductVariant_Sum_Order_By>;
  var_pop: InputMaybe<ProductVariant_Var_Pop_Order_By>;
  var_samp: InputMaybe<ProductVariant_Var_Samp_Order_By>;
  variance: InputMaybe<ProductVariant_Variance_Order_By>;
};

/** order by avg() on columns of table "ProductVariant" */
export type ProductVariant_Avg_Order_By = {
  quantity: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ProductVariant". All fields are combined with a logical 'AND'. */
export type ProductVariant_Bool_Exp = {
  _and: InputMaybe<Array<ProductVariant_Bool_Exp>>;
  _not: InputMaybe<ProductVariant_Bool_Exp>;
  _or: InputMaybe<Array<ProductVariant_Bool_Exp>>;
  condition: InputMaybe<Condition_Comparison_Exp>;
  createdAt: InputMaybe<Timestamp_Comparison_Exp>;
  id: InputMaybe<String_Comparison_Exp>;
  product: InputMaybe<Product_Bool_Exp>;
  productId: InputMaybe<String_Comparison_Exp>;
  quantity: InputMaybe<Int_Comparison_Exp>;
  storeB2CVariant: InputMaybe<Dbt_Store_B2c_Product_Variant_Bool_Exp>;
  storeExposedVariant: InputMaybe<Dbt_Store_Exposed_Product_Variant_Bool_Exp>;
};

/** order by max() on columns of table "ProductVariant" */
export type ProductVariant_Max_Order_By = {
  condition: InputMaybe<Order_By>;
  createdAt: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  productId: InputMaybe<Order_By>;
  quantity: InputMaybe<Order_By>;
};

/** order by min() on columns of table "ProductVariant" */
export type ProductVariant_Min_Order_By = {
  condition: InputMaybe<Order_By>;
  createdAt: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  productId: InputMaybe<Order_By>;
  quantity: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "ProductVariant". */
export type ProductVariant_Order_By = {
  condition: InputMaybe<Order_By>;
  createdAt: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  product: InputMaybe<Product_Order_By>;
  productId: InputMaybe<Order_By>;
  quantity: InputMaybe<Order_By>;
  storeB2CVariant: InputMaybe<Dbt_Store_B2c_Product_Variant_Order_By>;
  storeExposedVariant: InputMaybe<Dbt_Store_Exposed_Product_Variant_Order_By>;
};

/** select columns of table "ProductVariant" */
export enum ProductVariant_Select_Column {
  /** column name */
  Condition = 'condition',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  ProductId = 'productId',
  /** column name */
  Quantity = 'quantity',
}

/** order by stddev() on columns of table "ProductVariant" */
export type ProductVariant_Stddev_Order_By = {
  quantity: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "ProductVariant" */
export type ProductVariant_Stddev_Pop_Order_By = {
  quantity: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "ProductVariant" */
export type ProductVariant_Stddev_Samp_Order_By = {
  quantity: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "ProductVariant" */
export type ProductVariant_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: ProductVariant_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type ProductVariant_Stream_Cursor_Value_Input = {
  condition: InputMaybe<Scalars['Condition']['input']>;
  createdAt: InputMaybe<Scalars['timestamp']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  productId: InputMaybe<Scalars['String']['input']>;
  quantity: InputMaybe<Scalars['Int']['input']>;
};

/** order by sum() on columns of table "ProductVariant" */
export type ProductVariant_Sum_Order_By = {
  quantity: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "ProductVariant" */
export type ProductVariant_Var_Pop_Order_By = {
  quantity: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "ProductVariant" */
export type ProductVariant_Var_Samp_Order_By = {
  quantity: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "ProductVariant" */
export type ProductVariant_Variance_Order_By = {
  quantity: InputMaybe<Order_By>;
};

/** order by aggregate values of table "Product" */
export type Product_Aggregate_Order_By = {
  avg: InputMaybe<Product_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Product_Max_Order_By>;
  min: InputMaybe<Product_Min_Order_By>;
  stddev: InputMaybe<Product_Stddev_Order_By>;
  stddev_pop: InputMaybe<Product_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Product_Stddev_Samp_Order_By>;
  sum: InputMaybe<Product_Sum_Order_By>;
  var_pop: InputMaybe<Product_Var_Pop_Order_By>;
  var_samp: InputMaybe<Product_Var_Samp_Order_By>;
  variance: InputMaybe<Product_Variance_Order_By>;
};

/** order by avg() on columns of table "Product" */
export type Product_Avg_Order_By = {
  shopifyId: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Product". All fields are combined with a logical 'AND'. */
export type Product_Bool_Exp = {
  Vendor: InputMaybe<Customer_Bool_Exp>;
  _and: InputMaybe<Array<Product_Bool_Exp>>;
  _not: InputMaybe<Product_Bool_Exp>;
  _or: InputMaybe<Array<Product_Bool_Exp>>;
  createdAt: InputMaybe<Timestamp_Comparison_Exp>;
  handle: InputMaybe<String_Comparison_Exp>;
  id: InputMaybe<String_Comparison_Exp>;
  productType: InputMaybe<String_Comparison_Exp>;
  shopifyId: InputMaybe<Bigint_Comparison_Exp>;
  status: InputMaybe<ProductStatus_Comparison_Exp>;
  storeExposedProduct: InputMaybe<Dbt_Store_Exposed_Product_Bool_Exp>;
  variants: InputMaybe<ProductVariant_Bool_Exp>;
  vendorId: InputMaybe<Uuid_Comparison_Exp>;
};

/** order by max() on columns of table "Product" */
export type Product_Max_Order_By = {
  createdAt: InputMaybe<Order_By>;
  handle: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  productType: InputMaybe<Order_By>;
  shopifyId: InputMaybe<Order_By>;
  status: InputMaybe<Order_By>;
  vendorId: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Product" */
export type Product_Min_Order_By = {
  createdAt: InputMaybe<Order_By>;
  handle: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  productType: InputMaybe<Order_By>;
  shopifyId: InputMaybe<Order_By>;
  status: InputMaybe<Order_By>;
  vendorId: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Product". */
export type Product_Order_By = {
  Vendor: InputMaybe<Customer_Order_By>;
  createdAt: InputMaybe<Order_By>;
  handle: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  productType: InputMaybe<Order_By>;
  shopifyId: InputMaybe<Order_By>;
  status: InputMaybe<Order_By>;
  storeExposedProduct: InputMaybe<Dbt_Store_Exposed_Product_Order_By>;
  variants_aggregate: InputMaybe<ProductVariant_Aggregate_Order_By>;
  vendorId: InputMaybe<Order_By>;
};

/** select columns of table "Product" */
export enum Product_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Handle = 'handle',
  /** column name */
  Id = 'id',
  /** column name */
  ProductType = 'productType',
  /** column name */
  ShopifyId = 'shopifyId',
  /** column name */
  Status = 'status',
  /** column name */
  VendorId = 'vendorId',
}

/** order by stddev() on columns of table "Product" */
export type Product_Stddev_Order_By = {
  shopifyId: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Product" */
export type Product_Stddev_Pop_Order_By = {
  shopifyId: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Product" */
export type Product_Stddev_Samp_Order_By = {
  shopifyId: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Product" */
export type Product_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Product_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Product_Stream_Cursor_Value_Input = {
  createdAt: InputMaybe<Scalars['timestamp']['input']>;
  handle: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  productType: InputMaybe<Scalars['String']['input']>;
  shopifyId: InputMaybe<Scalars['bigint']['input']>;
  status: InputMaybe<Scalars['ProductStatus']['input']>;
  vendorId: InputMaybe<Scalars['uuid']['input']>;
};

/** order by sum() on columns of table "Product" */
export type Product_Sum_Order_By = {
  shopifyId: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Product" */
export type Product_Var_Pop_Order_By = {
  shopifyId: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Product" */
export type Product_Var_Samp_Order_By = {
  shopifyId: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Product" */
export type Product_Variance_Order_By = {
  shopifyId: InputMaybe<Order_By>;
};

/** columns and relationships of "Review" */
export type Review = {
  __typename?: 'Review';
  /** An object relationship */
  Customer: Customer;
  /** An array relationship */
  VendorReview: Array<VendorReview>;
  authorNickname: Maybe<Scalars['String']['output']>;
  content: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['timestamp']['output'];
  customerId: Scalars['uuid']['output'];
  id: Scalars['String']['output'];
  orderId: Maybe<Scalars['String']['output']>;
  rating: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

/** columns and relationships of "Review" */
export type ReviewVendorReviewArgs = {
  distinct_on: InputMaybe<Array<VendorReview_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<VendorReview_Order_By>>;
  where: InputMaybe<VendorReview_Bool_Exp>;
};

/** order by aggregate values of table "Review" */
export type Review_Aggregate_Order_By = {
  avg: InputMaybe<Review_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Review_Max_Order_By>;
  min: InputMaybe<Review_Min_Order_By>;
  stddev: InputMaybe<Review_Stddev_Order_By>;
  stddev_pop: InputMaybe<Review_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Review_Stddev_Samp_Order_By>;
  sum: InputMaybe<Review_Sum_Order_By>;
  var_pop: InputMaybe<Review_Var_Pop_Order_By>;
  var_samp: InputMaybe<Review_Var_Samp_Order_By>;
  variance: InputMaybe<Review_Variance_Order_By>;
};

/** order by avg() on columns of table "Review" */
export type Review_Avg_Order_By = {
  rating: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Review". All fields are combined with a logical 'AND'. */
export type Review_Bool_Exp = {
  Customer: InputMaybe<Customer_Bool_Exp>;
  VendorReview: InputMaybe<VendorReview_Bool_Exp>;
  _and: InputMaybe<Array<Review_Bool_Exp>>;
  _not: InputMaybe<Review_Bool_Exp>;
  _or: InputMaybe<Array<Review_Bool_Exp>>;
  authorNickname: InputMaybe<String_Comparison_Exp>;
  content: InputMaybe<String_Comparison_Exp>;
  createdAt: InputMaybe<Timestamp_Comparison_Exp>;
  customerId: InputMaybe<Uuid_Comparison_Exp>;
  id: InputMaybe<String_Comparison_Exp>;
  orderId: InputMaybe<String_Comparison_Exp>;
  rating: InputMaybe<Int_Comparison_Exp>;
  title: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "Review" */
export type Review_Max_Order_By = {
  authorNickname: InputMaybe<Order_By>;
  content: InputMaybe<Order_By>;
  createdAt: InputMaybe<Order_By>;
  customerId: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  orderId: InputMaybe<Order_By>;
  rating: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Review" */
export type Review_Min_Order_By = {
  authorNickname: InputMaybe<Order_By>;
  content: InputMaybe<Order_By>;
  createdAt: InputMaybe<Order_By>;
  customerId: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  orderId: InputMaybe<Order_By>;
  rating: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Review". */
export type Review_Order_By = {
  Customer: InputMaybe<Customer_Order_By>;
  VendorReview_aggregate: InputMaybe<VendorReview_Aggregate_Order_By>;
  authorNickname: InputMaybe<Order_By>;
  content: InputMaybe<Order_By>;
  createdAt: InputMaybe<Order_By>;
  customerId: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  orderId: InputMaybe<Order_By>;
  rating: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
};

/** select columns of table "Review" */
export enum Review_Select_Column {
  /** column name */
  AuthorNickname = 'authorNickname',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CustomerId = 'customerId',
  /** column name */
  Id = 'id',
  /** column name */
  OrderId = 'orderId',
  /** column name */
  Rating = 'rating',
  /** column name */
  Title = 'title',
}

/** order by stddev() on columns of table "Review" */
export type Review_Stddev_Order_By = {
  rating: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Review" */
export type Review_Stddev_Pop_Order_By = {
  rating: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Review" */
export type Review_Stddev_Samp_Order_By = {
  rating: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Review" */
export type Review_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Review_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Review_Stream_Cursor_Value_Input = {
  authorNickname: InputMaybe<Scalars['String']['input']>;
  content: InputMaybe<Scalars['String']['input']>;
  createdAt: InputMaybe<Scalars['timestamp']['input']>;
  customerId: InputMaybe<Scalars['uuid']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  orderId: InputMaybe<Scalars['String']['input']>;
  rating: InputMaybe<Scalars['Int']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "Review" */
export type Review_Sum_Order_By = {
  rating: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Review" */
export type Review_Var_Pop_Order_By = {
  rating: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Review" */
export type Review_Var_Samp_Order_By = {
  rating: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Review" */
export type Review_Variance_Order_By = {
  rating: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "ShipmentTimeframe". All fields are combined with logical 'AND'. */
export type ShipmentTimeframe_Comparison_Exp = {
  _eq: InputMaybe<Scalars['ShipmentTimeframe']['input']>;
  _gt: InputMaybe<Scalars['ShipmentTimeframe']['input']>;
  _gte: InputMaybe<Scalars['ShipmentTimeframe']['input']>;
  _in: InputMaybe<Array<Scalars['ShipmentTimeframe']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['ShipmentTimeframe']['input']>;
  _lte: InputMaybe<Scalars['ShipmentTimeframe']['input']>;
  _neq: InputMaybe<Scalars['ShipmentTimeframe']['input']>;
  _nin: InputMaybe<Array<Scalars['ShipmentTimeframe']['input']>>;
};

/** Boolean expression to compare columns of type "ShippingType". All fields are combined with logical 'AND'. */
export type ShippingType_Comparison_Exp = {
  _eq: InputMaybe<Scalars['ShippingType']['input']>;
  _gt: InputMaybe<Scalars['ShippingType']['input']>;
  _gte: InputMaybe<Scalars['ShippingType']['input']>;
  _in: InputMaybe<Array<Scalars['ShippingType']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['ShippingType']['input']>;
  _lte: InputMaybe<Scalars['ShippingType']['input']>;
  _neq: InputMaybe<Scalars['ShippingType']['input']>;
  _nin: InputMaybe<Array<Scalars['ShippingType']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq: InputMaybe<Scalars['String']['input']>;
  _gt: InputMaybe<Scalars['String']['input']>;
  _gte: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike: InputMaybe<Scalars['String']['input']>;
  _in: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex: InputMaybe<Scalars['String']['input']>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like: InputMaybe<Scalars['String']['input']>;
  _lt: InputMaybe<Scalars['String']['input']>;
  _lte: InputMaybe<Scalars['String']['input']>;
  _neq: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike: InputMaybe<Scalars['String']['input']>;
  _nin: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "VendorReview" */
export type VendorReview = {
  __typename?: 'VendorReview';
  /** An object relationship */
  Review: Review;
  /** An object relationship */
  Vendor: Customer;
  orderId: Maybe<Scalars['String']['output']>;
  reviewId: Scalars['String']['output'];
  vendorId: Scalars['uuid']['output'];
};

/** order by aggregate values of table "VendorReview" */
export type VendorReview_Aggregate_Order_By = {
  count: InputMaybe<Order_By>;
  max: InputMaybe<VendorReview_Max_Order_By>;
  min: InputMaybe<VendorReview_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "VendorReview". All fields are combined with a logical 'AND'. */
export type VendorReview_Bool_Exp = {
  Review: InputMaybe<Review_Bool_Exp>;
  Vendor: InputMaybe<Customer_Bool_Exp>;
  _and: InputMaybe<Array<VendorReview_Bool_Exp>>;
  _not: InputMaybe<VendorReview_Bool_Exp>;
  _or: InputMaybe<Array<VendorReview_Bool_Exp>>;
  orderId: InputMaybe<String_Comparison_Exp>;
  reviewId: InputMaybe<String_Comparison_Exp>;
  vendorId: InputMaybe<Uuid_Comparison_Exp>;
};

/** order by max() on columns of table "VendorReview" */
export type VendorReview_Max_Order_By = {
  orderId: InputMaybe<Order_By>;
  reviewId: InputMaybe<Order_By>;
  vendorId: InputMaybe<Order_By>;
};

/** order by min() on columns of table "VendorReview" */
export type VendorReview_Min_Order_By = {
  orderId: InputMaybe<Order_By>;
  reviewId: InputMaybe<Order_By>;
  vendorId: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "VendorReview". */
export type VendorReview_Order_By = {
  Review: InputMaybe<Review_Order_By>;
  Vendor: InputMaybe<Customer_Order_By>;
  orderId: InputMaybe<Order_By>;
  reviewId: InputMaybe<Order_By>;
  vendorId: InputMaybe<Order_By>;
};

/** select columns of table "VendorReview" */
export enum VendorReview_Select_Column {
  /** column name */
  OrderId = 'orderId',
  /** column name */
  ReviewId = 'reviewId',
  /** column name */
  VendorId = 'vendorId',
}

/** Streaming cursor of the table "VendorReview" */
export type VendorReview_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: VendorReview_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type VendorReview_Stream_Cursor_Value_Input = {
  orderId: InputMaybe<Scalars['String']['input']>;
  reviewId: InputMaybe<Scalars['String']['input']>;
  vendorId: InputMaybe<Scalars['uuid']['input']>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq: InputMaybe<Scalars['bigint']['input']>;
  _gt: InputMaybe<Scalars['bigint']['input']>;
  _gte: InputMaybe<Scalars['bigint']['input']>;
  _in: InputMaybe<Array<Scalars['bigint']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['bigint']['input']>;
  _lte: InputMaybe<Scalars['bigint']['input']>;
  _neq: InputMaybe<Scalars['bigint']['input']>;
  _nin: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** columns and relationships of "dbt.store_b2c_product_variant" */
export type Dbt_Store_B2c_Product_Variant = {
  __typename?: 'dbt_store_b2c_product_variant';
  compare_at_price: Maybe<Scalars['float8']['output']>;
  price: Scalars['float8']['output'];
  /** An object relationship */
  variant: Maybe<Dbt_Store_Base_Product_Variant>;
};

/** Boolean expression to filter rows from the table "dbt.store_b2c_product_variant". All fields are combined with a logical 'AND'. */
export type Dbt_Store_B2c_Product_Variant_Bool_Exp = {
  _and: InputMaybe<Array<Dbt_Store_B2c_Product_Variant_Bool_Exp>>;
  _not: InputMaybe<Dbt_Store_B2c_Product_Variant_Bool_Exp>;
  _or: InputMaybe<Array<Dbt_Store_B2c_Product_Variant_Bool_Exp>>;
  compare_at_price: InputMaybe<Float8_Comparison_Exp>;
  price: InputMaybe<Float8_Comparison_Exp>;
  variant: InputMaybe<Dbt_Store_Base_Product_Variant_Bool_Exp>;
};

/** Ordering options when selecting data from "dbt.store_b2c_product_variant". */
export type Dbt_Store_B2c_Product_Variant_Order_By = {
  compare_at_price: InputMaybe<Order_By>;
  price: InputMaybe<Order_By>;
  variant: InputMaybe<Dbt_Store_Base_Product_Variant_Order_By>;
};

/** select columns of table "dbt.store_b2c_product_variant" */
export enum Dbt_Store_B2c_Product_Variant_Select_Column {
  /** column name */
  CompareAtPrice = 'compare_at_price',
  /** column name */
  Price = 'price',
}

/** Streaming cursor of the table "dbt_store_b2c_product_variant" */
export type Dbt_Store_B2c_Product_Variant_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dbt_Store_B2c_Product_Variant_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dbt_Store_B2c_Product_Variant_Stream_Cursor_Value_Input = {
  compare_at_price: InputMaybe<Scalars['float8']['input']>;
  price: InputMaybe<Scalars['float8']['input']>;
};

/** columns and relationships of "dbt.store_base_product" */
export type Dbt_Store_Base_Product = {
  __typename?: 'dbt_store_base_product';
  /** An array relationship */
  collections: Array<Dbt_Store_Product_Collection>;
  createdAt: Scalars['timestamptz']['output'];
  id: Scalars['String']['output'];
  /** An array relationship */
  images: Array<Dbt_Store_Exposed_Product_Image>;
  /** An object relationship */
  product: Maybe<Dbt_Store_Exposed_Product>;
  shopifyId: Scalars['bigint']['output'];
  /** An array relationship */
  tags: Array<Dbt_Store_Exposed_Product_Tag>;
  /** An array relationship */
  variants: Array<Dbt_Store_Base_Product_Variant>;
  vendorId: Scalars['uuid']['output'];
};

/** columns and relationships of "dbt.store_base_product" */
export type Dbt_Store_Base_ProductCollectionsArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Product_Collection_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Product_Collection_Order_By>>;
  where: InputMaybe<Dbt_Store_Product_Collection_Bool_Exp>;
};

/** columns and relationships of "dbt.store_base_product" */
export type Dbt_Store_Base_ProductImagesArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Exposed_Product_Image_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Exposed_Product_Image_Order_By>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Image_Bool_Exp>;
};

/** columns and relationships of "dbt.store_base_product" */
export type Dbt_Store_Base_ProductTagsArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Exposed_Product_Tag_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Exposed_Product_Tag_Order_By>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Tag_Bool_Exp>;
};

/** columns and relationships of "dbt.store_base_product" */
export type Dbt_Store_Base_ProductVariantsArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Base_Product_Variant_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Base_Product_Variant_Order_By>>;
  where: InputMaybe<Dbt_Store_Base_Product_Variant_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "dbt.store_base_product". All fields are combined with a logical 'AND'. */
export type Dbt_Store_Base_Product_Bool_Exp = {
  _and: InputMaybe<Array<Dbt_Store_Base_Product_Bool_Exp>>;
  _not: InputMaybe<Dbt_Store_Base_Product_Bool_Exp>;
  _or: InputMaybe<Array<Dbt_Store_Base_Product_Bool_Exp>>;
  collections: InputMaybe<Dbt_Store_Product_Collection_Bool_Exp>;
  createdAt: InputMaybe<Timestamptz_Comparison_Exp>;
  id: InputMaybe<String_Comparison_Exp>;
  images: InputMaybe<Dbt_Store_Exposed_Product_Image_Bool_Exp>;
  product: InputMaybe<Dbt_Store_Exposed_Product_Bool_Exp>;
  shopifyId: InputMaybe<Bigint_Comparison_Exp>;
  tags: InputMaybe<Dbt_Store_Exposed_Product_Tag_Bool_Exp>;
  variants: InputMaybe<Dbt_Store_Base_Product_Variant_Bool_Exp>;
  vendorId: InputMaybe<Uuid_Comparison_Exp>;
};

/** Ordering options when selecting data from "dbt.store_base_product". */
export type Dbt_Store_Base_Product_Order_By = {
  collections_aggregate: InputMaybe<Dbt_Store_Product_Collection_Aggregate_Order_By>;
  createdAt: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  images_aggregate: InputMaybe<Dbt_Store_Exposed_Product_Image_Aggregate_Order_By>;
  product: InputMaybe<Dbt_Store_Exposed_Product_Order_By>;
  shopifyId: InputMaybe<Order_By>;
  tags_aggregate: InputMaybe<Dbt_Store_Exposed_Product_Tag_Aggregate_Order_By>;
  variants_aggregate: InputMaybe<Dbt_Store_Base_Product_Variant_Aggregate_Order_By>;
  vendorId: InputMaybe<Order_By>;
};

/** select columns of table "dbt.store_base_product" */
export enum Dbt_Store_Base_Product_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  ShopifyId = 'shopifyId',
  /** column name */
  VendorId = 'vendorId',
}

/** Streaming cursor of the table "dbt_store_base_product" */
export type Dbt_Store_Base_Product_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dbt_Store_Base_Product_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dbt_Store_Base_Product_Stream_Cursor_Value_Input = {
  createdAt: InputMaybe<Scalars['timestamptz']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  shopifyId: InputMaybe<Scalars['bigint']['input']>;
  vendorId: InputMaybe<Scalars['uuid']['input']>;
};

/** columns and relationships of "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant = {
  __typename?: 'dbt_store_base_product_variant';
  /** An object relationship */
  b2cVariant: Maybe<Dbt_Store_B2c_Product_Variant>;
  createdAt: Scalars['timestamptz']['output'];
  id: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  product: Maybe<Dbt_Store_Base_Product>;
  productId: Scalars['String']['output'];
  shopify_id: Scalars['bigint']['output'];
  /** An object relationship */
  variant: Maybe<Dbt_Store_Exposed_Product_Variant>;
};

/** order by aggregate values of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Aggregate_Order_By = {
  avg: InputMaybe<Dbt_Store_Base_Product_Variant_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Dbt_Store_Base_Product_Variant_Max_Order_By>;
  min: InputMaybe<Dbt_Store_Base_Product_Variant_Min_Order_By>;
  stddev: InputMaybe<Dbt_Store_Base_Product_Variant_Stddev_Order_By>;
  stddev_pop: InputMaybe<Dbt_Store_Base_Product_Variant_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Dbt_Store_Base_Product_Variant_Stddev_Samp_Order_By>;
  sum: InputMaybe<Dbt_Store_Base_Product_Variant_Sum_Order_By>;
  var_pop: InputMaybe<Dbt_Store_Base_Product_Variant_Var_Pop_Order_By>;
  var_samp: InputMaybe<Dbt_Store_Base_Product_Variant_Var_Samp_Order_By>;
  variance: InputMaybe<Dbt_Store_Base_Product_Variant_Variance_Order_By>;
};

/** order by avg() on columns of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Avg_Order_By = {
  shopify_id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "dbt.store_base_product_variant". All fields are combined with a logical 'AND'. */
export type Dbt_Store_Base_Product_Variant_Bool_Exp = {
  _and: InputMaybe<Array<Dbt_Store_Base_Product_Variant_Bool_Exp>>;
  _not: InputMaybe<Dbt_Store_Base_Product_Variant_Bool_Exp>;
  _or: InputMaybe<Array<Dbt_Store_Base_Product_Variant_Bool_Exp>>;
  b2cVariant: InputMaybe<Dbt_Store_B2c_Product_Variant_Bool_Exp>;
  createdAt: InputMaybe<Timestamptz_Comparison_Exp>;
  id: InputMaybe<String_Comparison_Exp>;
  product: InputMaybe<Dbt_Store_Base_Product_Bool_Exp>;
  productId: InputMaybe<String_Comparison_Exp>;
  shopify_id: InputMaybe<Bigint_Comparison_Exp>;
  variant: InputMaybe<Dbt_Store_Exposed_Product_Variant_Bool_Exp>;
};

/** order by max() on columns of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Max_Order_By = {
  createdAt: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  productId: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
};

/** order by min() on columns of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Min_Order_By = {
  createdAt: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  productId: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "dbt.store_base_product_variant". */
export type Dbt_Store_Base_Product_Variant_Order_By = {
  b2cVariant: InputMaybe<Dbt_Store_B2c_Product_Variant_Order_By>;
  createdAt: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  product: InputMaybe<Dbt_Store_Base_Product_Order_By>;
  productId: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  variant: InputMaybe<Dbt_Store_Exposed_Product_Variant_Order_By>;
};

/** select columns of table "dbt.store_base_product_variant" */
export enum Dbt_Store_Base_Product_Variant_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  ProductId = 'productId',
  /** column name */
  ShopifyId = 'shopify_id',
}

/** order by stddev() on columns of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Stddev_Order_By = {
  shopify_id: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Stddev_Pop_Order_By = {
  shopify_id: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Stddev_Samp_Order_By = {
  shopify_id: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "dbt_store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dbt_Store_Base_Product_Variant_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dbt_Store_Base_Product_Variant_Stream_Cursor_Value_Input = {
  createdAt: InputMaybe<Scalars['timestamptz']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  productId: InputMaybe<Scalars['String']['input']>;
  shopify_id: InputMaybe<Scalars['bigint']['input']>;
};

/** order by sum() on columns of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Sum_Order_By = {
  shopify_id: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Var_Pop_Order_By = {
  shopify_id: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Var_Samp_Order_By = {
  shopify_id: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "dbt.store_base_product_variant" */
export type Dbt_Store_Base_Product_Variant_Variance_Order_By = {
  shopify_id: InputMaybe<Order_By>;
};

/** columns and relationships of "dbt.store_discount" */
export type Dbt_Store_Discount = {
  __typename?: 'dbt_store_discount';
  code: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  collection: Array<Dbt_Store_Discount_Collection>;
  ends_at: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['bigint']['output'];
  min_amount: Maybe<Scalars['float8']['output']>;
  starts_at: Scalars['timestamptz']['output'];
  title: Scalars['String']['output'];
  value: Scalars['float8']['output'];
  value_type: Scalars['String']['output'];
};

/** columns and relationships of "dbt.store_discount" */
export type Dbt_Store_DiscountCollectionArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Discount_Collection_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Discount_Collection_Order_By>>;
  where: InputMaybe<Dbt_Store_Discount_Collection_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "dbt.store_discount". All fields are combined with a logical 'AND'. */
export type Dbt_Store_Discount_Bool_Exp = {
  _and: InputMaybe<Array<Dbt_Store_Discount_Bool_Exp>>;
  _not: InputMaybe<Dbt_Store_Discount_Bool_Exp>;
  _or: InputMaybe<Array<Dbt_Store_Discount_Bool_Exp>>;
  code: InputMaybe<String_Comparison_Exp>;
  collection: InputMaybe<Dbt_Store_Discount_Collection_Bool_Exp>;
  ends_at: InputMaybe<Timestamptz_Comparison_Exp>;
  id: InputMaybe<Bigint_Comparison_Exp>;
  min_amount: InputMaybe<Float8_Comparison_Exp>;
  starts_at: InputMaybe<Timestamptz_Comparison_Exp>;
  title: InputMaybe<String_Comparison_Exp>;
  value: InputMaybe<Float8_Comparison_Exp>;
  value_type: InputMaybe<String_Comparison_Exp>;
};

/** columns and relationships of "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection = {
  __typename?: 'dbt_store_discount_collection';
  collection_internal_id: Scalars['String']['output'];
  /** An object relationship */
  discount: Maybe<Dbt_Store_Discount>;
  discount_id: Scalars['bigint']['output'];
};

/** order by aggregate values of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Aggregate_Order_By = {
  avg: InputMaybe<Dbt_Store_Discount_Collection_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Dbt_Store_Discount_Collection_Max_Order_By>;
  min: InputMaybe<Dbt_Store_Discount_Collection_Min_Order_By>;
  stddev: InputMaybe<Dbt_Store_Discount_Collection_Stddev_Order_By>;
  stddev_pop: InputMaybe<Dbt_Store_Discount_Collection_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Dbt_Store_Discount_Collection_Stddev_Samp_Order_By>;
  sum: InputMaybe<Dbt_Store_Discount_Collection_Sum_Order_By>;
  var_pop: InputMaybe<Dbt_Store_Discount_Collection_Var_Pop_Order_By>;
  var_samp: InputMaybe<Dbt_Store_Discount_Collection_Var_Samp_Order_By>;
  variance: InputMaybe<Dbt_Store_Discount_Collection_Variance_Order_By>;
};

/** order by avg() on columns of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Avg_Order_By = {
  discount_id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "dbt.store_discount_collection". All fields are combined with a logical 'AND'. */
export type Dbt_Store_Discount_Collection_Bool_Exp = {
  _and: InputMaybe<Array<Dbt_Store_Discount_Collection_Bool_Exp>>;
  _not: InputMaybe<Dbt_Store_Discount_Collection_Bool_Exp>;
  _or: InputMaybe<Array<Dbt_Store_Discount_Collection_Bool_Exp>>;
  collection_internal_id: InputMaybe<String_Comparison_Exp>;
  discount: InputMaybe<Dbt_Store_Discount_Bool_Exp>;
  discount_id: InputMaybe<Bigint_Comparison_Exp>;
};

/** order by max() on columns of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Max_Order_By = {
  collection_internal_id: InputMaybe<Order_By>;
  discount_id: InputMaybe<Order_By>;
};

/** order by min() on columns of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Min_Order_By = {
  collection_internal_id: InputMaybe<Order_By>;
  discount_id: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "dbt.store_discount_collection". */
export type Dbt_Store_Discount_Collection_Order_By = {
  collection_internal_id: InputMaybe<Order_By>;
  discount: InputMaybe<Dbt_Store_Discount_Order_By>;
  discount_id: InputMaybe<Order_By>;
};

/** select columns of table "dbt.store_discount_collection" */
export enum Dbt_Store_Discount_Collection_Select_Column {
  /** column name */
  CollectionInternalId = 'collection_internal_id',
  /** column name */
  DiscountId = 'discount_id',
}

/** order by stddev() on columns of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Stddev_Order_By = {
  discount_id: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Stddev_Pop_Order_By = {
  discount_id: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Stddev_Samp_Order_By = {
  discount_id: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "dbt_store_discount_collection" */
export type Dbt_Store_Discount_Collection_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dbt_Store_Discount_Collection_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dbt_Store_Discount_Collection_Stream_Cursor_Value_Input = {
  collection_internal_id: InputMaybe<Scalars['String']['input']>;
  discount_id: InputMaybe<Scalars['bigint']['input']>;
};

/** order by sum() on columns of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Sum_Order_By = {
  discount_id: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Var_Pop_Order_By = {
  discount_id: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Var_Samp_Order_By = {
  discount_id: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "dbt.store_discount_collection" */
export type Dbt_Store_Discount_Collection_Variance_Order_By = {
  discount_id: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "dbt.store_discount". */
export type Dbt_Store_Discount_Order_By = {
  code: InputMaybe<Order_By>;
  collection_aggregate: InputMaybe<Dbt_Store_Discount_Collection_Aggregate_Order_By>;
  ends_at: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  min_amount: InputMaybe<Order_By>;
  starts_at: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
  value: InputMaybe<Order_By>;
  value_type: InputMaybe<Order_By>;
};

/** select columns of table "dbt.store_discount" */
export enum Dbt_Store_Discount_Select_Column {
  /** column name */
  Code = 'code',
  /** column name */
  EndsAt = 'ends_at',
  /** column name */
  Id = 'id',
  /** column name */
  MinAmount = 'min_amount',
  /** column name */
  StartsAt = 'starts_at',
  /** column name */
  Title = 'title',
  /** column name */
  Value = 'value',
  /** column name */
  ValueType = 'value_type',
}

/** Streaming cursor of the table "dbt_store_discount" */
export type Dbt_Store_Discount_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dbt_Store_Discount_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dbt_Store_Discount_Stream_Cursor_Value_Input = {
  code: InputMaybe<Scalars['String']['input']>;
  ends_at: InputMaybe<Scalars['timestamptz']['input']>;
  id: InputMaybe<Scalars['bigint']['input']>;
  min_amount: InputMaybe<Scalars['float8']['input']>;
  starts_at: InputMaybe<Scalars['timestamptz']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  value: InputMaybe<Scalars['float8']['input']>;
  value_type: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "dbt.store_exposed_product" */
export type Dbt_Store_Exposed_Product = {
  __typename?: 'dbt_store_exposed_product';
  brand: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  firstImage: Maybe<Scalars['String']['output']>;
  gender: Maybe<Scalars['String']['output']>;
  handle: Scalars['String']['output'];
  id: Scalars['String']['output'];
  model: Maybe<Scalars['String']['output']>;
  modelYear: Maybe<Scalars['String']['output']>;
  numberOfViews: Scalars['bigint']['output'];
  /** An object relationship */
  product: Maybe<Dbt_Store_Base_Product>;
  productType: Scalars['String']['output'];
  publishedAt: Maybe<Scalars['timestamptz']['output']>;
  size: Maybe<Scalars['String']['output']>;
  status: Scalars['ProductStatus']['output'];
  title: Scalars['String']['output'];
  vendor: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "dbt.store_exposed_product". All fields are combined with a logical 'AND'. */
export type Dbt_Store_Exposed_Product_Bool_Exp = {
  _and: InputMaybe<Array<Dbt_Store_Exposed_Product_Bool_Exp>>;
  _not: InputMaybe<Dbt_Store_Exposed_Product_Bool_Exp>;
  _or: InputMaybe<Array<Dbt_Store_Exposed_Product_Bool_Exp>>;
  brand: InputMaybe<String_Comparison_Exp>;
  description: InputMaybe<String_Comparison_Exp>;
  firstImage: InputMaybe<String_Comparison_Exp>;
  gender: InputMaybe<String_Comparison_Exp>;
  handle: InputMaybe<String_Comparison_Exp>;
  id: InputMaybe<String_Comparison_Exp>;
  model: InputMaybe<String_Comparison_Exp>;
  modelYear: InputMaybe<String_Comparison_Exp>;
  numberOfViews: InputMaybe<Bigint_Comparison_Exp>;
  product: InputMaybe<Dbt_Store_Base_Product_Bool_Exp>;
  productType: InputMaybe<String_Comparison_Exp>;
  publishedAt: InputMaybe<Timestamptz_Comparison_Exp>;
  size: InputMaybe<String_Comparison_Exp>;
  status: InputMaybe<ProductStatus_Comparison_Exp>;
  title: InputMaybe<String_Comparison_Exp>;
  vendor: InputMaybe<String_Comparison_Exp>;
};

/** columns and relationships of "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image = {
  __typename?: 'dbt_store_exposed_product_image';
  alt: Maybe<Scalars['String']['output']>;
  height: Scalars['bigint']['output'];
  position: Scalars['bigint']['output'];
  productId: Scalars['String']['output'];
  shopify_id: Scalars['bigint']['output'];
  src: Scalars['String']['output'];
  width: Scalars['bigint']['output'];
};

/** order by aggregate values of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Aggregate_Order_By = {
  avg: InputMaybe<Dbt_Store_Exposed_Product_Image_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Dbt_Store_Exposed_Product_Image_Max_Order_By>;
  min: InputMaybe<Dbt_Store_Exposed_Product_Image_Min_Order_By>;
  stddev: InputMaybe<Dbt_Store_Exposed_Product_Image_Stddev_Order_By>;
  stddev_pop: InputMaybe<Dbt_Store_Exposed_Product_Image_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Dbt_Store_Exposed_Product_Image_Stddev_Samp_Order_By>;
  sum: InputMaybe<Dbt_Store_Exposed_Product_Image_Sum_Order_By>;
  var_pop: InputMaybe<Dbt_Store_Exposed_Product_Image_Var_Pop_Order_By>;
  var_samp: InputMaybe<Dbt_Store_Exposed_Product_Image_Var_Samp_Order_By>;
  variance: InputMaybe<Dbt_Store_Exposed_Product_Image_Variance_Order_By>;
};

/** order by avg() on columns of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Avg_Order_By = {
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "dbt.store_exposed_product_image". All fields are combined with a logical 'AND'. */
export type Dbt_Store_Exposed_Product_Image_Bool_Exp = {
  _and: InputMaybe<Array<Dbt_Store_Exposed_Product_Image_Bool_Exp>>;
  _not: InputMaybe<Dbt_Store_Exposed_Product_Image_Bool_Exp>;
  _or: InputMaybe<Array<Dbt_Store_Exposed_Product_Image_Bool_Exp>>;
  alt: InputMaybe<String_Comparison_Exp>;
  height: InputMaybe<Bigint_Comparison_Exp>;
  position: InputMaybe<Bigint_Comparison_Exp>;
  productId: InputMaybe<String_Comparison_Exp>;
  shopify_id: InputMaybe<Bigint_Comparison_Exp>;
  src: InputMaybe<String_Comparison_Exp>;
  width: InputMaybe<Bigint_Comparison_Exp>;
};

/** order by max() on columns of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Max_Order_By = {
  alt: InputMaybe<Order_By>;
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  productId: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  src: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** order by min() on columns of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Min_Order_By = {
  alt: InputMaybe<Order_By>;
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  productId: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  src: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "dbt.store_exposed_product_image". */
export type Dbt_Store_Exposed_Product_Image_Order_By = {
  alt: InputMaybe<Order_By>;
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  productId: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  src: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** select columns of table "dbt.store_exposed_product_image" */
export enum Dbt_Store_Exposed_Product_Image_Select_Column {
  /** column name */
  Alt = 'alt',
  /** column name */
  Height = 'height',
  /** column name */
  Position = 'position',
  /** column name */
  ProductId = 'productId',
  /** column name */
  ShopifyId = 'shopify_id',
  /** column name */
  Src = 'src',
  /** column name */
  Width = 'width',
}

/** order by stddev() on columns of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Stddev_Order_By = {
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Stddev_Pop_Order_By = {
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Stddev_Samp_Order_By = {
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "dbt_store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dbt_Store_Exposed_Product_Image_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dbt_Store_Exposed_Product_Image_Stream_Cursor_Value_Input = {
  alt: InputMaybe<Scalars['String']['input']>;
  height: InputMaybe<Scalars['bigint']['input']>;
  position: InputMaybe<Scalars['bigint']['input']>;
  productId: InputMaybe<Scalars['String']['input']>;
  shopify_id: InputMaybe<Scalars['bigint']['input']>;
  src: InputMaybe<Scalars['String']['input']>;
  width: InputMaybe<Scalars['bigint']['input']>;
};

/** order by sum() on columns of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Sum_Order_By = {
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Var_Pop_Order_By = {
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Var_Samp_Order_By = {
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "dbt.store_exposed_product_image" */
export type Dbt_Store_Exposed_Product_Image_Variance_Order_By = {
  height: InputMaybe<Order_By>;
  position: InputMaybe<Order_By>;
  shopify_id: InputMaybe<Order_By>;
  width: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "dbt.store_exposed_product". */
export type Dbt_Store_Exposed_Product_Order_By = {
  brand: InputMaybe<Order_By>;
  description: InputMaybe<Order_By>;
  firstImage: InputMaybe<Order_By>;
  gender: InputMaybe<Order_By>;
  handle: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  model: InputMaybe<Order_By>;
  modelYear: InputMaybe<Order_By>;
  numberOfViews: InputMaybe<Order_By>;
  product: InputMaybe<Dbt_Store_Base_Product_Order_By>;
  productType: InputMaybe<Order_By>;
  publishedAt: InputMaybe<Order_By>;
  size: InputMaybe<Order_By>;
  status: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
  vendor: InputMaybe<Order_By>;
};

/** select columns of table "dbt.store_exposed_product" */
export enum Dbt_Store_Exposed_Product_Select_Column {
  /** column name */
  Brand = 'brand',
  /** column name */
  Description = 'description',
  /** column name */
  FirstImage = 'firstImage',
  /** column name */
  Gender = 'gender',
  /** column name */
  Handle = 'handle',
  /** column name */
  Id = 'id',
  /** column name */
  Model = 'model',
  /** column name */
  ModelYear = 'modelYear',
  /** column name */
  NumberOfViews = 'numberOfViews',
  /** column name */
  ProductType = 'productType',
  /** column name */
  PublishedAt = 'publishedAt',
  /** column name */
  Size = 'size',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Vendor = 'vendor',
}

/** Streaming cursor of the table "dbt_store_exposed_product" */
export type Dbt_Store_Exposed_Product_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dbt_Store_Exposed_Product_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dbt_Store_Exposed_Product_Stream_Cursor_Value_Input = {
  brand: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  firstImage: InputMaybe<Scalars['String']['input']>;
  gender: InputMaybe<Scalars['String']['input']>;
  handle: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
  model: InputMaybe<Scalars['String']['input']>;
  modelYear: InputMaybe<Scalars['String']['input']>;
  numberOfViews: InputMaybe<Scalars['bigint']['input']>;
  productType: InputMaybe<Scalars['String']['input']>;
  publishedAt: InputMaybe<Scalars['timestamptz']['input']>;
  size: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['ProductStatus']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  vendor: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "dbt.store_exposed_product_tag" */
export type Dbt_Store_Exposed_Product_Tag = {
  __typename?: 'dbt_store_exposed_product_tag';
  full_tag: Maybe<Scalars['String']['output']>;
  product_id: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** order by aggregate values of table "dbt.store_exposed_product_tag" */
export type Dbt_Store_Exposed_Product_Tag_Aggregate_Order_By = {
  count: InputMaybe<Order_By>;
  max: InputMaybe<Dbt_Store_Exposed_Product_Tag_Max_Order_By>;
  min: InputMaybe<Dbt_Store_Exposed_Product_Tag_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "dbt.store_exposed_product_tag". All fields are combined with a logical 'AND'. */
export type Dbt_Store_Exposed_Product_Tag_Bool_Exp = {
  _and: InputMaybe<Array<Dbt_Store_Exposed_Product_Tag_Bool_Exp>>;
  _not: InputMaybe<Dbt_Store_Exposed_Product_Tag_Bool_Exp>;
  _or: InputMaybe<Array<Dbt_Store_Exposed_Product_Tag_Bool_Exp>>;
  full_tag: InputMaybe<String_Comparison_Exp>;
  product_id: InputMaybe<String_Comparison_Exp>;
  tag: InputMaybe<String_Comparison_Exp>;
  value: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "dbt.store_exposed_product_tag" */
export type Dbt_Store_Exposed_Product_Tag_Max_Order_By = {
  full_tag: InputMaybe<Order_By>;
  product_id: InputMaybe<Order_By>;
  tag: InputMaybe<Order_By>;
  value: InputMaybe<Order_By>;
};

/** order by min() on columns of table "dbt.store_exposed_product_tag" */
export type Dbt_Store_Exposed_Product_Tag_Min_Order_By = {
  full_tag: InputMaybe<Order_By>;
  product_id: InputMaybe<Order_By>;
  tag: InputMaybe<Order_By>;
  value: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "dbt.store_exposed_product_tag". */
export type Dbt_Store_Exposed_Product_Tag_Order_By = {
  full_tag: InputMaybe<Order_By>;
  product_id: InputMaybe<Order_By>;
  tag: InputMaybe<Order_By>;
  value: InputMaybe<Order_By>;
};

/** select columns of table "dbt.store_exposed_product_tag" */
export enum Dbt_Store_Exposed_Product_Tag_Select_Column {
  /** column name */
  FullTag = 'full_tag',
  /** column name */
  ProductId = 'product_id',
  /** column name */
  Tag = 'tag',
  /** column name */
  Value = 'value',
}

/** Streaming cursor of the table "dbt_store_exposed_product_tag" */
export type Dbt_Store_Exposed_Product_Tag_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dbt_Store_Exposed_Product_Tag_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dbt_Store_Exposed_Product_Tag_Stream_Cursor_Value_Input = {
  full_tag: InputMaybe<Scalars['String']['input']>;
  product_id: InputMaybe<Scalars['String']['input']>;
  tag: InputMaybe<Scalars['String']['input']>;
  value: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "dbt.store_exposed_product_variant" */
export type Dbt_Store_Exposed_Product_Variant = {
  __typename?: 'dbt_store_exposed_product_variant';
  condition: Maybe<Scalars['Condition']['output']>;
  inventory_quantity: Scalars['bigint']['output'];
  isRefurbished: Maybe<Scalars['Boolean']['output']>;
  option1: Maybe<Scalars['String']['output']>;
  option1Name: Maybe<Scalars['String']['output']>;
  option2: Maybe<Scalars['String']['output']>;
  option2Name: Maybe<Scalars['String']['output']>;
  option3: Maybe<Scalars['String']['output']>;
  option3Name: Maybe<Scalars['String']['output']>;
  requiresShipping: Maybe<Scalars['Boolean']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  variant: Maybe<Dbt_Store_Base_Product_Variant>;
};

/** Boolean expression to filter rows from the table "dbt.store_exposed_product_variant". All fields are combined with a logical 'AND'. */
export type Dbt_Store_Exposed_Product_Variant_Bool_Exp = {
  _and: InputMaybe<Array<Dbt_Store_Exposed_Product_Variant_Bool_Exp>>;
  _not: InputMaybe<Dbt_Store_Exposed_Product_Variant_Bool_Exp>;
  _or: InputMaybe<Array<Dbt_Store_Exposed_Product_Variant_Bool_Exp>>;
  condition: InputMaybe<Condition_Comparison_Exp>;
  inventory_quantity: InputMaybe<Bigint_Comparison_Exp>;
  isRefurbished: InputMaybe<Boolean_Comparison_Exp>;
  option1: InputMaybe<String_Comparison_Exp>;
  option1Name: InputMaybe<String_Comparison_Exp>;
  option2: InputMaybe<String_Comparison_Exp>;
  option2Name: InputMaybe<String_Comparison_Exp>;
  option3: InputMaybe<String_Comparison_Exp>;
  option3Name: InputMaybe<String_Comparison_Exp>;
  requiresShipping: InputMaybe<Boolean_Comparison_Exp>;
  title: InputMaybe<String_Comparison_Exp>;
  updatedAt: InputMaybe<Timestamptz_Comparison_Exp>;
  variant: InputMaybe<Dbt_Store_Base_Product_Variant_Bool_Exp>;
};

/** Ordering options when selecting data from "dbt.store_exposed_product_variant". */
export type Dbt_Store_Exposed_Product_Variant_Order_By = {
  condition: InputMaybe<Order_By>;
  inventory_quantity: InputMaybe<Order_By>;
  isRefurbished: InputMaybe<Order_By>;
  option1: InputMaybe<Order_By>;
  option1Name: InputMaybe<Order_By>;
  option2: InputMaybe<Order_By>;
  option2Name: InputMaybe<Order_By>;
  option3: InputMaybe<Order_By>;
  option3Name: InputMaybe<Order_By>;
  requiresShipping: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
  updatedAt: InputMaybe<Order_By>;
  variant: InputMaybe<Dbt_Store_Base_Product_Variant_Order_By>;
};

/** select columns of table "dbt.store_exposed_product_variant" */
export enum Dbt_Store_Exposed_Product_Variant_Select_Column {
  /** column name */
  Condition = 'condition',
  /** column name */
  InventoryQuantity = 'inventory_quantity',
  /** column name */
  IsRefurbished = 'isRefurbished',
  /** column name */
  Option1 = 'option1',
  /** column name */
  Option1Name = 'option1Name',
  /** column name */
  Option2 = 'option2',
  /** column name */
  Option2Name = 'option2Name',
  /** column name */
  Option3 = 'option3',
  /** column name */
  Option3Name = 'option3Name',
  /** column name */
  RequiresShipping = 'requiresShipping',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updatedAt',
}

/** Streaming cursor of the table "dbt_store_exposed_product_variant" */
export type Dbt_Store_Exposed_Product_Variant_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dbt_Store_Exposed_Product_Variant_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dbt_Store_Exposed_Product_Variant_Stream_Cursor_Value_Input = {
  condition: InputMaybe<Scalars['Condition']['input']>;
  inventory_quantity: InputMaybe<Scalars['bigint']['input']>;
  isRefurbished: InputMaybe<Scalars['Boolean']['input']>;
  option1: InputMaybe<Scalars['String']['input']>;
  option1Name: InputMaybe<Scalars['String']['input']>;
  option2: InputMaybe<Scalars['String']['input']>;
  option2Name: InputMaybe<Scalars['String']['input']>;
  option3: InputMaybe<Scalars['String']['input']>;
  option3Name: InputMaybe<Scalars['String']['input']>;
  requiresShipping: InputMaybe<Scalars['Boolean']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
  updatedAt: InputMaybe<Scalars['timestamptz']['input']>;
};

/** columns and relationships of "dbt.store_product_collection" */
export type Dbt_Store_Product_Collection = {
  __typename?: 'dbt_store_product_collection';
  collection_id: Scalars['String']['output'];
  product_id: Scalars['String']['output'];
};

/** order by aggregate values of table "dbt.store_product_collection" */
export type Dbt_Store_Product_Collection_Aggregate_Order_By = {
  count: InputMaybe<Order_By>;
  max: InputMaybe<Dbt_Store_Product_Collection_Max_Order_By>;
  min: InputMaybe<Dbt_Store_Product_Collection_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "dbt.store_product_collection". All fields are combined with a logical 'AND'. */
export type Dbt_Store_Product_Collection_Bool_Exp = {
  _and: InputMaybe<Array<Dbt_Store_Product_Collection_Bool_Exp>>;
  _not: InputMaybe<Dbt_Store_Product_Collection_Bool_Exp>;
  _or: InputMaybe<Array<Dbt_Store_Product_Collection_Bool_Exp>>;
  collection_id: InputMaybe<String_Comparison_Exp>;
  product_id: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "dbt.store_product_collection" */
export type Dbt_Store_Product_Collection_Max_Order_By = {
  collection_id: InputMaybe<Order_By>;
  product_id: InputMaybe<Order_By>;
};

/** order by min() on columns of table "dbt.store_product_collection" */
export type Dbt_Store_Product_Collection_Min_Order_By = {
  collection_id: InputMaybe<Order_By>;
  product_id: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "dbt.store_product_collection". */
export type Dbt_Store_Product_Collection_Order_By = {
  collection_id: InputMaybe<Order_By>;
  product_id: InputMaybe<Order_By>;
};

/** select columns of table "dbt.store_product_collection" */
export enum Dbt_Store_Product_Collection_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  ProductId = 'product_id',
}

/** Streaming cursor of the table "dbt_store_product_collection" */
export type Dbt_Store_Product_Collection_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dbt_Store_Product_Collection_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dbt_Store_Product_Collection_Stream_Cursor_Value_Input = {
  collection_id: InputMaybe<Scalars['String']['input']>;
  product_id: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq: InputMaybe<Scalars['float8']['input']>;
  _gt: InputMaybe<Scalars['float8']['input']>;
  _gte: InputMaybe<Scalars['float8']['input']>;
  _in: InputMaybe<Array<Scalars['float8']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['float8']['input']>;
  _lte: InputMaybe<Scalars['float8']['input']>;
  _neq: InputMaybe<Scalars['float8']['input']>;
  _nin: InputMaybe<Array<Scalars['float8']['input']>>;
};

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
  /** fetch data from the table: "Checkout" */
  Checkout: Array<Checkout>;
  /** fetch data from the table: "Checkout" using primary key columns */
  Checkout_by_pk: Maybe<Checkout>;
  /** fetch data from the table: "Collection" */
  Collection: Array<Collection>;
  /** fetch data from the table: "Collection" using primary key columns */
  Collection_by_pk: Maybe<Collection>;
  /** fetch data from the table: "Customer" */
  Customer: Array<Customer>;
  /** fetch data from the table: "Customer" using primary key columns */
  Customer_by_pk: Maybe<Customer>;
  /** fetch data from the table: "NegociationAgreement" */
  NegociationAgreement: Array<NegociationAgreement>;
  /** fetch data from the table: "NegociationAgreement" using primary key columns */
  NegociationAgreement_by_pk: Maybe<NegociationAgreement>;
  /** fetch data from the table: "Payment" */
  Payment: Array<Payment>;
  /** fetch data from the table: "Payment" using primary key columns */
  Payment_by_pk: Maybe<Payment>;
  /** fetch data from the table: "Product" */
  Product: Array<Product>;
  /** fetch data from the table: "ProductVariant" */
  ProductVariant: Array<ProductVariant>;
  /** fetch data from the table: "ProductVariant" using primary key columns */
  ProductVariant_by_pk: Maybe<ProductVariant>;
  /** fetch data from the table: "Product" using primary key columns */
  Product_by_pk: Maybe<Product>;
  /** fetch data from the table: "Review" */
  Review: Array<Review>;
  /** fetch data from the table: "Review" using primary key columns */
  Review_by_pk: Maybe<Review>;
  /** An array relationship */
  VendorReview: Array<VendorReview>;
  /** fetch data from the table: "VendorReview" using primary key columns */
  VendorReview_by_pk: Maybe<VendorReview>;
  /** fetch data from the table: "dbt.store_b2c_product_variant" */
  dbt_store_b2c_product_variant: Array<Dbt_Store_B2c_Product_Variant>;
  /** fetch data from the table: "dbt.store_base_product" */
  dbt_store_base_product: Array<Dbt_Store_Base_Product>;
  /** fetch data from the table: "dbt.store_base_product" using primary key columns */
  dbt_store_base_product_by_pk: Maybe<Dbt_Store_Base_Product>;
  /** fetch data from the table: "dbt.store_base_product_variant" */
  dbt_store_base_product_variant: Array<Dbt_Store_Base_Product_Variant>;
  /** fetch data from the table: "dbt.store_base_product_variant" using primary key columns */
  dbt_store_base_product_variant_by_pk: Maybe<Dbt_Store_Base_Product_Variant>;
  /** fetch data from the table: "dbt.store_discount" */
  dbt_store_discount: Array<Dbt_Store_Discount>;
  /** fetch data from the table: "dbt.store_discount_collection" */
  dbt_store_discount_collection: Array<Dbt_Store_Discount_Collection>;
  /** fetch data from the table: "dbt.store_discount_collection" using primary key columns */
  dbt_store_discount_collection_by_pk: Maybe<Dbt_Store_Discount_Collection>;
  /** fetch data from the table: "dbt.store_exposed_product" */
  dbt_store_exposed_product: Array<Dbt_Store_Exposed_Product>;
  /** fetch data from the table: "dbt.store_exposed_product" using primary key columns */
  dbt_store_exposed_product_by_pk: Maybe<Dbt_Store_Exposed_Product>;
  /** fetch data from the table: "dbt.store_exposed_product_image" */
  dbt_store_exposed_product_image: Array<Dbt_Store_Exposed_Product_Image>;
  /** fetch data from the table: "dbt.store_exposed_product_image" using primary key columns */
  dbt_store_exposed_product_image_by_pk: Maybe<Dbt_Store_Exposed_Product_Image>;
  /** fetch data from the table: "dbt.store_exposed_product_tag" */
  dbt_store_exposed_product_tag: Array<Dbt_Store_Exposed_Product_Tag>;
  /** fetch data from the table: "dbt.store_exposed_product_variant" */
  dbt_store_exposed_product_variant: Array<Dbt_Store_Exposed_Product_Variant>;
  /** fetch data from the table: "dbt.store_product_collection" */
  dbt_store_product_collection: Array<Dbt_Store_Product_Collection>;
  /** fetch data from the table: "dbt.store_product_collection" using primary key columns */
  dbt_store_product_collection_by_pk: Maybe<Dbt_Store_Product_Collection>;
  shopify: Maybe<ShopifyQueryRoot>;
  /** fetch data from the table: "auth.users" */
  users: Array<Users>;
};

export type Query_RootCheckoutArgs = {
  distinct_on: InputMaybe<Array<Checkout_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Checkout_Order_By>>;
  where: InputMaybe<Checkout_Bool_Exp>;
};

export type Query_RootCheckout_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootCollectionArgs = {
  distinct_on: InputMaybe<Array<Collection_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Collection_Order_By>>;
  where: InputMaybe<Collection_Bool_Exp>;
};

export type Query_RootCollection_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootCustomerArgs = {
  distinct_on: InputMaybe<Array<Customer_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Customer_Order_By>>;
  where: InputMaybe<Customer_Bool_Exp>;
};

export type Query_RootCustomer_By_PkArgs = {
  authUserId: Scalars['uuid']['input'];
};

export type Query_RootNegociationAgreementArgs = {
  distinct_on: InputMaybe<Array<NegociationAgreement_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<NegociationAgreement_Order_By>>;
  where: InputMaybe<NegociationAgreement_Bool_Exp>;
};

export type Query_RootNegociationAgreement_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootPaymentArgs = {
  distinct_on: InputMaybe<Array<Payment_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Payment_Order_By>>;
  where: InputMaybe<Payment_Bool_Exp>;
};

export type Query_RootPayment_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootProductArgs = {
  distinct_on: InputMaybe<Array<Product_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Product_Order_By>>;
  where: InputMaybe<Product_Bool_Exp>;
};

export type Query_RootProductVariantArgs = {
  distinct_on: InputMaybe<Array<ProductVariant_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ProductVariant_Order_By>>;
  where: InputMaybe<ProductVariant_Bool_Exp>;
};

export type Query_RootProductVariant_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootProduct_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootReviewArgs = {
  distinct_on: InputMaybe<Array<Review_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Review_Order_By>>;
  where: InputMaybe<Review_Bool_Exp>;
};

export type Query_RootReview_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootVendorReviewArgs = {
  distinct_on: InputMaybe<Array<VendorReview_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<VendorReview_Order_By>>;
  where: InputMaybe<VendorReview_Bool_Exp>;
};

export type Query_RootVendorReview_By_PkArgs = {
  reviewId: Scalars['String']['input'];
};

export type Query_RootDbt_Store_B2c_Product_VariantArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_B2c_Product_Variant_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_B2c_Product_Variant_Order_By>>;
  where: InputMaybe<Dbt_Store_B2c_Product_Variant_Bool_Exp>;
};

export type Query_RootDbt_Store_Base_ProductArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Base_Product_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Base_Product_Order_By>>;
  where: InputMaybe<Dbt_Store_Base_Product_Bool_Exp>;
};

export type Query_RootDbt_Store_Base_Product_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootDbt_Store_Base_Product_VariantArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Base_Product_Variant_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Base_Product_Variant_Order_By>>;
  where: InputMaybe<Dbt_Store_Base_Product_Variant_Bool_Exp>;
};

export type Query_RootDbt_Store_Base_Product_Variant_By_PkArgs = {
  shopify_id: Scalars['bigint']['input'];
};

export type Query_RootDbt_Store_DiscountArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Discount_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Discount_Order_By>>;
  where: InputMaybe<Dbt_Store_Discount_Bool_Exp>;
};

export type Query_RootDbt_Store_Discount_CollectionArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Discount_Collection_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Discount_Collection_Order_By>>;
  where: InputMaybe<Dbt_Store_Discount_Collection_Bool_Exp>;
};

export type Query_RootDbt_Store_Discount_Collection_By_PkArgs = {
  collection_internal_id: Scalars['String']['input'];
  discount_id: Scalars['bigint']['input'];
};

export type Query_RootDbt_Store_Exposed_ProductArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Exposed_Product_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Exposed_Product_Order_By>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Bool_Exp>;
};

export type Query_RootDbt_Store_Exposed_Product_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootDbt_Store_Exposed_Product_ImageArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Exposed_Product_Image_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Exposed_Product_Image_Order_By>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Image_Bool_Exp>;
};

export type Query_RootDbt_Store_Exposed_Product_Image_By_PkArgs = {
  shopify_id: Scalars['bigint']['input'];
};

export type Query_RootDbt_Store_Exposed_Product_TagArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Exposed_Product_Tag_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Exposed_Product_Tag_Order_By>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Tag_Bool_Exp>;
};

export type Query_RootDbt_Store_Exposed_Product_VariantArgs = {
  distinct_on: InputMaybe<
    Array<Dbt_Store_Exposed_Product_Variant_Select_Column>
  >;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Exposed_Product_Variant_Order_By>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Variant_Bool_Exp>;
};

export type Query_RootDbt_Store_Product_CollectionArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Product_Collection_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Product_Collection_Order_By>>;
  where: InputMaybe<Dbt_Store_Product_Collection_Bool_Exp>;
};

export type Query_RootDbt_Store_Product_Collection_By_PkArgs = {
  collection_id: Scalars['String']['input'];
  product_id: Scalars['String']['input'];
};

export type Query_RootUsersArgs = {
  distinct_on: InputMaybe<Array<Users_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
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
  /** Deletes a cart metafield. */
  cartMetafieldDelete: Maybe<Shopify_CartMetafieldDeletePayload>;
  /**
   * Sets cart metafield values. Cart metafield values will be set regardless if they were previously created or not.
   *
   * Allows a maximum of 25 cart metafields to be set at a time.
   *
   */
  cartMetafieldsSet: Maybe<Shopify_CartMetafieldsSetPayload>;
  /** Updates the note on the cart. */
  cartNoteUpdate: Maybe<Shopify_CartNoteUpdatePayload>;
  /** Update the customer's payment method that will be used to checkout. */
  cartPaymentUpdate: Maybe<Shopify_CartPaymentUpdatePayload>;
  /** Update the selected delivery options for a delivery group. */
  cartSelectedDeliveryOptionsUpdate: Maybe<Shopify_CartSelectedDeliveryOptionsUpdatePayload>;
  /** Submit the cart for checkout completion. */
  cartSubmitForCompletion: Maybe<Shopify_CartSubmitForCompletionPayload>;
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
   * This mutation is throttled by IP. With private access,
   * you can provide a [`Shopify-Storefront-Buyer-IP`](https://shopify.dev/api/usage/authentication#optional-ip-header) instead of the request IP.
   * The header is case-sensitive and must be sent as `Shopify-Storefront-Buyer-IP`.
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
  cartId: Scalars['ID']['input'];
};

export type ShopifyMutationCartBuyerIdentityUpdateArgs = {
  buyerIdentity: Shopify_CartBuyerIdentityInput;
  cartId: Scalars['ID']['input'];
};

export type ShopifyMutationCartCreateArgs = {
  input: InputMaybe<Shopify_CartInput>;
};

export type ShopifyMutationCartDiscountCodesUpdateArgs = {
  cartId: Scalars['ID']['input'];
  discountCodes: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ShopifyMutationCartLinesAddArgs = {
  cartId: Scalars['ID']['input'];
  lines: Array<Shopify_CartLineInput>;
};

export type ShopifyMutationCartLinesRemoveArgs = {
  cartId: Scalars['ID']['input'];
  lineIds: Array<Scalars['ID']['input']>;
};

export type ShopifyMutationCartLinesUpdateArgs = {
  cartId: Scalars['ID']['input'];
  lines: Array<Shopify_CartLineUpdateInput>;
};

export type ShopifyMutationCartMetafieldDeleteArgs = {
  input: Shopify_CartMetafieldDeleteInput;
};

export type ShopifyMutationCartMetafieldsSetArgs = {
  metafields: Array<Shopify_CartMetafieldsSetInput>;
};

export type ShopifyMutationCartNoteUpdateArgs = {
  cartId: Scalars['ID']['input'];
  note: InputMaybe<Scalars['String']['input']>;
};

export type ShopifyMutationCartPaymentUpdateArgs = {
  cartId: Scalars['ID']['input'];
  payment: Shopify_CartPaymentInput;
};

export type ShopifyMutationCartSelectedDeliveryOptionsUpdateArgs = {
  cartId: Scalars['ID']['input'];
  selectedDeliveryOptions: Array<Shopify_CartSelectedDeliveryOptionInput>;
};

export type ShopifyMutationCartSubmitForCompletionArgs = {
  attemptToken: Scalars['String']['input'];
  cartId: Scalars['ID']['input'];
};

export type ShopifyMutationCheckoutAttributesUpdateV2Args = {
  checkoutId: Scalars['ID']['input'];
  input: Shopify_CheckoutAttributesUpdateV2Input;
};

export type ShopifyMutationCheckoutCompleteFreeArgs = {
  checkoutId: Scalars['ID']['input'];
};

export type ShopifyMutationCheckoutCompleteWithCreditCardV2Args = {
  checkoutId: Scalars['ID']['input'];
  payment: Shopify_CreditCardPaymentInputV2;
};

export type ShopifyMutationCheckoutCompleteWithTokenizedPaymentV3Args = {
  checkoutId: Scalars['ID']['input'];
  payment: Shopify_TokenizedPaymentInputV3;
};

export type ShopifyMutationCheckoutCreateArgs = {
  input: Shopify_CheckoutCreateInput;
  queueToken: InputMaybe<Scalars['String']['input']>;
};

export type ShopifyMutationCheckoutCustomerAssociateV2Args = {
  checkoutId: Scalars['ID']['input'];
  customerAccessToken: Scalars['String']['input'];
};

export type ShopifyMutationCheckoutCustomerDisassociateV2Args = {
  checkoutId: Scalars['ID']['input'];
};

export type ShopifyMutationCheckoutDiscountCodeApplyV2Args = {
  checkoutId: Scalars['ID']['input'];
  discountCode: Scalars['String']['input'];
};

export type ShopifyMutationCheckoutDiscountCodeRemoveArgs = {
  checkoutId: Scalars['ID']['input'];
};

export type ShopifyMutationCheckoutEmailUpdateV2Args = {
  checkoutId: Scalars['ID']['input'];
  email: Scalars['String']['input'];
};

export type ShopifyMutationCheckoutGiftCardRemoveV2Args = {
  appliedGiftCardId: Scalars['ID']['input'];
  checkoutId: Scalars['ID']['input'];
};

export type ShopifyMutationCheckoutGiftCardsAppendArgs = {
  checkoutId: Scalars['ID']['input'];
  giftCardCodes: Array<Scalars['String']['input']>;
};

export type ShopifyMutationCheckoutLineItemsAddArgs = {
  checkoutId: Scalars['ID']['input'];
  lineItems: Array<Shopify_CheckoutLineItemInput>;
};

export type ShopifyMutationCheckoutLineItemsRemoveArgs = {
  checkoutId: Scalars['ID']['input'];
  lineItemIds: Array<Scalars['ID']['input']>;
};

export type ShopifyMutationCheckoutLineItemsReplaceArgs = {
  checkoutId: Scalars['ID']['input'];
  lineItems: Array<Shopify_CheckoutLineItemInput>;
};

export type ShopifyMutationCheckoutLineItemsUpdateArgs = {
  checkoutId: Scalars['ID']['input'];
  lineItems: Array<Shopify_CheckoutLineItemUpdateInput>;
};

export type ShopifyMutationCheckoutShippingAddressUpdateV2Args = {
  checkoutId: Scalars['ID']['input'];
  shippingAddress: Shopify_MailingAddressInput;
};

export type ShopifyMutationCheckoutShippingLineUpdateArgs = {
  checkoutId: Scalars['ID']['input'];
  shippingRateHandle: Scalars['String']['input'];
};

export type ShopifyMutationCustomerAccessTokenCreateArgs = {
  input: Shopify_CustomerAccessTokenCreateInput;
};

export type ShopifyMutationCustomerAccessTokenCreateWithMultipassArgs = {
  multipassToken: Scalars['String']['input'];
};

export type ShopifyMutationCustomerAccessTokenDeleteArgs = {
  customerAccessToken: Scalars['String']['input'];
};

export type ShopifyMutationCustomerAccessTokenRenewArgs = {
  customerAccessToken: Scalars['String']['input'];
};

export type ShopifyMutationCustomerActivateArgs = {
  id: Scalars['ID']['input'];
  input: Shopify_CustomerActivateInput;
};

export type ShopifyMutationCustomerActivateByUrlArgs = {
  activationUrl: Scalars['shopify_URL']['input'];
  password: Scalars['String']['input'];
};

export type ShopifyMutationCustomerAddressCreateArgs = {
  address: Shopify_MailingAddressInput;
  customerAccessToken: Scalars['String']['input'];
};

export type ShopifyMutationCustomerAddressDeleteArgs = {
  customerAccessToken: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type ShopifyMutationCustomerAddressUpdateArgs = {
  address: Shopify_MailingAddressInput;
  customerAccessToken: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type ShopifyMutationCustomerCreateArgs = {
  input: Shopify_CustomerCreateInput;
};

export type ShopifyMutationCustomerDefaultAddressUpdateArgs = {
  addressId: Scalars['ID']['input'];
  customerAccessToken: Scalars['String']['input'];
};

export type ShopifyMutationCustomerRecoverArgs = {
  email: Scalars['String']['input'];
};

export type ShopifyMutationCustomerResetArgs = {
  id: Scalars['ID']['input'];
  input: Shopify_CustomerResetInput;
};

export type ShopifyMutationCustomerResetByUrlArgs = {
  password: Scalars['String']['input'];
  resetUrl: Scalars['shopify_URL']['input'];
};

export type ShopifyMutationCustomerUpdateArgs = {
  customer: Shopify_CustomerUpdateInput;
  customerAccessToken: Scalars['String']['input'];
};

export type ShopifyQueryRoot = {
  __typename?: 'shopifyQueryRoot';
  /** Fetch a specific Article by its ID. */
  article: Maybe<Shopify_Article>;
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
  /**
   * A poll for the status of the cart checkout completion and order creation.
   *
   */
  cartCompletionAttempt: Maybe<Shopify_CartCompletionAttemptResult>;
  /** Fetch a specific `Collection` by one of its unique attributes. */
  collection: Maybe<Shopify_Collection>;
  /** Find a collection by its handle. */
  collectionByHandle: Maybe<Shopify_Collection>;
  /** List of the shop’s collections. */
  collections: Shopify_CollectionConnection;
  /**
   * The customer associated with the given access token. Tokens are obtained by using the
   * [`customerAccessTokenCreate` mutation](https://shopify.dev/docs/api/storefront/latest/mutations/customerAccessTokenCreate).
   *
   */
  customer: Maybe<Shopify_Customer>;
  /** Returns the localized experiences configured for the shop. */
  localization: Shopify_Localization;
  /**
   * List of the shop's locations that support in-store pickup.
   *
   * When sorting by distance, you must specify a location via the `near` argument.
   *
   *
   */
  locations: Shopify_LocationConnection;
  /** Retrieve a [navigation menu](https://help.shopify.com/manual/online-store/menus-and-links) by its handle. */
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
  /** List of the predictive search results. */
  predictiveSearch: Maybe<Shopify_PredictiveSearchResult>;
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
  /** List of the shop’s products. For storefront search, use [`search` query](https://shopify.dev/docs/api/storefront/latest/queries/search). */
  products: Shopify_ProductConnection;
  /** The list of public Storefront API versions, including supported, release candidate and unstable versions. */
  publicApiVersions: Array<Shopify_ApiVersion>;
  /** List of the search results. */
  search: Shopify_SearchResultItemConnection;
  /** The shop associated with the storefront access token. */
  shop: Shopify_Shop;
  /** A list of redirects for a shop. */
  urlRedirects: Shopify_UrlRedirectConnection;
};

export type ShopifyQueryRootArticleArgs = {
  id: Scalars['ID']['input'];
};

export type ShopifyQueryRootArticlesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  query: InputMaybe<Scalars['String']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_ArticleSortKeys>;
};

export type ShopifyQueryRootBlogArgs = {
  handle: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['ID']['input']>;
};

export type ShopifyQueryRootBlogByHandleArgs = {
  handle: Scalars['String']['input'];
};

export type ShopifyQueryRootBlogsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  query: InputMaybe<Scalars['String']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_BlogSortKeys>;
};

export type ShopifyQueryRootCartArgs = {
  id: Scalars['ID']['input'];
};

export type ShopifyQueryRootCartCompletionAttemptArgs = {
  attemptId: Scalars['String']['input'];
};

export type ShopifyQueryRootCollectionArgs = {
  handle: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['ID']['input']>;
};

export type ShopifyQueryRootCollectionByHandleArgs = {
  handle: Scalars['String']['input'];
};

export type ShopifyQueryRootCollectionsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  query: InputMaybe<Scalars['String']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_CollectionSortKeys>;
};

export type ShopifyQueryRootCustomerArgs = {
  customerAccessToken: Scalars['String']['input'];
};

export type ShopifyQueryRootLocationsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  near: InputMaybe<Shopify_GeoCoordinateInput>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_LocationSortKeys>;
};

export type ShopifyQueryRootMenuArgs = {
  handle: Scalars['String']['input'];
};

export type ShopifyQueryRootMetaobjectArgs = {
  handle: InputMaybe<Shopify_MetaobjectHandleInput>;
  id: InputMaybe<Scalars['ID']['input']>;
};

export type ShopifyQueryRootMetaobjectsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};

export type ShopifyQueryRootNodeArgs = {
  id: Scalars['ID']['input'];
};

export type ShopifyQueryRootNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};

export type ShopifyQueryRootPageArgs = {
  handle: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['ID']['input']>;
};

export type ShopifyQueryRootPageByHandleArgs = {
  handle: Scalars['String']['input'];
};

export type ShopifyQueryRootPagesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  query: InputMaybe<Scalars['String']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_PageSortKeys>;
};

export type ShopifyQueryRootPredictiveSearchArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  limitScope: InputMaybe<Shopify_PredictiveSearchLimitScope>;
  query: Scalars['String']['input'];
  searchableFields: InputMaybe<Array<Shopify_SearchableField>>;
  types: InputMaybe<Array<Shopify_PredictiveSearchType>>;
  unavailableProducts: InputMaybe<Shopify_SearchUnavailableProductsType>;
};

export type ShopifyQueryRootProductArgs = {
  handle: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['ID']['input']>;
};

export type ShopifyQueryRootProductByHandleArgs = {
  handle: Scalars['String']['input'];
};

export type ShopifyQueryRootProductRecommendationsArgs = {
  intent?: InputMaybe<Shopify_ProductRecommendationIntent>;
  productId: Scalars['ID']['input'];
};

export type ShopifyQueryRootProductTagsArgs = {
  first: Scalars['Int']['input'];
};

export type ShopifyQueryRootProductTypesArgs = {
  first: Scalars['Int']['input'];
};

export type ShopifyQueryRootProductsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  query: InputMaybe<Scalars['String']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_ProductSortKeys>;
};

export type ShopifyQueryRootSearchArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  prefix: InputMaybe<Shopify_SearchPrefixQueryType>;
  productFilters: InputMaybe<Array<Shopify_ProductFilter>>;
  query: Scalars['String']['input'];
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_SearchSortKeys>;
  types: InputMaybe<Array<Shopify_SearchType>>;
  unavailableProducts: InputMaybe<Shopify_SearchUnavailableProductsType>;
};

export type ShopifyQueryRootUrlRedirectsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  query: InputMaybe<Scalars['String']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * A version of the API, as defined by [Shopify API versioning](https://shopify.dev/api/usage/versioning).
 * Versions are commonly referred to by their handle (for example, `2021-10`).
 *
 */
export type Shopify_ApiVersion = {
  __typename?: 'shopify_ApiVersion';
  /** The human-readable name of the version. */
  displayName: Scalars['String']['output'];
  /** The unique identifier of an ApiVersion. All supported API versions have a date-based (YYYY-MM) or `unstable` handle. */
  handle: Scalars['String']['output'];
  /** Whether the version is actively supported by Shopify. Supported API versions are guaranteed to be stable. Unsupported API versions include unstable, release candidate, and end-of-life versions that are marked as unsupported. For more information, refer to [Versioning](https://shopify.dev/api/usage/versioning). */
  supported: Scalars['Boolean']['output'];
};

/**
 * The input fields for submitting Apple Pay payment method information for checkout.
 *
 */
export type Shopify_ApplePayWalletContentInput = {
  /** The customer's billing address. */
  billingAddress: Shopify_MailingAddressInput;
  /** The data for the Apple Pay wallet. */
  data: Scalars['String']['input'];
  /** The header data for the Apple Pay wallet. */
  header: Shopify_ApplePayWalletHeaderInput;
  /** The last digits of the card used to create the payment. */
  lastDigits: InputMaybe<Scalars['String']['input']>;
  /** The signature for the Apple Pay wallet. */
  signature: Scalars['String']['input'];
  /** The version for the Apple Pay wallet. */
  version: Scalars['String']['input'];
};

/**
 * The input fields for submitting wallet payment method information for checkout.
 *
 */
export type Shopify_ApplePayWalletHeaderInput = {
  /** The application data for the Apple Pay wallet. */
  applicationData: InputMaybe<Scalars['String']['input']>;
  /** The ephemeral public key for the Apple Pay wallet. */
  ephemeralPublicKey: Scalars['String']['input'];
  /** The public key hash for the Apple Pay wallet. */
  publicKeyHash: Scalars['String']['input'];
  /** The transaction ID for the Apple Pay wallet. */
  transactionId: Scalars['String']['input'];
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
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The last characters of the gift card. */
  lastCharacters: Scalars['String']['output'];
  /** The amount that was applied to the checkout in its currency. */
  presentmentAmountUsed: Shopify_MoneyV2;
};

/** An article in an online store blog. */
export type Shopify_Article = Shopify_HasMetafields &
  Shopify_Node &
  Shopify_OnlineStorePublishable &
  Shopify_Trackable & {
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
    content: Scalars['String']['output'];
    /** The content of the article, complete with HTML formatting. */
    contentHtml: Scalars['shopify_HTML']['output'];
    /** Stripped excerpt of the article, single line with HTML tags removed. */
    excerpt: Maybe<Scalars['String']['output']>;
    /** The excerpt of the article, complete with HTML formatting. */
    excerptHtml: Maybe<Scalars['shopify_HTML']['output']>;
    /** A human-friendly unique string for the Article automatically generated from its title. */
    handle: Scalars['String']['output'];
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** The image associated with the article. */
    image: Maybe<Shopify_Image>;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
    onlineStoreUrl: Maybe<Scalars['shopify_URL']['output']>;
    /** The date and time when the article was published. */
    publishedAt: Scalars['shopify_DateTime']['output'];
    /** The article’s SEO information. */
    seo: Maybe<Shopify_Seo>;
    /**
     * A categorization that a article can be tagged with.
     *
     */
    tags: Array<Scalars['String']['output']>;
    /** The article’s name. */
    title: Scalars['String']['output'];
    /** A URL parameters to be added to a page URL when it is linked from a GraphQL result. This allows for tracking the origin of the traffic. */
    trackingParameters: Maybe<Scalars['String']['output']>;
  };

/** An article in an online store blog. */
export type Shopify_ArticleCommentsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An article in an online store blog. */
export type Shopify_ArticleContentArgs = {
  truncateAt: InputMaybe<Scalars['Int']['input']>;
};

/** An article in an online store blog. */
export type Shopify_ArticleExcerptArgs = {
  truncateAt: InputMaybe<Scalars['Int']['input']>;
};

/** An article in an online store blog. */
export type Shopify_ArticleMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/** An article in an online store blog. */
export type Shopify_ArticleMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** The author of an article. */
export type Shopify_ArticleAuthor = {
  __typename?: 'shopify_ArticleAuthor';
  /** The author's bio. */
  bio: Maybe<Scalars['String']['output']>;
  /** The author’s email. */
  email: Scalars['String']['output'];
  /** The author's first name. */
  firstName: Scalars['String']['output'];
  /** The author's last name. */
  lastName: Scalars['String']['output'];
  /** The author's full name. */
  name: Scalars['String']['output'];
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
  cursor: Scalars['String']['output'];
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
  key: Scalars['String']['output'];
  /** Value of the attribute. */
  value: Maybe<Scalars['String']['output']>;
};

/** The input fields for an attribute. */
export type Shopify_AttributeInput = {
  /** Key or name of the attribute. */
  key: Scalars['String']['input'];
  /** Value of the attribute. */
  value: Scalars['String']['input'];
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
    title: Scalars['String']['output'];
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
  ready: Scalars['Boolean']['output'];
  /** The fetched shipping rates. `null` until the `ready` field is `true`. */
  shippingRates: Maybe<Array<Shopify_ShippingRate>>;
};

/** Represents a cart line common fields. */
export type Shopify_BaseCartLine = {
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
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The merchandise that the buyer intends to purchase. */
  merchandise: Shopify_Merchandise;
  /** The quantity of the merchandise that the customer intends to purchase. */
  quantity: Scalars['Int']['output'];
  /** The selling plan associated with the cart line and the effect that each selling plan has on variants when they're purchased. */
  sellingPlanAllocation: Maybe<Shopify_SellingPlanAllocation>;
};

/** Represents a cart line common fields. */
export type Shopify_BaseCartLineAttributeArgs = {
  key: Scalars['String']['input'];
};

/**
 * An auto-generated type for paginating through multiple BaseCartLines.
 *
 */
export type Shopify_BaseCartLineConnection = {
  __typename?: 'shopify_BaseCartLineConnection';
  /** A list of edges. */
  edges: Array<Shopify_BaseCartLineEdge>;
  /** A list of the nodes contained in BaseCartLineEdge. */
  nodes: Array<Shopify_BaseCartLine>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
};

/**
 * An auto-generated type which holds one BaseCartLine and a cursor during pagination.
 *
 */
export type Shopify_BaseCartLineEdge = {
  __typename?: 'shopify_BaseCartLineEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of BaseCartLineEdge. */
  node: Shopify_BaseCartLine;
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
    handle: Scalars['String']['output'];
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
    onlineStoreUrl: Maybe<Scalars['shopify_URL']['output']>;
    /** The blog's SEO information. */
    seo: Maybe<Shopify_Seo>;
    /** The blogs’s title. */
    title: Scalars['String']['output'];
  };

/** An online store blog. */
export type Shopify_BlogArticleByHandleArgs = {
  handle: Scalars['String']['input'];
};

/** An online store blog. */
export type Shopify_BlogArticlesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  query: InputMaybe<Scalars['String']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_ArticleSortKeys>;
};

/** An online store blog. */
export type Shopify_BlogMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
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
  cursor: Scalars['String']['output'];
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
 * The store's [branding configuration](https://help.shopify.com/en/manual/promoting-marketing/managing-brand-assets).
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
  shortDescription: Maybe<Scalars['String']['output']>;
  /** The store's slogan. */
  slogan: Maybe<Scalars['String']['output']>;
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
  background: Maybe<Scalars['shopify_Color']['output']>;
  /** The foreground color. */
  foreground: Maybe<Scalars['shopify_Color']['output']>;
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
export type Shopify_Cart = Shopify_HasMetafields &
  Shopify_Node & {
    __typename?: 'shopify_Cart';
    /** An attribute associated with the cart. */
    attribute: Maybe<Shopify_Attribute>;
    /** The attributes associated with the cart. Attributes are represented as key-value pairs. */
    attributes: Array<Shopify_Attribute>;
    /** Information about the buyer that's interacting with the cart. */
    buyerIdentity: Shopify_CartBuyerIdentity;
    /** The URL of the checkout for the cart. */
    checkoutUrl: Scalars['shopify_URL']['output'];
    /** The estimated costs that the buyer will pay at checkout. The costs are subject to change and changes will be reflected at checkout. The `cost` field uses the `buyerIdentity` field to determine [international pricing](https://shopify.dev/custom-storefronts/internationalization/international-pricing). */
    cost: Shopify_CartCost;
    /** The date and time when the cart was created. */
    createdAt: Scalars['shopify_DateTime']['output'];
    /**
     * The delivery groups available for the cart, based on the buyer identity default
     * delivery address preference or the default address of the logged-in customer.
     *
     */
    deliveryGroups: Shopify_CartDeliveryGroupConnection;
    /** The discounts that have been applied to the entire cart. */
    discountAllocations: Array<Shopify_CartDiscountAllocation>;
    /** The case-insensitive discount codes that the customer added at checkout. */
    discountCodes: Array<Shopify_CartDiscountCode>;
    /** The estimated costs that the buyer will pay at checkout. The estimated costs are subject to change and changes will be reflected at checkout. The `estimatedCost` field uses the `buyerIdentity` field to determine [international pricing](https://shopify.dev/custom-storefronts/internationalization/international-pricing). */
    estimatedCost: Shopify_CartEstimatedCost;
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** A list of lines containing information about the items the customer intends to purchase. */
    lines: Shopify_BaseCartLineConnection;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** A note that's associated with the cart. For example, the note can be a personalized message to the buyer. */
    note: Maybe<Scalars['String']['output']>;
    /** The total number of items in the cart. */
    totalQuantity: Scalars['Int']['output'];
    /** The date and time when the cart was updated. */
    updatedAt: Scalars['shopify_DateTime']['output'];
  };

/**
 * A cart represents the merchandise that a buyer intends to purchase,
 * and the estimated cost associated with the cart. Learn how to
 * [interact with a cart](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
 * during a customer's session.
 *
 */
export type Shopify_CartAttributeArgs = {
  key: Scalars['String']['input'];
};

/**
 * A cart represents the merchandise that a buyer intends to purchase,
 * and the estimated cost associated with the cart. Learn how to
 * [interact with a cart](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
 * during a customer's session.
 *
 */
export type Shopify_CartDeliveryGroupsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * A cart represents the merchandise that a buyer intends to purchase,
 * and the estimated cost associated with the cart. Learn how to
 * [interact with a cart](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
 * during a customer's session.
 *
 */
export type Shopify_CartLinesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * A cart represents the merchandise that a buyer intends to purchase,
 * and the estimated cost associated with the cart. Learn how to
 * [interact with a cart](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
 * during a customer's session.
 *
 */
export type Shopify_CartMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/**
 * A cart represents the merchandise that a buyer intends to purchase,
 * and the estimated cost associated with the cart. Learn how to
 * [interact with a cart](https://shopify.dev/custom-storefronts/internationalization/international-pricing)
 * during a customer's session.
 *
 */
export type Shopify_CartMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
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
    title: Scalars['String']['output'];
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
  /** The email address of the buyer that's interacting with the cart. */
  email: Maybe<Scalars['String']['output']>;
  /** The phone number of the buyer that's interacting with the cart. */
  phone: Maybe<Scalars['String']['output']>;
  /**
   * A set of wallet preferences tied to the buyer that is interacting with the cart.
   * Preferences can be used to populate relevant payment fields in the checkout flow.
   *
   */
  walletPreferences: Array<Scalars['String']['output']>;
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
  customerAccessToken: InputMaybe<Scalars['String']['input']>;
  /**
   * An ordered set of delivery addresses tied to the buyer that is interacting with the cart.
   * The rank of the preferences is determined by the order of the addresses in the array. Preferences
   * can be used to populate relevant fields in the checkout flow.
   *
   * The input must not contain more than `250` values.
   */
  deliveryAddressPreferences: InputMaybe<Array<Shopify_DeliveryAddressInput>>;
  /** The email address of the buyer that is interacting with the cart. */
  email: InputMaybe<Scalars['String']['input']>;
  /** The phone number of the buyer that is interacting with the cart. */
  phone: InputMaybe<Scalars['String']['input']>;
  /**
   * A set of wallet preferences tied to the buyer that is interacting with the cart.
   * Preferences can be used to populate relevant payment fields in the checkout flow.
   *   Accepted value: `["shop_pay"]`.
   *
   * The input must not contain more than `250` values.
   */
  walletPreferences: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Return type for `cartBuyerIdentityUpdate` mutation. */
export type Shopify_CartBuyerIdentityUpdatePayload = {
  __typename?: 'shopify_CartBuyerIdentityUpdatePayload';
  /** The updated cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/**
 * Represents how credit card details are provided for a direct payment.
 *
 */
export enum Shopify_CartCardSource {
  /**
   * The credit card was provided by a third party and vaulted on their system.
   * Using this value requires a separate permission from Shopify.
   *
   */
  SavedCreditCard = 'SAVED_CREDIT_CARD',
}

/** The discount that has been applied to the cart line using a discount code. */
export type Shopify_CartCodeDiscountAllocation =
  Shopify_CartDiscountAllocation & {
    __typename?: 'shopify_CartCodeDiscountAllocation';
    /** The code used to apply the discount. */
    code: Scalars['String']['output'];
    /** The discounted amount that has been applied to the cart line. */
    discountedAmount: Shopify_MoneyV2;
  };

/** The completion action to checkout a cart. */
export type Shopify_CartCompletionAction = Shopify_CompletePaymentChallenge;

/** The required completion action to checkout a cart. */
export type Shopify_CartCompletionActionRequired = {
  __typename?: 'shopify_CartCompletionActionRequired';
  /** The action required to complete the cart completion attempt. */
  action: Maybe<Shopify_CartCompletionAction>;
  /** The ID of the cart completion attempt. */
  id: Scalars['String']['output'];
};

/** The result of a cart completion attempt. */
export type Shopify_CartCompletionAttemptResult =
  | Shopify_CartCompletionActionRequired
  | Shopify_CartCompletionFailed
  | Shopify_CartCompletionProcessing
  | Shopify_CartCompletionSuccess;

/** A failed completion to checkout a cart. */
export type Shopify_CartCompletionFailed = {
  __typename?: 'shopify_CartCompletionFailed';
  /** The errors that caused the checkout to fail. */
  errors: Array<Shopify_CompletionError>;
  /** The ID of the cart completion attempt. */
  id: Scalars['String']['output'];
};

/** A cart checkout completion that's still processing. */
export type Shopify_CartCompletionProcessing = {
  __typename?: 'shopify_CartCompletionProcessing';
  /** The ID of the cart completion attempt. */
  id: Scalars['String']['output'];
  /** The number of milliseconds to wait before polling again. */
  pollDelay: Scalars['Int']['output'];
};

/** A successful completion to checkout a cart and a created order. */
export type Shopify_CartCompletionSuccess = {
  __typename?: 'shopify_CartCompletionSuccess';
  /** The date and time when the job completed. */
  completedAt: Maybe<Scalars['shopify_DateTime']['output']>;
  /** The ID of the cart completion attempt. */
  id: Scalars['String']['output'];
  /** The ID of the order that's created in Shopify. */
  orderId: Scalars['ID']['output'];
  /** The URL of the order confirmation in Shopify. */
  orderUrl: Scalars['shopify_URL']['output'];
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
  subtotalAmountEstimated: Scalars['Boolean']['output'];
  /** The total amount for the customer to pay. */
  totalAmount: Shopify_MoneyV2;
  /** Whether the total amount is estimated. */
  totalAmountEstimated: Scalars['Boolean']['output'];
  /** The duty amount for the customer to pay at checkout. */
  totalDutyAmount: Maybe<Shopify_MoneyV2>;
  /** Whether the total duty amount is estimated. */
  totalDutyAmountEstimated: Scalars['Boolean']['output'];
  /** The tax amount for the customer to pay at checkout. */
  totalTaxAmount: Maybe<Shopify_MoneyV2>;
  /** Whether the total tax amount is estimated. */
  totalTaxAmountEstimated: Scalars['Boolean']['output'];
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
    title: Scalars['String']['output'];
  };

/** Information about the options available for one or more line items to be delivered to a specific address. */
export type Shopify_CartDeliveryGroup = {
  __typename?: 'shopify_CartDeliveryGroup';
  /** A list of cart lines for the delivery group. */
  cartLines: Shopify_BaseCartLineConnection;
  /** The destination address for the delivery group. */
  deliveryAddress: Shopify_MailingAddress;
  /** The delivery options available for the delivery group. */
  deliveryOptions: Array<Shopify_CartDeliveryOption>;
  /** The ID for the delivery group. */
  id: Scalars['ID']['output'];
  /** The selected delivery option for the delivery group. */
  selectedDeliveryOption: Maybe<Shopify_CartDeliveryOption>;
};

/** Information about the options available for one or more line items to be delivered to a specific address. */
export type Shopify_CartDeliveryGroupCartLinesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
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
  cursor: Scalars['String']['output'];
  /** The item at the end of CartDeliveryGroupEdge. */
  node: Shopify_CartDeliveryGroup;
};

/** Information about a delivery option. */
export type Shopify_CartDeliveryOption = {
  __typename?: 'shopify_CartDeliveryOption';
  /** The code of the delivery option. */
  code: Maybe<Scalars['String']['output']>;
  /** The method for the delivery option. */
  deliveryMethodType: Shopify_DeliveryMethodType;
  /** The description of the delivery option. */
  description: Maybe<Scalars['String']['output']>;
  /** The estimated cost for the delivery option. */
  estimatedCost: Shopify_MoneyV2;
  /** The unique identifier of the delivery option. */
  handle: Scalars['String']['output'];
  /** The title of the delivery option. */
  title: Maybe<Scalars['String']['output']>;
};

/**
 * The input fields for submitting direct payment method information for checkout.
 *
 */
export type Shopify_CartDirectPaymentMethodInput = {
  /** The customer's billing address. */
  billingAddress: Shopify_MailingAddressInput;
  /** The source of the credit card payment. */
  cardSource: InputMaybe<Shopify_CartCardSource>;
  /** The session ID for the direct payment method used to create the payment. */
  sessionId: Scalars['String']['input'];
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
  applicable: Scalars['Boolean']['output'];
  /** The code for the discount. */
  code: Scalars['String']['output'];
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
  /** Delivery group was not found in cart. */
  InvalidDeliveryGroup = 'INVALID_DELIVERY_GROUP',
  /** Delivery option was not valid. */
  InvalidDeliveryOption = 'INVALID_DELIVERY_OPTION',
  /** Merchandise line was not found in cart. */
  InvalidMerchandiseLine = 'INVALID_MERCHANDISE_LINE',
  /** The metafields were not valid. */
  InvalidMetafields = 'INVALID_METAFIELDS',
  /** The payment wasn't valid. */
  InvalidPayment = 'INVALID_PAYMENT',
  /** Cannot update payment on an empty cart */
  InvalidPaymentEmptyCart = 'INVALID_PAYMENT_EMPTY_CART',
  /** The input value should be less than the maximum value allowed. */
  LessThan = 'LESS_THAN',
  /** Missing discount code. */
  MissingDiscountCode = 'MISSING_DISCOUNT_CODE',
  /** Missing note. */
  MissingNote = 'MISSING_NOTE',
  /** The payment method is not supported. */
  PaymentMethodNotSupported = 'PAYMENT_METHOD_NOT_SUPPORTED',
}

/** The estimated costs that the buyer will pay at checkout. The estimated cost uses [`CartBuyerIdentity`](https://shopify.dev/api/storefront/reference/cart/cartbuyeridentity) to determine [international pricing](https://shopify.dev/custom-storefronts/internationalization/international-pricing). */
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

/**
 * The input fields for submitting a billing address without a selected payment method.
 *
 */
export type Shopify_CartFreePaymentMethodInput = {
  /** The customer's billing address. */
  billingAddress: Shopify_MailingAddressInput;
};

/** The input fields to create a cart. */
export type Shopify_CartInput = {
  /**
   * An array of key-value pairs that contains additional information about the cart.
   *
   * The input must not contain more than `250` values.
   */
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
   * The input must not contain more than `250` values.
   */
  discountCodes: InputMaybe<Array<Scalars['String']['input']>>;
  /**
   * A list of merchandise lines to add to the cart.
   *
   * The input must not contain more than `250` values.
   */
  lines: InputMaybe<Array<Shopify_CartLineInput>>;
  /**
   * The metafields to associate with this cart.
   *
   * The input must not contain more than `250` values.
   */
  metafields: InputMaybe<Array<Shopify_CartInputMetafieldInput>>;
  /**
   * A note that's associated with the cart. For example, the note can be a personalized message to the buyer.
   *
   */
  note: InputMaybe<Scalars['String']['input']>;
};

/** The input fields for a cart metafield value to set. */
export type Shopify_CartInputMetafieldInput = {
  /** The key name of the metafield. */
  key: Scalars['String']['input'];
  /**
   * The type of data that the cart metafield stores.
   * The type of data must be a [supported type](https://shopify.dev/apps/metafields/types).
   *
   */
  type: Scalars['String']['input'];
  /**
   * The data to store in the cart metafield. The data is always stored as a string, regardless of the metafield's type.
   *
   */
  value: Scalars['String']['input'];
};

/** Represents information about the merchandise in the cart. */
export type Shopify_CartLine = Shopify_BaseCartLine &
  Shopify_Node & {
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
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** The merchandise that the buyer intends to purchase. */
    merchandise: Shopify_Merchandise;
    /** The quantity of the merchandise that the customer intends to purchase. */
    quantity: Scalars['Int']['output'];
    /** The selling plan associated with the cart line and the effect that each selling plan has on variants when they're purchased. */
    sellingPlanAllocation: Maybe<Shopify_SellingPlanAllocation>;
  };

/** Represents information about the merchandise in the cart. */
export type Shopify_CartLineAttributeArgs = {
  key: Scalars['String']['input'];
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
 * The estimated cost of the merchandise line that the buyer will pay at checkout.
 *
 */
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

/** The input fields to create a merchandise line on a cart. */
export type Shopify_CartLineInput = {
  /**
   * An array of key-value pairs that contains additional information about the merchandise line.
   *
   * The input must not contain more than `250` values.
   */
  attributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The ID of the merchandise that the buyer intends to purchase. */
  merchandiseId: Scalars['ID']['input'];
  /** The quantity of the merchandise. */
  quantity: InputMaybe<Scalars['Int']['input']>;
  /** The ID of the selling plan that the merchandise is being purchased with. */
  sellingPlanId: InputMaybe<Scalars['ID']['input']>;
};

/** The input fields to update a line item on a cart. */
export type Shopify_CartLineUpdateInput = {
  /**
   * An array of key-value pairs that contains additional information about the merchandise line.
   *
   * The input must not contain more than `250` values.
   */
  attributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The ID of the merchandise line. */
  id: Scalars['ID']['input'];
  /** The ID of the merchandise for the line item. */
  merchandiseId: InputMaybe<Scalars['ID']['input']>;
  /** The quantity of the line item. */
  quantity: InputMaybe<Scalars['Int']['input']>;
  /** The ID of the selling plan that the merchandise is being purchased with. */
  sellingPlanId: InputMaybe<Scalars['ID']['input']>;
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

/** The input fields to delete a cart metafield. */
export type Shopify_CartMetafieldDeleteInput = {
  /**
   * The key name of the cart metafield. Can either be a composite key (`namespace.key`) or a simple key
   *  that relies on the default app-reserved namespace.
   *
   */
  key: Scalars['String']['input'];
  /** The ID of the cart resource. */
  ownerId: Scalars['ID']['input'];
};

/** Return type for `cartMetafieldDelete` mutation. */
export type Shopify_CartMetafieldDeletePayload = {
  __typename?: 'shopify_CartMetafieldDeletePayload';
  /** The ID of the deleted cart metafield. */
  deletedId: Maybe<Scalars['ID']['output']>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_MetafieldDeleteUserError>;
};

/** The input fields for a cart metafield value to set. */
export type Shopify_CartMetafieldsSetInput = {
  /** The key name of the cart metafield. */
  key: Scalars['String']['input'];
  /** The ID of the cart resource. */
  ownerId: Scalars['ID']['input'];
  /**
   * The type of data that the cart metafield stores.
   * The type of data must be a [supported type](https://shopify.dev/apps/metafields/types).
   *
   */
  type: Scalars['String']['input'];
  /**
   * The data to store in the cart metafield. The data is always stored as a string, regardless of the metafield's type.
   *
   */
  value: Scalars['String']['input'];
};

/** Return type for `cartMetafieldsSet` mutation. */
export type Shopify_CartMetafieldsSetPayload = {
  __typename?: 'shopify_CartMetafieldsSetPayload';
  /** The list of cart metafields that were set. */
  metafields: Maybe<Array<Shopify_Metafield>>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_MetafieldsSetUserError>;
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
 * The input fields for updating the payment method that will be used to checkout.
 *
 */
export type Shopify_CartPaymentInput = {
  /** The amount that the customer will be charged at checkout. */
  amount: Shopify_MoneyInput;
  /**
   * The input fields to use when checking out a cart with a direct payment method (like a credit card).
   *
   */
  directPaymentMethod: InputMaybe<Shopify_CartDirectPaymentMethodInput>;
  /**
   * The input fields to use to checkout a cart without providing a payment method.
   * Use this payment method input if the total cost of the cart is 0.
   *
   */
  freePaymentMethod: InputMaybe<Shopify_CartFreePaymentMethodInput>;
  /**
   * An ID of the order placed on the originating platform.
   * Note that this value doesn't correspond to the Shopify Order ID.
   *
   */
  sourceIdentifier: InputMaybe<Scalars['String']['input']>;
  /**
   * The input fields to use when checking out a cart with a wallet payment method (like Shop Pay or Apple Pay).
   *
   */
  walletPaymentMethod: InputMaybe<Shopify_CartWalletPaymentMethodInput>;
};

/** Return type for `cartPaymentUpdate` mutation. */
export type Shopify_CartPaymentUpdatePayload = {
  __typename?: 'shopify_CartPaymentUpdatePayload';
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
  deliveryGroupId: Scalars['ID']['input'];
  /** The handle of the selected delivery option. */
  deliveryOptionHandle: Scalars['String']['input'];
};

/** Return type for `cartSelectedDeliveryOptionsUpdate` mutation. */
export type Shopify_CartSelectedDeliveryOptionsUpdatePayload = {
  __typename?: 'shopify_CartSelectedDeliveryOptionsUpdatePayload';
  /** The updated cart. */
  cart: Maybe<Shopify_Cart>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/** Return type for `cartSubmitForCompletion` mutation. */
export type Shopify_CartSubmitForCompletionPayload = {
  __typename?: 'shopify_CartSubmitForCompletionPayload';
  /** The result of cart submission for completion. */
  result: Maybe<Shopify_CartSubmitForCompletionResult>;
  /** The list of errors that occurred from executing the mutation. */
  userErrors: Array<Shopify_CartUserError>;
};

/** The result of cart submit completion. */
export type Shopify_CartSubmitForCompletionResult =
  | Shopify_SubmitAlreadyAccepted
  | Shopify_SubmitFailed
  | Shopify_SubmitSuccess
  | Shopify_SubmitThrottled;

/** Represents an error that happens during execution of a cart mutation. */
export type Shopify_CartUserError = Shopify_DisplayableError & {
  __typename?: 'shopify_CartUserError';
  /** The error code. */
  code: Maybe<Shopify_CartErrorCode>;
  /** The path to the input field that caused the error. */
  field: Maybe<Array<Scalars['String']['output']>>;
  /** The error message. */
  message: Scalars['String']['output'];
};

/**
 * The input fields for submitting wallet payment method information for checkout.
 *
 */
export type Shopify_CartWalletPaymentMethodInput = {
  /** The payment method information for the Apple Pay wallet. */
  applePayWalletContent: InputMaybe<Shopify_ApplePayWalletContentInput>;
  /** The payment method information for the Shop Pay wallet. */
  shopPayWalletContent: InputMaybe<Shopify_ShopPayWalletContentInput>;
};

/**
 * A container for all the information required to checkout items and pay.
 *
 * The Storefront GraphQL Checkout API is deprecated and will be removed in a future version. Please see https://shopify.dev/changelog/deprecation-of-checkout-apis for more information.
 *
 */
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
  completedAt: Maybe<Scalars['shopify_DateTime']['output']>;
  /** The date and time when the checkout was created. */
  createdAt: Scalars['shopify_DateTime']['output'];
  /** The currency code for the checkout. */
  currencyCode: Shopify_CurrencyCode;
  /** A list of extra information that's added to the checkout. */
  customAttributes: Array<Shopify_Attribute>;
  /** Discounts that have been applied on the checkout. */
  discountApplications: Shopify_DiscountApplicationConnection;
  /** The email attached to this checkout. */
  email: Maybe<Scalars['String']['output']>;
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** A list of line item objects, each one containing information about an item in the checkout. */
  lineItems: Shopify_CheckoutLineItemConnection;
  /** The sum of all the prices of all the items in the checkout. Duties, taxes, shipping and discounts excluded. */
  lineItemsSubtotalPrice: Shopify_MoneyV2;
  /** The note associated with the checkout. */
  note: Maybe<Scalars['String']['output']>;
  /** The resulting order from a paid checkout. */
  order: Maybe<Shopify_Order>;
  /** The <b>Order status</b> page for this Checkout, null when checkout isn't completed. */
  orderStatusUrl: Maybe<Scalars['shopify_URL']['output']>;
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
  ready: Scalars['Boolean']['output'];
  /** States whether or not the fulfillment requires shipping. */
  requiresShipping: Scalars['Boolean']['output'];
  /** The shipping address to where the line items will be shipped. */
  shippingAddress: Maybe<Shopify_MailingAddress>;
  /**
   * The discounts that have been allocated onto the shipping line by discount applications.
   *
   */
  shippingDiscountAllocations: Array<Shopify_DiscountAllocation>;
  /** Once a shipping rate is selected by the customer it's transitioned to a `shipping_line` object. */
  shippingLine: Maybe<Shopify_ShippingRate>;
  /** The price at checkout before shipping and taxes. */
  subtotalPrice: Shopify_MoneyV2;
  /** The price at checkout before duties, shipping, and taxes. */
  subtotalPriceV2: Shopify_MoneyV2;
  /** Whether the checkout is tax exempt. */
  taxExempt: Scalars['Boolean']['output'];
  /** Whether taxes are included in the line item and shipping line prices. */
  taxesIncluded: Scalars['Boolean']['output'];
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
  updatedAt: Scalars['shopify_DateTime']['output'];
  /** The url pointing to the checkout accessible from the web. */
  webUrl: Scalars['shopify_URL']['output'];
};

/**
 * A container for all the information required to checkout items and pay.
 *
 * The Storefront GraphQL Checkout API is deprecated and will be removed in a future version. Please see https://shopify.dev/changelog/deprecation-of-checkout-apis for more information.
 *
 */
export type Shopify_CheckoutDiscountApplicationsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * A container for all the information required to checkout items and pay.
 *
 * The Storefront GraphQL Checkout API is deprecated and will be removed in a future version. Please see https://shopify.dev/changelog/deprecation-of-checkout-apis for more information.
 *
 */
export type Shopify_CheckoutLineItemsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/** The input fields required to update a checkout's attributes. */
export type Shopify_CheckoutAttributesUpdateV2Input = {
  /**
   * Allows setting partial addresses on a Checkout, skipping the full validation of attributes.
   * The required attributes are city, province, and country.
   * Full validation of the addresses is still done at completion time. Defaults to `false` with
   * each operation.
   *
   */
  allowPartialAddresses: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * A list of extra information that's added to the checkout.
   *
   * The input must not contain more than `250` values.
   */
  customAttributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The text of an optional note that a shop owner can attach to the checkout. */
  note: InputMaybe<Scalars['String']['input']>;
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

/** The input fields for the identity of the customer associated with the checkout. */
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

/** The input fields required to create a checkout. */
export type Shopify_CheckoutCreateInput = {
  /**
   * Allows setting partial addresses on a Checkout, skipping the full validation of attributes.
   * The required attributes are city, province, and country.
   * Full validation of addresses is still done at completion time. Defaults to `null`.
   *
   */
  allowPartialAddresses: InputMaybe<Scalars['Boolean']['input']>;
  /** The identity of the customer associated with the checkout. */
  buyerIdentity: InputMaybe<Shopify_CheckoutBuyerIdentityInput>;
  /**
   * A list of extra information that's added to the checkout.
   *
   * The input must not contain more than `250` values.
   */
  customAttributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The email with which the customer wants to checkout. */
  email: InputMaybe<Scalars['String']['input']>;
  /**
   * A list of line item objects, each one containing information about an item in the checkout.
   *
   * The input must not contain more than `250` values.
   */
  lineItems: InputMaybe<Array<Shopify_CheckoutLineItemInput>>;
  /** The text of an optional note that a shop owner can attach to the checkout. */
  note: InputMaybe<Scalars['String']['input']>;
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
  queueToken: Maybe<Scalars['String']['output']>;
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
  /** Product is not published for this customer. */
  ProductNotAvailable = 'PRODUCT_NOT_AVAILABLE',
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
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The quantity of the line item. */
  quantity: Scalars['Int']['output'];
  /** Title of the line item. Defaults to the product's title. */
  title: Scalars['String']['output'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of CheckoutLineItemEdge. */
  node: Shopify_CheckoutLineItem;
};

/** The input fields to create a line item on a checkout. */
export type Shopify_CheckoutLineItemInput = {
  /**
   * Extra information in the form of an array of Key-Value pairs about the line item.
   *
   * The input must not contain more than `250` values.
   */
  customAttributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The quantity of the line item. */
  quantity: Scalars['Int']['input'];
  /** The ID of the product variant for the line item. */
  variantId: Scalars['ID']['input'];
};

/** The input fields to update a line item on the checkout. */
export type Shopify_CheckoutLineItemUpdateInput = {
  /**
   * Extra information in the form of an array of Key-Value pairs about the line item.
   *
   * The input must not contain more than `250` values.
   */
  customAttributes: InputMaybe<Array<Shopify_AttributeInput>>;
  /** The ID of the line item. */
  id: InputMaybe<Scalars['ID']['input']>;
  /** The quantity of the line item. */
  quantity: InputMaybe<Scalars['Int']['input']>;
  /** The variant ID of the line item. */
  variantId: InputMaybe<Scalars['ID']['input']>;
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
  field: Maybe<Array<Scalars['String']['output']>>;
  /** The error message. */
  message: Scalars['String']['output'];
};

/**
 * A collection represents a grouping of products that a shop owner can create to
 * organize them or make their shops easier to browse.
 *
 */
export type Shopify_Collection = Shopify_HasMetafields &
  Shopify_Node &
  Shopify_OnlineStorePublishable &
  Shopify_Trackable & {
    __typename?: 'shopify_Collection';
    /** Stripped description of the collection, single line with HTML tags removed. */
    description: Scalars['String']['output'];
    /** The description of the collection, complete with HTML formatting. */
    descriptionHtml: Scalars['shopify_HTML']['output'];
    /**
     * A human-friendly unique string for the collection automatically generated from its title.
     * Limit of 255 characters.
     *
     */
    handle: Scalars['String']['output'];
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** Image associated with the collection. */
    image: Maybe<Shopify_Image>;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
    onlineStoreUrl: Maybe<Scalars['shopify_URL']['output']>;
    /** List of products in the collection. */
    products: Shopify_ProductConnection;
    /** The collection's SEO information. */
    seo: Shopify_Seo;
    /** The collection’s name. Limit of 255 characters. */
    title: Scalars['String']['output'];
    /** A URL parameters to be added to a page URL when it is linked from a GraphQL result. This allows for tracking the origin of the traffic. */
    trackingParameters: Maybe<Scalars['String']['output']>;
    /** The date and time when the collection was last modified. */
    updatedAt: Scalars['shopify_DateTime']['output'];
  };

/**
 * A collection represents a grouping of products that a shop owner can create to
 * organize them or make their shops easier to browse.
 *
 */
export type Shopify_CollectionDescriptionArgs = {
  truncateAt: InputMaybe<Scalars['Int']['input']>;
};

/**
 * A collection represents a grouping of products that a shop owner can create to
 * organize them or make their shops easier to browse.
 *
 */
export type Shopify_CollectionMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/**
 * A collection represents a grouping of products that a shop owner can create to
 * organize them or make their shops easier to browse.
 *
 */
export type Shopify_CollectionMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/**
 * A collection represents a grouping of products that a shop owner can create to
 * organize them or make their shops easier to browse.
 *
 */
export type Shopify_CollectionProductsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  filters: InputMaybe<Array<Shopify_ProductFilter>>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
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
  /** The total count of Collections. */
  totalCount: Scalars['shopify_UnsignedInt64']['output'];
};

/**
 * An auto-generated type which holds one Collection and a cursor during pagination.
 *
 */
export type Shopify_CollectionEdge = {
  __typename?: 'shopify_CollectionEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
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
  content: Scalars['String']['output'];
  /** The content of the comment, complete with HTML formatting. */
  contentHtml: Scalars['shopify_HTML']['output'];
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
};

/** A comment on an article. */
export type Shopify_CommentContentArgs = {
  truncateAt: InputMaybe<Scalars['Int']['input']>;
};

/** The author of a comment. */
export type Shopify_CommentAuthor = {
  __typename?: 'shopify_CommentAuthor';
  /** The author's email. */
  email: Scalars['String']['output'];
  /** The author’s name. */
  name: Scalars['String']['output'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of CommentEdge. */
  node: Shopify_Comment;
};

/** The action for the 3DS payment redirect. */
export type Shopify_CompletePaymentChallenge = {
  __typename?: 'shopify_CompletePaymentChallenge';
  /** The URL for the 3DS payment redirect. */
  redirectUrl: Maybe<Scalars['shopify_URL']['output']>;
};

/** An error that occurred during a cart completion attempt. */
export type Shopify_CompletionError = {
  __typename?: 'shopify_CompletionError';
  /** The error code. */
  code: Shopify_CompletionErrorCode;
  /** The error message. */
  message: Maybe<Scalars['String']['output']>;
};

/** The code of the error that occurred during a cart completion attempt. */
export enum Shopify_CompletionErrorCode {
  Error = 'ERROR',
  InventoryReservationError = 'INVENTORY_RESERVATION_ERROR',
  PaymentAmountTooSmall = 'PAYMENT_AMOUNT_TOO_SMALL',
  PaymentCallIssuer = 'PAYMENT_CALL_ISSUER',
  PaymentCardDeclined = 'PAYMENT_CARD_DECLINED',
  PaymentError = 'PAYMENT_ERROR',
  PaymentGatewayNotEnabledError = 'PAYMENT_GATEWAY_NOT_ENABLED_ERROR',
  PaymentInsufficientFunds = 'PAYMENT_INSUFFICIENT_FUNDS',
  PaymentInvalidBillingAddress = 'PAYMENT_INVALID_BILLING_ADDRESS',
  PaymentInvalidCreditCard = 'PAYMENT_INVALID_CREDIT_CARD',
  PaymentInvalidCurrency = 'PAYMENT_INVALID_CURRENCY',
  PaymentInvalidPaymentMethod = 'PAYMENT_INVALID_PAYMENT_METHOD',
  PaymentTransientError = 'PAYMENT_TRANSIENT_ERROR',
}

/** Represents information about the grouped merchandise in the cart. */
export type Shopify_ComponentizableCartLine = Shopify_BaseCartLine &
  Shopify_Node & {
    __typename?: 'shopify_ComponentizableCartLine';
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
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** The components of the line item. */
    lineComponents: Array<Shopify_CartLine>;
    /** The merchandise that the buyer intends to purchase. */
    merchandise: Shopify_Merchandise;
    /** The quantity of the merchandise that the customer intends to purchase. */
    quantity: Scalars['Int']['output'];
    /** The selling plan associated with the cart line and the effect that each selling plan has on variants when they're purchased. */
    sellingPlanAllocation: Maybe<Shopify_SellingPlanAllocation>;
  };

/** Represents information about the grouped merchandise in the cart. */
export type Shopify_ComponentizableCartLineAttributeArgs = {
  key: Scalars['String']['input'];
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
  /** The market that includes this country. */
  market: Maybe<Shopify_Market>;
  /** The name of the country. */
  name: Scalars['String']['output'];
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
  /** Türkiye. */
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
  brand: Maybe<Scalars['String']['output']>;
  /** The expiry month of the credit card. */
  expiryMonth: Maybe<Scalars['Int']['output']>;
  /** The expiry year of the credit card. */
  expiryYear: Maybe<Scalars['Int']['output']>;
  /** The credit card's BIN number. */
  firstDigits: Maybe<Scalars['String']['output']>;
  /** The first name of the card holder. */
  firstName: Maybe<Scalars['String']['output']>;
  /** The last 4 digits of the credit card. */
  lastDigits: Maybe<Scalars['String']['output']>;
  /** The last name of the card holder. */
  lastName: Maybe<Scalars['String']['output']>;
  /** The masked credit card number with only the last 4 digits displayed. */
  maskedNumber: Maybe<Scalars['String']['output']>;
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
  idempotencyKey: Scalars['String']['input'];
  /** The amount and currency of the payment. */
  paymentAmount: Shopify_MoneyInput;
  /** Executes the payment in test mode if possible. Defaults to `false`. */
  test: InputMaybe<Scalars['Boolean']['input']>;
  /** The ID returned by Shopify's Card Vault. */
  vaultId: Scalars['String']['input'];
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
  name: Scalars['String']['output'];
  /** The symbol of the currency. */
  symbol: Scalars['String']['output'];
};

/**
 * The three-letter currency codes that represent the world currencies used in
 * stores. These include standard ISO 4217 codes, legacy codes,
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
  /** Venezuelan Bolivares Soberanos (VES). */
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
  acceptsMarketing: Scalars['Boolean']['output'];
  /** A list of addresses for the customer. */
  addresses: Shopify_MailingAddressConnection;
  /** The date and time when the customer was created. */
  createdAt: Scalars['shopify_DateTime']['output'];
  /** The customer’s default address. */
  defaultAddress: Maybe<Shopify_MailingAddress>;
  /** The customer’s name, email or phone number. */
  displayName: Scalars['String']['output'];
  /** The customer’s email address. */
  email: Maybe<Scalars['String']['output']>;
  /** The customer’s first name. */
  firstName: Maybe<Scalars['String']['output']>;
  /** A unique ID for the customer. */
  id: Scalars['ID']['output'];
  /** The customer's most recently updated, incomplete checkout. */
  lastIncompleteCheckout: Maybe<Shopify_Checkout>;
  /** The customer’s last name. */
  lastName: Maybe<Scalars['String']['output']>;
  /** Returns a metafield found by namespace and key. */
  metafield: Maybe<Shopify_Metafield>;
  /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
  metafields: Array<Maybe<Shopify_Metafield>>;
  /** The number of orders that the customer has made at the store in their lifetime. */
  numberOfOrders: Scalars['shopify_UnsignedInt64']['output'];
  /** The orders associated with the customer. */
  orders: Shopify_OrderConnection;
  /** The customer’s phone number. */
  phone: Maybe<Scalars['String']['output']>;
  /**
   * A comma separated list of tags that have been added to the customer.
   * Additional access scope required: unauthenticated_read_customer_tags.
   *
   */
  tags: Array<Scalars['String']['output']>;
  /** The date and time when the customer information was updated. */
  updatedAt: Scalars['shopify_DateTime']['output'];
};

/** A customer represents a customer account with the shop. Customer accounts store contact information for the customer, saving logged-in customers the trouble of having to provide it at every checkout. */
export type Shopify_CustomerAddressesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A customer represents a customer account with the shop. Customer accounts store contact information for the customer, saving logged-in customers the trouble of having to provide it at every checkout. */
export type Shopify_CustomerMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/** A customer represents a customer account with the shop. Customer accounts store contact information for the customer, saving logged-in customers the trouble of having to provide it at every checkout. */
export type Shopify_CustomerMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** A customer represents a customer account with the shop. Customer accounts store contact information for the customer, saving logged-in customers the trouble of having to provide it at every checkout. */
export type Shopify_CustomerOrdersArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  query: InputMaybe<Scalars['String']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_OrderSortKeys>;
};

/** A CustomerAccessToken represents the unique token required to make modifications to the customer object. */
export type Shopify_CustomerAccessToken = {
  __typename?: 'shopify_CustomerAccessToken';
  /** The customer’s access token. */
  accessToken: Scalars['String']['output'];
  /** The date and time when the customer access token expires. */
  expiresAt: Scalars['shopify_DateTime']['output'];
};

/** The input fields required to create a customer access token. */
export type Shopify_CustomerAccessTokenCreateInput = {
  /** The email associated to the customer. */
  email: Scalars['String']['input'];
  /** The login password to be used by the customer. */
  password: Scalars['String']['input'];
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
  deletedAccessToken: Maybe<Scalars['String']['output']>;
  /** ID of the destroyed customer access token. */
  deletedCustomerAccessTokenId: Maybe<Scalars['String']['output']>;
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

/** The input fields to activate a customer. */
export type Shopify_CustomerActivateInput = {
  /** The activation token required to activate the customer. */
  activationToken: Scalars['String']['input'];
  /** New password that will be set during activation. */
  password: Scalars['String']['input'];
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
  deletedCustomerAddressId: Maybe<Scalars['String']['output']>;
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

/** The input fields to create a new customer. */
export type Shopify_CustomerCreateInput = {
  /** Indicates whether the customer has consented to be sent marketing material via email. */
  acceptsMarketing: InputMaybe<Scalars['Boolean']['input']>;
  /** The customer’s email. */
  email: Scalars['String']['input'];
  /** The customer’s first name. */
  firstName: InputMaybe<Scalars['String']['input']>;
  /** The customer’s last name. */
  lastName: InputMaybe<Scalars['String']['input']>;
  /** The login password used by the customer. */
  password: Scalars['String']['input'];
  /**
   * A unique phone number for the customer.
   *
   * Formatted using E.164 standard. For example, _+16135551111_.
   *
   */
  phone: InputMaybe<Scalars['String']['input']>;
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

/** The input fields to reset a customer's password. */
export type Shopify_CustomerResetInput = {
  /** New password that will be set as part of the reset password process. */
  password: Scalars['String']['input'];
  /** The reset token required to reset the customer’s password. */
  resetToken: Scalars['String']['input'];
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

/** The input fields to update the Customer information. */
export type Shopify_CustomerUpdateInput = {
  /** Indicates whether the customer has consented to be sent marketing material via email. */
  acceptsMarketing: InputMaybe<Scalars['Boolean']['input']>;
  /** The customer’s email. */
  email: InputMaybe<Scalars['String']['input']>;
  /** The customer’s first name. */
  firstName: InputMaybe<Scalars['String']['input']>;
  /** The customer’s last name. */
  lastName: InputMaybe<Scalars['String']['input']>;
  /** The login password used by the customer. */
  password: InputMaybe<Scalars['String']['input']>;
  /**
   * A unique phone number for the customer.
   *
   * Formatted using E.164 standard. For example, _+16135551111_. To remove the phone number, specify `null`.
   *
   */
  phone: InputMaybe<Scalars['String']['input']>;
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
  field: Maybe<Array<Scalars['String']['output']>>;
  /** The error message. */
  message: Scalars['String']['output'];
};

/** A delivery address of the buyer that is interacting with the cart. */
export type Shopify_DeliveryAddress = Shopify_MailingAddress;

/**
 * The input fields for delivery address preferences.
 *
 */
export type Shopify_DeliveryAddressInput = {
  /**
   * The ID of a customer address that is associated with the buyer that is interacting with the cart.
   *
   */
  customerAddressId: InputMaybe<Scalars['ID']['input']>;
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
  cursor: Scalars['String']['output'];
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
  applicable: Scalars['Boolean']['output'];
  /** The string identifying the discount code that was used at the time of application. */
  code: Scalars['String']['output'];
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
  field: Maybe<Array<Scalars['String']['output']>>;
  /** The error message. */
  message: Scalars['String']['output'];
};

/** Represents a web address. */
export type Shopify_Domain = {
  __typename?: 'shopify_Domain';
  /** The host name of the domain (eg: `example.com`). */
  host: Scalars['String']['output'];
  /** Whether SSL is enabled or not. */
  sslEnabled: Scalars['Boolean']['output'];
  /** The URL of the domain (eg: `https://example.com`). */
  url: Scalars['shopify_URL']['output'];
};

/** Represents a video hosted outside of Shopify. */
export type Shopify_ExternalVideo = Shopify_Media &
  Shopify_Node & {
    __typename?: 'shopify_ExternalVideo';
    /** A word or phrase to share the nature or contents of a media. */
    alt: Maybe<Scalars['String']['output']>;
    /** The embed URL of the video for the respective host. */
    embedUrl: Scalars['shopify_URL']['output'];
    /** The URL. */
    embeddedUrl: Scalars['shopify_URL']['output'];
    /** The host of the external video. */
    host: Shopify_MediaHost;
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** The media content type. */
    mediaContentType: Shopify_MediaContentType;
    /** The origin URL of the video on the respective host. */
    originUrl: Scalars['shopify_URL']['output'];
    /** The presentation for a media. */
    presentation: Maybe<Shopify_MediaPresentation>;
    /** The preview image for the media. */
    previewImage: Maybe<Shopify_Image>;
  };

/** A filter that is supported on the parent field. */
export type Shopify_Filter = {
  __typename?: 'shopify_Filter';
  /** A unique identifier. */
  id: Scalars['String']['output'];
  /** A human-friendly string for this filter. */
  label: Scalars['String']['output'];
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
  count: Scalars['Int']['output'];
  /** A unique identifier. */
  id: Scalars['String']['output'];
  /**
   * An input object that can be used to filter by this value on the parent field.
   *
   * The value is provided as a helper for building dynamic filtering UI. For
   * example, if you have a list of selected `FilterValue` objects, you can combine
   * their respective `input` values to use in a subsequent query.
   *
   */
  input: Scalars['shopify_JSON']['output'];
  /** A human-friendly string for this filter value. */
  label: Scalars['String']['output'];
};

/** Represents a single fulfillment in an order. */
export type Shopify_Fulfillment = {
  __typename?: 'shopify_Fulfillment';
  /** List of the fulfillment's line items. */
  fulfillmentLineItems: Shopify_FulfillmentLineItemConnection;
  /** The name of the tracking company. */
  trackingCompany: Maybe<Scalars['String']['output']>;
  /**
   * Tracking information associated with the fulfillment,
   * such as the tracking number and tracking URL.
   *
   */
  trackingInfo: Array<Shopify_FulfillmentTrackingInfo>;
};

/** Represents a single fulfillment in an order. */
export type Shopify_FulfillmentFulfillmentLineItemsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Represents a single fulfillment in an order. */
export type Shopify_FulfillmentTrackingInfoArgs = {
  first: InputMaybe<Scalars['Int']['input']>;
};

/** Represents a single line item in a fulfillment. There is at most one fulfillment line item for each order line item. */
export type Shopify_FulfillmentLineItem = {
  __typename?: 'shopify_FulfillmentLineItem';
  /** The associated order's line item. */
  lineItem: Shopify_OrderLineItem;
  /** The amount fulfilled in this fulfillment. */
  quantity: Scalars['Int']['output'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of FulfillmentLineItemEdge. */
  node: Shopify_FulfillmentLineItem;
};

/** Tracking information associated with the fulfillment. */
export type Shopify_FulfillmentTrackingInfo = {
  __typename?: 'shopify_FulfillmentTrackingInfo';
  /** The tracking number of the fulfillment. */
  number: Maybe<Scalars['String']['output']>;
  /** The URL to track the fulfillment. */
  url: Maybe<Scalars['shopify_URL']['output']>;
};

/** The generic file resource lets you manage files in a merchant’s store. Generic files include any file that doesn’t fit into a designated type such as image or video. Example: PDF, JSON. */
export type Shopify_GenericFile = Shopify_Node & {
  __typename?: 'shopify_GenericFile';
  /** A word or phrase to indicate the contents of a file. */
  alt: Maybe<Scalars['String']['output']>;
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The MIME type of the file. */
  mimeType: Maybe<Scalars['String']['output']>;
  /** The size of the original file in bytes. */
  originalFileSize: Maybe<Scalars['Int']['output']>;
  /** The preview image for the file. */
  previewImage: Maybe<Shopify_Image>;
  /** The URL of the file. */
  url: Maybe<Scalars['shopify_URL']['output']>;
};

/** The input fields used to specify a geographical location. */
export type Shopify_GeoCoordinateInput = {
  /** The coordinate's latitude value. */
  latitude: Scalars['Float']['input'];
  /** The coordinate's longitude value. */
  longitude: Scalars['Float']['input'];
};

/** Represents information about the metafields associated to the specified resource. */
export type Shopify_HasMetafields = {
  /** Returns a metafield found by namespace and key. */
  metafield: Maybe<Shopify_Metafield>;
  /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
  metafields: Array<Maybe<Shopify_Metafield>>;
};

/** Represents information about the metafields associated to the specified resource. */
export type Shopify_HasMetafieldsMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/** Represents information about the metafields associated to the specified resource. */
export type Shopify_HasMetafieldsMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** The input fields to identify a metafield on an owner resource by namespace and key. */
export type Shopify_HasMetafieldsIdentifier = {
  /** The identifier for the metafield. */
  key: Scalars['String']['input'];
  /** The container the metafield belongs to. */
  namespace: Scalars['String']['input'];
};

/** Represents an image resource. */
export type Shopify_Image = {
  __typename?: 'shopify_Image';
  /** A word or phrase to share the nature or contents of an image. */
  altText: Maybe<Scalars['String']['output']>;
  /** The original height of the image in pixels. Returns `null` if the image isn't hosted by Shopify. */
  height: Maybe<Scalars['Int']['output']>;
  /** A unique ID for the image. */
  id: Maybe<Scalars['ID']['output']>;
  /**
   * The location of the original image as a URL.
   *
   * If there are any existing transformations in the original source URL, they will remain and not be stripped.
   *
   */
  originalSrc: Scalars['shopify_URL']['output'];
  /** The location of the image as a URL. */
  src: Scalars['shopify_URL']['output'];
  /**
   * The location of the transformed image as a URL.
   *
   * All transformation arguments are considered "best-effort". If they can be applied to an image, they will be.
   * Otherwise any transformations which an image type doesn't support will be ignored.
   *
   */
  transformedSrc: Scalars['shopify_URL']['output'];
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
  url: Scalars['shopify_URL']['output'];
  /** The original width of the image in pixels. Returns `null` if the image isn't hosted by Shopify. */
  width: Maybe<Scalars['Int']['output']>;
};

/** Represents an image resource. */
export type Shopify_ImageTransformedSrcArgs = {
  crop: InputMaybe<Shopify_CropRegion>;
  maxHeight: InputMaybe<Scalars['Int']['input']>;
  maxWidth: InputMaybe<Scalars['Int']['input']>;
  preferredContentType: InputMaybe<Shopify_ImageContentType>;
  scale?: InputMaybe<Scalars['Int']['input']>;
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
  cursor: Scalars['String']['output'];
  /** The item at the end of ImageEdge. */
  node: Shopify_Image;
};

/**
 * The available options for transforming an image.
 *
 * All transformation options are considered best effort. Any transformation that
 * the original image type doesn't support will be ignored.
 *
 */
export type Shopify_ImageTransformInput = {
  /**
   * The region of the image to remain after cropping.
   * Must be used in conjunction with the `maxWidth` and/or `maxHeight` fields,
   * where the `maxWidth` and `maxHeight` aren't equal.
   * The `crop` argument should coincide with the smaller value. A smaller `maxWidth` indicates a `LEFT` or `RIGHT` crop, while
   * a smaller `maxHeight` indicates a `TOP` or `BOTTOM` crop. For example, `{
   * maxWidth: 5, maxHeight: 10, crop: LEFT }` will result
   * in an image with a width of 5 and height of 10, where the right side of the image is removed.
   *
   */
  crop: InputMaybe<Shopify_CropRegion>;
  /**
   * Image height in pixels between 1 and 5760.
   *
   */
  maxHeight: InputMaybe<Scalars['Int']['input']>;
  /**
   * Image width in pixels between 1 and 5760.
   *
   */
  maxWidth: InputMaybe<Scalars['Int']['input']>;
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
  scale: InputMaybe<Scalars['Int']['input']>;
};

/** A language. */
export type Shopify_Language = {
  __typename?: 'shopify_Language';
  /** The name of the language in the language itself. If the language uses capitalization, it is capitalized for a mid-sentence position. */
  endonymName: Scalars['String']['output'];
  /** The ISO code. */
  isoCode: Shopify_LanguageCode;
  /** The name of the language in the current language. */
  name: Scalars['String']['output'];
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
  /** Central Kurdish. */
  Ckb = 'CKB',
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
  /** Filipino. */
  Fil = 'FIL',
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
  /** Latin. */
  La = 'LA',
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
  /** Moldavian. */
  Mo = 'MO',
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
  /** Sanskrit. */
  Sa = 'SA',
  /** Sardinian. */
  Sc = 'SC',
  /** Sindhi. */
  Sd = 'SD',
  /** Northern Sami. */
  Se = 'SE',
  /** Sango. */
  Sg = 'SG',
  /** Serbo-Croatian. */
  Sh = 'SH',
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
  /** The market including the country of the active localized experience. Use the `@inContext` directive to change this value. */
  market: Shopify_Market;
};

/** Represents a location where product inventory is held. */
export type Shopify_Location = Shopify_HasMetafields &
  Shopify_Node & {
    __typename?: 'shopify_Location';
    /** The address of the location. */
    address: Shopify_LocationAddress;
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The name of the location. */
    name: Scalars['String']['output'];
  };

/** Represents a location where product inventory is held. */
export type Shopify_LocationMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/** Represents a location where product inventory is held. */
export type Shopify_LocationMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/**
 * Represents the address of a location.
 *
 */
export type Shopify_LocationAddress = {
  __typename?: 'shopify_LocationAddress';
  /** The first line of the address for the location. */
  address1: Maybe<Scalars['String']['output']>;
  /** The second line of the address for the location. */
  address2: Maybe<Scalars['String']['output']>;
  /** The city of the location. */
  city: Maybe<Scalars['String']['output']>;
  /** The country of the location. */
  country: Maybe<Scalars['String']['output']>;
  /** The country code of the location. */
  countryCode: Maybe<Scalars['String']['output']>;
  /** A formatted version of the address for the location. */
  formatted: Array<Scalars['String']['output']>;
  /** The latitude coordinates of the location. */
  latitude: Maybe<Scalars['Float']['output']>;
  /** The longitude coordinates of the location. */
  longitude: Maybe<Scalars['Float']['output']>;
  /** The phone number of the location. */
  phone: Maybe<Scalars['String']['output']>;
  /** The province of the location. */
  province: Maybe<Scalars['String']['output']>;
  /**
   * The code for the province, state, or district of the address of the location.
   *
   */
  provinceCode: Maybe<Scalars['String']['output']>;
  /** The ZIP code of the location. */
  zip: Maybe<Scalars['String']['output']>;
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
  cursor: Scalars['String']['output'];
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
  address1: Maybe<Scalars['String']['output']>;
  /**
   * The second line of the address. Typically the number of the apartment, suite, or unit.
   *
   */
  address2: Maybe<Scalars['String']['output']>;
  /** The name of the city, district, village, or town. */
  city: Maybe<Scalars['String']['output']>;
  /** The name of the customer's company or organization. */
  company: Maybe<Scalars['String']['output']>;
  /** The name of the country. */
  country: Maybe<Scalars['String']['output']>;
  /**
   * The two-letter code for the country of the address.
   *
   * For example, US.
   *
   */
  countryCode: Maybe<Scalars['String']['output']>;
  /**
   * The two-letter code for the country of the address.
   *
   * For example, US.
   *
   */
  countryCodeV2: Maybe<Shopify_CountryCode>;
  /** The first name of the customer. */
  firstName: Maybe<Scalars['String']['output']>;
  /** A formatted version of the address, customized by the provided arguments. */
  formatted: Array<Scalars['String']['output']>;
  /** A comma-separated list of the values for city, province, and country. */
  formattedArea: Maybe<Scalars['String']['output']>;
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The last name of the customer. */
  lastName: Maybe<Scalars['String']['output']>;
  /** The latitude coordinate of the customer address. */
  latitude: Maybe<Scalars['Float']['output']>;
  /** The longitude coordinate of the customer address. */
  longitude: Maybe<Scalars['Float']['output']>;
  /** The full name of the customer, based on firstName and lastName. */
  name: Maybe<Scalars['String']['output']>;
  /**
   * A unique phone number for the customer.
   *
   * Formatted using E.164 standard. For example, _+16135551111_.
   *
   */
  phone: Maybe<Scalars['String']['output']>;
  /** The region of the address, such as the province, state, or district. */
  province: Maybe<Scalars['String']['output']>;
  /**
   * The two-letter code for the region.
   *
   * For example, ON.
   *
   */
  provinceCode: Maybe<Scalars['String']['output']>;
  /** The zip or postal code of the address. */
  zip: Maybe<Scalars['String']['output']>;
};

/** Represents a mailing address for customers and shipping. */
export type Shopify_MailingAddressFormattedArgs = {
  withCompany?: InputMaybe<Scalars['Boolean']['input']>;
  withName?: InputMaybe<Scalars['Boolean']['input']>;
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
  cursor: Scalars['String']['output'];
  /** The item at the end of MailingAddressEdge. */
  node: Shopify_MailingAddress;
};

/** The input fields to create or update a mailing address. */
export type Shopify_MailingAddressInput = {
  /**
   * The first line of the address. Typically the street address or PO Box number.
   *
   */
  address1: InputMaybe<Scalars['String']['input']>;
  /**
   * The second line of the address. Typically the number of the apartment, suite, or unit.
   *
   */
  address2: InputMaybe<Scalars['String']['input']>;
  /**
   * The name of the city, district, village, or town.
   *
   */
  city: InputMaybe<Scalars['String']['input']>;
  /**
   * The name of the customer's company or organization.
   *
   */
  company: InputMaybe<Scalars['String']['input']>;
  /** The name of the country. */
  country: InputMaybe<Scalars['String']['input']>;
  /** The first name of the customer. */
  firstName: InputMaybe<Scalars['String']['input']>;
  /** The last name of the customer. */
  lastName: InputMaybe<Scalars['String']['input']>;
  /**
   * A unique phone number for the customer.
   *
   * Formatted using E.164 standard. For example, _+16135551111_.
   *
   */
  phone: InputMaybe<Scalars['String']['input']>;
  /** The region of the address, such as the province, state, or district. */
  province: InputMaybe<Scalars['String']['input']>;
  /** The zip or postal code of the address. */
  zip: InputMaybe<Scalars['String']['input']>;
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
  description: Maybe<Scalars['String']['output']>;
  /** Which lines of targetType that the discount is allocated over. */
  targetSelection: Shopify_DiscountApplicationTargetSelection;
  /** The type of line that the discount is applicable towards. */
  targetType: Shopify_DiscountApplicationTargetType;
  /** The title of the application. */
  title: Scalars['String']['output'];
  /** The value of the discount application. */
  value: Shopify_PricingValue;
};

/** A group of one or more regions of the world that a merchant is targeting for sales. To learn more about markets, refer to [the Shopify Markets conceptual overview](/docs/apps/markets). */
export type Shopify_Market = Shopify_HasMetafields &
  Shopify_Node & {
    __typename?: 'shopify_Market';
    /**
     * A human-readable unique string for the market automatically generated from its title.
     *
     */
    handle: Scalars['String']['output'];
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
  };

/** A group of one or more regions of the world that a merchant is targeting for sales. To learn more about markets, refer to [the Shopify Markets conceptual overview](/docs/apps/markets). */
export type Shopify_MarketMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/** A group of one or more regions of the world that a merchant is targeting for sales. To learn more about markets, refer to [the Shopify Markets conceptual overview](/docs/apps/markets). */
export type Shopify_MarketMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** Represents a media interface. */
export type Shopify_Media = {
  /** A word or phrase to share the nature or contents of a media. */
  alt: Maybe<Scalars['String']['output']>;
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The media content type. */
  mediaContentType: Shopify_MediaContentType;
  /** The presentation for a media. */
  presentation: Maybe<Shopify_MediaPresentation>;
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
  cursor: Scalars['String']['output'];
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
    alt: Maybe<Scalars['String']['output']>;
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** The image for the media. */
    image: Maybe<Shopify_Image>;
    /** The media content type. */
    mediaContentType: Shopify_MediaContentType;
    /** The presentation for a media. */
    presentation: Maybe<Shopify_MediaPresentation>;
    /** The preview image for the media. */
    previewImage: Maybe<Shopify_Image>;
  };

/** A media presentation. */
export type Shopify_MediaPresentation = Shopify_Node & {
  __typename?: 'shopify_MediaPresentation';
  /** A JSON object representing a presentation view. */
  asJson: Maybe<Scalars['shopify_JSON']['output']>;
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
};

/** A media presentation. */
export type Shopify_MediaPresentationAsJsonArgs = {
  format: Shopify_MediaPresentationFormat;
};

/** The possible formats for a media presentation. */
export enum Shopify_MediaPresentationFormat {
  /** A media image presentation. */
  Image = 'IMAGE',
  /** A model viewer presentation. */
  ModelViewer = 'MODEL_VIEWER',
}

/**
 * A [navigation menu](https://help.shopify.com/manual/online-store/menus-and-links) representing a hierarchy
 * of hyperlinks (items).
 *
 */
export type Shopify_Menu = Shopify_Node & {
  __typename?: 'shopify_Menu';
  /** The menu's handle. */
  handle: Scalars['String']['output'];
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The menu's child items. */
  items: Array<Shopify_MenuItem>;
  /** The count of items on the menu. */
  itemsCount: Scalars['Int']['output'];
  /** The menu's title. */
  title: Scalars['String']['output'];
};

/** A menu item within a parent menu. */
export type Shopify_MenuItem = Shopify_Node & {
  __typename?: 'shopify_MenuItem';
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The menu item's child items. */
  items: Array<Shopify_MenuItem>;
  /** The linked resource. */
  resource: Maybe<Shopify_MenuItemResource>;
  /** The ID of the linked resource. */
  resourceId: Maybe<Scalars['ID']['output']>;
  /** The menu item's tags to filter a collection. */
  tags: Array<Scalars['String']['output']>;
  /** The menu item's title. */
  title: Scalars['String']['output'];
  /** The menu item's type. */
  type: Shopify_MenuItemType;
  /** The menu item's URL. */
  url: Maybe<Scalars['shopify_URL']['output']>;
};

/**
 * The list of possible resources a `MenuItem` can reference.
 *
 */
export type Shopify_MenuItemResource =
  | Shopify_Article
  | Shopify_Blog
  | Shopify_Collection
  | Shopify_Page
  | Shopify_Product
  | Shopify_ShopPolicy;

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
  createdAt: Scalars['shopify_DateTime']['output'];
  /** The description of a metafield. */
  description: Maybe<Scalars['String']['output']>;
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The unique identifier for the metafield within its namespace. */
  key: Scalars['String']['output'];
  /** The container for a group of metafields that the metafield is associated with. */
  namespace: Scalars['String']['output'];
  /** The type of resource that the metafield is attached to. */
  parentResource: Shopify_MetafieldParentResource;
  /** Returns a reference object if the metafield's type is a resource reference. */
  reference: Maybe<Shopify_MetafieldReference>;
  /** A list of reference objects if the metafield's type is a resource reference list. */
  references: Maybe<Shopify_MetafieldReferenceConnection>;
  /**
   * The type name of the metafield.
   * Refer to the list of [supported types](https://shopify.dev/apps/metafields/definitions/types).
   *
   */
  type: Scalars['String']['output'];
  /** The date and time when the metafield was last updated. */
  updatedAt: Scalars['shopify_DateTime']['output'];
  /** The data stored in the metafield. Always stored as a string, regardless of the metafield's type. */
  value: Scalars['String']['output'];
};

/**
 * Metafields represent custom metadata attached to a resource. Metafields can be sorted into namespaces and are
 * comprised of keys, values, and value types.
 *
 */
export type Shopify_MetafieldReferencesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

/** Possible error codes that can be returned by `MetafieldDeleteUserError`. */
export enum Shopify_MetafieldDeleteErrorCode {
  /** The owner ID is invalid. */
  InvalidOwner = 'INVALID_OWNER',
  /** Metafield not found. */
  MetafieldDoesNotExist = 'METAFIELD_DOES_NOT_EXIST',
}

/** An error that occurs during the execution of cart metafield deletion. */
export type Shopify_MetafieldDeleteUserError = Shopify_DisplayableError & {
  __typename?: 'shopify_MetafieldDeleteUserError';
  /** The error code. */
  code: Maybe<Shopify_MetafieldDeleteErrorCode>;
  /** The path to the input field that caused the error. */
  field: Maybe<Array<Scalars['String']['output']>>;
  /** The error message. */
  message: Scalars['String']['output'];
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
  key: Scalars['String']['input'];
  /** The namespace of the metafield to filter on. */
  namespace: Scalars['String']['input'];
  /** The value of the metafield. */
  value: Scalars['String']['input'];
};

/** A resource that the metafield belongs to. */
export type Shopify_MetafieldParentResource =
  | Shopify_Article
  | Shopify_Blog
  | Shopify_Cart
  | Shopify_Collection
  | Shopify_Customer
  | Shopify_Location
  | Shopify_Market
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
  cursor: Scalars['String']['output'];
  /** The item at the end of MetafieldReferenceEdge. */
  node: Shopify_MetafieldReference;
};

/** An error that occurs during the execution of `MetafieldsSet`. */
export type Shopify_MetafieldsSetUserError = Shopify_DisplayableError & {
  __typename?: 'shopify_MetafieldsSetUserError';
  /** The error code. */
  code: Maybe<Shopify_MetafieldsSetUserErrorCode>;
  /** The index of the array element that's causing the error. */
  elementIndex: Maybe<Scalars['Int']['output']>;
  /** The path to the input field that caused the error. */
  field: Maybe<Array<Scalars['String']['output']>>;
  /** The error message. */
  message: Scalars['String']['output'];
};

/** Possible error codes that can be returned by `MetafieldsSetUserError`. */
export enum Shopify_MetafieldsSetUserErrorCode {
  /** The input value is blank. */
  Blank = 'BLANK',
  /** The input value isn't included in the list. */
  Inclusion = 'INCLUSION',
  /** The owner ID is invalid. */
  InvalidOwner = 'INVALID_OWNER',
  /** The type is invalid. */
  InvalidType = 'INVALID_TYPE',
  /** The value is invalid for metafield type or for definition options. */
  InvalidValue = 'INVALID_VALUE',
  /** The input value should be less than or equal to the maximum value allowed. */
  LessThanOrEqualTo = 'LESS_THAN_OR_EQUAL_TO',
  /** The input value needs to be blank. */
  Present = 'PRESENT',
  /** The input value is too long. */
  TooLong = 'TOO_LONG',
  /** The input value is too short. */
  TooShort = 'TOO_SHORT',
}

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
  handle: Scalars['String']['output'];
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The type of the metaobject. Defines the namespace of its associated metafields. */
  type: Scalars['String']['output'];
  /** The date and time when the metaobject was last updated. */
  updatedAt: Scalars['shopify_DateTime']['output'];
};

/** An instance of a user-defined model based on a MetaobjectDefinition. */
export type Shopify_MetaobjectFieldArgs = {
  key: Scalars['String']['input'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of MetaobjectEdge. */
  node: Shopify_Metaobject;
};

/** Provides the value of a Metaobject field. */
export type Shopify_MetaobjectField = {
  __typename?: 'shopify_MetaobjectField';
  /** The field key. */
  key: Scalars['String']['output'];
  /** A referenced object if the field type is a resource reference. */
  reference: Maybe<Shopify_MetafieldReference>;
  /** A list of referenced objects if the field type is a resource reference list. */
  references: Maybe<Shopify_MetafieldReferenceConnection>;
  /**
   * The type name of the field.
   * See the list of [supported types](https://shopify.dev/apps/metafields/definitions/types).
   *
   */
  type: Scalars['String']['output'];
  /** The field value. */
  value: Maybe<Scalars['String']['output']>;
};

/** Provides the value of a Metaobject field. */
export type Shopify_MetaobjectFieldReferencesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

/** The input fields used to retrieve a metaobject by handle. */
export type Shopify_MetaobjectHandleInput = {
  /** The handle of the metaobject. */
  handle: Scalars['String']['input'];
  /** The type of the metaobject. */
  type: Scalars['String']['input'];
};

/** Represents a Shopify hosted 3D model. */
export type Shopify_Model3d = Shopify_Media &
  Shopify_Node & {
    __typename?: 'shopify_Model3d';
    /** A word or phrase to share the nature or contents of a media. */
    alt: Maybe<Scalars['String']['output']>;
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** The media content type. */
    mediaContentType: Shopify_MediaContentType;
    /** The presentation for a media. */
    presentation: Maybe<Shopify_MediaPresentation>;
    /** The preview image for the media. */
    previewImage: Maybe<Shopify_Image>;
    /** The sources for a 3d model. */
    sources: Array<Shopify_Model3dSource>;
  };

/** Represents a source for a Shopify hosted 3d model. */
export type Shopify_Model3dSource = {
  __typename?: 'shopify_Model3dSource';
  /** The filesize of the 3d model. */
  filesize: Scalars['Int']['output'];
  /** The format of the 3d model. */
  format: Scalars['String']['output'];
  /** The MIME type of the 3d model. */
  mimeType: Scalars['String']['output'];
  /** The URL of the 3d model. */
  url: Scalars['String']['output'];
};

/** The input fields for a monetary value with currency. */
export type Shopify_MoneyInput = {
  /** Decimal money amount. */
  amount: Scalars['shopify_Decimal']['input'];
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
  amount: Scalars['shopify_Decimal']['output'];
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
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
};

/** Represents a resource that can be published to the Online Store sales channel. */
export type Shopify_OnlineStorePublishable = {
  /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
  onlineStoreUrl: Maybe<Scalars['shopify_URL']['output']>;
};

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_Order = Shopify_HasMetafields &
  Shopify_Node & {
    __typename?: 'shopify_Order';
    /** The address associated with the payment method. */
    billingAddress: Maybe<Shopify_MailingAddress>;
    /** The reason for the order's cancellation. Returns `null` if the order wasn't canceled. */
    cancelReason: Maybe<Shopify_OrderCancelReason>;
    /** The date and time when the order was canceled. Returns null if the order wasn't canceled. */
    canceledAt: Maybe<Scalars['shopify_DateTime']['output']>;
    /** The code of the currency used for the payment. */
    currencyCode: Shopify_CurrencyCode;
    /** The subtotal of line items and their discounts, excluding line items that have been removed. Does not contain order-level discounts, duties, shipping costs, or shipping discounts. Taxes aren't included unless the order is a taxes-included order. */
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
    customerLocale: Maybe<Scalars['String']['output']>;
    /** The unique URL that the customer can use to access the order. */
    customerUrl: Maybe<Scalars['shopify_URL']['output']>;
    /** Discounts that have been applied on the order. */
    discountApplications: Shopify_DiscountApplicationConnection;
    /** Whether the order has had any edits applied or not. */
    edited: Scalars['Boolean']['output'];
    /** The customer's email address. */
    email: Maybe<Scalars['String']['output']>;
    /** The financial status of the order. */
    financialStatus: Maybe<Shopify_OrderFinancialStatus>;
    /** The fulfillment status for the order. */
    fulfillmentStatus: Shopify_OrderFulfillmentStatus;
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** List of the order’s line items. */
    lineItems: Shopify_OrderLineItemConnection;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /**
     * Unique identifier for the order that appears on the order.
     * For example, _#1000_ or _Store1001.
     *
     */
    name: Scalars['String']['output'];
    /** A unique numeric identifier for the order for use by shop owner and customer. */
    orderNumber: Scalars['Int']['output'];
    /** The total cost of duties charged at checkout. */
    originalTotalDuties: Maybe<Shopify_MoneyV2>;
    /** The total price of the order before any applied edits. */
    originalTotalPrice: Shopify_MoneyV2;
    /** The customer's phone number for receiving SMS notifications. */
    phone: Maybe<Scalars['String']['output']>;
    /**
     * The date and time when the order was imported.
     * This value can be set to dates in the past when importing from other systems.
     * If no value is provided, it will be auto-generated based on current date and time.
     *
     */
    processedAt: Scalars['shopify_DateTime']['output'];
    /** The address to where the order will be shipped. */
    shippingAddress: Maybe<Shopify_MailingAddress>;
    /**
     * The discounts that have been allocated onto the shipping line by discount applications.
     *
     */
    shippingDiscountAllocations: Array<Shopify_DiscountAllocation>;
    /** The unique URL for the order's status page. */
    statusUrl: Scalars['shopify_URL']['output'];
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
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_OrderLineItemsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_OrderMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_OrderMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/** An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information. */
export type Shopify_OrderSuccessfulFulfillmentsArgs = {
  first: InputMaybe<Scalars['Int']['input']>;
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
  totalCount: Scalars['shopify_UnsignedInt64']['output'];
};

/**
 * An auto-generated type which holds one Order and a cursor during pagination.
 *
 */
export type Shopify_OrderEdge = {
  __typename?: 'shopify_OrderEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
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
  currentQuantity: Scalars['Int']['output'];
  /** List of custom attributes associated to the line item. */
  customAttributes: Array<Shopify_Attribute>;
  /** The discounts that have been allocated onto the order line item by discount applications. */
  discountAllocations: Array<Shopify_DiscountAllocation>;
  /** The total price of the line item, including discounts, and displayed in the presentment currency. */
  discountedTotalPrice: Shopify_MoneyV2;
  /** The total price of the line item, not including any discounts. The total price is calculated using the original unit price multiplied by the quantity, and it's displayed in the presentment currency. */
  originalTotalPrice: Shopify_MoneyV2;
  /** The number of products variants associated to the line item. */
  quantity: Scalars['Int']['output'];
  /** The title of the product combined with title of the variant. */
  title: Scalars['String']['output'];
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
  cursor: Scalars['String']['output'];
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
  Shopify_OnlineStorePublishable &
  Shopify_Trackable & {
    __typename?: 'shopify_Page';
    /** The description of the page, complete with HTML formatting. */
    body: Scalars['shopify_HTML']['output'];
    /** Summary of the page body. */
    bodySummary: Scalars['String']['output'];
    /** The timestamp of the page creation. */
    createdAt: Scalars['shopify_DateTime']['output'];
    /** A human-friendly unique string for the page automatically generated from its title. */
    handle: Scalars['String']['output'];
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
    onlineStoreUrl: Maybe<Scalars['shopify_URL']['output']>;
    /** The page's SEO information. */
    seo: Maybe<Shopify_Seo>;
    /** The title of the page. */
    title: Scalars['String']['output'];
    /** A URL parameters to be added to a page URL when it is linked from a GraphQL result. This allows for tracking the origin of the traffic. */
    trackingParameters: Maybe<Scalars['String']['output']>;
    /** The timestamp of the latest page update. */
    updatedAt: Scalars['shopify_DateTime']['output'];
  };

/** Shopify merchants can create pages to hold static HTML content. Each Page object represents a custom page on the online store. */
export type Shopify_PageMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
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
  cursor: Scalars['String']['output'];
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
  endCursor: Maybe<Scalars['String']['output']>;
  /** Whether there are more pages to fetch following the current page. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Whether there are any pages prior to the current page. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** The cursor corresponding to the first node in edges. */
  startCursor: Maybe<Scalars['String']['output']>;
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
  errorMessage: Maybe<Scalars['String']['output']>;
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /**
   * A client-side generated token to identify a payment and perform idempotent operations.
   * For more information, refer to
   * [Idempotent requests](https://shopify.dev/api/usage/idempotent-requests).
   *
   */
  idempotencyKey: Maybe<Scalars['String']['output']>;
  /** The URL where the customer needs to be redirected so they can complete the 3D Secure payment flow. */
  nextActionUrl: Maybe<Scalars['shopify_URL']['output']>;
  /** Whether the payment is still processing asynchronously. */
  ready: Scalars['Boolean']['output'];
  /** A flag to indicate if the payment is to be done in test mode for gateways that support it. */
  test: Scalars['Boolean']['output'];
  /** The actual transaction recorded by Shopify after having processed the payment with the gateway. */
  transaction: Maybe<Shopify_Transaction>;
};

/** Settings related to payments. */
export type Shopify_PaymentSettings = {
  __typename?: 'shopify_PaymentSettings';
  /** List of the card brands which the shop accepts. */
  acceptedCardBrands: Array<Shopify_CardBrand>;
  /** The url pointing to the endpoint to vault credit cards. */
  cardVaultUrl: Scalars['shopify_URL']['output'];
  /** The country where the shop is located. */
  countryCode: Shopify_CountryCode;
  /** The three-letter code for the shop's primary currency. */
  currencyCode: Shopify_CurrencyCode;
  /**
   * A list of enabled currencies (ISO 4217 format) that the shop accepts.
   * Merchants can enable currencies from their Shopify Payments settings in the Shopify admin.
   *
   */
  enabledPresentmentCurrencies: Array<Shopify_CurrencyCode>;
  /** The shop’s Shopify Payments account ID. */
  shopifyPaymentsAccountId: Maybe<Scalars['String']['output']>;
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

/** Decides the distribution of results. */
export enum Shopify_PredictiveSearchLimitScope {
  /** Return results up to limit across all types. */
  All = 'ALL',
  /** Return results up to limit per type. */
  Each = 'EACH',
}

/**
 * A predictive search result represents a list of products, collections, pages, articles, and query suggestions
 * that matches the predictive search query.
 *
 */
export type Shopify_PredictiveSearchResult = {
  __typename?: 'shopify_PredictiveSearchResult';
  /** The articles that match the search query. */
  articles: Array<Shopify_Article>;
  /** The articles that match the search query. */
  collections: Array<Shopify_Collection>;
  /** The pages that match the search query. */
  pages: Array<Shopify_Page>;
  /** The products that match the search query. */
  products: Array<Shopify_Product>;
  /** The query suggestions that are relevant to the search query. */
  queries: Array<Shopify_SearchQuerySuggestion>;
};

/** The types of search items to perform predictive search on. */
export enum Shopify_PredictiveSearchType {
  /** Returns matching articles. */
  Article = 'ARTICLE',
  /** Returns matching collections. */
  Collection = 'COLLECTION',
  /** Returns matching pages. */
  Page = 'PAGE',
  /** Returns matching products. */
  Product = 'PRODUCT',
  /** Returns matching query strings. */
  Query = 'QUERY',
}

/**
 * The input fields for a filter used to view a subset of products in a collection matching a specific price range.
 *
 */
export type Shopify_PriceRangeFilter = {
  /** The maximum price in the range. Empty indicates no max price. */
  max: InputMaybe<Scalars['Float']['input']>;
  /** The minimum price in the range. Defaults to zero. */
  min: InputMaybe<Scalars['Float']['input']>;
};

/** The value of the percentage pricing object. */
export type Shopify_PricingPercentageValue = {
  __typename?: 'shopify_PricingPercentageValue';
  /** The percentage value of the object. */
  percentage: Scalars['Float']['output'];
};

/** The price value (fixed or percentage) for a discount application. */
export type Shopify_PricingValue =
  | Shopify_MoneyV2
  | Shopify_PricingPercentageValue;

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_Product = Shopify_HasMetafields &
  Shopify_Node &
  Shopify_OnlineStorePublishable &
  Shopify_Trackable & {
    __typename?: 'shopify_Product';
    /** Indicates if at least one product variant is available for sale. */
    availableForSale: Scalars['Boolean']['output'];
    /** List of collections a product belongs to. */
    collections: Shopify_CollectionConnection;
    /** The compare at price of the product across all variants. */
    compareAtPriceRange: Shopify_ProductPriceRange;
    /** The date and time when the product was created. */
    createdAt: Scalars['shopify_DateTime']['output'];
    /** Stripped description of the product, single line with HTML tags removed. */
    description: Scalars['String']['output'];
    /** The description of the product, complete with HTML formatting. */
    descriptionHtml: Scalars['shopify_HTML']['output'];
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
    handle: Scalars['String']['output'];
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** List of images associated with the product. */
    images: Shopify_ImageConnection;
    /** Whether the product is a gift card. */
    isGiftCard: Scalars['Boolean']['output'];
    /** The media associated with the product. */
    media: Shopify_MediaConnection;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The URL used for viewing the resource on the shop's Online Store. Returns `null` if the resource is currently not published to the Online Store sales channel. */
    onlineStoreUrl: Maybe<Scalars['shopify_URL']['output']>;
    /** List of product options. */
    options: Array<Shopify_ProductOption>;
    /** The price range. */
    priceRange: Shopify_ProductPriceRange;
    /** A categorization that a product can be tagged with, commonly used for filtering and searching. */
    productType: Scalars['String']['output'];
    /** The date and time when the product was published to the channel. */
    publishedAt: Scalars['shopify_DateTime']['output'];
    /** Whether the product can only be purchased with a selling plan. */
    requiresSellingPlan: Scalars['Boolean']['output'];
    /** A list of a product's available selling plan groups. A selling plan group represents a selling method. For example, 'Subscribe and save' is a selling method where customers pay for goods or services per delivery. A selling plan group contains individual selling plans. */
    sellingPlanGroups: Shopify_SellingPlanGroupConnection;
    /** The product's SEO information. */
    seo: Shopify_Seo;
    /**
     * A comma separated list of tags that have been added to the product.
     * Additional access scope required for private apps: unauthenticated_read_product_tags.
     *
     */
    tags: Array<Scalars['String']['output']>;
    /** The product’s title. */
    title: Scalars['String']['output'];
    /** The total quantity of inventory in stock for this Product. */
    totalInventory: Maybe<Scalars['Int']['output']>;
    /** A URL parameters to be added to a page URL when it is linked from a GraphQL result. This allows for tracking the origin of the traffic. */
    trackingParameters: Maybe<Scalars['String']['output']>;
    /**
     * The date and time when the product was last modified.
     * A product's `updatedAt` value can change for different reasons. For example, if an order
     * is placed for a product that has inventory tracking set up, then the inventory adjustment
     * is counted as an update.
     *
     */
    updatedAt: Scalars['shopify_DateTime']['output'];
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
    vendor: Scalars['String']['output'];
  };

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_ProductCollectionsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_ProductDescriptionArgs = {
  truncateAt: InputMaybe<Scalars['Int']['input']>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_ProductImagesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_ProductImageSortKeys>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_ProductMediaArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
  sortKey?: InputMaybe<Shopify_ProductMediaSortKeys>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_ProductMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_ProductMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_ProductOptionsArgs = {
  first: InputMaybe<Scalars['Int']['input']>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_ProductSellingPlanGroupsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_ProductVariantBySelectedOptionsArgs = {
  selectedOptions: Array<Shopify_SelectedOptionInput>;
};

/**
 * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
 * For example, a digital download (such as a movie, music or ebook file) also
 * qualifies as a product, as do services (such as equipment rental, work for hire,
 * customization of another product or an extended warranty).
 *
 */
export type Shopify_ProductVariantsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
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
  cursor: Scalars['String']['output'];
  /** The item at the end of ProductEdge. */
  node: Shopify_Product;
};

/**
 * The input fields for a filter used to view a subset of products in a collection.
 * By default, the `available` and `price` filters are enabled. Filters are customized with the Shopify Search & Discovery app.
 * Learn more about [customizing storefront filtering](https://help.shopify.com/manual/online-store/themes/customizing-themes/storefront-filters).
 *
 */
export type Shopify_ProductFilter = {
  /** Filter on if the product is available for sale. */
  available: InputMaybe<Scalars['Boolean']['input']>;
  /** A range of prices to filter with-in. */
  price: InputMaybe<Shopify_PriceRangeFilter>;
  /** A product metafield to filter on. */
  productMetafield: InputMaybe<Shopify_MetafieldFilter>;
  /** The product type to filter on. */
  productType: InputMaybe<Scalars['String']['input']>;
  /** The product vendor to filter on. */
  productVendor: InputMaybe<Scalars['String']['input']>;
  /** A product tag to filter on. */
  tag: InputMaybe<Scalars['String']['input']>;
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
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The product option’s name. */
  name: Scalars['String']['output'];
  /** The corresponding value to the product option name. */
  values: Array<Scalars['String']['output']>;
};

/** The price range of the product. */
export type Shopify_ProductPriceRange = {
  __typename?: 'shopify_ProductPriceRange';
  /** The highest variant's price. */
  maxVariantPrice: Shopify_MoneyV2;
  /** The lowest variant's price. */
  minVariantPrice: Shopify_MoneyV2;
};

/**
 * The recommendation intent that is used to generate product recommendations.
 * You can use intent to generate product recommendations according to different strategies.
 *
 */
export enum Shopify_ProductRecommendationIntent {
  /** Offer customers products that are complementary to a product for which recommendations are to be fetched. An example is add-on products that display in a Pair it with section. */
  Complementary = 'COMPLEMENTARY',
  /** Offer customers a mix of products that are similar or complementary to a product for which recommendations are to be fetched. An example is substitutable products that display in a You may also like section. */
  Related = 'RELATED',
}

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

/**
 * A product variant represents a different version of a product, such as differing sizes or differing colors.
 *
 */
export type Shopify_ProductVariant = Shopify_HasMetafields &
  Shopify_Node & {
    __typename?: 'shopify_ProductVariant';
    /** Indicates if the product variant is available for sale. */
    availableForSale: Scalars['Boolean']['output'];
    /** The barcode (for example, ISBN, UPC, or GTIN) associated with the variant. */
    barcode: Maybe<Scalars['String']['output']>;
    /** The compare at price of the variant. This can be used to mark a variant as on sale, when `compareAtPrice` is higher than `price`. */
    compareAtPrice: Maybe<Shopify_MoneyV2>;
    /** The compare at price of the variant. This can be used to mark a variant as on sale, when `compareAtPriceV2` is higher than `priceV2`. */
    compareAtPriceV2: Maybe<Shopify_MoneyV2>;
    /** Whether a product is out of stock but still available for purchase (used for backorders). */
    currentlyNotInStock: Scalars['Boolean']['output'];
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** Image associated with the product variant. This field falls back to the product image if no image is available. */
    image: Maybe<Shopify_Image>;
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** The product variant’s price. */
    price: Shopify_MoneyV2;
    /** The product variant’s price. */
    priceV2: Shopify_MoneyV2;
    /** The product object that the product variant belongs to. */
    product: Shopify_Product;
    /** The total sellable quantity of the variant for online sales channels. */
    quantityAvailable: Maybe<Scalars['Int']['output']>;
    /** Whether a customer needs to provide a shipping address when placing an order for the product variant. */
    requiresShipping: Scalars['Boolean']['output'];
    /** List of product options applied to the variant. */
    selectedOptions: Array<Shopify_SelectedOption>;
    /** Represents an association between a variant and a selling plan. Selling plan allocations describe which selling plans are available for each variant, and what their impact is on pricing. */
    sellingPlanAllocations: Shopify_SellingPlanAllocationConnection;
    /** The SKU (stock keeping unit) associated with the variant. */
    sku: Maybe<Scalars['String']['output']>;
    /** The in-store pickup availability of this variant by location. */
    storeAvailability: Shopify_StoreAvailabilityConnection;
    /** The product variant’s title. */
    title: Scalars['String']['output'];
    /** The unit price value for the variant based on the variant's measurement. */
    unitPrice: Maybe<Shopify_MoneyV2>;
    /** The unit price measurement for the variant. */
    unitPriceMeasurement: Maybe<Shopify_UnitPriceMeasurement>;
    /** The weight of the product variant in the unit system specified with `weight_unit`. */
    weight: Maybe<Scalars['Float']['output']>;
    /** Unit of measurement for weight. */
    weightUnit: Shopify_WeightUnit;
  };

/**
 * A product variant represents a different version of a product, such as differing sizes or differing colors.
 *
 */
export type Shopify_ProductVariantMetafieldArgs = {
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/**
 * A product variant represents a different version of a product, such as differing sizes or differing colors.
 *
 */
export type Shopify_ProductVariantMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/**
 * A product variant represents a different version of a product, such as differing sizes or differing colors.
 *
 */
export type Shopify_ProductVariantSellingPlanAllocationsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * A product variant represents a different version of a product, such as differing sizes or differing colors.
 *
 */
export type Shopify_ProductVariantStoreAvailabilityArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  near: InputMaybe<Shopify_GeoCoordinateInput>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
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
  cursor: Scalars['String']['output'];
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
  description: Maybe<Scalars['String']['output']>;
  /** The SEO title. */
  title: Maybe<Scalars['String']['output']>;
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
  title: Scalars['String']['output'];
  /** The value of the discount application. */
  value: Shopify_PricingValue;
};

/** Specifies whether to perform a partial word match on the last search term. */
export enum Shopify_SearchPrefixQueryType {
  /** Perform a partial word match on the last search term. */
  Last = 'LAST',
  /** Don't perform a partial word match on the last search term. */
  None = 'NONE',
}

/** A search query suggestion. */
export type Shopify_SearchQuerySuggestion = Shopify_Trackable & {
  __typename?: 'shopify_SearchQuerySuggestion';
  /** The text of the search query suggestion with highlighted HTML tags. */
  styledText: Scalars['String']['output'];
  /** The text of the search query suggestion. */
  text: Scalars['String']['output'];
  /** A URL parameters to be added to a page URL when it is linked from a GraphQL result. This allows for tracking the origin of the traffic. */
  trackingParameters: Maybe<Scalars['String']['output']>;
};

/**
 * A search result that matches the search query.
 *
 */
export type Shopify_SearchResultItem =
  | Shopify_Article
  | Shopify_Page
  | Shopify_Product;

/**
 * An auto-generated type for paginating through multiple SearchResultItems.
 *
 */
export type Shopify_SearchResultItemConnection = {
  __typename?: 'shopify_SearchResultItemConnection';
  /** A list of edges. */
  edges: Array<Shopify_SearchResultItemEdge>;
  /** A list of the nodes contained in SearchResultItemEdge. */
  nodes: Array<Shopify_SearchResultItem>;
  /** Information to aid in pagination. */
  pageInfo: Shopify_PageInfo;
  /** A list of available filters. */
  productFilters: Array<Shopify_Filter>;
  /** The total number of results. */
  totalCount: Scalars['Int']['output'];
};

/**
 * An auto-generated type which holds one SearchResultItem and a cursor during pagination.
 *
 */
export type Shopify_SearchResultItemEdge = {
  __typename?: 'shopify_SearchResultItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of SearchResultItemEdge. */
  node: Shopify_SearchResultItem;
};

/** The set of valid sort keys for the search query. */
export enum Shopify_SearchSortKeys {
  /** Sort by the `price` value. */
  Price = 'PRICE',
  /** Sort by relevance to the search terms. */
  Relevance = 'RELEVANCE',
}

/** The types of search items to perform search within. */
export enum Shopify_SearchType {
  /** Returns matching articles. */
  Article = 'ARTICLE',
  /** Returns matching pages. */
  Page = 'PAGE',
  /** Returns matching products. */
  Product = 'PRODUCT',
}

/** Specifies whether to display results for unavailable products. */
export enum Shopify_SearchUnavailableProductsType {
  /** Exclude unavailable products. */
  Hide = 'HIDE',
  /** Show unavailable products after all other matching results. This is the default. */
  Last = 'LAST',
  /** Show unavailable products in the order that they're found. */
  Show = 'SHOW',
}

/** Specifies the list of resource fields to search. */
export enum Shopify_SearchableField {
  /** Author of the page or article. */
  Author = 'AUTHOR',
  /** Body of the page or article or product description or collection description. */
  Body = 'BODY',
  /** Product type. */
  ProductType = 'PRODUCT_TYPE',
  /** Tag associated with the product or article. */
  Tag = 'TAG',
  /** Title of the page or article or product title or collection title. */
  Title = 'TITLE',
  /** Variant barcode. */
  VariantsBarcode = 'VARIANTS_BARCODE',
  /** Variant SKU. */
  VariantsSku = 'VARIANTS_SKU',
  /** Variant title. */
  VariantsTitle = 'VARIANTS_TITLE',
  /** Product vendor. */
  Vendor = 'VENDOR',
}

/**
 * Properties used by customers to select a product variant.
 * Products can have multiple options, like different sizes or colors.
 *
 */
export type Shopify_SelectedOption = {
  __typename?: 'shopify_SelectedOption';
  /** The product option’s name. */
  name: Scalars['String']['output'];
  /** The product option’s value. */
  value: Scalars['String']['output'];
};

/** The input fields required for a selected option. */
export type Shopify_SelectedOptionInput = {
  /** The product option’s name. */
  name: Scalars['String']['input'];
  /** The product option’s value. */
  value: Scalars['String']['input'];
};

/** Represents how products and variants can be sold and purchased. */
export type Shopify_SellingPlan = {
  __typename?: 'shopify_SellingPlan';
  /** The initial payment due for the purchase. */
  checkoutCharge: Shopify_SellingPlanCheckoutCharge;
  /** The description of the selling plan. */
  description: Maybe<Scalars['String']['output']>;
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** The name of the selling plan. For example, '6 weeks of prepaid granola, delivered weekly'. */
  name: Scalars['String']['output'];
  /** The selling plan options available in the drop-down list in the storefront. For example, 'Delivery every week' or 'Delivery every 2 weeks' specifies the delivery frequency options for the product. Individual selling plans contribute their options to the associated selling plan group. For example, a selling plan group might have an option called `option1: Delivery every`. One selling plan in that group could contribute `option1: 2 weeks` with the pricing for that option, and another selling plan could contribute `option1: 4 weeks`, with different pricing. */
  options: Array<Shopify_SellingPlanOption>;
  /** The price adjustments that a selling plan makes when a variant is purchased with a selling plan. */
  priceAdjustments: Array<Shopify_SellingPlanPriceAdjustment>;
  /** Whether purchasing the selling plan will result in multiple deliveries. */
  recurringDeliveries: Scalars['Boolean']['output'];
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
  cursor: Scalars['String']['output'];
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
  percentage: Scalars['Float']['output'];
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
  cursor: Scalars['String']['output'];
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
  appName: Maybe<Scalars['String']['output']>;
  /** The name of the selling plan group. */
  name: Scalars['String']['output'];
  /** Represents the selling plan options available in the drop-down list in the storefront. For example, 'Delivery every week' or 'Delivery every 2 weeks' specifies the delivery frequency options for the product. */
  options: Array<Shopify_SellingPlanGroupOption>;
  /** A list of selling plans in a selling plan group. A selling plan is a representation of how products and variants can be sold and purchased. For example, an individual selling plan could be '6 weeks of prepaid granola, delivered weekly'. */
  sellingPlans: Shopify_SellingPlanConnection;
};

/** Represents a selling method. For example, 'Subscribe and save' is a selling method where customers pay for goods or services per delivery. A selling plan group contains individual selling plans. */
export type Shopify_SellingPlanGroupSellingPlansArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  reverse?: InputMaybe<Scalars['Boolean']['input']>;
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
  cursor: Scalars['String']['output'];
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
  name: Scalars['String']['output'];
  /** The values for the options specified by the selling plans in the selling plan group. For example, '1 week', '2 weeks', '3 weeks'. */
  values: Array<Scalars['String']['output']>;
};

/** An option provided by a Selling Plan. */
export type Shopify_SellingPlanOption = {
  __typename?: 'shopify_SellingPlanOption';
  /** The name of the option (ie "Delivery every"). */
  name: Maybe<Scalars['String']['output']>;
  /** The value of the option (ie "Month"). */
  value: Maybe<Scalars['String']['output']>;
};

/** A percentage amount that's deducted from the original variant price. For example, 10% off. */
export type Shopify_SellingPlanPercentagePriceAdjustment = {
  __typename?: 'shopify_SellingPlanPercentagePriceAdjustment';
  /** The percentage value of the price adjustment. */
  adjustmentPercentage: Scalars['Int']['output'];
};

/** Represents by how much the price of a variant associated with a selling plan is adjusted. Each variant can have up to two price adjustments. If a variant has multiple price adjustments, then the first price adjustment applies when the variant is initially purchased. The second price adjustment applies after a certain number of orders (specified by the `orderCount` field) are made. If a selling plan doesn't have any price adjustments, then the unadjusted price of the variant is the effective price. */
export type Shopify_SellingPlanPriceAdjustment = {
  __typename?: 'shopify_SellingPlanPriceAdjustment';
  /** The type of price adjustment. An adjustment value can have one of three types: percentage, amount off, or a new price. */
  adjustmentValue: Shopify_SellingPlanPriceAdjustmentValue;
  /** The number of orders that the price adjustment applies to. If the price adjustment always applies, then this field is `null`. */
  orderCount: Maybe<Scalars['Int']['output']>;
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
  handle: Scalars['String']['output'];
  /** Price of this shipping rate. */
  price: Shopify_MoneyV2;
  /** Price of this shipping rate. */
  priceV2: Shopify_MoneyV2;
  /** Title of this shipping rate. */
  title: Scalars['String']['output'];
};

/** Shop represents a collection of the general settings and information about the shop. */
export type Shopify_Shop = Shopify_HasMetafields &
  Shopify_Node & {
    __typename?: 'shopify_Shop';
    /** The shop's branding configuration. */
    brand: Maybe<Shopify_Brand>;
    /** A description of the shop. */
    description: Maybe<Scalars['String']['output']>;
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** Returns a metafield found by namespace and key. */
    metafield: Maybe<Shopify_Metafield>;
    /** The metafields associated with the resource matching the supplied list of namespaces and keys. */
    metafields: Array<Maybe<Shopify_Metafield>>;
    /** A string representing the way currency is formatted when the currency isn’t specified. */
    moneyFormat: Scalars['String']['output'];
    /** The shop’s name. */
    name: Scalars['String']['output'];
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
  key: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/** Shop represents a collection of the general settings and information about the shop. */
export type Shopify_ShopMetafieldsArgs = {
  identifiers: Array<Shopify_HasMetafieldsIdentifier>;
};

/**
 * The input fields for submitting Shop Pay payment method information for checkout.
 *
 */
export type Shopify_ShopPayWalletContentInput = {
  /** The customer's billing address. */
  billingAddress: Shopify_MailingAddressInput;
  /** Session token for transaction. */
  sessionToken: Scalars['String']['input'];
};

/** Policy that a merchant has configured for their store, such as their refund or privacy policy. */
export type Shopify_ShopPolicy = Shopify_Node & {
  __typename?: 'shopify_ShopPolicy';
  /** Policy text, maximum size of 64kb. */
  body: Scalars['String']['output'];
  /** Policy’s handle. */
  handle: Scalars['String']['output'];
  /** A globally-unique ID. */
  id: Scalars['ID']['output'];
  /** Policy’s title. */
  title: Scalars['String']['output'];
  /** Public URL to the policy. */
  url: Scalars['shopify_URL']['output'];
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
  body: Scalars['String']['output'];
  /** The handle of the policy. */
  handle: Scalars['String']['output'];
  /** The unique ID of the policy. A default policy doesn't have an ID. */
  id: Maybe<Scalars['ID']['output']>;
  /** The title of the policy. */
  title: Scalars['String']['output'];
  /** Public URL to the policy. */
  url: Scalars['shopify_URL']['output'];
};

/**
 * The availability of a product variant at a particular location.
 * Local pick-up must be enabled in the  store's shipping settings, otherwise this will return an empty result.
 *
 */
export type Shopify_StoreAvailability = {
  __typename?: 'shopify_StoreAvailability';
  /** Whether the product variant is in-stock at this location. */
  available: Scalars['Boolean']['output'];
  /** The location where this product variant is stocked at. */
  location: Shopify_Location;
  /** Returns the estimated amount of time it takes for pickup to be ready (Example: Usually ready in 24 hours). */
  pickUpTime: Scalars['String']['output'];
  /** The quantity of the product variant in-stock at this location. */
  quantityAvailable: Scalars['Int']['output'];
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
  cursor: Scalars['String']['output'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of StringEdge. */
  node: Scalars['String']['output'];
};

/** An error that occurred during cart submit for completion. */
export type Shopify_SubmissionError = {
  __typename?: 'shopify_SubmissionError';
  /** The error code. */
  code: Shopify_SubmissionErrorCode;
  /** The error message. */
  message: Maybe<Scalars['String']['output']>;
};

/** The code of the error that occurred during cart submit for completion. */
export enum Shopify_SubmissionErrorCode {
  BuyerIdentityEmailIsInvalid = 'BUYER_IDENTITY_EMAIL_IS_INVALID',
  BuyerIdentityEmailRequired = 'BUYER_IDENTITY_EMAIL_REQUIRED',
  BuyerIdentityPhoneIsInvalid = 'BUYER_IDENTITY_PHONE_IS_INVALID',
  DeliveryAddress1Invalid = 'DELIVERY_ADDRESS1_INVALID',
  DeliveryAddress1Required = 'DELIVERY_ADDRESS1_REQUIRED',
  DeliveryAddress1TooLong = 'DELIVERY_ADDRESS1_TOO_LONG',
  DeliveryAddress2Invalid = 'DELIVERY_ADDRESS2_INVALID',
  DeliveryAddress2Required = 'DELIVERY_ADDRESS2_REQUIRED',
  DeliveryAddress2TooLong = 'DELIVERY_ADDRESS2_TOO_LONG',
  DeliveryAddressRequired = 'DELIVERY_ADDRESS_REQUIRED',
  DeliveryCityInvalid = 'DELIVERY_CITY_INVALID',
  DeliveryCityRequired = 'DELIVERY_CITY_REQUIRED',
  DeliveryCityTooLong = 'DELIVERY_CITY_TOO_LONG',
  DeliveryCompanyInvalid = 'DELIVERY_COMPANY_INVALID',
  DeliveryCompanyRequired = 'DELIVERY_COMPANY_REQUIRED',
  DeliveryCompanyTooLong = 'DELIVERY_COMPANY_TOO_LONG',
  DeliveryCountryRequired = 'DELIVERY_COUNTRY_REQUIRED',
  DeliveryFirstNameInvalid = 'DELIVERY_FIRST_NAME_INVALID',
  DeliveryFirstNameRequired = 'DELIVERY_FIRST_NAME_REQUIRED',
  DeliveryFirstNameTooLong = 'DELIVERY_FIRST_NAME_TOO_LONG',
  DeliveryInvalidPostalCodeForCountry = 'DELIVERY_INVALID_POSTAL_CODE_FOR_COUNTRY',
  DeliveryInvalidPostalCodeForZone = 'DELIVERY_INVALID_POSTAL_CODE_FOR_ZONE',
  DeliveryLastNameInvalid = 'DELIVERY_LAST_NAME_INVALID',
  DeliveryLastNameRequired = 'DELIVERY_LAST_NAME_REQUIRED',
  DeliveryLastNameTooLong = 'DELIVERY_LAST_NAME_TOO_LONG',
  DeliveryNoDeliveryAvailable = 'DELIVERY_NO_DELIVERY_AVAILABLE',
  DeliveryNoDeliveryAvailableForMerchandiseLine = 'DELIVERY_NO_DELIVERY_AVAILABLE_FOR_MERCHANDISE_LINE',
  DeliveryOptionsPhoneNumberInvalid = 'DELIVERY_OPTIONS_PHONE_NUMBER_INVALID',
  DeliveryOptionsPhoneNumberRequired = 'DELIVERY_OPTIONS_PHONE_NUMBER_REQUIRED',
  DeliveryPhoneNumberInvalid = 'DELIVERY_PHONE_NUMBER_INVALID',
  DeliveryPhoneNumberRequired = 'DELIVERY_PHONE_NUMBER_REQUIRED',
  DeliveryPostalCodeInvalid = 'DELIVERY_POSTAL_CODE_INVALID',
  DeliveryPostalCodeRequired = 'DELIVERY_POSTAL_CODE_REQUIRED',
  DeliveryZoneNotFound = 'DELIVERY_ZONE_NOT_FOUND',
  DeliveryZoneRequiredForCountry = 'DELIVERY_ZONE_REQUIRED_FOR_COUNTRY',
  Error = 'ERROR',
  MerchandiseLineLimitReached = 'MERCHANDISE_LINE_LIMIT_REACHED',
  MerchandiseNotApplicable = 'MERCHANDISE_NOT_APPLICABLE',
  MerchandiseNotEnoughStockAvailable = 'MERCHANDISE_NOT_ENOUGH_STOCK_AVAILABLE',
  MerchandiseOutOfStock = 'MERCHANDISE_OUT_OF_STOCK',
  MerchandiseProductNotPublished = 'MERCHANDISE_PRODUCT_NOT_PUBLISHED',
  NoDeliveryGroupSelected = 'NO_DELIVERY_GROUP_SELECTED',
  PaymentsAddress1Invalid = 'PAYMENTS_ADDRESS1_INVALID',
  PaymentsAddress1Required = 'PAYMENTS_ADDRESS1_REQUIRED',
  PaymentsAddress1TooLong = 'PAYMENTS_ADDRESS1_TOO_LONG',
  PaymentsAddress2Invalid = 'PAYMENTS_ADDRESS2_INVALID',
  PaymentsAddress2Required = 'PAYMENTS_ADDRESS2_REQUIRED',
  PaymentsAddress2TooLong = 'PAYMENTS_ADDRESS2_TOO_LONG',
  PaymentsBillingAddressZoneNotFound = 'PAYMENTS_BILLING_ADDRESS_ZONE_NOT_FOUND',
  PaymentsBillingAddressZoneRequiredForCountry = 'PAYMENTS_BILLING_ADDRESS_ZONE_REQUIRED_FOR_COUNTRY',
  PaymentsCityInvalid = 'PAYMENTS_CITY_INVALID',
  PaymentsCityRequired = 'PAYMENTS_CITY_REQUIRED',
  PaymentsCityTooLong = 'PAYMENTS_CITY_TOO_LONG',
  PaymentsCompanyInvalid = 'PAYMENTS_COMPANY_INVALID',
  PaymentsCompanyRequired = 'PAYMENTS_COMPANY_REQUIRED',
  PaymentsCompanyTooLong = 'PAYMENTS_COMPANY_TOO_LONG',
  PaymentsCountryRequired = 'PAYMENTS_COUNTRY_REQUIRED',
  PaymentsCreditCardBaseExpired = 'PAYMENTS_CREDIT_CARD_BASE_EXPIRED',
  PaymentsCreditCardBaseGatewayNotSupported = 'PAYMENTS_CREDIT_CARD_BASE_GATEWAY_NOT_SUPPORTED',
  PaymentsCreditCardBaseInvalidStartDateOrIssueNumberForDebit = 'PAYMENTS_CREDIT_CARD_BASE_INVALID_START_DATE_OR_ISSUE_NUMBER_FOR_DEBIT',
  PaymentsCreditCardBrandNotSupported = 'PAYMENTS_CREDIT_CARD_BRAND_NOT_SUPPORTED',
  PaymentsCreditCardFirstNameBlank = 'PAYMENTS_CREDIT_CARD_FIRST_NAME_BLANK',
  PaymentsCreditCardGeneric = 'PAYMENTS_CREDIT_CARD_GENERIC',
  PaymentsCreditCardLastNameBlank = 'PAYMENTS_CREDIT_CARD_LAST_NAME_BLANK',
  PaymentsCreditCardMonthInclusion = 'PAYMENTS_CREDIT_CARD_MONTH_INCLUSION',
  PaymentsCreditCardNameInvalid = 'PAYMENTS_CREDIT_CARD_NAME_INVALID',
  PaymentsCreditCardNumberInvalid = 'PAYMENTS_CREDIT_CARD_NUMBER_INVALID',
  PaymentsCreditCardNumberInvalidFormat = 'PAYMENTS_CREDIT_CARD_NUMBER_INVALID_FORMAT',
  PaymentsCreditCardSessionId = 'PAYMENTS_CREDIT_CARD_SESSION_ID',
  PaymentsCreditCardVerificationValueBlank = 'PAYMENTS_CREDIT_CARD_VERIFICATION_VALUE_BLANK',
  PaymentsCreditCardVerificationValueInvalidForCardType = 'PAYMENTS_CREDIT_CARD_VERIFICATION_VALUE_INVALID_FOR_CARD_TYPE',
  PaymentsCreditCardYearExpired = 'PAYMENTS_CREDIT_CARD_YEAR_EXPIRED',
  PaymentsCreditCardYearInvalidExpiryYear = 'PAYMENTS_CREDIT_CARD_YEAR_INVALID_EXPIRY_YEAR',
  PaymentsFirstNameInvalid = 'PAYMENTS_FIRST_NAME_INVALID',
  PaymentsFirstNameRequired = 'PAYMENTS_FIRST_NAME_REQUIRED',
  PaymentsFirstNameTooLong = 'PAYMENTS_FIRST_NAME_TOO_LONG',
  PaymentsInvalidPostalCodeForCountry = 'PAYMENTS_INVALID_POSTAL_CODE_FOR_COUNTRY',
  PaymentsInvalidPostalCodeForZone = 'PAYMENTS_INVALID_POSTAL_CODE_FOR_ZONE',
  PaymentsLastNameInvalid = 'PAYMENTS_LAST_NAME_INVALID',
  PaymentsLastNameRequired = 'PAYMENTS_LAST_NAME_REQUIRED',
  PaymentsLastNameTooLong = 'PAYMENTS_LAST_NAME_TOO_LONG',
  PaymentsMethodRequired = 'PAYMENTS_METHOD_REQUIRED',
  PaymentsMethodUnavailable = 'PAYMENTS_METHOD_UNAVAILABLE',
  PaymentsPhoneNumberInvalid = 'PAYMENTS_PHONE_NUMBER_INVALID',
  PaymentsPhoneNumberRequired = 'PAYMENTS_PHONE_NUMBER_REQUIRED',
  PaymentsPostalCodeInvalid = 'PAYMENTS_POSTAL_CODE_INVALID',
  PaymentsPostalCodeRequired = 'PAYMENTS_POSTAL_CODE_REQUIRED',
  PaymentsShopifyPaymentsRequired = 'PAYMENTS_SHOPIFY_PAYMENTS_REQUIRED',
  PaymentsUnacceptablePaymentAmount = 'PAYMENTS_UNACCEPTABLE_PAYMENT_AMOUNT',
  PaymentsWalletContentMissing = 'PAYMENTS_WALLET_CONTENT_MISSING',
  TaxesDeliveryGroupIdNotFound = 'TAXES_DELIVERY_GROUP_ID_NOT_FOUND',
  TaxesLineIdNotFound = 'TAXES_LINE_ID_NOT_FOUND',
  TaxesMustBeDefined = 'TAXES_MUST_BE_DEFINED',
}

/** Cart submit for checkout completion is successful. */
export type Shopify_SubmitAlreadyAccepted = {
  __typename?: 'shopify_SubmitAlreadyAccepted';
  /** The ID of the cart completion attempt that will be used for polling for the result. */
  attemptId: Scalars['String']['output'];
};

/** Cart submit for checkout completion failed. */
export type Shopify_SubmitFailed = {
  __typename?: 'shopify_SubmitFailed';
  /** The URL of the checkout for the cart. */
  checkoutUrl: Maybe<Scalars['shopify_URL']['output']>;
  /** The list of errors that occurred from executing the mutation. */
  errors: Array<Shopify_SubmissionError>;
};

/** Cart submit for checkout completion is already accepted. */
export type Shopify_SubmitSuccess = {
  __typename?: 'shopify_SubmitSuccess';
  /** The ID of the cart completion attempt that will be used for polling for the result. */
  attemptId: Scalars['String']['output'];
};

/** Cart submit for checkout completion is throttled. */
export type Shopify_SubmitThrottled = {
  __typename?: 'shopify_SubmitThrottled';
  /**
   * UTC date time string that indicates the time after which clients should make their next
   * poll request. Any poll requests sent before this time will be ignored. Use this value to schedule the
   * next poll request.
   *
   */
  pollAfter: Scalars['shopify_DateTime']['output'];
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
  idempotencyKey: Scalars['String']['input'];
  /** Public Hash Key used for AndroidPay payments only. */
  identifier: InputMaybe<Scalars['String']['input']>;
  /** The amount and currency of the payment. */
  paymentAmount: Shopify_MoneyInput;
  /** A simple string or JSON containing the required payment data for the tokenized payment. */
  paymentData: Scalars['String']['input'];
  /** Whether to execute the payment in test mode, if possible. Test mode isn't supported in production stores. Defaults to `false`. */
  test: InputMaybe<Scalars['Boolean']['input']>;
  /** The type of payment token. */
  type: Shopify_PaymentTokenType;
};

/** Represents a resource that you can track the origin of the search traffic. */
export type Shopify_Trackable = {
  /** A URL parameters to be added to a page URL when it is linked from a GraphQL result. This allows for tracking the origin of the traffic. */
  trackingParameters: Maybe<Scalars['String']['output']>;
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
  test: Scalars['Boolean']['output'];
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
  quantityValue: Scalars['Float']['output'];
  /** The reference unit for the unit price measurement. */
  referenceUnit: Maybe<Shopify_UnitPriceMeasurementMeasuredUnit>;
  /** The reference value for the unit price measurement. */
  referenceValue: Scalars['Int']['output'];
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
  id: Scalars['ID']['output'];
  /** The old path to be redirected from. When the user visits this path, they'll be redirected to the target location. */
  path: Scalars['String']['output'];
  /** The target location where the user will be redirected to. */
  target: Scalars['String']['output'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of UrlRedirectEdge. */
  node: Shopify_UrlRedirect;
};

/** Represents an error in the input of a mutation. */
export type Shopify_UserError = Shopify_DisplayableError & {
  __typename?: 'shopify_UserError';
  /** The path to the input field that caused the error. */
  field: Maybe<Array<Scalars['String']['output']>>;
  /** The error message. */
  message: Scalars['String']['output'];
};

/** The input fields for a filter used to view a subset of products in a collection matching a specific variant option. */
export type Shopify_VariantOptionFilter = {
  /** The name of the variant option to filter on. */
  name: Scalars['String']['input'];
  /** The value of the variant option to filter on. */
  value: Scalars['String']['input'];
};

/** Represents a Shopify hosted video. */
export type Shopify_Video = Shopify_Media &
  Shopify_Node & {
    __typename?: 'shopify_Video';
    /** A word or phrase to share the nature or contents of a media. */
    alt: Maybe<Scalars['String']['output']>;
    /** A globally-unique ID. */
    id: Scalars['ID']['output'];
    /** The media content type. */
    mediaContentType: Shopify_MediaContentType;
    /** The presentation for a media. */
    presentation: Maybe<Shopify_MediaPresentation>;
    /** The preview image for the media. */
    previewImage: Maybe<Shopify_Image>;
    /** The sources for a video. */
    sources: Array<Shopify_VideoSource>;
  };

/** Represents a source for a Shopify hosted video. */
export type Shopify_VideoSource = {
  __typename?: 'shopify_VideoSource';
  /** The format of the video source. */
  format: Scalars['String']['output'];
  /** The height of the video. */
  height: Scalars['Int']['output'];
  /** The video MIME type. */
  mimeType: Scalars['String']['output'];
  /** The URL of the video. */
  url: Scalars['String']['output'];
  /** The width of the video. */
  width: Scalars['Int']['output'];
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
  /** fetch data from the table: "Checkout" */
  Checkout: Array<Checkout>;
  /** fetch data from the table: "Checkout" using primary key columns */
  Checkout_by_pk: Maybe<Checkout>;
  /** fetch data from the table in a streaming manner: "Checkout" */
  Checkout_stream: Array<Checkout>;
  /** fetch data from the table: "Collection" */
  Collection: Array<Collection>;
  /** fetch data from the table: "Collection" using primary key columns */
  Collection_by_pk: Maybe<Collection>;
  /** fetch data from the table in a streaming manner: "Collection" */
  Collection_stream: Array<Collection>;
  /** fetch data from the table: "Customer" */
  Customer: Array<Customer>;
  /** fetch data from the table: "Customer" using primary key columns */
  Customer_by_pk: Maybe<Customer>;
  /** fetch data from the table in a streaming manner: "Customer" */
  Customer_stream: Array<Customer>;
  /** fetch data from the table: "NegociationAgreement" */
  NegociationAgreement: Array<NegociationAgreement>;
  /** fetch data from the table: "NegociationAgreement" using primary key columns */
  NegociationAgreement_by_pk: Maybe<NegociationAgreement>;
  /** fetch data from the table in a streaming manner: "NegociationAgreement" */
  NegociationAgreement_stream: Array<NegociationAgreement>;
  /** fetch data from the table: "Payment" */
  Payment: Array<Payment>;
  /** fetch data from the table: "Payment" using primary key columns */
  Payment_by_pk: Maybe<Payment>;
  /** fetch data from the table in a streaming manner: "Payment" */
  Payment_stream: Array<Payment>;
  /** fetch data from the table: "Product" */
  Product: Array<Product>;
  /** fetch data from the table: "ProductVariant" */
  ProductVariant: Array<ProductVariant>;
  /** fetch data from the table: "ProductVariant" using primary key columns */
  ProductVariant_by_pk: Maybe<ProductVariant>;
  /** fetch data from the table in a streaming manner: "ProductVariant" */
  ProductVariant_stream: Array<ProductVariant>;
  /** fetch data from the table: "Product" using primary key columns */
  Product_by_pk: Maybe<Product>;
  /** fetch data from the table in a streaming manner: "Product" */
  Product_stream: Array<Product>;
  /** fetch data from the table: "Review" */
  Review: Array<Review>;
  /** fetch data from the table: "Review" using primary key columns */
  Review_by_pk: Maybe<Review>;
  /** fetch data from the table in a streaming manner: "Review" */
  Review_stream: Array<Review>;
  /** An array relationship */
  VendorReview: Array<VendorReview>;
  /** fetch data from the table: "VendorReview" using primary key columns */
  VendorReview_by_pk: Maybe<VendorReview>;
  /** fetch data from the table in a streaming manner: "VendorReview" */
  VendorReview_stream: Array<VendorReview>;
  /** fetch data from the table: "dbt.store_b2c_product_variant" */
  dbt_store_b2c_product_variant: Array<Dbt_Store_B2c_Product_Variant>;
  /** fetch data from the table in a streaming manner: "dbt.store_b2c_product_variant" */
  dbt_store_b2c_product_variant_stream: Array<Dbt_Store_B2c_Product_Variant>;
  /** fetch data from the table: "dbt.store_base_product" */
  dbt_store_base_product: Array<Dbt_Store_Base_Product>;
  /** fetch data from the table: "dbt.store_base_product" using primary key columns */
  dbt_store_base_product_by_pk: Maybe<Dbt_Store_Base_Product>;
  /** fetch data from the table in a streaming manner: "dbt.store_base_product" */
  dbt_store_base_product_stream: Array<Dbt_Store_Base_Product>;
  /** fetch data from the table: "dbt.store_base_product_variant" */
  dbt_store_base_product_variant: Array<Dbt_Store_Base_Product_Variant>;
  /** fetch data from the table: "dbt.store_base_product_variant" using primary key columns */
  dbt_store_base_product_variant_by_pk: Maybe<Dbt_Store_Base_Product_Variant>;
  /** fetch data from the table in a streaming manner: "dbt.store_base_product_variant" */
  dbt_store_base_product_variant_stream: Array<Dbt_Store_Base_Product_Variant>;
  /** fetch data from the table: "dbt.store_discount" */
  dbt_store_discount: Array<Dbt_Store_Discount>;
  /** fetch data from the table: "dbt.store_discount_collection" */
  dbt_store_discount_collection: Array<Dbt_Store_Discount_Collection>;
  /** fetch data from the table: "dbt.store_discount_collection" using primary key columns */
  dbt_store_discount_collection_by_pk: Maybe<Dbt_Store_Discount_Collection>;
  /** fetch data from the table in a streaming manner: "dbt.store_discount_collection" */
  dbt_store_discount_collection_stream: Array<Dbt_Store_Discount_Collection>;
  /** fetch data from the table in a streaming manner: "dbt.store_discount" */
  dbt_store_discount_stream: Array<Dbt_Store_Discount>;
  /** fetch data from the table: "dbt.store_exposed_product" */
  dbt_store_exposed_product: Array<Dbt_Store_Exposed_Product>;
  /** fetch data from the table: "dbt.store_exposed_product" using primary key columns */
  dbt_store_exposed_product_by_pk: Maybe<Dbt_Store_Exposed_Product>;
  /** fetch data from the table: "dbt.store_exposed_product_image" */
  dbt_store_exposed_product_image: Array<Dbt_Store_Exposed_Product_Image>;
  /** fetch data from the table: "dbt.store_exposed_product_image" using primary key columns */
  dbt_store_exposed_product_image_by_pk: Maybe<Dbt_Store_Exposed_Product_Image>;
  /** fetch data from the table in a streaming manner: "dbt.store_exposed_product_image" */
  dbt_store_exposed_product_image_stream: Array<Dbt_Store_Exposed_Product_Image>;
  /** fetch data from the table in a streaming manner: "dbt.store_exposed_product" */
  dbt_store_exposed_product_stream: Array<Dbt_Store_Exposed_Product>;
  /** fetch data from the table: "dbt.store_exposed_product_tag" */
  dbt_store_exposed_product_tag: Array<Dbt_Store_Exposed_Product_Tag>;
  /** fetch data from the table in a streaming manner: "dbt.store_exposed_product_tag" */
  dbt_store_exposed_product_tag_stream: Array<Dbt_Store_Exposed_Product_Tag>;
  /** fetch data from the table: "dbt.store_exposed_product_variant" */
  dbt_store_exposed_product_variant: Array<Dbt_Store_Exposed_Product_Variant>;
  /** fetch data from the table in a streaming manner: "dbt.store_exposed_product_variant" */
  dbt_store_exposed_product_variant_stream: Array<Dbt_Store_Exposed_Product_Variant>;
  /** fetch data from the table: "dbt.store_product_collection" */
  dbt_store_product_collection: Array<Dbt_Store_Product_Collection>;
  /** fetch data from the table: "dbt.store_product_collection" using primary key columns */
  dbt_store_product_collection_by_pk: Maybe<Dbt_Store_Product_Collection>;
  /** fetch data from the table in a streaming manner: "dbt.store_product_collection" */
  dbt_store_product_collection_stream: Array<Dbt_Store_Product_Collection>;
  /** fetch data from the table: "auth.users" */
  users: Array<Users>;
  /** fetch data from the table in a streaming manner: "auth.users" */
  users_stream: Array<Users>;
};

export type Subscription_RootCheckoutArgs = {
  distinct_on: InputMaybe<Array<Checkout_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Checkout_Order_By>>;
  where: InputMaybe<Checkout_Bool_Exp>;
};

export type Subscription_RootCheckout_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootCheckout_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Checkout_Stream_Cursor_Input>>;
  where: InputMaybe<Checkout_Bool_Exp>;
};

export type Subscription_RootCollectionArgs = {
  distinct_on: InputMaybe<Array<Collection_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Collection_Order_By>>;
  where: InputMaybe<Collection_Bool_Exp>;
};

export type Subscription_RootCollection_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootCollection_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Collection_Stream_Cursor_Input>>;
  where: InputMaybe<Collection_Bool_Exp>;
};

export type Subscription_RootCustomerArgs = {
  distinct_on: InputMaybe<Array<Customer_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Customer_Order_By>>;
  where: InputMaybe<Customer_Bool_Exp>;
};

export type Subscription_RootCustomer_By_PkArgs = {
  authUserId: Scalars['uuid']['input'];
};

export type Subscription_RootCustomer_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Customer_Stream_Cursor_Input>>;
  where: InputMaybe<Customer_Bool_Exp>;
};

export type Subscription_RootNegociationAgreementArgs = {
  distinct_on: InputMaybe<Array<NegociationAgreement_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<NegociationAgreement_Order_By>>;
  where: InputMaybe<NegociationAgreement_Bool_Exp>;
};

export type Subscription_RootNegociationAgreement_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootNegociationAgreement_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<NegociationAgreement_Stream_Cursor_Input>>;
  where: InputMaybe<NegociationAgreement_Bool_Exp>;
};

export type Subscription_RootPaymentArgs = {
  distinct_on: InputMaybe<Array<Payment_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Payment_Order_By>>;
  where: InputMaybe<Payment_Bool_Exp>;
};

export type Subscription_RootPayment_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootPayment_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Payment_Stream_Cursor_Input>>;
  where: InputMaybe<Payment_Bool_Exp>;
};

export type Subscription_RootProductArgs = {
  distinct_on: InputMaybe<Array<Product_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Product_Order_By>>;
  where: InputMaybe<Product_Bool_Exp>;
};

export type Subscription_RootProductVariantArgs = {
  distinct_on: InputMaybe<Array<ProductVariant_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ProductVariant_Order_By>>;
  where: InputMaybe<ProductVariant_Bool_Exp>;
};

export type Subscription_RootProductVariant_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootProductVariant_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ProductVariant_Stream_Cursor_Input>>;
  where: InputMaybe<ProductVariant_Bool_Exp>;
};

export type Subscription_RootProduct_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootProduct_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Product_Stream_Cursor_Input>>;
  where: InputMaybe<Product_Bool_Exp>;
};

export type Subscription_RootReviewArgs = {
  distinct_on: InputMaybe<Array<Review_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Review_Order_By>>;
  where: InputMaybe<Review_Bool_Exp>;
};

export type Subscription_RootReview_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootReview_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Review_Stream_Cursor_Input>>;
  where: InputMaybe<Review_Bool_Exp>;
};

export type Subscription_RootVendorReviewArgs = {
  distinct_on: InputMaybe<Array<VendorReview_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<VendorReview_Order_By>>;
  where: InputMaybe<VendorReview_Bool_Exp>;
};

export type Subscription_RootVendorReview_By_PkArgs = {
  reviewId: Scalars['String']['input'];
};

export type Subscription_RootVendorReview_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<VendorReview_Stream_Cursor_Input>>;
  where: InputMaybe<VendorReview_Bool_Exp>;
};

export type Subscription_RootDbt_Store_B2c_Product_VariantArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_B2c_Product_Variant_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_B2c_Product_Variant_Order_By>>;
  where: InputMaybe<Dbt_Store_B2c_Product_Variant_Bool_Exp>;
};

export type Subscription_RootDbt_Store_B2c_Product_Variant_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dbt_Store_B2c_Product_Variant_Stream_Cursor_Input>>;
  where: InputMaybe<Dbt_Store_B2c_Product_Variant_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Base_ProductArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Base_Product_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Base_Product_Order_By>>;
  where: InputMaybe<Dbt_Store_Base_Product_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Base_Product_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootDbt_Store_Base_Product_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dbt_Store_Base_Product_Stream_Cursor_Input>>;
  where: InputMaybe<Dbt_Store_Base_Product_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Base_Product_VariantArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Base_Product_Variant_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Base_Product_Variant_Order_By>>;
  where: InputMaybe<Dbt_Store_Base_Product_Variant_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Base_Product_Variant_By_PkArgs = {
  shopify_id: Scalars['bigint']['input'];
};

export type Subscription_RootDbt_Store_Base_Product_Variant_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dbt_Store_Base_Product_Variant_Stream_Cursor_Input>>;
  where: InputMaybe<Dbt_Store_Base_Product_Variant_Bool_Exp>;
};

export type Subscription_RootDbt_Store_DiscountArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Discount_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Discount_Order_By>>;
  where: InputMaybe<Dbt_Store_Discount_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Discount_CollectionArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Discount_Collection_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Discount_Collection_Order_By>>;
  where: InputMaybe<Dbt_Store_Discount_Collection_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Discount_Collection_By_PkArgs = {
  collection_internal_id: Scalars['String']['input'];
  discount_id: Scalars['bigint']['input'];
};

export type Subscription_RootDbt_Store_Discount_Collection_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dbt_Store_Discount_Collection_Stream_Cursor_Input>>;
  where: InputMaybe<Dbt_Store_Discount_Collection_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Discount_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dbt_Store_Discount_Stream_Cursor_Input>>;
  where: InputMaybe<Dbt_Store_Discount_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Exposed_ProductArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Exposed_Product_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Exposed_Product_Order_By>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Exposed_Product_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootDbt_Store_Exposed_Product_ImageArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Exposed_Product_Image_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Exposed_Product_Image_Order_By>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Image_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Exposed_Product_Image_By_PkArgs = {
  shopify_id: Scalars['bigint']['input'];
};

export type Subscription_RootDbt_Store_Exposed_Product_Image_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<
    InputMaybe<Dbt_Store_Exposed_Product_Image_Stream_Cursor_Input>
  >;
  where: InputMaybe<Dbt_Store_Exposed_Product_Image_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Exposed_Product_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dbt_Store_Exposed_Product_Stream_Cursor_Input>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Exposed_Product_TagArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Exposed_Product_Tag_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Exposed_Product_Tag_Order_By>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Tag_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Exposed_Product_Tag_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dbt_Store_Exposed_Product_Tag_Stream_Cursor_Input>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Tag_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Exposed_Product_VariantArgs = {
  distinct_on: InputMaybe<
    Array<Dbt_Store_Exposed_Product_Variant_Select_Column>
  >;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Exposed_Product_Variant_Order_By>>;
  where: InputMaybe<Dbt_Store_Exposed_Product_Variant_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Exposed_Product_Variant_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<
    InputMaybe<Dbt_Store_Exposed_Product_Variant_Stream_Cursor_Input>
  >;
  where: InputMaybe<Dbt_Store_Exposed_Product_Variant_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Product_CollectionArgs = {
  distinct_on: InputMaybe<Array<Dbt_Store_Product_Collection_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Dbt_Store_Product_Collection_Order_By>>;
  where: InputMaybe<Dbt_Store_Product_Collection_Bool_Exp>;
};

export type Subscription_RootDbt_Store_Product_Collection_By_PkArgs = {
  collection_id: Scalars['String']['input'];
  product_id: Scalars['String']['input'];
};

export type Subscription_RootDbt_Store_Product_Collection_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dbt_Store_Product_Collection_Stream_Cursor_Input>>;
  where: InputMaybe<Dbt_Store_Product_Collection_Bool_Exp>;
};

export type Subscription_RootUsersArgs = {
  distinct_on: InputMaybe<Array<Users_Select_Column>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<Users_Order_By>>;
  where: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where: InputMaybe<Users_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq: InputMaybe<Scalars['timestamp']['input']>;
  _gt: InputMaybe<Scalars['timestamp']['input']>;
  _gte: InputMaybe<Scalars['timestamp']['input']>;
  _in: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['timestamp']['input']>;
  _lte: InputMaybe<Scalars['timestamp']['input']>;
  _neq: InputMaybe<Scalars['timestamp']['input']>;
  _nin: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq: InputMaybe<Scalars['timestamptz']['input']>;
  _gt: InputMaybe<Scalars['timestamptz']['input']>;
  _gte: InputMaybe<Scalars['timestamptz']['input']>;
  _in: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['timestamptz']['input']>;
  _lte: InputMaybe<Scalars['timestamptz']['input']>;
  _neq: InputMaybe<Scalars['timestamptz']['input']>;
  _nin: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** columns and relationships of "auth.users" */
export type Users = {
  __typename?: 'users';
  avatarUrl: Scalars['String']['output'];
  /** An object relationship */
  customer: Maybe<Customer>;
  displayName: Scalars['String']['output'];
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
  avatarUrl: InputMaybe<Scalars['String']['input']>;
  displayName: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq: InputMaybe<Scalars['uuid']['input']>;
  _gt: InputMaybe<Scalars['uuid']['input']>;
  _gte: InputMaybe<Scalars['uuid']['input']>;
  _in: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['uuid']['input']>;
  _lte: InputMaybe<Scalars['uuid']['input']>;
  _neq: InputMaybe<Scalars['uuid']['input']>;
  _nin: InputMaybe<Array<Scalars['uuid']['input']>>;
};

export type GetAvailableDiscountsQueryVariables = Exact<{
  discountTitles: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
}>;

export type GetAvailableDiscountsQuery = {
  __typename?: 'query_root';
  dbt_store_discount: Array<{
    __typename?: 'dbt_store_discount';
    ends_at: any | null;
    starts_at: any;
    id: number;
    value: any;
    value_type: string;
    code: string | null;
    title: string;
    min_amount: any | null;
    collection: Array<{
      __typename?: 'dbt_store_discount_collection';
      collection_internal_id: string;
    }>;
  }>;
};

export type ProductCardFieldsFragment = {
  __typename?: 'dbt_store_exposed_product';
  handle: string;
  vendor: string;
  title: string;
  description: string | null;
  productType: string;
  numberOfViews: number;
  status: any;
  product: {
    __typename?: 'dbt_store_base_product';
    id: string;
    shopifyId: number;
    collections: Array<{
      __typename?: 'dbt_store_product_collection';
      collection_id: string;
    }>;
    variants: Array<{
      __typename?: 'dbt_store_base_product_variant';
      id: string | null;
      shopifyId: number;
      exposedVariant: {
        __typename?: 'dbt_store_exposed_product_variant';
        inventory_quantity: number;
        option1Name: string | null;
        option1: string | null;
        option2Name: string | null;
        option2: string | null;
        option3Name: string | null;
        option3: string | null;
        condition: any | null;
        isRefurbished: boolean | null;
      } | null;
      b2cVariant: {
        __typename?: 'dbt_store_b2c_product_variant';
        price: any;
        compare_at_price: any | null;
      } | null;
    }>;
    tags: Array<{
      __typename?: 'dbt_store_exposed_product_tag';
      tag: string;
      value: string;
    }>;
    images: Array<{
      __typename?: 'dbt_store_exposed_product_image';
      alt: string | null;
      src: string;
      height: number;
      width: number;
    }>;
  } | null;
};

export type VendorDetailsFragment = {
  __typename?: 'Customer';
  isPro: boolean;
  sellerName: string | null;
  shipmentTimeframe: any | null;
  profilePictureShopifyCdnUrl: string | null;
  createdAt: any;
  authUserId: any;
  VendorReviews: Array<{
    __typename?: 'VendorReview';
    Review: {
      __typename?: 'Review';
      content: string | null;
      createdAt: any;
      id: string;
      rating: number;
      title: string;
      authorNickname: string | null;
      Customer: {
        __typename?: 'Customer';
        createdAt: any;
        sellerName: string | null;
        profilePictureShopifyCdnUrl: string | null;
      };
    };
  }>;
  negociationAgreements: Array<{
    __typename?: 'NegociationAgreement';
    maxAmountPercent: number;
  }>;
};

export type FetchProductsQueryVariables = Exact<{
  productIds: InputMaybe<
    Array<Scalars['bigint']['input']> | Scalars['bigint']['input']
  >;
  productHandles: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
}>;

export type FetchProductsQuery = {
  __typename?: 'query_root';
  Product: Array<{
    __typename?: 'Product';
    storeExposedProduct: {
      __typename?: 'dbt_store_exposed_product';
      handle: string;
      vendor: string;
      title: string;
      description: string | null;
      productType: string;
      numberOfViews: number;
      status: any;
      product: {
        __typename?: 'dbt_store_base_product';
        id: string;
        shopifyId: number;
        collections: Array<{
          __typename?: 'dbt_store_product_collection';
          collection_id: string;
        }>;
        variants: Array<{
          __typename?: 'dbt_store_base_product_variant';
          id: string | null;
          shopifyId: number;
          exposedVariant: {
            __typename?: 'dbt_store_exposed_product_variant';
            inventory_quantity: number;
            option1Name: string | null;
            option1: string | null;
            option2Name: string | null;
            option2: string | null;
            option3Name: string | null;
            option3: string | null;
            condition: any | null;
            isRefurbished: boolean | null;
          } | null;
          b2cVariant: {
            __typename?: 'dbt_store_b2c_product_variant';
            price: any;
            compare_at_price: any | null;
          } | null;
        }>;
        tags: Array<{
          __typename?: 'dbt_store_exposed_product_tag';
          tag: string;
          value: string;
        }>;
        images: Array<{
          __typename?: 'dbt_store_exposed_product_image';
          alt: string | null;
          src: string;
          height: number;
          width: number;
        }>;
      } | null;
    } | null;
    Vendor: {
      __typename?: 'Customer';
      isPro: boolean;
      sellerName: string | null;
      shipmentTimeframe: any | null;
      profilePictureShopifyCdnUrl: string | null;
      createdAt: any;
      authUserId: any;
      VendorReviews: Array<{
        __typename?: 'VendorReview';
        Review: {
          __typename?: 'Review';
          content: string | null;
          createdAt: any;
          id: string;
          rating: number;
          title: string;
          authorNickname: string | null;
          Customer: {
            __typename?: 'Customer';
            createdAt: any;
            sellerName: string | null;
            profilePictureShopifyCdnUrl: string | null;
          };
        };
      }>;
      negociationAgreements: Array<{
        __typename?: 'NegociationAgreement';
        maxAmountPercent: number;
      }>;
    };
  }>;
};

export type ReviewsFieldsFragment = {
  __typename?: 'VendorReview';
  Review: {
    __typename?: 'Review';
    content: string | null;
    createdAt: any;
    id: string;
    rating: number;
    title: string;
    authorNickname: string | null;
    Customer: {
      __typename?: 'Customer';
      createdAt: any;
      sellerName: string | null;
      profilePictureShopifyCdnUrl: string | null;
    };
  };
};

export type FetchCollectionPageDataQueryVariables = Exact<{
  collectionHandle: Scalars['String']['input'];
  vendorSellerName: Scalars['String']['input'];
}>;

export type FetchCollectionPageDataQuery = {
  __typename?: 'query_root';
  Collection: Array<{
    __typename?: 'Collection';
    shopifyId: string;
    handle: string;
    type: any | null;
    description: string | null;
    title: string | null;
    featuredImageSrc: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    parentCollection: {
      __typename?: 'Collection';
      shortName: string | null;
      handle: string;
      shopifyId: string;
      title: string | null;
      childCollections: Array<{
        __typename?: 'Collection';
        handle: string;
        shortName: string | null;
        shopifyId: string;
        title: string | null;
      }>;
      parentCollection: {
        __typename?: 'Collection';
        shortName: string | null;
        handle: string;
        shopifyId: string;
        title: string | null;
        parentCollection: {
          __typename?: 'Collection';
          shortName: string | null;
          handle: string;
          shopifyId: string;
          title: string | null;
        } | null;
      } | null;
    } | null;
    childCollections: Array<{
      __typename?: 'Collection';
      shortName: string | null;
      handle: string;
      title: string | null;
      featuredImageSrc: string | null;
    }>;
  }>;
  vendorData: Array<{
    __typename?: 'Customer';
    sellerName: string | null;
    coverPictureShopifyCdnUrl: string | null;
    description: string | null;
    profilePictureShopifyCdnUrl: string | null;
    VendorReviews: Array<{
      __typename?: 'VendorReview';
      Review: {
        __typename?: 'Review';
        content: string | null;
        createdAt: any;
        id: string;
        rating: number;
        title: string;
        authorNickname: string | null;
        Customer: {
          __typename?: 'Customer';
          createdAt: any;
          sellerName: string | null;
          profilePictureShopifyCdnUrl: string | null;
        };
      };
    }>;
  }>;
};

export type FetchProductMetadataQueryVariables = Exact<{
  productHandle: InputMaybe<Scalars['String']['input']>;
}>;

export type FetchProductMetadataQuery = {
  __typename?: 'query_root';
  shopify: {
    __typename?: 'shopifyQueryRoot';
    product: {
      __typename?: 'shopify_Product';
      productType: string;
      featuredImage: {
        __typename?: 'shopify_Image';
        src: any;
        width: number | null;
        height: number | null;
      } | null;
      seo: {
        __typename?: 'shopify_SEO';
        description: string | null;
        title: string | null;
      };
    } | null;
  } | null;
};
