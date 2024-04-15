import MondopointTable from '@/components/molecules/MondopointTable';
import { merge } from 'lodash';
import compact from 'lodash/compact';

export type ProductAttributeConfig = {
  name: ProductAttributes;
  attributeName: string;
  shopifyTagName?: string;
  informativeComponent?: React.ReactNode;
  sortAlphabetically?: boolean;
  capitalize?: boolean;
};

export enum ProductAttributes {
  PRODUCT_TYPE = 'PRODUCT_TYPE',
  OWNER = 'OWNER',
  PRODUCT_DISCOUNT_RANGE = 'PRODUCT_DISCOUNT_RANGE',
  CONDITION = 'CONDITION',
  YEAR = 'YEAR',
  COLOR = 'COLOR',
  FREE_RANDO = 'FREE_RANDO',
  GENDER = 'GENDER',
  GORE_TEX = 'GORE_TEX',
  GPS_INTEGRATED = 'GPS_INTEGRATED',
  TRANSMISSION_GROUP = 'TRANSMISSION_GROUP',
  FLYING_HOURS = 'FLYING_HOURS',
  BRAND = 'BRAND',
  MODEL = 'MODEL',
  MATTER = 'MATTER',
  MATTER_STICK = 'MATTER_STICK',
  MATTER_FRAME = 'MATTER_FRAME',
  LEVEL = 'LEVEL',
  OUTINGS_NUMBER = 'OUTINGS_NUMBER',
  CROSS_SKIING_STANDARD = 'CROSS_SKIING_STANDARD',
  WEIGHT = 'WEIGHT',
  TOTAL_FLYING_WEIGHT = 'TOTAL_FLYING_WEIGHT',
  SIZE = 'SIZE',
  SIZE_WING = 'SIZE_WING',
  SIZE_CYCLIST = 'SIZE_CYCLIST',
  SIZE_PARAGLIDER = 'SIZE_PARAGLIDER',
  SIZE_HARNESS = 'SIZE_HARNESS',
  SIZE_CRAMPON = 'SIZE_CRAMPON',
  SIZE_GEAR = 'SIZE_GEAR',
  SIZE_HELMET = 'SIZE_HELMET',
  SIZE_WATCH = 'SIZE_WATCH',
  SIZE_MONDOPOINT = 'SIZE_MONDOPOINT',
  SIZE_BOARD_FEET = 'SIZE_BOARD_FEET',
  SIZE_SHOES = 'SIZE_SHOES',
  SIZE_ROLLER = 'SIZE_ROLLER',
  SIZE_SADDLE = 'SIZE_SADDLE',
  SIZE_SKI = 'SIZE_SKI',
  SIZE_TENT = 'SIZE_TENT',
  SIZE_TEXTILE = 'SIZE_TEXTILE',
  SIZE_BIKE = 'SIZE_BIKE',
  FORMATTED_SIZE_BIKE = 'FORMATTED_SIZE_BIKE',
  IS_REFURBISHED = 'IS_REFURBISHED',
  SIZE_VOLUME = 'SIZE_VOLUME',
}
type AttributesConfiguration = {
  [name: string]: ProductAttributeConfig;
};

const commonAttributesConfiguration: AttributesConfiguration = {
  [ProductAttributes.PRODUCT_TYPE]: {
    name: ProductAttributes.PRODUCT_TYPE,
    attributeName: 'product_type',
    capitalize: false,
  },
  [ProductAttributes.CONDITION]: {
    name: ProductAttributes.CONDITION,
    attributeName: 'condition',
  },
  [ProductAttributes.BRAND]: {
    name: ProductAttributes.BRAND,
    attributeName: 'array_tags.marque',
    shopifyTagName: 'marque',
  },
  [ProductAttributes.MODEL]: {
    name: ProductAttributes.MODEL,
    attributeName: 'array_tags.modele',
    shopifyTagName: 'modele',
    capitalize: false,
  },
};

export const b2bProductAttributesConfiguration: AttributesConfiguration = {
  ...commonAttributesConfiguration,
};

export const publicProductAttributesConfiguration: AttributesConfiguration = {
  ...commonAttributesConfiguration,
  [ProductAttributes.OWNER]: {
    name: ProductAttributes.OWNER,
    attributeName: 'meta.barooders.owner',
  },
  [ProductAttributes.FORMATTED_SIZE_BIKE]: {
    name: ProductAttributes.FORMATTED_SIZE_BIKE,
    attributeName: 'array_tags.formatted-bike-size',
    shopifyTagName: 'formatted-bike-size',
  },
  [ProductAttributes.PRODUCT_DISCOUNT_RANGE]: {
    name: ProductAttributes.PRODUCT_DISCOUNT_RANGE,
    attributeName: 'meta.barooders.product_discount_range',
  },
  [ProductAttributes.IS_REFURBISHED]: {
    name: ProductAttributes.IS_REFURBISHED,
    attributeName: 'is_refurbished',
  },
  [ProductAttributes.TRANSMISSION_GROUP]: {
    name: ProductAttributes.TRANSMISSION_GROUP,
    attributeName: 'array_tags.groupe-transmission-velos',
    shopifyTagName: 'groupe-transmission-velos',
    capitalize: false,
  },
  [ProductAttributes.FREE_RANDO]: {
    name: ProductAttributes.FREE_RANDO,
    attributeName: 'array_tags.free rando',
    shopifyTagName: 'free rando',
  },
  [ProductAttributes.GORE_TEX]: {
    name: ProductAttributes.GORE_TEX,
    attributeName: 'array_tags.gore-tex',
    shopifyTagName: 'gore-tex',
  },
  [ProductAttributes.GPS_INTEGRATED]: {
    name: ProductAttributes.GPS_INTEGRATED,
    attributeName: 'array_tags.gps intégré',
    shopifyTagName: 'gps intégré',
  },
  [ProductAttributes.FLYING_HOURS]: {
    name: ProductAttributes.FLYING_HOURS,
    attributeName: 'array_tags.heures de vol',
    shopifyTagName: 'heures de vol',
  },
  [ProductAttributes.MATTER]: {
    name: ProductAttributes.MATTER,
    attributeName: 'array_tags.matière',
    shopifyTagName: 'matière',
  },
  [ProductAttributes.MATTER_STICK]: {
    name: ProductAttributes.MATTER_STICK,
    attributeName: 'array_tags.matériau bâtons',
    shopifyTagName: 'matériau bâtons',
  },
  [ProductAttributes.MATTER_FRAME]: {
    name: ProductAttributes.MATTER_FRAME,
    attributeName: 'array_tags.matériau du cadre',
    shopifyTagName: 'matériau du cadre',
  },
  [ProductAttributes.LEVEL]: {
    name: ProductAttributes.LEVEL,
    attributeName: 'array_tags.niveau',
    shopifyTagName: 'niveau',
  },
  [ProductAttributes.OUTINGS_NUMBER]: {
    name: ProductAttributes.OUTINGS_NUMBER,
    attributeName: 'array_tags.nombre de sorties',
    shopifyTagName: 'nombre de sorties',
  },
  [ProductAttributes.CROSS_SKIING_STANDARD]: {
    name: ProductAttributes.CROSS_SKIING_STANDARD,
    attributeName: 'array_tags.norme ski de fond',
    shopifyTagName: 'norme ski de fond',
  },
  [ProductAttributes.TOTAL_FLYING_WEIGHT]: {
    name: ProductAttributes.TOTAL_FLYING_WEIGHT,
    attributeName: 'array_tags.ptv',
    shopifyTagName: 'ptv',
  },
  [ProductAttributes.SIZE]: {
    name: ProductAttributes.SIZE,
    attributeName: 'array_tags.taille',
    shopifyTagName: 'taille',
  },
  [ProductAttributes.SIZE_WING]: {
    name: ProductAttributes.SIZE_WING,
    attributeName: 'array_tags.taille aile',
    shopifyTagName: 'taille aile',
  },
  [ProductAttributes.SIZE_CYCLIST]: {
    name: ProductAttributes.SIZE_CYCLIST,
    attributeName: 'array_tags.taille parapente',
    shopifyTagName: 'taille parapente',
  },
  [ProductAttributes.SIZE_PARAGLIDER]: {
    name: ProductAttributes.SIZE_PARAGLIDER,
    attributeName: 'array_tags.taille-baudrier',
    shopifyTagName: 'taille-baudrier',
  },
  [ProductAttributes.SIZE_HARNESS]: {
    name: ProductAttributes.SIZE_HARNESS,
    attributeName: 'array_tags.taille-crampon',
    shopifyTagName: 'taille-crampon',
  },
  [ProductAttributes.SIZE_CRAMPON]: {
    name: ProductAttributes.SIZE_CRAMPON,
    attributeName: 'array_tags.taille-cycliste',
    shopifyTagName: 'taille-cycliste',
  },
  [ProductAttributes.SIZE_GEAR]: {
    name: ProductAttributes.SIZE_GEAR,
    attributeName: 'array_tags.taille-gear',
    shopifyTagName: 'taille-gear',
  },
  [ProductAttributes.SIZE_HELMET]: {
    name: ProductAttributes.SIZE_HELMET,
    attributeName: 'array_tags.taille-helmet',
    shopifyTagName: 'taille-helmet',
  },
  [ProductAttributes.SIZE_WATCH]: {
    name: ProductAttributes.SIZE_WATCH,
    attributeName: 'array_tags.taille-montre',
    shopifyTagName: 'taille-montre',
  },
  [ProductAttributes.SIZE_MONDOPOINT]: {
    name: ProductAttributes.SIZE_MONDOPOINT,
    attributeName: 'array_tags.taille-mp',
    shopifyTagName: 'taille-mp',
    informativeComponent: <MondopointTable />,
  },
  [ProductAttributes.SIZE_BOARD_FEET]: {
    name: ProductAttributes.SIZE_BOARD_FEET,
    attributeName: 'array_tags.taille-planche-feet',
    shopifyTagName: 'taille-planche-feet',
  },
  [ProductAttributes.SIZE_SHOES]: {
    name: ProductAttributes.SIZE_SHOES,
    attributeName: 'array_tags.taille-pointure',
    shopifyTagName: 'taille-pointure',
  },
  [ProductAttributes.SIZE_ROLLER]: {
    name: ProductAttributes.SIZE_ROLLER,
    attributeName: 'array_tags.taille-roller',
    shopifyTagName: 'taille-roller',
  },
  [ProductAttributes.SIZE_SADDLE]: {
    name: ProductAttributes.SIZE_SADDLE,
    attributeName: 'array_tags.taille-sellette',
    shopifyTagName: 'taille-sellette',
  },
  [ProductAttributes.SIZE_SKI]: {
    name: ProductAttributes.SIZE_SKI,
    attributeName: 'array_tags.taille-ski',
    shopifyTagName: 'taille-ski',
  },
  [ProductAttributes.SIZE_TENT]: {
    name: ProductAttributes.SIZE_TENT,
    attributeName: 'array_tags.taille-tentes',
    shopifyTagName: 'taille-tentes',
  },
  [ProductAttributes.SIZE_TEXTILE]: {
    name: ProductAttributes.SIZE_TEXTILE,
    attributeName: 'array_tags.taille-textile',
    shopifyTagName: 'taille-textile',
  },
  [ProductAttributes.GENDER]: {
    name: ProductAttributes.GENDER,
    attributeName: 'array_tags.genre',
    shopifyTagName: 'genre',
  },
  [ProductAttributes.YEAR]: {
    name: ProductAttributes.YEAR,
    attributeName: 'array_tags.année',
    shopifyTagName: 'année',
  },
  [ProductAttributes.COLOR]: {
    name: ProductAttributes.COLOR,
    attributeName: 'array_tags.couleur',
    shopifyTagName: 'couleur',
  },
  [ProductAttributes.SIZE_VOLUME]: {
    name: ProductAttributes.SIZE_VOLUME,
    attributeName: 'array_tags.taille-volume',
    shopifyTagName: 'taille-volume',
  },
};

const mergedProductAttributesConfiguration = merge(
  publicProductAttributesConfiguration,
  b2bProductAttributesConfiguration,
);

export const getProductConfigFromShopifyTags = (tagNames: string[]) =>
  compact(
    tagNames.map((tagName) =>
      Object.values(mergedProductAttributesConfiguration).find(
        (productAttribute) => productAttribute.shopifyTagName === tagName,
      ),
    ),
  );

export const getProductConfigFromAttributeName = (tagName: string) =>
  Object.values(mergedProductAttributesConfiguration).find(
    (productAttribute) => productAttribute.attributeName === tagName,
  );
