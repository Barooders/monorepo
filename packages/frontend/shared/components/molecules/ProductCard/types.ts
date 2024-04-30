import { Condition } from '@/components/pages/SellingForm/types';
import { Discount, ImageType, Url } from '@/types';
import { ReviewType } from '../Reviews/container';
import { AvailableOffers } from './config';

export type CardLabel = {
  position?: 'left' | 'right';
  color: 'white' | 'blue' | 'purple' | 'primary';
  content: React.ReactNode;
};

export type RawVariant = {
  option1Name: string | null;
  option1: string | null;
  option2Name: string | null;
  option2: string | null;
  option3Name: string | null;
  option3: string | null;
};

export type Variant = {
  name: string;
  id: string;
  shopifyId: string;
  price: number;
  compareAtPrice: number;
  available: boolean;
  isRefurbished: boolean;
};

export type ProductMultiVariants = {
  id: string;
  shopifyId: string;
  labels: CardLabel[];
  vendor: {
    id: string | null;
    name: string | null;
    profilePicture: Url | null;
    createdAt: string;
    shipmentTimeframeSentence: string | null;
    isPro: boolean;
    negociationMaxAmountPercent: number | null;
    reviews: {
      count: number;
      averageRating?: number;
    };
  };
  images: (ImageType | null)[];
  title: string;
  description?: string;
  commissionAmount?: number;
  productType: string;
  variantCondition: Condition;
  numberOfViews: number;
  hasRefurbishedVariant: boolean;
  tags: Record<string, string>;
  handle: string;
  intent?: 'highlight' | 'card' | 'page' | 'small-card';
  isSoldOut: boolean;
  variantId?: string;
  variantShopifyId?: string;
  variants: Variant[];
  className?: string;
  availableOffers?: AvailableOffers[];
  reviews: ReviewType[];
  collections: string[];
};

export type ProductSingleVariant = ProductMultiVariants & {
  compareAtPrice: number;
  price: number;
  discounts: Discount[];
  productLink: Url;
  setSelectedVariant: (variantId: string) => void;
};

export type B2BProductCardProps = {
  tags: Record<string, string>;
  variantCondition: Condition;
  image?: ImageType;
  title: string;
  price: number;
  largestBundlePrice?: number;
  compareAtPrice: number;
  stock: number;
  productType: string;
  handle: string;
  shopifyId: string;
  id: string;
  vendorId: string;
};

export type B2BProductPanelProps = {
  tags: Record<string, string>;
  variantCondition: Condition;
  title: string;
  price: number;
  largestBundlePrice?: number;
  compareAtPrice: number;
  stock: number;
  productType: string;
  handle: string;
  shopifyId: string;
  id: string;
  images: string[];
  description: string;
  isSoldOut: boolean;
  numberOfViews: number;
  hasOpenedPriceOffer: boolean;
  vendorId: string;
  openDetails: (productInternalId: string) => void;
};
