export abstract class IEmailClient {
  abstract sendCreatedOfferEmail(
    toEmail: string,
    toFirstName: string,
  ): Promise<void>;

  abstract sendProductAvailabilityEmail(
    toEmail: string,
    toFirstName: string,
    oldProductThresholdInDays: number,
  ): Promise<void>;
}
