export enum QueueNames {
  PRODUCTS_TO_INDEX = 'products-to-index-queue',
  IMPORT_IMAGES = 'import-images-queue',
}

export type QueuePayload = {
  [QueueNames.PRODUCTS_TO_INDEX]: {
    productId: string;
  };
};
