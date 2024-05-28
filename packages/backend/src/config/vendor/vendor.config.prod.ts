import { EnvVendorsConfig, UNUSED_VENDOR_ID } from './types';

export const prodVendorConfig: EnvVendorsConfig = {
  tuvalum: {
    vendorId: 'f20e7bf7-66f9-4e1e-a710-ac524282e72a',
    synchros: [
      { commandName: 'syncProducts', cron: '0 6 * * *' },
      { commandName: 'syncProducts', cron: '0 18 * * *' },
      { commandName: 'updateProductStatuses', cron: '20 */2 * * *' },
    ],
  },
  tuvalum_v2: {
    vendorId: 'f20e7bf7-66f9-4e1e-a710-ac524282e72a',
    synchros: [
      // { commandName: 'syncProducts', cron: '0 6 * * *' },
      // { commandName: 'syncProducts', cron: '0 18 * * *' },
      // { commandName: 'updateProductStatuses', cron: '20 */2 * * *' },
    ],
  },
  freeglisse: {
    vendorId: '9405edd7-43c8-47f6-8883-2738cc869531',
    synchros: [
      { commandName: 'syncProducts', cron: '0 1 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 1 * * *' },
    ],
  },
  matkite: {
    vendorId: 'dfb30f4b-f6be-48f4-a94f-26749d93d4e4',
    synchros: [
      { commandName: 'syncProducts', cron: '0 1 * * *' },
      { commandName: 'updateProductStatuses', cron: '20 */3 * * *' },
    ],
  },
  bike_xtreme: {
    vendorId: 'c789ebfe-f2c7-4dc5-a75d-47785d99b30c',
    synchros: [
      { commandName: 'syncProducts', cron: '30 2 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 */3 * * *' },
    ],
  },
  velo_emotion: {
    vendorId: '6f7915d7-f263-414a-8c71-055cda9ba4ea',
    synchros: [],
  },
  cycling_store: {
    vendorId: '1ebc5f48-eab2-40fe-a43b-da65d61cf828',
    synchros: [],
    // synchros: [
    //   { commandName: 'syncProducts', cron: '30 0 * * *' },
    //   { commandName: 'updateProductStatuses', cron: '0 * * * *' },
    // ],
  },
  bbbike: {
    vendorId: 'e890ebf6-ffa3-454a-aa84-b6f06ae3aca4',
    synchros: [
      { commandName: 'syncProducts', cron: '30 3 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 1 * * *' },
    ],
  },
  bicipedia: {
    vendorId: '3ac82924-0bb3-4ede-a5fe-81d09df0fa39',
    synchros: [
      { commandName: 'syncProducts', cron: '0 23 * * *' },
      { commandName: 'updateProductStatuses', cron: '50 */2 * * *' },
    ],
  },
  semotion: {
    vendorId: '8f56e505-cb73-44f0-b53f-83c0340e0ee8',
    synchros: [
      { commandName: 'syncProducts', cron: '30 7 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 */3 * * *' },
    ],
  },
  gary_bom: { vendorId: '09cf6248-127d-4be6-a6ab-a8583d92a5b5', synchros: [] },
  joost_bikes: {
    vendorId: 'a528a855-ebc4-47bb-9e3c-e932ccf63b36',
    synchros: [
      { commandName: 'syncProducts', cron: '0 3 * * *' },
      { commandName: 'updateProductStatuses', cron: '40 */3 * * *' },
    ],
  },
  paname_bicis: {
    vendorId: '04d259fb-f8b5-4da5-8727-5b619dfa3d3d',
    synchros: [],
  },
  velosport20: {
    vendorId: 'eb9853eb-4cc5-44ae-9f24-2f8d2bc8f14a',
    synchros: [],
    // synchros: [
    //   { commandName: 'syncProducts', cron: '0 4 * * *' },
    //   { commandName: 'updateProductStatuses', cron: '20 * * * *' },
    // ],
  },
  agava_presales: {
    vendorId: '7905706f-2bb2-43a5-b1fb-fb315139d3de',
    synchros: [
      { commandName: 'syncProducts', cron: '0 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 */3 * * *' },
    ],
  },
  agava_presales_b2b: {
    vendorId: '7905706f-2bb2-43a5-b1fb-fb315139d3de',
    synchros: [
      { commandName: 'syncProducts', cron: '0 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 */3 * * *' },
    ],
  },
  funbike: {
    vendorId: '8ff695e6-f0f8-4710-9b6f-908bcef9cd06',
    synchros: [
      { commandName: 'syncProducts', cron: '0 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '10 */3 * * *' },
    ],
  },
  ebs: {
    vendorId: 'd32c05d6-6ea2-4e6b-abb3-62e7217e94ac',
    synchros: [
      { commandName: 'syncProducts', cron: '0 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 */3 * * *' },
    ],
  },
  trocsport: {
    vendorId: '0d452628-7292-4192-9641-f2039df89303',
    synchros: [
      { commandName: 'syncProducts', cron: '0 2 * * *' },
      { commandName: 'updateProductStatuses', cron: '50 */3 * * *' },
    ],
  },
  bcycles: {
    vendorId: '1e24d345-07cc-4328-94e7-6dbf6c2c1050',
    synchros: [
      { commandName: 'syncProducts', cron: '30 7 * * *' },
      { commandName: 'updateProductStatuses', cron: '50 */3 * * *' },
    ],
  },
  bewak: {
    vendorId: '94ec432e-cbd8-45cf-955d-e3d67a8e3c0a',
    synchros: [
      { commandName: 'syncProducts', cron: '0 1 * * *' },
      { commandName: 'updateProductStatuses', cron: '50 */2 * * *' },
    ],
  },
  bewak_excluded_brands: {
    vendorId: '43b03898-6866-42ab-81cc-8faacbd07ab0',
    synchros: [
      { commandName: 'syncProducts', cron: '30 2 * * *' },
      { commandName: 'updateProductStatuses', cron: '50 */2 * * *' },
    ],
  },
  horizons_angers: {
    vendorId: 'b131f9d2-90f6-4022-9684-a24d79e60c62',
    synchros: [
      { commandName: 'syncProducts', cron: '0 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '50 */3 * * *' },
    ],
  },
  kite_spirit: {
    vendorId: '34ce035e-55d4-4cf8-a6ae-4dec5edda27c',
    synchros: [
      { commandName: 'syncProducts', cron: '0 23 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 */3 * * *' },
    ],
  },
  skidoc: {
    vendorId: '6dcd1d90-b7b3-4ef9-bc44-f8b7cb545fef',
    synchros: [
      { commandName: 'syncProducts', cron: '0 6 * * *' },
      { commandName: 'updateProductStatuses', cron: '20 */3 * * *' },
    ],
  },
  freeride: { vendorId: '5b2bb9d6-c4e4-46eb-8564-0f0b03436543', synchros: [] },
  fiets: {
    vendorId: '36fa1a49-2146-4484-bba1-6d883090b86c',
    synchros: [
      { commandName: 'syncProducts', cron: '0 4 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 */3 * * *' },
    ],
  },
  mbspro: {
    vendorId: 'a207c89c-e2e1-4e66-bef9-98f983f1446e',
    synchros: [
      { commandName: 'syncProducts', cron: '30 2 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 */3 * * *' },
    ],
  },
  used_elite_bikes: {
    vendorId: 'b12f0568-7487-44b8-b4c0-ad9ce9133919',
    synchros: [
      { commandName: 'syncProducts', cron: '30 1 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 4 * * *' },
    ],
  },
  gem_bikes: {
    vendorId: '91d89f86-da6c-4fcd-a22d-0abb7ad98e0c',
    synchros: [
      { commandName: 'syncProducts', cron: '0 1 * * *' },
      { commandName: 'updateProductStatuses', cron: '40 */3 * * *' },
    ],
  },
  sanferbike: {
    vendorId: '743f4783-b0cd-49a3-8d02-70f1d1f704b5',
    synchros: [
      { commandName: 'syncProducts', cron: '30 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '20 */3 * * *' },
    ],
  },
  tribici_presta: {
    vendorId: 'd99c1c6d-98e9-4cca-a758-f1c3d06a8eec',
    synchros: [
      { commandName: 'syncProducts', cron: '30 3 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 */3 * * *' },
    ],
  },
  club_in_sport: {
    vendorId: '7e6b6a67-27e2-4438-8929-2b1815e20271',
    synchros: [],
  },
  bernaudeau_woo: {
    vendorId: '3cbb2030-a8ca-4bb4-a6c7-e883b2e13169',
    synchros: [
      { commandName: 'syncProducts', cron: '0 23 * * *' },
      { commandName: 'updateProductStatuses', cron: '50 */3 * * *' },
    ],
  },
  ciklet: {
    vendorId: '938e2c7b-e692-4443-a87c-00fb874c9d5f',
    synchros: [
      { commandName: 'syncProducts', cron: '0 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '40 */2 * * *' },
    ],
  },
  montanini: {
    vendorId: '4918c185-a2ec-487e-9cf6-a67e8bb12692',
    synchros: [],
    // synchros: [
    //   { commandName: 'syncProducts', cron: '30 1 * * *' },
    //   { commandName: 'updateProductStatuses', cron: '40 * * * *' },
    // ],}
  },
  lario_ebike: {
    vendorId: '205ad821-fd08-4cb3-8e76-78af089e0006',
    synchros: [
      { commandName: 'syncProducts', cron: '0 4 * * *' },
      { commandName: 'updateProductStatuses', cron: '40 */3 * * *' },
    ],
  },
  velosport34: {
    vendorId: 'cd7a5a5e-3cb8-4ce9-886e-f14ca1424fd5',
    synchros: [
      { commandName: 'syncProducts', cron: '30 3 * * *' },
      { commandName: 'updateProductStatuses', cron: '10 */3 * * *' },
    ],
  },
  daz_bike: {
    vendorId: '0a61c4e1-cdcd-40b7-88a3-71d0062d6d4e',
    synchros: [
      { commandName: 'syncProducts', cron: '30 23 * * *' },
      { commandName: 'updateProductStatuses', cron: '20 */3 * * *' },
    ],
  },
  pilat: {
    vendorId: '275c5c7d-7658-4c9e-b72a-e66b717d6f41',
    synchros: [
      { commandName: 'syncProducts', cron: '0 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 3 * * *' },
    ],
  },
  dayak: {
    vendorId: 'f89cec51-7968-41d6-b42b-a967928a9591',
    synchros: [
      { commandName: 'syncProducts', cron: '0 23 * * *' },
      { commandName: 'updateProductStatuses', cron: '20 */3 * * *' },
    ],
  },
  zyclora: {
    vendorId: '37c4f291-36d9-40de-933e-719eb4d2d833',
    synchros: [
      { commandName: 'syncProducts', cron: '0 23 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 */2 * * *' },
    ],
  },
  le_bon_coin: {
    vendorId: UNUSED_VENDOR_ID,
    catalog: {
      scrapfly: {
        productCollectionHandle: 'admin-vendeurs-synchro-leboncoin',
      },
    },
    synchros: [{ commandName: 'updateProductStatuses', cron: '30 10 * * *' }],
  },
  everide: {
    vendorId: UNUSED_VENDOR_ID,
    catalog: {
      scrapfly: {
        productCollectionHandle: 'admin-vendeurs-synchro-everide',
      },
    },
    synchros: [{ commandName: 'updateProductStatuses', cron: '0 18 * * *' }],
  },
  ferrareis: {
    vendorId: '92d87ca9-efd5-4468-b7b3-16d9a56cfe20',
    synchros: [
      { commandName: 'syncProducts', cron: '30 23 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 */3 * * *' },
    ],
  },
  chris_bikes: {
    vendorId: 'b8367484-a8dc-4c51-acdb-036a7c31b725',
    synchros: [
      { commandName: 'syncProducts', cron: '30 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 9 * * *' },
    ],
  },
  all_cycles: {
    vendorId: '43f27a35-a4da-4388-9745-b3c11849b118',
    synchros: [
      { commandName: 'syncProducts', cron: '0 6 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 12 * * *' },
    ],
  },
  pastel: {
    vendorId: '1a50d8b6-d183-4c8a-a35e-491dd25c9667',
    synchros: [{ commandName: 'updateProductStatuses', cron: '0 2 * * *' }],
  },
  techni_cycles: {
    vendorId: '42065950-85bb-49b3-b1d4-3f2691ac5e84',
    synchros: [],
    // synchros: [
    //   { commandName: 'syncProducts', cron: '30 6 * * *' },
    //   { commandName: 'updateProductStatuses', cron: '30 8 * * *' },
    // ],
  },
  roue_liber: {
    vendorId: 'ab563cee-ad89-4953-a958-977c1621a043',
    synchros: [
      { commandName: 'syncProducts', cron: '30 1 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 */3 * * *' },
    ],
  },
  milla_bikes: {
    vendorId: '3f50f794-44c2-4095-831a-f1f70f58a67a',
    synchros: [
      { commandName: 'syncProducts', cron: '0 4 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 */3 * * *' },
    ],
  },
  willemd: {
    vendorId: '7935d069-0a25-4d8e-926c-c1c8eeeb8ecd',
    synchros: [
      { commandName: 'syncProducts', cron: '0 10 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 1 * * *' },
    ],
  },
  loewi: {
    vendorId: '59235b58-cc2a-4071-9e22-9702795e2a16',
    synchros: [
      { commandName: 'syncProducts', cron: '30 21 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 8 * * *' },
    ],
  },
  savoldelli: {
    vendorId: '844b5ff7-7871-4ac4-9499-be75ae9b3a54',
    synchros: [],
  },
  baroudeur_cycles: {
    vendorId: '80ab72f6-e655-449e-9594-e3d397071bd8',
    synchros: [
      { commandName: 'syncProducts', cron: '0 4 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 2 * * *' },
    ],
  },
  tch: {
    vendorId: '7e5c2537-8fc2-400e-90b2-3c66a864ca7d',
    synchros: [
      { commandName: 'syncProducts', cron: '0 1 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 */3 * * *' },
    ],
  },
  velo_meldois: {
    vendorId: 'd33a829c-10c1-4ad3-a651-0859c69ad7d5',
    synchros: [
      { commandName: 'syncProducts', cron: '0 9 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 20 * * *' },
    ],
  },
  cyclink: {
    vendorId: 'd40826be-6833-4726-b431-d960d618afb4',
    synchros: [
      { commandName: 'syncProducts', cron: '30 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 23 * * *' },
    ],
  },
  mint_bikes: {
    vendorId: 'a8c4b23a-0518-4e50-b4c8-58ac73096f5d',
    synchros: [
      { commandName: 'syncProducts', cron: '30 7 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 0 * * *' },
    ],
  },
  tnc: {
    vendorId: 'f528c71d-1a7c-4fb6-b477-d5c6bfcd6bab',
    synchros: [
      { commandName: 'syncProducts', cron: '0 20 * * *' },
      { commandName: 'updateProductStatuses', cron: '0 1 * * *' },
    ],
  },
  alpin_store: {
    vendorId: '3cfd67a4-5aea-40b9-99ab-790d15cbaa08',
    synchros: [
      { commandName: 'syncProducts', cron: '0 4 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 */3 * * *' },
    ],
  },
  alpin_store_orders: {
    vendorId: '3cfd67a4-5aea-40b9-99ab-790d15cbaa08',
    synchros: [],
  },
  agava: {
    vendorId: '9fa2866d-ad2d-4ab8-b0f3-9de1e1e6f41e',
    synchros: [
      { commandName: 'syncProducts', cron: '0 5 * * *' },
      { commandName: 'updateProductStatuses', cron: '50 */3 * * *' },
    ],
  },
  agava_b2b: {
    vendorId: '9fa2866d-ad2d-4ab8-b0f3-9de1e1e6f41e',
    synchros: [
      { commandName: 'syncProducts', cron: '0 5 * * *' },
      { commandName: 'updateProductStatuses', cron: '50 */3 * * *' },
    ],
  },
  agava_parts: {
    vendorId: '9fa2866d-ad2d-4ab8-b0f3-9de1e1e6f41e',
    synchros: [
      { commandName: 'syncProducts', cron: '0 21 * * *' },
      { commandName: 'updateProductStatuses', cron: '40 */3 * * *' },
    ],
  },
  mvh_cycles: {
    vendorId: '4f252266-c98e-4ba0-a62b-da65a70f366d',
    synchros: [],
  },
  darosa_parts: {
    vendorId: '2d1e8cea-9183-4cf6-b3d4-4f0e3f1c5ab1',
    synchros: [
      { commandName: 'syncProducts', cron: '0 4 * * *' },
      { commandName: 'updateProductStatuses', cron: '50 */3 * * *' },
    ],
  },
  darosa_bikes: {
    vendorId: 'f0c27c8a-cd76-4f0b-8fe9-66a9e45327be',
    synchros: [],
  },
  nordics_value: {
    vendorId: '18405705-a382-43ba-8d84-840da6956684',
    synchros: [
      { commandName: 'syncProducts', cron: '30 1 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 3 * * *' },
    ],
  },
  projet_boussole: {
    vendorId: '95267aa0-e040-429b-9b2c-9a82575abf61',
    synchros: [
      { commandName: 'syncProducts', cron: '30 11 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 21 * * *' },
    ],
  },
  jbikes: {
    vendorId: '67b93b6f-7467-402d-8f32-91a2ebb8f9ea',
    synchros: [
      { commandName: 'syncProducts', cron: '0 9 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 */3 * * *' },
    ],
  },
  fastlap: {
    vendorId: 'fe56506b-d9cc-4210-a702-97eeec72c45b',
    synchros: [
      { commandName: 'syncProducts', cron: '0 5 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 16 * * *' },
    ],
  },
  le_hollandais: {
    vendorId: 'a485ddbe-2001-43ee-9c98-dfb00fc1c9b0',
    synchros: [
      { commandName: 'syncProducts', cron: '0 0 * * *' },
      { commandName: 'updateProductStatuses', cron: '20 */3 * * *' },
    ],
  },
  hbe_shopify: {
    vendorId: '62d7cf29-2563-4936-985b-8599b0c8804a',
    synchros: [],
  },
  bikef: {
    vendorId: '28553b01-476c-4afc-b412-8faf57fa428d',
    synchros: [
      // { commandName: 'syncProducts', cron: '0 16 * * *' },
      // { commandName: 'updateProductStatuses', cron: '10 */3 * * *' },
    ],
  },
  sbikes: {
    vendorId: '76e83268-b5b6-47e3-9cda-99b2b272763f',
    synchros: [
      { commandName: 'syncProducts', cron: '30 5 * * *' },
      // { commandName: 'updateProductStatuses', cron: '0 * * * *' },
    ],
  },
  recocycle: {
    vendorId: 'efaea235-d824-484e-b3a7-6df24e89ad33',
    synchros: [
      { commandName: 'syncProducts', cron: '0 12 * * *' },
      { commandName: 'updateProductStatuses', cron: '10 */3 * * *' },
    ],
  },
  manufaktur: {
    vendorId: '5487023d-4b3b-40d3-92c3-2e9cad71b388',
    synchros: [
      { commandName: 'syncProducts', cron: '30 22 * * *' },
      { commandName: 'updateProductStatuses', cron: '30 */3 * * *' },
    ],
  },
  elettronic: {
    vendorId: '21a9373d-904f-4843-9701-6d9573040a24',
    synchros: [
      { commandName: 'syncProducts', cron: '0 12 * * *' },
      { commandName: 'updateProductStatuses', cron: '20 */3 * * *' },
    ],
  },
  moulin_a_velos: {
    vendorId: 'b4a5518e-f59f-4999-8ea6-84fafaa91ccd',
    synchros: [
      { commandName: 'syncProducts', cron: '0 17 * * *' },
      { commandName: 'updateProductStatuses', cron: '10 */3 * * *' },
    ],
  },
  sector_ciclismo: {
    vendorId: '19070fd7-c486-4231-9734-c8b42ee250ba',
    synchros: [],
  },
};
