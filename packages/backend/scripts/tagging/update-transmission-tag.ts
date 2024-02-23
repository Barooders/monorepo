/* eslint-disable no-console */
import production from '@config/env/prod.secret';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import 'dotenv.config';
import Shopify from 'shopify-api-node';

const DATA_FOLDER = `${__dirname}/data`;
const PRODUCTS_FILE = 'transmission.csv';
type ProductNeedingTagCleaning = [string, string, string, string, string];

const shopifyClient = new Shopify({
  shopName: 'barooders.myshopify.com',
  accessToken: production.externalServices.shopify.accessToken,
  autoLimit: true,
});

const PIM_TRANSMISSION_TAGS = [
  'Campagnolo Athena EPS',
  'Campagnolo Athena',
  'Campagnolo Centaur',
  'Campagnolo Chorus',
  'Campagnolo EKAR',
  'Campagnolo Mirage',
  'Campagnolo Record EPS',
  'Campagnolo Super Record EPS',
  'Campagnolo Super Record',
  'Campagnolo Record',
  'Campagnolo Veloce',
  'Campagnolo Potenza',
  'SRAM Apex',
  'SRAM Force eTap AXS',
  'SRAM Force',
  'SRAM GX Eagle AXS',
  'SRAM GX Eagle',
  'SRAM NX Eagle',
  'SRAM NX Eagle eTap AXS',
  'SRAM Eagle',
  'SRAM Red eTap AXS',
  'SRAM Red eTap',
  'SRAM Red',
  'SRAM Rival eTap AXS',
  'SRAM Rival eTap',
  'SRAM Rival',
  'SRAM SX Eagle',
  'SRAM X01 AXS Eagle',
  'SRAM X01 Eagle',
  'SRAM XX1 AXS Eagle',
  'SRAM XX1 Eagle',
  'Shimano 105 Di2',
  'Shimano 105',
  'Shimano Acera',
  'Shimano Alivio',
  'Shimano Altus',
  'Shimano Claris',
  'Shimano Deore XT',
  'Shimano Deore',
  'Shimano Dura-Ace Di2',
  'Shimano Dura-Ace',
  'Shimano GRX',
  'Shimano Nexus',
  'Shimano SLX',
  'Shimano STX',
  'Shimano Sora',
  'Shimano Tiagra',
  'Shimano Tourney',
  'Shimano Ultegra Di2',
  'Shimano Ultegra',
  'Shimano XTR',
  'Shimano XT',
  'Shimano RSX 100',
];

const getNewTagValue = (value: string) => {
  const lowerValue = value.toLowerCase();

  if (lowerValue.includes('ekar')) return 'Campagnolo EKAR';
  if (lowerValue.includes('super record') && lowerValue.includes('eps'))
    return 'Campagnolo Super Record EPS';
  if (lowerValue.includes('super record')) return 'Campagnolo Super Record';
  if (lowerValue.includes('record')) return 'Campagnolo Record';
  if (lowerValue.includes('potenza')) return 'Campagnolo Potenza';
  if (lowerValue.includes('apex')) return 'SRAM Apex';
  if (lowerValue.includes('force') && lowerValue.includes('axs'))
    return 'SRAM Force eTap AXS';
  if (lowerValue.includes('record')) return 'Campagnolo Record';
  if (lowerValue.includes('gx') && lowerValue.includes('axs'))
    return 'SRAM GX Eagle AXS';
  if (lowerValue.includes('gx')) return 'SRAM GX Eagle';
  if (lowerValue.includes('nx')) return 'SRAM NX Eagle';
  if (lowerValue.includes('red') && lowerValue.includes('axs'))
    return 'SRAM Red eTap AXS';
  if (
    lowerValue.includes('red') &&
    (lowerValue.includes('etap') || lowerValue.includes('e-tap'))
  )
    return 'SRAM Red eTap';
  if (lowerValue.includes('rival') && lowerValue.includes('axs'))
    return 'SRAM Rival eTap AXS';
  if (lowerValue.includes('rival')) return 'SRAM Rival';
  if (lowerValue.includes('105') && lowerValue.includes('di2'))
    return 'Shimano 105 Di2';
  if (lowerValue.includes('105')) return 'Shimano 105';
  if (lowerValue.includes('alivio')) return 'Shimano Alivio';
  if (lowerValue.includes('altus')) return 'Shimano Altus';
  if (lowerValue.includes('deore') && lowerValue.includes('xt'))
    return 'Shimano Deore XT';
  if (lowerValue.includes('dura') && lowerValue.includes('di2'))
    return 'Shimano Dura-Ace Di2';
  if (lowerValue.includes('dura')) return 'Shimano Dura-Ace';
  if (
    lowerValue.includes('deora') ||
    lowerValue.includes('depre') ||
    lowerValue.includes('deor') ||
    lowerValue.includes('shimano d')
  )
    return 'Shimano Deore';
  if (lowerValue.includes('grx')) return 'Shimano GRX';
  if (lowerValue.includes('nexus')) return 'Shimano Nexus';
  if (lowerValue.includes('slx')) return 'Shimano SLX';
  if (lowerValue.includes('stx')) return 'Shimano STX';
  if (lowerValue.includes('sora')) return 'Shimano Sora';
  if (lowerValue.includes('tiagra')) return 'Shimano Tiagra';
  if (lowerValue.includes('tourney')) return 'Shimano Tourney';
  if (lowerValue.includes('ultegra') && lowerValue.includes('di2'))
    return 'Shimano Ultegra Di2';
  if (
    lowerValue.includes('ultegra') ||
    lowerValue.includes('ultégra') ||
    lowerValue.includes('shimano u') ||
    lowerValue.includes('ultagra')
  )
    return 'Shimano Ultegra';
  if (lowerValue.includes('xtr')) return 'Shimano XTR';
  if (lowerValue.includes('xt')) return 'Shimano XT';
  if (lowerValue.includes('rsx')) return 'Shimano RSX 100';

  const pimTag = PIM_TRANSMISSION_TAGS.find(
    (tag) => tag.toLowerCase() === lowerValue,
  );

  if (pimTag) return pimTag;

  if (lowerValue.includes('shimano')) return 'Shimano';
  if (lowerValue.includes('campagnolo')) return 'Campagnolo';
  if (lowerValue.includes('sram')) return 'SRAM';

  return 'Autre';
};

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, PRODUCTS_FILE, {
    from: 2,
  })) as ProductNeedingTagCleaning[];

  for (const [productId, tagString] of rows) {
    try {
      const productIdNumber = Number(productId);

      const productTags = tagString.split(';').map((tag) => tag.trim());

      const transmissionTag = productTags.find((tag) =>
        tag.includes('groupe-transmission-velos:'),
      );

      if (!transmissionTag) {
        //console.log(`👋 ${productId} - No transmission tag (skipping)`);
        continue;
      }

      const [key, value] = transmissionTag.split(':');
      const newTagValue = getNewTagValue(value);

      if (newTagValue === value) {
        //console.log(`👋 ${productId} - No change (skipping)`);
        continue;
      }

      await shopifyClient.product.update(productIdNumber, {
        tags: [
          ...productTags.filter((tag) => tag !== transmissionTag),
          `${key}:${newTagValue}`,
        ].join(', '),
      });

      console.log(
        `🚀 ${productId} - updated from "${value}" to "${newTagValue}"`,
      );
    } catch (e) {
      console.error(`💥 ${JSON.stringify(e)}`);
    }
  }
};

void run();
