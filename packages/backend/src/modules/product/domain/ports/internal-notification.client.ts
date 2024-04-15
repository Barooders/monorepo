export abstract class IInternalNotificationClient {
  abstract sendErrorNotification(message: string): Promise<void>;
}
