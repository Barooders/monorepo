export abstract class IInternalNotificationClient {
  abstract sendB2BNotification(message: string): Promise<void>;
}
