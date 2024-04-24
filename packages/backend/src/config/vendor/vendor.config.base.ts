import { Condition } from '@libs/domain/prisma.main.client';
import { jsonParse } from '@libs/helpers/json';
import { JSDOM } from 'jsdom';
import { cloneDeep } from 'lodash';
import { merge } from 'shared-types';
import {
  NEW_PRODUCT_DEFAULT_DESCRIPTION,
  USED_PRODUCT_DEFAULT_DESCRIPTION,
} from './constants';
import { AllBaseVendorsConfig, BrandFilterAction, VendorType } from './types';
import vendorSecrets from './vendor.secret';

export const DESIRED_BIKES_TAGS = [
  'weight',
  'year',
  'size',
  'brand',
  'brakes',
  'model',
  'type',
  'frame',
  'color',
  'condition',
  'suspension',
  'fork',
  'transmission',
  'wheels',
];

export const MINIMAL_BIKES_TAGS = [
  'year',
  'size',
  'brand',
  'brakes',
  'model',
  'transmissionOrGroup',
];

const bewakExcludedBrands = [
  'msr',
  'thermarest',
  'platypus',
  'packtowl',
  'sealline',
  'ortlieb',
];

const baseCsvConfig = {
  variantId: 1,
  productId: 2,
  isActive: 3,
  inventoryQuantity: 4,
  price: 5,
  compareAtPrice: 6,
  productType: [7],
  productTitle: 8,
};

const bewakConfig = {
  type: VendorType.PRESTASHOP,
  apiKey: vendorSecrets.bewakApiKey,
  apiUrl: vendorSecrets.bewakApiUrl,
  catalog: {
    common: {
      defaultDescription: NEW_PRODUCT_DEFAULT_DESCRIPTION,
      defaultProductCondition: Condition.AS_NEW,
    },
  },
  order: {
    common: {
      isSyncActivated: true,
    },
    prestashop: {
      forceOrderStatusAfterCreation: true,
      firstNameSuffix: ' /Barooders',
      trackingUrlBaseUrl: 'https://gls-group.eu/FR/fr/suivi-colis?match=',
      customerDefaultGroupId: '3',
      customerGroupId: '13',
      countryId: '8',
      currencyId: '1',
      langId: '1',
      shopGroupId: '1',
      shopId: '1',
      carrierSolution: 'GLS Chez vous +',
      paymentModule: 'bankwire',
      paymentMethodName: 'Barooders',
      orderStateId: '24',
      getShippingCost: () => {
        return 8.7;
      },
    },
  },
};

export const baseVendorConfig: AllBaseVendorsConfig = {
  tuvalum: {
    slug: 'tuvalum',
    mappingKey: 'tuvalum',
    type: VendorType.TUVALUM,
    apiKey: vendorSecrets.tuvalumApiKey,
    apiUrl: vendorSecrets.tuvalumApiUrl,
    username: vendorSecrets.tuvalumUsername,
    password: vendorSecrets.tuvalumPassword,
    catalog: {
      common: {
        priceCorrections: [{ amount: -15 }],
      },
    },
  },
  freeglisse: {
    slug: 'freeglisse',
    mappingKey: 'freeglisse',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.freeglisseApiKey,
    apiUrl: vendorSecrets.freeglisseApiUrl,
    catalog: {
      common: {
        showExternalIdInDescription: true,
        variantOptionTagsWithCategorySuffix: ['pointure'],
        descriptionSuffix: `<br>
      <ul>
        <li>La catégorie Qualité A propose du matériel d'occasion ayant un bon état général, bien entretenu et pouvant être utilisé pendant de nombreuses saisons.</li>
        <li>La catégorie Qualité B possède du matériel d'occasion en état correct, mais présentant des marques d'usures plus prononcées (présence de rayures et d'accrocs).</li>
        <li>La catégorie Qualité C propose du matériel abîmé, dont la sérigraphie est dégradée mais qui reste skiable et performant.</li>
      </ul>`,
        ignoredVariants: ['qualité c'],
      },
    },
    order: {
      common: {
        isSyncActivated: true,
      },
      prestashop: {
        forceOrderStatusAfterCreation: true,
        customerDefaultGroupId: '3',
        countryId: '8',
        currencyId: '1',
        langId: '1',
        shopGroupId: '1',
        shopId: '1',
        carrierSolution: 'DPDPredict',
        paymentModule: 'payplug',
        paymentMethodName: 'Barooders',
        orderStateId: '2',
        fetchProductWeightForShippingCompute: true,
        getShippingCost: ({ weight }) => {
          if (weight === undefined) throw new Error('Weight is undefined');

          if (weight < 4) return 12;
          if (weight < 8) return 15;
          if (weight < 11) return 19;
          if (weight < 15) return 22;
          if (weight < 20) return 25;
          if (weight < 25) return 28;
          return 30;
        },
      },
    },
  },
  matkite: {
    slug: 'matkite',
    mappingKey: 'matkite',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.matkiteApiKey,
    apiUrl: 'https://www.mckiteshop.com/api/',
    catalog: {},
  },
  sanferbike: {
    slug: 'sanferbike',
    mappingKey: 'sanferbike',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.sanferbikeApiKey,
    apiUrl: 'https://www.sanferbike.com/api/',
    catalog: {
      common: {
        commissionPercentToAdd: 9,
        brandFilter: {
          names: ['trek', 'scott'],
          action: BrandFilterAction.EXCLUDE,
        },
      },
    },
  },
  bike_xtreme: {
    slug: 'bike_xtreme',
    mappingKey: 'bike_xtreme',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.bikeXtremeApiKey,
    apiUrl: 'https://www.bikextreme.it/api/',
    catalog: {
      common: {
        defaultProductCondition: Condition.VERY_GOOD,
      },
    },
  },
  milla_bikes: {
    slug: 'milla_bikes',
    mappingKey: 'milla_bikes',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.millaBikesApiKey,
    apiUrl: 'https://millabikes.es/api/',
    catalog: {},
  },
  velo_emotion: {
    slug: 'velo_emotion',
    mappingKey: 'velo_emotion',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.veloEmotionApiKey,
    apiUrl: 'https://ac-emotion.com/api/',
    catalog: {},
  },
  velosport34: {
    slug: 'velosport34',
    mappingKey: 'velosport34',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.velosport34ApiKey,
    apiUrl: 'https://www.velo-sport34.fr/api/',
    catalog: {},
  },
  ferrareis: {
    slug: 'ferrareis',
    mappingKey: 'ferrareis',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.ferrareisApiKey,
    apiUrl: 'https://www.cicloruotaferrareis.com/api/',
    catalog: {
      common: {
        commissionPercentToAdd: 10,
      },
    },
  },
  cycling_store: {
    slug: 'cycling_store',
    mappingKey: 'cycling_store',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.cyclingStoreApiKey,
    apiUrl: 'https://cyclingstore.fr/api/',
    catalog: {
      common: {
        variantOptionTagsWithCategorySuffix: ['taille'],
      },
    },
  },
  semotion: {
    slug: 'semotion',
    mappingKey: 'semotion',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.semotionApiKey,
    apiUrl: 'https://www.sportemotion.fr/api/',
    catalog: {
      common: {
        variantOptionTagsWithCategorySuffix: ['taille'],
      },
    },
  },
  ebs: {
    slug: 'ebs',
    mappingKey: 'ebs',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.ebikeApiKey,
    apiUrl: 'https://www.ebike-occasions.com/api/',
    catalog: {},
  },
  trocsport: {
    slug: 'trocsport',
    mappingKey: 'trocsport',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.trocsportApiKey,
    apiUrl: vendorSecrets.trocsportApiUrl,
    catalog: {
      common: {
        shouldIgnoreCheapBikesBelow150: true,
      },
    },
    order: {
      common: {
        isSyncActivated: true,
      },
      prestashop: {
        customerDefaultGroupId: '3',
        countryId: '8',
        currencyId: '1',
        langId: '1',
        shopGroupId: '1',
        shopId: '1',
        carrierSolution: 'Livraison à domicile Predict sur rendez-vous',
        paymentModule: 'mercanet',
        paymentMethodName: 'Barooders',
        orderStateId: '11',
        getShippingCost: ({ productsTotalPrice }) => {
          if (productsTotalPrice > 200) return 0;

          return 7;
        },
      },
    },
  },
  bcycles: {
    slug: 'bcycles',
    mappingKey: 'bcycles',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.bcyclesApiKey,
    apiUrl: 'https://www.bcycles.it/api/',
    catalog: {
      common: {
        defaultProductCondition: Condition.AS_NEW,
      },
      prestashop: {
        externalLanguageId: '4',
      },
    },
  },
  bewak: {
    slug: 'bewak',
    mappingKey: 'bewak',
    ...merge(cloneDeep(bewakConfig), {
      catalog: {
        common: {
          excludedTitles: ['pack tente'],
          brandFilter: {
            names: bewakExcludedBrands,
            action: BrandFilterAction.EXCLUDE,
          },
        },
      },
    }),
  },
  bewak_excluded_brands: {
    slug: 'bewak_excluded_brands',
    mappingKey: 'bewak',
    ...merge(cloneDeep(bewakConfig), {
      catalog: {
        common: {
          excludedTitles: ['pack tente'],
          brandFilter: {
            names: bewakExcludedBrands,
            action: BrandFilterAction.ONLY,
          },
        },
      },
    }),
  },
  kite_spirit: {
    slug: 'kite_spirit',
    mappingKey: 'kite_spirit',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.kitespiritApiKey,
    apiUrl: vendorSecrets.kitespiritApiUrl,
    catalog: {},
  },
  skidoc: {
    slug: 'skidoc',
    mappingKey: 'skidoc',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.skidocApiKey,
    apiUrl: vendorSecrets.skidocApiUrl,
    catalog: {},
    order: {
      common: {
        isSyncActivated: true,
      },
      prestashop: {
        customerDefaultGroupId: '3',
        countryId: '8',
        currencyId: '1',
        langId: '1',
        shopGroupId: '1',
        shopId: '1',
        carrierSolution: 'Livraison à domicile Predict sur rendez-vous',
        paymentModule: 'paybox',
        paymentMethodName: 'Barooders',
        orderStateId: '11',
        getShippingCost: ({ productType, productsTotalPrice }) => {
          if (productsTotalPrice > 199) return 0;

          if (productType.toLowerCase().startsWith('bâton')) return 9;

          return 13;
        },
      },
    },
  },
  freeride: {
    slug: 'freeride',
    mappingKey: 'freeride',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.freerideApiKey,
    apiUrl: 'https://www.freeride-attitude.com/api/',
    catalog: {
      common: {
        defaultProductCondition: Condition.AS_NEW,
        parsedTagKeysFromDescription: [
          'size',
          'brand',
          'model',
          'type',
          'year',
        ],
      },
    },
  },
  fiets: {
    slug: 'fiets',
    mappingKey: 'fiets',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.fietsApiKey,
    apiUrl: vendorSecrets.fietsApiUrl,
    catalog: {
      common: {
        defaultProductCondition: Condition.VERY_GOOD,
      },
    },
  },
  funbike: {
    slug: 'funbike',
    mappingKey: 'funbike',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.funbikeApiKey,
    apiUrl: 'https://www.funwayvelos.fr/api/',
    catalog: {
      common: {
        commissionPercentToAdd: 8,
      },
    },
  },
  mbspro: {
    slug: 'mbspro',
    mappingKey: 'mbspro',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.mbsProApiKey,
    apiUrl: 'https://www.monbikeshop.com/api/',
    catalog: {
      common: {
        commissionPercentToAdd: 8,
        defaultProductCondition: Condition.AS_NEW,
      },
    },
  },
  used_elite_bikes: {
    slug: 'used_elite_bikes',
    mappingKey: 'used_elite_bikes',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.usedEliteBikesApiKey,
    apiUrl: 'https://www.used-elitebikes.com/api/',
    catalog: {
      common: {
        commissionPercentToAdd: 8,
      },
      prestashop: {
        fetchRecursiveCategories: true,
      },
    },
  },
  gem_bikes: {
    slug: 'gem_bikes',
    mappingKey: 'gem_bikes',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.gemBikesApiKey,
    apiUrl: 'https://shop.gem-bikes.com/api/',
    catalog: {},
  },
  tribici_presta: {
    slug: 'tribici_presta',
    mappingKey: 'tribici_presta',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.tribiciApiKey,
    apiUrl: 'https://tri4fun-store.com/api/',
    catalog: {
      common: {
        defaultProductCondition: Condition.AS_NEW,
        variantOptionTagsWithCategorySuffix: ['taille'],
        priceCorrections: [
          {
            // Marquage des vélos
            amount: 20,
            filter: ({ isBike }) => isBike,
          },
        ],
      },
    },
  },
  club_in_sport: {
    slug: 'club_in_sport',
    mappingKey: 'club_in_sport',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.clubInSportApiKey,
    apiUrl: 'https://www.clubinsport.com/api/',
    catalog: {
      common: {
        defaultProductCondition: Condition.AS_NEW,
        minimumDiscount: 0.1,
      },
    },
  },
  bernaudeau_woo: {
    slug: 'bernaudeau_woo',
    mappingKey: 'bernaudeau_woo',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://www.bernaudeaucycloccasions.fr/wp-json/wc/v3',
    apiKey: vendorSecrets.bernaudeauApiKey,
    apiSecret: vendorSecrets.bernaudeauApiSecret,
    catalog: {
      wooCommerce: {
        mapSingleVariant: true,
      },
    },
  },
  bicipedia: {
    slug: 'bicipedia',
    mappingKey: 'bicipedia',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://www.bicipedia.it/wp-json/wc/v3',
    apiKey: vendorSecrets.bicipediaApiKey,
    apiSecret: vendorSecrets.bicipediaApiSecret,
    catalog: {},
  },
  bbbike: {
    slug: 'bbbike',
    mappingKey: 'bbbike',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://www.bbbikeforli.it/wp-json/wc/v3',
    apiKey: vendorSecrets.bbbikeApiKey,
    apiSecret: vendorSecrets.bbbikeApiSecret,
    catalog: {
      common: {
        commissionPercentToAdd: 5,
      },
    },
  },
  ciklet: {
    slug: 'ciklet',
    mappingKey: 'ciklet',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://api.ciklet.cc/wp-json/wc/v3',
    apiKey: vendorSecrets.cikletApiKey,
    apiSecret: vendorSecrets.cikletApiSecret,
    catalog: {
      wooCommerce: {
        allProductsPathOverride: '/products-ng',
      },
    },
  },
  paname_bicis: {
    slug: 'paname_bicis',
    mappingKey: 'paname_bicis',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://panamebicis.com/wp-json/wc/v3',
    apiKey: vendorSecrets.panameBicisApiKey,
    apiSecret: vendorSecrets.panameBicisApiSecret,
    catalog: {
      wooCommerce: {
        mapSingleVariant: true,
        stringifySingleItemArray: true,
      },
    },
  },
  montanini: {
    slug: 'montanini',
    mappingKey: 'montanini',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://www.ciclimontanini.com/wp-json/wc/v3',
    apiKey: vendorSecrets.montaniniApiKey,
    apiSecret: vendorSecrets.montaniniApiSecret,
    catalog: {
      common: {
        variantOptionTagsWithCategorySuffix: ['taglia'],
      },
      wooCommerce: {
        mapSingleVariant: true,
        stringifySingleItemArray: true,
      },
    },
  },
  daz_bike: {
    slug: 'daz_bike',
    mappingKey: 'daz_bike',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://ciclidalzilio.com/wp-json/wc/v3',
    apiKey: vendorSecrets.dazBikeApiKey,
    apiSecret: vendorSecrets.dazBikeApiSecret,
    catalog: {
      wooCommerce: {
        mapSingleVariant: true,
        stringifySingleItemArray: true,
      },
    },
  },
  le_bon_coin: {
    slug: 'le_bon_coin',
    mappingKey: 'le_bon_coin',
    type: VendorType.SCRAPFLY,
    apiUrl: 'leboncoin.fr',
    catalog: {
      scrapfly: {
        isAvailable: (apiContent: string) => {
          const jsDom = new JSDOM(apiContent);
          return (
            ![...jsDom.window.document.querySelectorAll('span')].some(
              (el) =>
                el.textContent === 'Un achat est en cours sur cet article',
            ) &&
            ![
              ...jsDom.window.document.querySelectorAll(
                '[data-qa-id*=adview_title]',
              ),
            ].some((el) => el.textContent?.includes('#VENDU#'))
          );
        },
      },
    },
  },
  everide: {
    slug: 'everide',
    mappingKey: 'everide',
    type: VendorType.SCRAPFLY,
    apiUrl: 'everide.app',
    catalog: {
      scrapfly: {
        mapReferenceUrl: (url: string) => {
          const productIdMatch = url.match(/.*everide\.app.*,([a-zA-Z0-9]+)/);
          const productId = productIdMatch?.[1];

          if (!productId) {
            return {
              status: 'error',
              message: `Could not find a valid Everide product id after comma in reference url ${url}`,
            };
          }

          return {
            status: 'success',
            url: `https://www.everide.app/api/v2/products/${productId}`,
          };
        },
        isAvailable: (apiContent: string) => {
          try {
            const {
              status,
              response: { canBeSold, qte },
            } = jsonParse(apiContent);

            if (status !== 'success' || canBeSold === undefined) {
              throw new Error(`Invalid Everide API response`);
            }

            return canBeSold === 1 && qte > 0;
          } catch (e: unknown) {
            throw new Error(
              `Could not parse Everide API response: ${apiContent}`,
            );
          }
        },
      },
    },
  },
  chris_bikes: {
    slug: 'chris_bikes',
    mappingKey: 'chris_bikes',
    type: VendorType.SHOPIFY,
    apiUrl: 'chris-bike-dijon.myshopify.com',
    accessToken: vendorSecrets.chrisAccessToken,
    catalog: {
      common: {
        parsedTagKeysFromDescription: DESIRED_BIKES_TAGS,
      },
    },
  },
  baroudeur_cycles: {
    slug: 'baroudeur_cycles',
    mappingKey: 'baroudeur_cycles',
    type: VendorType.SHOPIFY,
    apiUrl: 'baroudeur-cycles.myshopify.com',
    accessToken: vendorSecrets.baroudeurAccessToken,
    catalog: {
      common: {
        defaultProductCondition: Condition.AS_NEW,
      },
    },
  },
  pilat: {
    slug: 'pilat',
    mappingKey: 'pilat',
    type: VendorType.SHOPIFY,
    apiUrl: 'le-cycle-stephanois.myshopify.com',
    accessToken: vendorSecrets.pilatAccessToken,
    catalog: {
      common: {
        defaultProductCondition: Condition.AS_NEW,
        minimumDiscount: 0.05,
      },
    },
  },
  all_cycles: {
    slug: 'all_cycles',
    mappingKey: 'all_cycles',
    type: VendorType.SHOPIFY,
    apiUrl: 'allcycles-dev.myshopify.com',
    accessToken: vendorSecrets.allCyclesToken,
    catalog: {
      common: {
        defaultProductCondition: Condition.AS_NEW,
        commissionPercentToAdd: 5,
        minimalPriceInCents: 50000,
      },
    },
  },
  pastel: {
    slug: 'pastel',
    mappingKey: 'pastel',
    type: VendorType.SHOPIFY,
    apiUrl: 'pastel-cycles.myshopify.com',
    accessToken: vendorSecrets.pastelAccessToken,
    catalog: {
      common: {
        defaultProductCondition: Condition.AS_NEW,
      },
    },
  },
  techni_cycles: {
    slug: 'techni_cycles',
    mappingKey: 'techni_cycles',
    type: VendorType.SHOPIFY,
    apiUrl: 'technicycles-3768.myshopify.com',
    accessToken: vendorSecrets.techniCyclesAccessToken,
    catalog: {
      common: {
        defaultProductCondition: Condition.AS_NEW,
      },
    },
  },
  willemd: {
    slug: 'willemd',
    mappingKey: 'willemd',
    type: VendorType.SHOPIFY,
    apiUrl: 'tweedehands-outdoorkleding.myshopify.com',
    accessToken: vendorSecrets.willemAccessToken,
    catalog: {
      common: {
        defaultProductCondition: Condition.VERY_GOOD,
        variantOptionTagsWithCategorySuffix: ['grootte'],
      },
    },
  },
  loewi: {
    slug: 'loewi',
    mappingKey: 'loewi',
    type: VendorType.SHOPIFY,
    apiUrl: 'loewi2.myshopify.com',
    accessToken: vendorSecrets.loewiAccessToken,
    catalog: {},
  },
  savoldelli: {
    slug: 'savoldelli',
    mappingKey: 'savoldelli',
    type: VendorType.SHOPIFY,
    apiUrl: 'savoldelli.myshopify.com',
    accessToken: vendorSecrets.savoldelliAccessToken,
    catalog: {},
  },
  tch: {
    slug: 'tch',
    mappingKey: 'tch',
    type: VendorType.CSV,
    apiUrl:
      'https://feedfiles.woolytech.com/procycles.myshopify.com/9RclmUHL1O.csv',
    catalog: {
      common: {
        defaultProductCondition: Condition.VERY_GOOD,
      },
      csv: {
        textTransformer: (input: string) => {
          return input.replace(/\n^(?![0-9]{13}).*$/gm, (match) =>
            match.replace(/\n/g, '<br>'),
          );
        },
        columns: {
          productId: 1,
          variantId: 1,
          productType: [5],
          productTitle: 3,
          description: [38, 21],
          variantCondition: 4,
          tags: [
            2, 3, 4, 6, 7, 9, 12, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
            33, 34, 35, 36, 37,
          ],
          images: [13, 14, 15, 16, 17, 18, 19, 20],
          option1: 8,
          compareAtPrice: 10,
          price: 11,
        },
      },
    },
  },
  velo_meldois: {
    slug: 'velo_meldois',
    mappingKey: 'velo_meldois',
    type: VendorType.SHOPIFY,
    apiUrl: 'lesvelosmeldois.myshopify.com',
    accessToken: vendorSecrets.velomeldoisAccessToken,
    catalog: {
      common: {
        defaultProductCondition: Condition.VERY_GOOD,
        parsedTagKeysFromDescription: MINIMAL_BIKES_TAGS,
      },
    },
  },
  cyclink: {
    slug: 'cyclink',
    mappingKey: 'cyclink',
    type: VendorType.SHOPIFY,
    apiUrl: '73f5c0-2.myshopify.com',
    accessToken: vendorSecrets.cyclinkAccessToken,
    catalog: {},
  },
  mint_bikes: {
    slug: 'mint_bikes',
    mappingKey: 'mint_bikes',
    type: VendorType.SHOPIFY,
    apiUrl: 'velokaz.myshopify.com',
    accessToken: vendorSecrets.mintAccessToken,
    catalog: {},
    order: {
      common: { isSyncActivated: true },
      shopify: { sendRealCustomerEmail: true },
    },
  },
  tnc: {
    slug: 'tnc',
    mappingKey: 'tnc',
    type: VendorType.SHOPIFY,
    apiUrl: 'topnsport.myshopify.com',
    accessToken: vendorSecrets.tncAccessToken,
    catalog: {
      common: {
        variantOptionTagsWithCategorySuffix: ['taille'],
      },
    },
    order: {
      common: { isSyncActivated: true },
      shopify: { sendDiscountedPrice: true },
    },
  },
  alpin_store: {
    slug: 'alpin_store',
    mappingKey: 'alpin_store',
    type: VendorType.XML,
    apiUrl: 'https://search.alpinstore.com/data/flux/barooder.xml',
    catalog: {
      common: {
        defaultProductCondition: Condition.AS_NEW,
      },
      xml: {
        fields: {
          variant: 'item',
          productId: 'g\\:item_group_id',
          productType: 'g\\:product_type',
          variantId: 'g\\:id',
          variantCondition: 'g\\:condition',
          productTitle: 'g\\:title',
          description: 'g\\:description',
          tags: [
            'g\\:brand',
            'g\\:size',
            'g\\:age_group',
            'g\\:genre',
            'g\\:gender',
            'g\\:custom_label_0',
            'g\\:custom_label_1',
            'g\\:custom_label_2',
            'g\\:custom_label_3',
            'g\\:custom_label_4',
            'g\\:delai_de_livraison',
          ],
          images: ['g\\:image_link'],
          inventoryQuantity: 'g\\:quantity',
          price: 'g\\:sale_price',
          compareAtPrice: 'g\\:price',
          option1: {
            key: 'Taille',
            value: 'g\\:size',
          },
        },
      },
    },
  },
  alpin_store_orders: {
    slug: 'alpin_store',
    mappingKey: 'alpin_store',
    type: VendorType.PRESTASHOP,
    apiKey: vendorSecrets.alpinstoreApiKey,
    apiUrl: vendorSecrets.alpinstoreApiUrl,
    catalog: {},
    order: {
      common: {
        isSyncActivated: true,
      },
      prestashop: {
        forceOrderStatusAfterCreation: true,
        useExternalVariantIdAsCombinationId: true,
        disableStockCheckBeforeOrder: true,
        customerDefaultGroupId: '3',
        countryId: '8',
        currencyId: '1',
        langId: '1',
        shopGroupId: '1',
        shopId: '1',
        carrierSolution: 'DPD - Domicile',
        paymentModule: 'bankwire',
        paymentMethodName: 'Barooders',
        orderStateId: '2',
        getShippingCost: () => {
          return 10;
        },
      },
    },
  },
  zyclora: {
    slug: 'zyclora',
    mappingKey: 'zyclora',
    type: VendorType.XML,
    apiUrl: 'https://files.channable.com/XhAjAJB4Y8SPMLjfBDhJPg==.xml',
    catalog: {
      xml: {
        fields: {
          variant: 'Product',
          productId: 'id_produit',
          productType: 'categories',
          variantId: 'external_id',
          variantCondition: 'etat',
          productTitle: 'name',
          description: 'long_description',
          tags: [
            'model_of_the_bike',
            'short_description',
            'marques',
            'matiere_cadre',
            'taille_roue_route',
            'taille_roue_vtt',
            'taille_du_cycliste_route',
            'taille_du_cycliste_vtt',
            'debattement_fourche',
            'type_suspension',
            'groupe_transmission',
            'développement_cassette',
            'plateau',
            'url_video',
            'materiau_de_la_roue',
            'vitesses',
            'moteur',
            'kilometrage',
            'batterie',
            'year',
          ],
          images: [
            'image_1',
            'image_2',
            'image_3',
            'image_4',
            'image_5',
            'image_6',
            'image_7',
            'image_8',
          ],
          inventoryQuantity: 'quantity',
          price: 'specific_price_value',
          compareAtPrice: 'price_tax_exc',
          option1: {
            key: 'Taille',
            value: 'taille_cadre_route',
          },
          option2: {
            key: 'Taille VTT',
            value: 'taille_cadre_vtt',
          },
        },
      },
      common: {
        priceCorrections: [{ amount: -10 }],
      },
    },
  },
  lario_ebike: {
    slug: 'lario_ebike',
    mappingKey: 'lario_ebike',
    type: VendorType.CSV,
    apiUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSPyGihqc3-v5Ev4_EydcoZZwmdpHQhQ8HilOofW3JttEhBwXI-DF5JtHH-4owRmzi3WZsyLqQm6ZyM/pub?gid=1274531655&single=true&output=csv',
    catalog: {
      csv: {
        columns: {
          ...baseCsvConfig,
          tags: [9, 10, 11],
          option1: 12,
          variantCondition: 13,
          images: [14],
        },
      },
    },
  },
  sector_ciclismo: {
    slug: 'sector_ciclismo',
    mappingKey: 'sector_ciclismo',
    type: VendorType.CSV,
    apiUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKS-7U4OPGEZgW6ysQGYvDK5EF3PbEpuISJfc8-DNINMa1o-8YIi59JguugaaLIiR5A87MbldmbIiP/pub?gid=1274531655&single=true&output=csv',
    catalog: {
      csv: {
        columns: {
          ...baseCsvConfig,
          productType: [13],
          productTitle: 15,
          tags: [7, 8, 9, 10, 11, 14],
          option1: 7,
          variantCondition: 14,
          images: [17],
        },
      },
    },
  },
  horizons_angers: {
    slug: 'horizons_angers',
    mappingKey: 'horizons_angers',
    type: VendorType.CSV,
    apiUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVIXzEXdqOMDexMi0BnKp1W3esOpWKgQGyVZY8uRQfh9IlaZLG2RBEhG-Gr1u4GdaOYkHvGQujJPp0/pub?gid=1274531655&single=true&output=csv',
    catalog: {
      common: {
        defaultDescription: NEW_PRODUCT_DEFAULT_DESCRIPTION,
      },
      csv: {
        columns: {
          ...baseCsvConfig,
          tags: [9, 10, 11, 13, 17, 18, 19, 20, 21, 22, 23, 24, 25],
          option1: 12,
          variantCondition: 14,
          images: [15, 16],
        },
      },
    },
  },
  agava: {
    slug: 'agava',
    mappingKey: 'agava',
    type: VendorType.CSV,
    apiUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdIczC8BzwR-JzH6IAZKP0UrkVEL1-WYT2UWh2BlEJm7Et7lEFyCtO-rIXpgxkc93x4oKE1W2Wh_ow/pub?gid=1274531655&single=true&output=csv',
    catalog: {
      csv: {
        columns: {
          ...baseCsvConfig,
          tags: [9, 10, 11, 13, 17, 18, 19, 20],
          option1: 12,
          option2: 16,
          variantCondition: 14,
          images: [15],
        },
      },
    },
  },
  agava_parts: {
    slug: 'agava_parts',
    mappingKey: 'agava_parts',
    type: VendorType.CSV,
    apiUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0Cb9aybxzqYEomhR8yRnrPzlhMyZjljxTM4IwjjJOXrukyWPa095L2YLsNSKJI3yY3GJw_NgjfKIF/pub?gid=1274531655&single=true&output=csv',
    catalog: {
      common: {
        variantOptionTagsWithCategorySuffix: ['taille'],
      },
      csv: {
        columns: {
          ...baseCsvConfig,
          tags: [9],
          option1: 10,
          option2: 13,
          variantCondition: 11,
          images: [12],
        },
      },
    },
  },
  agava_presales: {
    slug: 'agava_presales',
    mappingKey: 'agava_presales',
    type: VendorType.CSV,
    apiUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVYXXPlSFGrt9bahdBOEz6odCp9MAJ6EJwIwQjzk-kmweRdgjt1BXrooyMmoaA1Jh1yyjDR-xQ_8RR/pub?gid=1274531655&single=true&output=csv',
    catalog: {
      common: {
        defaultDescription: NEW_PRODUCT_DEFAULT_DESCRIPTION,
      },
      csv: {
        columns: {
          ...baseCsvConfig,
          tags: [9, 10, 11, 13, 17, 18, 19, 20, 21],
          option1: 12,
          option2: 16,
          variantCondition: 14,
          images: [15],
        },
      },
    },
  },
  roue_liber: {
    slug: 'roue_liber',
    mappingKey: 'roue_liber',
    type: VendorType.CSV,
    apiUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSw3fQ2EacRlb9SaLor59kSQRcjsi2UXmGEirFMgIaJtN2B0Jx9Q2VAmVkDmpEfQfmzPGJmlsqdGsEv/pub?gid=601883144&single=true&output=csv',
    catalog: {
      common: {
        defaultDescription: NEW_PRODUCT_DEFAULT_DESCRIPTION,
      },
      csv: {
        columns: {
          ...baseCsvConfig,
          tags: [9, 10, 11, 13, 17, 18, 19, 20, 21, 22, 23],
          option1: 12,
          option2: 16,
          variantCondition: 14,
          images: [15],
        },
      },
    },
  },
  mvh_cycles: {
    slug: 'mvh_cycles',
    mappingKey: 'mvh_cycles',
    type: VendorType.CSV,
    apiUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3ivq2GawbgOK9lpH69orIfPgItgJQOlHllobpXHeFcv0KKxrVxddw7ncVvFUQOFYkyuBhzToCa5oa/pub?gid=1274531655&single=true&output=csv',
    catalog: {
      csv: {
        columns: {
          ...baseCsvConfig,
          tags: [7, 8, 9, 10, 11, 13, 14, 29],
          description: [18],
          productTitle: 12,
          productType: [15],
          variantCondition: 16,
          images: [19],
          option1: 7,
          option2: 8,
          option3: 9,
        },
      },
    },
  },
  darosa_parts: {
    slug: 'darosa_parts',
    mappingKey: 'darosa_parts',
    type: VendorType.CSV,
    apiUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vStJw3XjK6eech-fixprCYN7fMa62NJ5wbE61GUlSiLgGKdA5kJiGUO3xgIYJnqoacCqgfxUjQ137jS/pub?gid=1274531655&single=true&output=csv',
    catalog: {
      csv: {
        columns: {
          ...baseCsvConfig,
          tags: [9, 10, 11, 13, 17, 18],
          option1: 12,
          option2: 16,
          variantCondition: 14,
          images: [15],
        },
      },
    },
  },
  darosa_bikes: {
    slug: 'darosa_bikes',
    mappingKey: 'darosa_bikes',
    type: VendorType.CSV,
    apiUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRckhzJH863TvQMTvVN7-jRtt8sg3WoyaXzHtb13PdkV9AazV6iYcmjwZ_w9WqtMux-2He94PDqyk3F/pub?gid=1274531655&single=true&output=csv',
    catalog: {
      csv: {
        columns: {
          ...baseCsvConfig,
          tags: [9, 10, 11, 13, 17, 18],
          option1: 12,
          option2: 16,
          variantCondition: 14,
          images: [15],
        },
      },
    },
  },
  nordics_value: {
    slug: 'nordics_value',
    mappingKey: 'nordics_value',
    type: VendorType.SHOPIFY,
    apiUrl: 'rvfocus1demo.myshopify.com',
    accessToken: vendorSecrets.nordicsAccessToken,
    catalog: {
      common: {
        defaultDescription: USED_PRODUCT_DEFAULT_DESCRIPTION,
        defaultProductCondition: Condition.VERY_GOOD,
      },
    },
  },
  projet_boussole: {
    slug: 'projet_boussole',
    mappingKey: 'projet_boussole',
    type: VendorType.SHOPIFY,
    apiUrl: 'projet-boussole.myshopify.com',
    accessToken: vendorSecrets.boussoleAccessToken,
    catalog: {},
  },
  jbikes: {
    slug: 'jbikes',
    mappingKey: 'jbikes',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://jbikes.fr/wp-json/wc/v3',
    apiKey: vendorSecrets.jbikesApiKey,
    apiSecret: vendorSecrets.jbikesApiSecret,
    catalog: {
      common: {
        parsedTagKeysFromDescription: DESIRED_BIKES_TAGS,
        defaultProductCondition: Condition.VERY_GOOD,
      },
      wooCommerce: {
        mapSingleVariant: true,
        stringifySingleItemArray: true,
      },
    },
  },
  fastlap: {
    slug: 'fastlap',
    mappingKey: 'fastlap',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://fastlap.shop/wp-json/wc/v3',
    apiKey: vendorSecrets.fastlapApiKey,
    apiSecret: vendorSecrets.fastlapApiSecret,
    catalog: {
      common: {
        defaultProductCondition: Condition.VERY_GOOD,
      },
      wooCommerce: {
        mapSingleVariant: true,
      },
    },
  },
  gary_bom: {
    slug: 'gary_bom',
    mappingKey: 'gary_bom',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://www.atelierduride.com/wp-json/wc/v3',
    apiKey: vendorSecrets.garybomApiKey,
    apiSecret: vendorSecrets.garybomApiSecret,
    catalog: {
      wooCommerce: {
        mapSingleVariant: true,
      },
    },
  },
  joost_bikes: {
    slug: 'joost_bikes',
    mappingKey: 'joost_bikes',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://joostracefietsen.nl/wp-json/wc/v3',
    apiKey: vendorSecrets.joostBikesApiKey,
    apiSecret: vendorSecrets.joostBikesApiSecret,
    catalog: {
      wooCommerce: {
        mapSingleVariant: true,
        stringifySingleItemArray: true,
      },
    },
  },
  velosport20: {
    slug: 'velosport20',
    mappingKey: 'velosport20',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://www.ciclisport2000.it/wp-json/wc/v3',
    apiKey: vendorSecrets.velosport20ApiKey,
    apiSecret: vendorSecrets.velosport20ApiSecret,
    catalog: {
      common: {
        skipProductUpdate: true,
        commissionPercentToAdd: 6,
      },
      wooCommerce: {
        mapSingleVariant: true,
        stringifySingleItemArray: true,
      },
    },
  },
  le_hollandais: {
    slug: 'le_hollandais',
    mappingKey: 'le_hollandais',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://lehollandaisvelo.fr/wp-json/wc/v3',
    apiKey: vendorSecrets.lehollandaisApiKey,
    apiSecret: vendorSecrets.lehollandaisApiSecret,
    catalog: {
      wooCommerce: {
        stringifySingleItemArray: true,
      },
    },
  },
  dayak: {
    slug: 'dayak',
    mappingKey: 'dayak',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://velo-dayak.fr/wp-json/wc/v3',
    apiKey: vendorSecrets.dayakApiKey,
    apiSecret: vendorSecrets.dayakApiSecret,
    catalog: {
      common: {
        minimumDiscount: 0.1,
        defaultProductCondition: Condition.AS_NEW,
      },
      wooCommerce: {
        stringifySingleItemArray: true,
      },
    },
  },
  hbe_shopify: {
    slug: 'hbe_shopify',
    mappingKey: 'hbe_shopify',
    type: VendorType.SHOPIFY,
    apiUrl: 'velvet-3240.myshopify.com',
    accessToken: vendorSecrets.hbeShopifyAccessToken,
    catalog: {
      common: {
        translateDescription: false,
        parsedTagKeysFromDescription: DESIRED_BIKES_TAGS,
        descriptionPrefix: `<ul>
        <li>47 points de contrôle sur nos vélos</li>
        <li>Garantie Européenne : 15 mois</li>
        <li>Délai de rétractation de 14 jours</li>
        <li>Livraison sous 2 à 5 jours avec suivi et trace ouvrés dans l'UE avec suivi et Airtag (optionnel)</li>
        <li>Service client disponible 7j/7</li>
      </ul>
      <br>`,
      },
    },
  },
  bikef: {
    slug: 'bikef',
    mappingKey: 'bikef',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://www.worldbikeformia.it/wp-json/wc/v3',
    apiKey: vendorSecrets.bikefApiKey,
    apiSecret: vendorSecrets.bikefApiSecret,
    catalog: {
      common: {
        commissionPercentToAdd: 9,
        translateDescription: true,
      },
    },
  },
  sbikes: {
    slug: 'sbikes',
    mappingKey: 'sbikes',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://cheapassbikes.nl/wp-json/wc/v3',
    apiKey: vendorSecrets.sbikesApiKey,
    apiSecret: vendorSecrets.sbikesApiSecret,
    catalog: {
      common: {
        priceCorrections: [{ amount: 40 }],
        translateDescription: true,
        descriptionPrefix: `<ul>
      <li>Tous les vélos seront livrés avec un antivol et une sonnette</li>
      <li>Une boîte endommagée ne donne pas le droit de refuser/retourner le vélo</li>
      <li>Les vélos peuvent présenter des rayures ou des défauts de peinture</li>
      <li>Les vélos ont une garantie de 2 semaines</li>
      <li>En cas de problèmes techniques, le client peut faire réparer le vélo dans un magasin de vélo local et nous envoyer le reçu du paiement</li>
      <li>Le retour gratuit n’est possible que si le vélo ne peut pas être réparé</li>
      <li>Le retour normal est possible dans les 14 jours et les frais s’élèvent à 99 euros qui ne vous seront pas rétribués lors du remboursement</li>
    </ul>
    <br>`,
      },
      wooCommerce: {
        mapSingleVariant: true,
        stringifySingleItemArray: true,
      },
    },
  },
  recocycle: {
    slug: 'recocycle',
    mappingKey: 'recocycle',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://recocycle.fr/wp-json/wc/v3',
    apiKey: vendorSecrets.recoApiKey,
    apiSecret: vendorSecrets.recoApiSecret,
    catalog: {
      common: {
        parsedTagKeysFromDescription: ['brand'],
      },
      wooCommerce: {
        stringifySingleItemArray: true,
      },
    },
  },
  manufaktur: {
    slug: 'manufaktur',
    mappingKey: 'manufaktur',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://www.lastenrad-manufaktur.com/wp-json/wc/v3',
    apiKey: vendorSecrets.manufakturApiKey,
    apiSecret: vendorSecrets.manufakturApiSecret,
    catalog: {
      common: {
        parsedTagKeysFromDescription: MINIMAL_BIKES_TAGS,
        translateDescription: true,
        defaultProductCondition: Condition.AS_NEW,
      },
      wooCommerce: {
        mapSingleVariant: true,
        stringifySingleItemArray: true,
      },
    },
  },
  elettronic: {
    slug: 'elettronic',
    mappingKey: 'elettronic',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://www.elettronicshop.com/wp-json/wc/v3',
    apiKey: vendorSecrets.elettronicApiKey,
    apiSecret: vendorSecrets.elettronicApiSecret,
    catalog: {
      common: {
        defaultProductCondition: Condition.VERY_GOOD,
        translateDescription: true,
      },
      wooCommerce: {
        mapSingleVariant: true,
      },
    },
  },
  moulin_a_velos: {
    slug: 'moulin_a_velos',
    mappingKey: 'moulin_a_velos',
    type: VendorType.WOO_COMMERCE,
    apiUrl: 'https://www.lemoulinavelos.com/wp-json/wc/v3',
    apiKey: vendorSecrets.moulinApiKey,
    apiSecret: vendorSecrets.moulinApiSecret,
    catalog: {
      wooCommerce: {
        mapSingleVariant: true,
        stringifySingleItemArray: true,
      },
    },
  },
};
