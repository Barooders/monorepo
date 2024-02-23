export class SkippedProductException {
  constructor(readonly productId: string, readonly message: string) {}
}
