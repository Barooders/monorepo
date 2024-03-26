export abstract class IInternalNotificationClient {
  abstract sendNewPriceOfferNotification(message: string): Promise<void>;
}
