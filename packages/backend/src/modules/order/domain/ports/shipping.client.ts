export abstract class IShippingClient {
  abstract getOrcreateShippingLabelStreamFromOrderName(
    orderName: string,
  ): Promise<Buffer>;
}
