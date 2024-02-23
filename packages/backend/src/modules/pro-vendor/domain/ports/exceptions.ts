import { ExceptionBase } from '@libs/domain/exceptions';

export class ProductOutOfStockException extends ExceptionBase {
  constructor(externalVariantId: string) {
    super(`Variant (${externalVariantId}) is not available on vendor.`);
  }

  readonly code = 'VENDOR.PRODUCT_OUT_OF_STOCK';
}
