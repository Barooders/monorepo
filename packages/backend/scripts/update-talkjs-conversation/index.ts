/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import 'dotenv.config';

import { envConfigs } from '@config/env/env.config';
import { extractRowsFromCSVFile } from '@libs/helpers/csv';
import { TalkJS } from 'talkjs-node';

const DATA_FOLDER = `${__dirname}/data`;
const CONVERSATION_FILE = 'conversations.csv';
type Conversation = [string, string, string, string, string, string, string];

const talkJs = new TalkJS({
  appId: envConfigs.production.externalServices.talkjs.appId,
  apiKey: envConfigs.production.externalServices.talkjs.apiKey,
});

const run = async () => {
  const rows = (await extractRowsFromCSVFile(DATA_FOLDER, CONVERSATION_FILE, {
    from: 2,
  })) as Conversation[];

  for (const [
    conversation_id,
    vendor_shopify_id,
    vendor_internal_id,
    customer_shopify_id,
    customer_internal_id,
    product_shopify_id,
    product_internal_id,
  ] of rows) {
    try {
      console.time(`Updating conversation ${conversation_id}`);

      await talkJs.conversations.update(conversation_id, {
        custom: {
          // @ts-ignore
          customerChatId: customer_shopify_id,
          customerInternalId: customer_internal_id,
          customerShopifyId: customer_shopify_id,
          productInternalId: product_internal_id,
          productShopifyId: product_shopify_id,
          vendorChatId: vendor_shopify_id,
          vendorInternalId: vendor_internal_id,
          vendorShopifyId: vendor_shopify_id,
        },
      });

      console.timeEnd(`Updating conversation ${conversation_id}`);
    } catch (error: any) {
      console.log(`${conversation_id} failed to update: ${error.message}`);
    }
  }
};

void run();
