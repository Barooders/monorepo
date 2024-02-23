export class UnreachableExternalApiException {
  constructor(readonly vendor: string, readonly message: string) {}
}
