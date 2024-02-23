export abstract class IInternalNotificationClient {
  abstract sendOrderPaidNotification(message: string): Promise<void>;
  abstract sendFirstSaleNotification(message: string): Promise<void>;
  abstract sendOrderCreatedWithBaroodersSplitPaymentNotification(
    message: string,
  ): Promise<void>;
  abstract sendErrorNotification(message: string): Promise<void>;
  abstract sendOrderCanceledNotification(message: string): Promise<void>;
}
