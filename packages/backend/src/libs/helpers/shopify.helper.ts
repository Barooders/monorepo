import * as crypto from 'crypto';

/**
 * Authenticate a Shopify webhook as stated here:
 * https://shopify.dev/apps/webhooks/configuration/https#step-5-verify-the-webhook
 * @param {string} rawBody - The rawBody request body used for creating the hash
 * @param {string} hmac - The Shopify hmac to authenticate
 * @param {string} secretKey - The Shopify secret key used to create the hash
 * @returns {boolean} - Boolean confirming/infirming authentication
 */
export const isValidShopifyWebhook = (
  rawBody: string,
  hmac: string,
  secretKey: string,
): boolean => {
  const callHmac = crypto
    .createHmac('sha256', secretKey)
    .update(rawBody, 'utf-8')
    .digest('base64');

  return callHmac === hmac;
};

export const getTagsObject = (
  tags: string | string[],
): Record<string, string[]> => {
  const tagsArray = Array.isArray(tags) ? tags : tags.split(',');

  return tagsArray.reduce((acc: Record<string, string[]>, tag) => {
    const currentEntries = tag.split(/:(.*)/s);
    if (!currentEntries || currentEntries.length !== 3) return acc;

    const key = currentEntries[0].trim();
    const value = currentEntries[1].trim().replace(':', '-');

    if (acc[key] === undefined) {
      acc[key] = [value];
    } else if (Array.isArray(acc[key])) {
      acc[key].push(value);
    }

    return acc;
  }, {});
};
