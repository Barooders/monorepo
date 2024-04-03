import envConfig from '@config/env/env.config';
import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { IAnalyticsProvider } from '@modules/customer/domain/ports/analytics.provider';
import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

const URL_EXPIRATION_TIME = 10 * 60; // 10 minutes
const METABASE_SITE_URL = 'http://barooders-metabase.herokuapp.com';
const VENDOR_DASHBOARD_ID = 68;

@Injectable()
export class MetabaseClient implements IAnalyticsProvider {
  constructor(private prisma: PrismaMainClient) {}

  async getVendorDataURL(vendorId: UUID): Promise<string> {
    const vendorSellerName = await this.prisma.customer.findUniqueOrThrow({
      where: {
        authUserId: vendorId.uuid,
      },
    });

    if (!vendorSellerName) {
      throw new Error('Vendor seller name not found');
    }

    const payload = {
      resource: { dashboard: VENDOR_DASHBOARD_ID },
      params: {
        vendor: vendorSellerName,
      },
      exp: Math.round(Date.now() / 1000) + URL_EXPIRATION_TIME,
    };
    const token = sign(payload, envConfig.externalServices.metabase.secretKey);

    return (
      METABASE_SITE_URL +
      '/embed/dashboard/' +
      token +
      '#bordered=true&titled=true'
    );
  }
}
