export abstract class IInternalNotificationProvider {
  abstract notifyStatusChangeOnFloaPayment: (message: string) => Promise<void>;
}
