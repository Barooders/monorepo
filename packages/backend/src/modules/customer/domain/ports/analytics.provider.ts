import { UUID } from '@libs/domain/value-objects';

export abstract class IAnalyticsProvider {
  abstract getVendorDataURL(vendorId: UUID): Promise<string>;
}
