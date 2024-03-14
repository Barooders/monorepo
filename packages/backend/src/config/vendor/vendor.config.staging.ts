import { EnvVendorsConfig, UNUSED_VENDOR_ID } from './types';

const DEFAULT_USER = '52355f01-31c9-4f47-a062-d4a7564d4791';
const DEFAULT_CONFIG = {
  vendorId: DEFAULT_USER,
};
const DISABLED_ORDER_SYNC_CONFIG = {
  order: {
    common: {
      isSyncActivated: false,
    },
  },
};

const DEFAULT_CONFIG_WITHOUT_ORDER = {
  ...DEFAULT_CONFIG,
  ...DISABLED_ORDER_SYNC_CONFIG,
};

export const stagingVendorConfig: EnvVendorsConfig = {
  tuvalum: {
    vendorId: 'eac0e7ff-8809-42e7-9392-f6f3f382eebc',
  },
  fiets: DEFAULT_CONFIG,
  le_bon_coin: {
    vendorId: UNUSED_VENDOR_ID,
  },
  everide: {
    vendorId: UNUSED_VENDOR_ID,
  },
  zyclora: {
    vendorId: '54862c01-e6d6-4474-a9af-5a22b2b11d23',
  },
  chris_bikes: DEFAULT_CONFIG,
  ciklet: DEFAULT_CONFIG,
  montanini: DEFAULT_CONFIG,
  velosport34: DEFAULT_CONFIG,
  pilat: DEFAULT_CONFIG,
  bike_xtreme: DEFAULT_CONFIG,
  agava_presales: DEFAULT_CONFIG,
  alpin_store_orders: DEFAULT_CONFIG_WITHOUT_ORDER,
  dayak: DEFAULT_CONFIG,
  manufaktur: DEFAULT_CONFIG,
  horizons_angers: DEFAULT_CONFIG,
  lario_ebike: DEFAULT_CONFIG,
  darosa_parts: DEFAULT_CONFIG,
  darosa_bikes: DEFAULT_CONFIG,
  bewak: DEFAULT_CONFIG_WITHOUT_ORDER,
  bewak_excluded_brands: DEFAULT_CONFIG_WITHOUT_ORDER,
  mint_bikes: DEFAULT_CONFIG_WITHOUT_ORDER,
  nordics_value: DEFAULT_CONFIG,
  fastlap: DEFAULT_CONFIG,
  kite_spirit: DEFAULT_CONFIG,
  bbbike: DEFAULT_CONFIG,
  bicipedia: DEFAULT_CONFIG,
  freeglisse: DEFAULT_CONFIG_WITHOUT_ORDER,
  projet_boussole: {
    vendorId: 'b4cce880-04c5-4eac-9547-1ce5e1c15cc9',
  },
  ebs: {
    vendorId: 'a2b6c4f6-d393-4b80-9696-49604c6c0caa',
  },
  bcycles: {
    vendorId: 'f34ab201-9895-4a14-a577-601e6302f708',
  },
  tnc: {
    vendorId: 'dbf74a44-a9c9-4cb6-b025-260efe28ad23',
    ...DISABLED_ORDER_SYNC_CONFIG,
  },
  skidoc: DEFAULT_CONFIG_WITHOUT_ORDER,
  trocsport: DEFAULT_CONFIG_WITHOUT_ORDER,
  jbikes: {
    vendorId: '56686e56-92b8-4e06-9e19-7447c4346efd',
  },
  moulin_a_velos: {
    vendorId: 'c30ae02a-49c1-4040-b92c-fcc4ec2914bc',
  },
  cyclink: {
    vendorId: 'b2cef3d5-431b-4c67-be19-9fc6638294f2',
  },
  recocycle: {
    vendorId: '41100601-e3a8-4abb-8790-ba8533932153',
  },
  freeride: DEFAULT_CONFIG,
  velo_meldois: DEFAULT_CONFIG,
  sbikes: DEFAULT_CONFIG,
  funbike: DEFAULT_CONFIG,
  mbspro: DEFAULT_CONFIG,
  cycling_store: DEFAULT_CONFIG,
  semotion: DEFAULT_CONFIG,
  willemd: DEFAULT_CONFIG,
  tch: DEFAULT_CONFIG,
  pastel: DEFAULT_CONFIG,
  loewi: DEFAULT_CONFIG,
  baroudeur_cycles: DEFAULT_CONFIG,
  bernaudeau_woo: DEFAULT_CONFIG,
  daz_bike: DEFAULT_CONFIG,
  ferrareis: DEFAULT_CONFIG,
  roue_liber: DEFAULT_CONFIG,
  all_cycles: DEFAULT_CONFIG,
  tribici_presta: DEFAULT_CONFIG,
  club_in_sport: DEFAULT_CONFIG,
  alpin_store: DEFAULT_CONFIG,
  paname_bicis: DEFAULT_CONFIG,
  agava: DEFAULT_CONFIG,
  milla_bikes: DEFAULT_CONFIG,
  agava_parts: DEFAULT_CONFIG,
  mvh_cycles: DEFAULT_CONFIG,
  bikef: DEFAULT_CONFIG,
  techni_cycles: DEFAULT_CONFIG,
  matkite: DEFAULT_CONFIG,
  elite_bikes: DEFAULT_CONFIG,
  velo_emotion: DEFAULT_CONFIG,
  hbe_shopify: DEFAULT_CONFIG,
  elettronic: DEFAULT_CONFIG,
  gary_bom: DEFAULT_CONFIG,
  joost_bikes: DEFAULT_CONFIG,
  velosport20: DEFAULT_CONFIG,
  le_hollandais: DEFAULT_CONFIG,
};
