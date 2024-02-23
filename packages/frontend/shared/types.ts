import { CLAIMS_KEY } from '../shared/config';
import { Condition } from './components/pages/SellingForm/types';

export type HasuraToken = {
  accessToken: string;
  accessTokenExpiresIn: number;
  creationDate: Timestamp;
  refreshToken: Uuid;
  user: User;
};

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

export enum AccountSections {
  ORDERS = 'orders',
  ONLINE_PRODUCTS = 'onlineProducts',
  PURCHASES = 'purchases',
  FAVORITES = 'favorites',
}

export type HasuraAuthJwtType = {
  [CLAIMS_KEY]: {
    'x-hasura-shopifyCustomerId'?: string;
    'x-hasura-sellerName'?: string;
    'x-hasura-allowed-roles': string[];
    'x-hasura-default-role': string;
    'x-hasura-user-id': string;
    'x-hasura-user-is-anonymous': 'true' | 'false';
  };
  sub: string;
  iat: number;
  exp: number;
  iss: 'hasura-auth';
};

export type User = {
  id: Uuid;
  createdAt: Timestamp;
  displayName: string;
  avatarUrl: Url | null;
  locale: Locale;
  isAnonymous: boolean;
  defaultRole: HasuraUserRole;
  emailVerified: boolean;
  phoneNumber: PhoneNumber | null;
  phoneNumberVerified: boolean;
  activeMfaType: null;
  roles: HasuraUserRole[];
  metadata: Record<string, unknown>;
  email: string;
};

export type HasuraUserRole =
  | 'public'
  | 'registered_user'
  | 'me'
  | 'admin'
  | 'me_as_customer'
  | 'me_as_vendor';

export type ProductAPI = {
  availableForSale: boolean;
  featuredImage: {
    altText: string;
    height: number;
    url: URL;
    width: number;
    transformedSrc: URL;
  };
  handle: Slug;
  id: ShopifyGlobalId;
  vendor: string;
  variants: {
    nodes: {
      price: Price;
      compareAtPrice: Price | null;
    }[];
  };
  title: string;
  tags: Tag[];
  productType: string;
};

export type Product = {
  availableForSale: boolean;
  featuredImage: {
    altText: string;
    height: number;
    width: number;
    src: URL;
  };
  handle: Slug;
  id: ShopifyGlobalId;
  vendor: string;
  price: Price;
  compareAtPrice?: Price;
  title: string;
  state?: string;
  brand?: string;
  model?: string;
  tags: Tag[];
  productType: string;
};

export type VendorAPI = {
  authUserId: Uuid;
  coverPictureShopifyCdnUrl: Url;
  description: string;
  firstName: string;
  id: Uuid;
  isPro: boolean;
  lastName: string;
  profilePictureShopifyCdnUrl: Url;
  rating: number | null;
  sellerName: string;
  shopifyId: ShopifyId;
};

type Price = {
  amount: string;
  currencyCode: CurrencyCode;
};

export type HitSearchType = {
  variant_shopify_id: number;
  variant_internal_id: string | null;
  title: string;
  vendor: string;
  vendor_informations?: {
    reviews: {
      count?: number;
      average_rating?: number;
    };
  };
  meta: {
    barooders: {
      owner: 'b2c' | 'c2c';
      product_discount_range: string;
    };
  };
  product_type: string;
  is_refurbished?: string;
  condition: Condition;
  variant_title: string;
  handle: string;
  inventory_quantity: number;
  array_tags: Record<string, string[]>;
  computed_scoring: number;
  price: number;
  product_shopify_id: number;
  product_internal_id: string;
  product_image?: string;
  compare_at_price: number;
  collection_internal_ids: string[];
  collection_handles: string[];
};

export type FreeShippingDiscount = {
  valueType: 'free_shipping';
  value: null;
  hideReduction: true;
};

export type LoweringPriceDiscount = {
  valueType: 'lowering_price';
  value: null;
  hideReduction: true;
};

type PriceDiscount = {
  valueType: 'percentage' | 'fixed_amount';
  value: number;
  hideReduction: boolean;
};

export type Discount = {
  collections: string[];
  title: string;
  code?: string;
  startsAt?: Date;
  endsAt?: Date;
  id?: string;
  label: string;
  minAmount?: number;
} & (LoweringPriceDiscount | FreeShippingDiscount | PriceDiscount);

export type ListArticle = {
  imageSrc: string | null;
  blurb: string | null;
  title: string;
  tags: string[];
  author: string;
  createdAt: Date;
  handle: string;
};

export type FullArticle = ListArticle & {
  htmlContent: string;
  seoDescription: string;
  seoTitle: string;
};

export type AppRouterPage<
  ParamsType = null,
  SearchParamsType = null,
> = (props: {
  params: ParamsType;
  searchParams: SearchParamsType;
}) => Promise<React.ReactNode>;

// Value Objects

export type URL = string;
export type Slug = string;
export type ShopifyGlobalId = string;
export type ShopifyId = number;
export type CurrencyCode = string;
export type Tag = string;
export type Timestamp = number;
export type Url = string;
export type Uuid = string;
export type Email = string;
export type PhoneNumber = string;
export type Location = {
  address: string;
  zipcode: string;
  city: string;
  country: string;
};
export type Locale = 'fr';
export type ImageType = {
  src: Url;
  altText: string;
  width: number | null;
  height: number | null;
};

export type ConversationType = {
  id: string;
  customerId: string;
  vendorId: string;
  productId: string;
};

export type NegociationAgreementType = {
  productType: string | null;
  maxAmountPercent: number;
};

export type PriceOffer = {
  id: string | null;
  newPrice: number;
  initiatorId: string;
  discountCode: string | null;
  status: PriceOfferStatus;
};

export enum PriceOfferStatus {
  PROPOSED = 'PROPOSED',
  DECLINED = 'DECLINED',
  ACCEPTED = 'ACCEPTED',
  CANCELED = 'CANCELED',
  BOUGHT_WITH = 'BOUGHT_WITH',
  BOUGHT_WITHOUT = 'BOUGHT_WITHOUT',
}
