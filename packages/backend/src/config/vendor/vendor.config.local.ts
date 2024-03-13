import { DEFAULT_USER } from 'prisma/seed';
import { EnvVendorsConfig, UNUSED_VENDOR_ID } from './types';

const DEFAULT_CONFIG = {
  vendorId: DEFAULT_USER,
};

const DEFAULT_CONFIG_WITHOUT_ORDER = {
  ...DEFAULT_CONFIG,
  order: {
    common: {
      isSyncActivated: false,
    },
  },
};

export const localVendorConfig: EnvVendorsConfig = {
  tuvalum: DEFAULT_CONFIG,
  fiets: DEFAULT_CONFIG,
  le_bon_coin: {
    vendorId: UNUSED_VENDOR_ID,
  },
  everide: {
    vendorId: UNUSED_VENDOR_ID,
  },
  zyclora: DEFAULT_CONFIG,
  alpin_store_orders: DEFAULT_CONFIG_WITHOUT_ORDER,
  agava_presales: DEFAULT_CONFIG,
  montanini: DEFAULT_CONFIG,
  ciklet: DEFAULT_CONFIG,
  velosport34: DEFAULT_CONFIG,
  lario_ebike: DEFAULT_CONFIG,
  horizons_angers: DEFAULT_CONFIG,
  dayak: DEFAULT_CONFIG,
  pilat: DEFAULT_CONFIG,
  darosa_parts: DEFAULT_CONFIG,
  darosa_bikes: DEFAULT_CONFIG,
  chris_bikes: DEFAULT_CONFIG,
  fastlap: DEFAULT_CONFIG,
  velo_emotion: DEFAULT_CONFIG,
  bewak: DEFAULT_CONFIG_WITHOUT_ORDER,
  bewak_excluded_brands: DEFAULT_CONFIG_WITHOUT_ORDER,
  bernaudeau_woo: DEFAULT_CONFIG,
  daz_bike: DEFAULT_CONFIG,
  all_cycles: DEFAULT_CONFIG,
  ferrareis: DEFAULT_CONFIG,
  alpin_store: DEFAULT_CONFIG,
  agava: DEFAULT_CONFIG,
  roue_liber: DEFAULT_CONFIG,
  agava_parts: DEFAULT_CONFIG,
  mvh_cycles: DEFAULT_CONFIG,
  techni_cycles: DEFAULT_CONFIG,
  cycling_store: DEFAULT_CONFIG,
  mint_bikes: DEFAULT_CONFIG,
  willemd: DEFAULT_CONFIG,
  loewi: DEFAULT_CONFIG,
  milla_bikes: DEFAULT_CONFIG,
  baroudeur_cycles: DEFAULT_CONFIG,
  paname_bicis: DEFAULT_CONFIG,
  nordics_value: DEFAULT_CONFIG,
  kite_spirit: DEFAULT_CONFIG,
  projet_boussole: DEFAULT_CONFIG,
  ebs: DEFAULT_CONFIG,
  bcycles: DEFAULT_CONFIG,
  tnc: DEFAULT_CONFIG_WITHOUT_ORDER,
  trocsport: DEFAULT_CONFIG_WITHOUT_ORDER,
  skidoc: DEFAULT_CONFIG_WITHOUT_ORDER,
  jbikes: DEFAULT_CONFIG,
  moulin_a_velos: DEFAULT_CONFIG,
  funbike: DEFAULT_CONFIG,
  mbspro: DEFAULT_CONFIG,
  freeglisse: DEFAULT_CONFIG_WITHOUT_ORDER,
  cyclink: DEFAULT_CONFIG,
  recocycle: DEFAULT_CONFIG,
  freeride: DEFAULT_CONFIG,
  velo_meldois: DEFAULT_CONFIG,
  sbikes: DEFAULT_CONFIG,
  manufaktur: DEFAULT_CONFIG,
  semotion: DEFAULT_CONFIG,
  tch: DEFAULT_CONFIG,
  pastel: DEFAULT_CONFIG,
  tribici_presta: DEFAULT_CONFIG,
  club_in_sport: DEFAULT_CONFIG,
  bikef: DEFAULT_CONFIG,
  matkite: DEFAULT_CONFIG,
  bike_xtreme: DEFAULT_CONFIG,
  hbe_shopify: DEFAULT_CONFIG,
  elettronic: DEFAULT_CONFIG,
  gary_bom: DEFAULT_CONFIG,
  joost_bikes: DEFAULT_CONFIG,
  velosport20: DEFAULT_CONFIG,
  le_hollandais: DEFAULT_CONFIG,
};
