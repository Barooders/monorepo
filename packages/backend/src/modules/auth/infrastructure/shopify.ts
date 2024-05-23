// Copied from https://github.com/beaucoo/multipassify/blob/master/multipassify.js
import { shopifyConfig } from '@config/shopify.config';
import * as crypto from 'crypto';
import { jsonStringify } from '@libs/helpers/json';

const BLOCK_SIZE = 16;

type MultipassPayload = {
  email: string;
  redirect_to?: string;
};

type EncryptionKeys = {
  encryptionKey: Buffer;
  signingKey: Buffer;
};

export const getEncryptionKeys = (): EncryptionKeys => {
  const secret = shopifyConfig.shopifyMultipassSecret;
  const hash = crypto.createHash('sha256').update(secret).digest();
  return {
    encryptionKey: hash.slice(0, BLOCK_SIZE),
    signingKey: hash.slice(BLOCK_SIZE, 32),
  };
};

export const encode = (payload: MultipassPayload) => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!payload) return;

  // Serialize the customer data to JSON and encrypt it
  const cipherText = encrypt(
    jsonStringify({
      ...payload,
      created_at: new Date().toISOString(),
    }),
  );

  // Create a signature (message authentication code) of the ciphertext
  // and encode everything using URL-safe Base64 (RFC 4648)
  const token = Buffer.concat([cipherText, sign(cipherText)])
    .toString('base64')
    .replace(/\+/g, '-') // Replace + with -
    .replace(/\//g, '_'); // Replace / with _;

  return token;
};

export const generateUrl = (payload: MultipassPayload): string => {
  return `https://${shopifyConfig.shopDNS}/account/login/multipass/${encode(
    payload,
  )}`;
};

export const sign = (data: Buffer): Buffer => {
  const signed = crypto
    .createHmac('SHA256', getEncryptionKeys().signingKey)
    .update(data)
    .digest();
  return signed;
};

export const encrypt = (plaintext: string): Buffer => {
  // Use a random IV
  const iv = crypto.randomBytes(BLOCK_SIZE);
  const cipher = crypto.createCipheriv(
    'aes-128-cbc',
    getEncryptionKeys().encryptionKey,
    iv,
  );

  // Use IV as first block of ciphertext
  const encrypted = Buffer.concat([
    iv,
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  return encrypted;
};
