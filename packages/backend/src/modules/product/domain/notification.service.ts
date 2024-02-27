import {
  CustomerType,
  NotificationName,
  NotificationType,
  PrismaMainClient,
  ProductStatus,
} from '@libs/domain/prisma.main.client';
import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { IEmailClient } from './ports/email.client';

const ONE_DAY = 24 * 60 * 60 * 1000;
const OLD_PRODUCT_IN_DAYS = 30;
const EMAIL_FREQUENCY_IN_DAYS = 20;

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
        lte: new Date(new Date().getTime() - OLD_PRODUCT_IN_DAYS * ONE_DAY),
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
                new Date().getTime() - EMAIL_FREQUENCY_IN_DAYS * ONE_DAY,
              ),
            },
          },
        },
      },
      include: {
        user: true,
        _count: {
          select: {
            products: {
              where: productQuery,
            },
          },
        },
      },
    });

    this.logger.warn(`Found ${vendors.length} vendors with old products`);

    for (const vendor of vendors) {
      try {
        if (!vendor.user?.email)
          throw new Error(`Vendor ${vendor.authUserId} has no email`);
        if (vendor.user.disabled)
          throw new Error(`Vendor ${vendor.authUserId} is disabled`);
        if (vendor._count.products === 0)
          throw new Error(`Vendor ${vendor.authUserId} has no old products`);

        await this.emailClient.sendProductAvailabilityEmail(
          vendor.user.email,
          vendor.firstName ?? '',
          OLD_PRODUCT_IN_DAYS,
        );
        await this.prisma.notification.create({
          data: {
            type: NotificationType.EMAIL,
            name: NotificationName.IS_PRODUCT_STILL_AVAILABLE,
            recipientType: CustomerType.seller,
            metadata: {
              vendorEmail: vendor.user.email,
              emailFrequency: EMAIL_FREQUENCY_IN_DAYS,
              oldProductThresholdInDays: OLD_PRODUCT_IN_DAYS,
              oldProductsCount: vendor._count.products,
            },
            recipient: {
              connect: {
                authUserId: vendor.authUserId,
              },
            },
          },
        });
        this.logger.warn(
          `Notified vendor ${vendor.authUserId} for old products`,
        );
      } catch (error: any) {
        this.logger.error(
          `Cannot notify vendor (${vendor.authUserId}) because ${error.message}`,
          error,
        );
        Sentry.captureException(error);
      }
    }
  }
}
