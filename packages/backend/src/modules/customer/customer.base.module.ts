import { CustomerRepository as SharedCustomerRepository } from '@libs/domain/customer.repository';
import { CustomerService } from './domain/customer.service';
import { PaymentAccountProviderService } from './domain/payment-account-provider.service';
import { IAnalyticsProvider } from './domain/ports/analytics.provider';
import { IInternalNotificationClient } from './domain/ports/internal-notification.client';
import { IMarketingClient } from './domain/ports/marketing.client';
import { IPaymentProvider } from './domain/ports/payment-provider';
import { IStoreRepository } from './domain/ports/store.repository';
import { MetabaseClient } from './infrastructure/analytics/metabase.client';
import { SlackClient } from './infrastructure/internal-notification/slack.client';
import { KlaviyoClient } from './infrastructure/marketing/klaviyo.client';
import { StripeClient } from './infrastructure/payment-provider/stripe.client';
import { ShopifyRepository } from './infrastructure/store/shopify.repository';

export const commonProviders = [
  CustomerService,
  PaymentAccountProviderService,
  SharedCustomerRepository,
  {
    provide: IPaymentProvider,
    useClass: StripeClient,
  },
  {
    provide: IInternalNotificationClient,
    useClass: SlackClient,
  },
  {
    provide: IAnalyticsProvider,
    useClass: MetabaseClient,
  },
  {
    provide: IMarketingClient,
    useClass: KlaviyoClient,
  },
  { provide: IStoreRepository, useClass: ShopifyRepository },
];
