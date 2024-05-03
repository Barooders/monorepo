export abstract class IInternalNotificationClient {
  abstract sendErrorNotification(message: string): Promise<void>;
  abstract sendB2BNotification(message: string): Promise<void>;
}
