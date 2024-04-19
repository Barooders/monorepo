export abstract class IMarketingClient {
  abstract deleteProfile(clientEmail: string): Promise<void>;
}
