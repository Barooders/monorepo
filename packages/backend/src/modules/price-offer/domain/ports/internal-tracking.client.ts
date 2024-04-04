export abstract class IInternalTrackingClient {
  abstract createB2BOffer(message: string): Promise<void>;
}
