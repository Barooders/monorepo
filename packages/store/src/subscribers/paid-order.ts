import {
  OrderService,
  SubscriberArgs,
  SubscriberConfig,
} from '@medusajs/medusa';
import envConfig from '../config/env/env.config';
import { backendClient } from '../utils/backend';

type OrderPaidEvent = {
  id: string;
  no_notification: boolean;
};

export default async function orderPaidHandler({
  data,
}: SubscriberArgs<OrderPaidEvent>) {
  await backendClient<{ data: { id: number } }>(
    `/v2/orders/webhook/paid-event`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `Api-Key ${envConfig.backend.apiKey}`,
      },
      // eslint-disable-next-line no-restricted-syntax
      data: JSON.stringify({ id: data.id }),
    },
  );
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PAYMENT_CAPTURED,
};
