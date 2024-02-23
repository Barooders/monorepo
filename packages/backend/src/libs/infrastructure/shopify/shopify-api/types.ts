export type ShopifyError = {
  message: string;
  response?: { body?: { errors?: Record<string, unknown>[]; error?: string } };
};
