import {
  NotificationName,
  NotificationType,
  PrismaMainClient,
  ProductStatus,
} from '@libs/domain/prisma.main.client';
import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { IEmailClient } from './ports/email.client';

const ONE_DAY = 24 * 60 * 60 * 1000;
const PRODUCT_AVAILABILITY_TRIGGER = 30 * ONE_DAY;
const EMAIL_AVAILABILITY_FREQUENCY = 20 * ONE_DAY;

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private emailClient: IEmailClient,
    private prisma: PrismaMainClient,
  ) {}

  async notify(email: string | null, firstName: string | null) {
    if (!email) {
      this.logger.debug(`Cannot notify customer without email`);
      return;
    }
    if (!firstName) {
      this.logger.debug(`Notifying customer (${email}) without firstName`);
    }

    try {
      await this.emailClient.sendCreatedOfferEmail(email, firstName ?? '');
    } catch (error: any) {
      this.logger.error(
        `Cannot notify customer (${email}) because ${error.message}`,
        error,
      );
      Sentry.captureException(error);
    }
  }

  async notifyVendorsWithOldProducts() {
    const productQuery = {
      status: ProductStatus.ACTIVE,
      createdAt: {
        lte: new Date(new Date().getTime() - PRODUCT_AVAILABILITY_TRIGGER),
      },
      OR: [
        {
          source: {
            contains: 'saisiefacile',
          },
        },
        {
          source: {
            in: ['New sell form', 'Application', 'vendor-page'],
          },
        },
      ],
    };

    const vendors = await this.prisma.customer.findMany({
      where: {
        products: {
          some: productQuery,
        },
        notifications: {
          none: {
            type: NotificationType.EMAIL,
            name: NotificationName.IS_PRODUCT_STILL_AVAILABLE,
            createdAt: {
              gte: new Date(
                new Date().getTime() - EMAIL_AVAILABILITY_FREQUENCY,
              ),
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            products: {
              where: productQuery,
            },
          },
        },
      },
    });

    this.logger.debug(vendors.length);

    throw new Error('Method not implemented.');
  }
}
