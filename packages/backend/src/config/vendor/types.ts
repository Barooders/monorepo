import { Condition, ProductStatus } from '@libs/domain/prisma.main.client';
import { RecursivePartial } from '@libs/types/recursive-partial.type';

export const UNUSED_VENDOR_ID = 'unused-vendor-id';
export const enum VendorType {
  PRESTASHOP = 'prestashop',
  TUVALUM = 'tuvalum',
  SHOPIFY = 'shopify',
  SCRAPFLY = 'scrapfly',
  WOO_COMMERCE = 'woocommerce',
  CSV = 'csv',
  XML = 'xml',
}

export type SynchronizedProVendor =
  | 'agava'
  | 'agava_parts'
  | 'agava_presales'
  | 'all_cycles'
  | 'alpin_store'
  | 'alpin_store_orders'
  | 'bcycles'
  | 'horizons_angers'
  | 'bernaudeau_woo'
  | 'bbbike'
  | 'bicipedia'
  | 'ciklet'
  | 'bewak'
  | 'dayak'
  | 'bewak_excluded_brands'
  | 'bikef'
  | 'chris_bikes'
  | 'montanini'
  | 'velosport34'
  | 'paname_bicis'
  | 'pilat'
  | 'milla_bikes'
  | 'lario_ebike'
  | 'club_in_sport'
  | 'cycling_store'
  | 'cyclink'
  | 'darosa_parts'
  | 'darosa_bikes'
  | 'fastlap'
  | 'velo_emotion'
  | 'baroudeur_cycles'
  | 'roue_liber'
  | 'daz_bike'
  | 'ebs'
  | 'elettronic'
  | 'everide'
  | 'ferrareis'
  | 'fiets'
  | 'freeglisse'
  | 'freeride'
  | 'funbike'
  | 'gary_bom'
  | 'hbe_shopify'
  | 'jbikes'
  | 'joost_bikes'
  | 'kite_spirit'
  | 'le_bon_coin'
  | 'le_hollandais'
  | 'loewi'
  | 'savoldelli'
  | 'manufaktur'
  | 'matkite'
  | 'sanferbike'
  | 'bike_xtreme'
  | 'mbspro'
  | 'used_elite_bikes'
  | 'gem_bikes'
  | 'mint_bikes'
  | 'moulin_a_velos'
  | 'mvh_cycles'
  | 'nordics_value'
  | 'pastel'
  | 'projet_boussole'
  | 'recocycle'
  | 'sbikes'
  | 'semotion'
  | 'skidoc'
  | 'tch'
  | 'techni_cycles'
  | 'tnc'
  | 'tribici_presta'
  | 'trocsport'
  | 'tuvalum'
  | 'velo_meldois'
  | 'velosport20'
  | 'willemd'
  | 'zyclora';

export enum BrandFilterAction {
  ONLY = 'only',
  EXCLUDE = 'exclude',
}

interface CommonCatalogConfig {
  skipProductUpdate?: boolean;
  shouldIgnoreCheapBikesBelow150?: boolean;
  minimalPriceInCents?: number;
  defaultDescription?: string;
  defaultProductCondition?: Condition;
  parsedTagKeysFromDescription?: string[];
  translateDescription?: boolean;
  variantOptionTagsWithCategorySuffix?: string[];
  showExternalIdInDescription?: boolean;
  commissionPercentToAdd?: number;
  priceMultiplier?: number;
  priceCorrection?: number;
  minimumDiscount?: number;
  defaultPublishedProductStatus?: ProductStatus;
  descriptionPrefix?: string;
  descriptionSuffix?: string;
  ignoredVariants?: string[];
  brandFilter?: { names: string[]; action: BrandFilterAction };
  excludedTitles?: string[];
}

interface PrestashopCatalogConfig {
  categoriesToFilterInFetch?: number[];
  externalLanguageId?: string;
  fetchRecursiveCategories?: boolean;
}

interface WooCommerceCatalogConfig {
  allProductsPathOverride?: string;
  mapSingleVariant?: boolean;
  stringifySingleItemArray?: boolean;
}

interface XMLCatalogConfig {
  fields: {
    variant: string;
    productId: string;
    productType: string;
    variantId: string;
    variantCondition: string;
    productTitle: string;
    description: string;
    tags: string[];
    images: string[];
    inventoryQuantity: string;
    price: string;
    compareAtPrice: string;
    option1?: {
      key: string;
      value: string;
    };
    option2?: {
      key: string;
      value: string;
    };
    option3?: {
      key: string;
      value: string;
    };
    productEANCode?: string;
  };
}

interface CSVCatalogConfig {
  textTransformer?: (input: string) => string;
  columns: {
    isActive?: number;
    productId: number;
    productType: number[];
    variantId: number;
    variantCondition: number;
    productTitle: number;
    description?: number[];
    tags: number[];
    images: number[];
    inventoryQuantity?: number;
    price: number;
    compareAtPrice: number;
    option1?: number;
    option2?: number;
    option3?: number;
    productEANCode?: number;
  };
}

interface ScrapflyCatalogConfig {
  productCollectionHandle?: string;
  isAvailable?: (apiContent: string) => boolean;
  mapReferenceUrl?: (url: string) =>
    | {
        status: 'success';
        url: string;
      }
    | {
        status: 'error';
        message: string;
      };
}

interface CommonOrderConfig {
  isSyncActivated: boolean;
}

interface ShopifyOrderConfig {
  sendDiscountedPrice?: boolean;
  sendRealCustomerEmail?: boolean;
}

interface PrestashopOrderConfig {
  customerDefaultGroupId: string;
  customerGroupId?: string;
  countryId: string; //TODO: Get country from user country
  currencyId: string;
  langId: string;
  shopId: string;
  shopGroupId: string;
  carrierSolution: string;
  paymentModule: string;
  paymentMethodName: string;
  orderStateId: string;
  getShippingCost: (input: {
    weight?: number;
    productsTotalPrice: number;
    productType: string;
  }) => number;
  forceOrderStatusAfterCreation?: boolean;
  useExternalVariantIdAsCombinationId?: boolean;
  disableStockCheckBeforeOrder?: boolean;
  trackingUrlBaseUrl?: string;
  firstNameSuffix?: string;
  fetchProductWeightForShippingCompute?: boolean;
}

interface SynchroConfig {
  commandName: 'updateProductStatuses' | 'syncProducts';
  cron: string;
}

export interface FullVendorConfig {
  slug: SynchronizedProVendor;
  mappingKey: MappingKey;
  type: VendorType;
  apiUrl: string;
  vendorId: string;
  synchros: SynchroConfig[];
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  username?: string;
  password?: string;
  catalog: {
    common?: CommonCatalogConfig;
    scrapfly?: ScrapflyCatalogConfig;
    prestashop?: PrestashopCatalogConfig;
    wooCommerce?: WooCommerceCatalogConfig;
    csv?: CSVCatalogConfig;
    xml?: XMLCatalogConfig;
  };
  order?: {
    common: CommonOrderConfig;
    shopify?: ShopifyOrderConfig;
    prestashop?: PrestashopOrderConfig;
  };
}

export interface BrandFilter {
  names: string[];
  action: BrandFilterAction;
}
export interface ShippingCostInput {
  weight?: number;
  productsTotalPrice: number;
  productType: string;
}

export type VendorConfig = FullVendorConfig & {
  vendorName: string;
};

export type AllBaseVendorsConfig = {
  [key in SynchronizedProVendor]: Omit<
    FullVendorConfig,
    'vendorId' | 'synchros'
  >;
};

export type AllVendorsConfigInterface = {
  [key in SynchronizedProVendor]: FullVendorConfig;
};

export type EnvVendorsConfig = {
  [key in SynchronizedProVendor]: RecursivePartial<FullVendorConfig> & {
    vendorId: string;
    synchros: SynchroConfig[];
  };
};

export type MappingKey = VendorType | SynchronizedProVendor;
