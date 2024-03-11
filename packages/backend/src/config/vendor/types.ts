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
  | 'bike_point'
  | 'alpin_store_orders'
  | 'bcycles'
  | 'horizons_angers'
  | 'bernaudeau_woo'
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
  | 'manufaktur'
  | 'matkite'
  | 'bike_xtreme'
  | 'mbspro'
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

export interface FullVendorConfig {
  slug: SynchronizedProVendor;
  mappingKey: MappingKey;
  type: VendorType;
  apiUrl: string;
  vendorId: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  username?: string;
  password?: string;
  catalog?: {
    skipProductUpdate?: boolean;
    externalVendorId?: string;
    productCollectionHandle?: string;
    shouldIgnoreCheapBikesBelow150?: boolean;
    minimalPriceInCents?: number;
    categoriesToFilterInFetch?: number[];
    defaultDescription?: string;
    mapMultipleVariants?: boolean;
    defaultProductCondition?: Condition;
    parsedTagKeysFromDescription?: string[];
    isAvailable?: (apiContent: string) => boolean;
    mapReferenceUrl?: (url: string) => string;
    translateDescription?: boolean;
    variantOptionTagsWithCategorySuffix?: string[];
    showExternalIdInDescription?: boolean;
    commissionPercentToAdd?: number;
    priceMultiplier?: number;
    minimumDiscount?: number;
    externalLanguageId?: string;
    defaultPublishedProductStatus?: ProductStatus;
    descriptionPrefix?: string;
    descriptionSuffix?: string;
    ignoredVariants?: string[];
    brandFilter?: BrandFilter;
    excludedTitles?: string[];
    textTransformer?: (input: string) => string;
    csvColumns?: {
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
    xmlFields?: {
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
  };
  order?: {
    isSyncActivated: boolean;
    sendDiscountedPrice?: boolean;
    sendRealCustomerEmail?: boolean;
    forceOrderStatusAfterCreation?: boolean;
    useExternalVariantIdAsCombinationId?: boolean;
    disableStockCheckBeforeOrder?: boolean;
    trackingUrlBaseUrl?: string;
    firstNameSuffix?: string;
    customerDefaultGroupId?: string;
    customerGroupId?: string;
    countryId?: string; //TODO: Get country from user country
    currencyId?: string;
    langId?: string;
    shopId?: string;
    shopGroupId?: string;
    carrierSolution?: string;
    paymentModule?: string;
    paymentMethodName?: string;
    orderStateId?: string;
    getShippingCost?: (input: ShippingCostInput) => number;
    fetchProductWeightForShippingCompute?: boolean;
  };
}

export enum BrandFilterAction {
  ONLY = 'only',
  EXCLUDE = 'exclude',
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

type BaseVendorConfig = Omit<FullVendorConfig, 'vendorId'>;

export type AllBaseVendorsConfig = {
  [key in SynchronizedProVendor]: BaseVendorConfig;
};

export type AllVendorsConfigInterface = {
  [key in SynchronizedProVendor]: FullVendorConfig;
};

export type EnvVendorsConfig = {
  [key in SynchronizedProVendor]: RecursivePartial<BaseVendorConfig> & {
    vendorId: string;
  };
};

export type MappingKey = VendorType | SynchronizedProVendor;

export type VendorSecretsType = {
  tuvalumApiKey: string;
  tuvalumApiUrl: string;
  tuvalumUsername: string;
  tuvalumPassword: string;
  freeglisseApiKey: string;
  freeglisseApiUrl: string;
  alpinstoreApiUrl: string;
  alpinstoreApiKey: string;
  matkiteApiKey: string;
  bikeXtremeApiKey: string;
  millaBikesApiKey: string;
  veloEmotionApiKey: string;
  velosport34ApiKey: string;
  ferrareisApiKey: string;
  cyclingStoreApiKey: string;
  semotionApiKey: string;
  ebikeApiKey: string;
  trocsportApiKey: string;
  trocsportApiUrl: string;
  bcyclesApiKey: string;
  bewakApiKey: string;
  bewakApiUrl: string;
  kitespiritApiKey: string;
  kitespiritApiUrl: string;
  skidocApiKey: string;
  skidocApiUrl: string;
  freerideApiKey: string;
  fietsApiKey: string;
  fietsApiUrl: string;
  mbsProApiKey: string;
  funbikeApiKey: string;
  tribiciApiKey: string;
  clubInSportApiKey: string;
  chrisAccessToken: string;
  pilatAccessToken: string;
  allCyclesToken: string;
  pastelAccessToken: string;
  techniCyclesAccessToken: string;
  loewiAccessToken: string;
  baroudeurAccessToken: string;
  velomeldoisAccessToken: string;
  cyclinkAccessToken: string;
  mintAccessToken: string;
  tncAccessToken: string;
  nordicsAccessToken: string;
  boussoleAccessToken: string;
  jbikesApiKey: string;
  jbikesApiSecret: string;
  fastlapApiKey: string;
  fastlapApiSecret: string;
  bernaudeauApiKey: string;
  bernaudeauApiSecret: string;
  bikePointApiKey: string;
  bikePointApiSecret: string;
  cikletApiKey: string;
  cikletApiSecret: string;
  panameBicisApiKey: string;
  panameBicisApiSecret: string;
  montaniniApiKey: string;
  montaniniApiSecret: string;
  dazBikeApiKey: string;
  dazBikeApiSecret: string;
  worldBikeFormiaApiKey: string;
  worldBikeFormiaApiSecret: string;
  garybomApiKey: string;
  garybomApiSecret: string;
  joostBikesApiKey: string;
  joostBikesApiSecret: string;
  velosport20ApiKey: string;
  velosport20ApiSecret: string;
  lehollandaisApiKey: string;
  lehollandaisApiSecret: string;
  dayakApiKey: string;
  dayakApiSecret: string;
  hbeShopifyAccessToken: string;
  bikefApiKey: string;
  bikefApiSecret: string;
  sbikesApiKey: string;
  sbikesApiSecret: string;
  recoApiKey: string;
  recoApiSecret: string;
  manufakturApiKey: string;
  manufakturApiSecret: string;
  elettronicApiKey: string;
  elettronicApiSecret: string;
  moulinApiKey: string;
  moulinApiSecret: string;
  willemAccessToken: string;
};
