import {
  Order,
  OrderService,
  SubscriberArgs,
  SubscriberConfig,
} from '@medusajs/medusa';
import envConfig from '../config/env/env.config';
import { backendClient } from '../utils/backend';

type OrderPlacedEvent = {
  id: string;
  no_notification: boolean;
};

export default async function orderPlacedHandler({
  data,
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  const orderService: OrderService =
    container.resolve<OrderService>('orderService');

  const order: Order = await orderService.retrieve(data.id, {
    relations: [
      'items',
      'items.variant',
      'items.variant.product',
      'fulfillments',
      'fulfillments.items',
      'discounts',
      'shipping_address',
      'payments',
    ],
  });

  await backendClient<{ data: { id: number } }>(
    `/v2/orders/webhook/created-event`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `Api-Key ${envConfig.backend.apiKey}`,
      },
      // eslint-disable-next-line no-restricted-syntax
      data: JSON.stringify(order),
    },
  );
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
};
