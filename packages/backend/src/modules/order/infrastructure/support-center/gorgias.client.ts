import envConfig from '@config/env/env.config';
import {
  ISupportCenterClient,
  OpenTicket,
} from '@modules/order/domain/ports/support-center.client';
import { Injectable, Logger } from '@nestjs/common';

const GORGIAS_BASE_URL = 'https://barooders.gorgias.com';

const getFromGorgias = async (path: string) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Basic ${envConfig.externalServices.gorgias.basicToken}`,
    },
  };

  const response = await fetch(`${GORGIAS_BASE_URL}/api${path}`, options);

  if (!response.ok) {
    throw new Error(
      `Cannot GET from Gorgias for ${path}: ${response.statusText}`,
    );
  }

  const { data } = await response.json();

  if (!data || !Array.isArray(data))
    throw new Error(`No data array found in Gorgias response for ${path}`);

  return data;
};

@Injectable()
export class GorgiasClient implements ISupportCenterClient {
  private readonly logger: Logger = new Logger(GorgiasClient.name);

  async getOpenTickets(email: string): Promise<OpenTicket[]> {
    const customers = await getFromGorgias(`/customers?email=${email}`);

    if (customers.length === 0) {
      this.logger.warn(`No customer found in Gorgias for email ${email}`);
      return [];
    }

    const gorgiasUserId = customers[0].id;

    const openTickets = await getFromGorgias(
      `/tickets?customer_id=${gorgiasUserId}`,
    );

    return openTickets
      .filter(({ status }) => status === 'open')
      .map(({ id, subject: title }) => ({
        url: `${GORGIAS_BASE_URL}/app/ticket/${id}`,
        title,
      }));
  }
}
