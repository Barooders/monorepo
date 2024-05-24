import envConfig from '@config/env/env.config';
import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { IAnalyticsProvider } from '@modules/customer/domain/ports/analytics.provider';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { sign } from 'jsonwebtoken';

const METABASE_SITE_URL = 'https://barooders-metabase.herokuapp.com';
const VENDOR_DASHBOARD_ID = 68;

type MetabasePayload = {
  resource: { dashboard: number };
  params: { vendor: string };
  exp: number;
};

@Injectable()
export class MetabaseClient implements IAnalyticsProvider {
  constructor(private prisma: PrismaMainClient) {}

  async getVendorDataURL(vendorId: UUID): Promise<string> {
    const { sellerName } = await this.prisma.customer.findUniqueOrThrow({
      where: {
        authUserId: vendorId.uuid,
      },
    });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!sellerName) {
      throw new Error('Vendor seller name not found');
    }

    const payload: MetabasePayload = {
      resource: { dashboard: VENDOR_DASHBOARD_ID },
      params: {
        vendor: sellerName,
      },
      exp: dayjs().add(10, 'minute').unix(),
    };

    const token = sign(payload, envConfig.externalServices.metabase.secretKey);

    return (
      METABASE_SITE_URL +
      '/embed/dashboard/' +
      token +
      '#bordered=true&titled=false'
    );
  }
}
