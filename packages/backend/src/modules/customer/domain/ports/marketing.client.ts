export abstract class IMarketingClient {
  abstract deleteProfile(clientEmail: string): Promise<void>;
  abstract createProfile(
    clientEmail: string,
    firstName: string,
    lastName: string,
  ): Promise<void>;
}
