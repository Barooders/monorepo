export abstract class IEmailClient {
  abstract sendCreatedOfferEmail(
    toEmail: string,
    toFirstName: string,
  ): Promise<void>;
}
