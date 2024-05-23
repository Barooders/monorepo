import { SynchronizedProVendor } from '@config/vendor/types';
import {
  BackgroundTask,
  CaptureBackgroundTransaction,
} from '@libs/application/decorators/capture-background-transaction';
import {
  AggregateName,
  EventName,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import {
  ProductSyncService,
  SynchroEvent,
} from '@modules/pro-vendor/domain/product-sync.service';
import { StockUpdateService } from '@modules/pro-vendor/domain/stock-update.service';
import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Command, Console } from 'nestjs-console';
import { IVendorProductServiceProvider } from '../domain/ports/vendor-product-service.provider';

interface SynchroCommandOptions {
  force?: boolean;
  products?: string[];
  syncImages?: boolean;
  days?: string;
}

@Console({
  command: 'proVendor',
  description: 'Pro-vendor CLI',
})
export class ProVendorCLIConsole {
  private readonly logger: Logger = new Logger(ProVendorCLIConsole.name);

  constructor(
    private productSyncService: ProductSyncService,
    private stockUpdateService: StockUpdateService,
    private readonly vendorConfigService: IVendorConfigService,
    private readonly vendorProductServiceProvider: IVendorProductServiceProvider,
    private prisma: PrismaMainClient,
    private readonly loggerService: LoggerService,
  ) {}

  @CaptureBackgroundTransaction({
    name: 'syncProducts',
    type: BackgroundTask.CLI,
  })
  @Command({
    command: 'syncProducts <vendorSlug>',
    description:
      'Sync products from vendor. By default, will sync products since last run.',
    options: [
      {
        flags: '-f, --force',
        required: false,
        description: 'Will ignore last sync date and synchronize all catalog',
      },
      {
        flags: '-d, --days <numberOfDays>',
        required: false,
        description: 'Will check for products updated since X days',
      },
      {
        flags: '-p, --products <productIds...>',
        required: false,
        description: 'Will run only on specific productIds',
      },
      {
        flags: '--syncImages',
        required: false,
        description: 'Toggle the sync of images even on update',
      },
    ],
  })
  async syncProducts(
    vendorSlug: SynchronizedProVendor,
    options: SynchroCommandOptions,
  ): Promise<void> {
    const eventName = SynchroEvent.PRODUCTS_UPDATED;
    this.loggerService.setSharedContext({ vendorSlug, eventName });

    const timeExecutionStart = Date.now();
    this.logger.debug(`Starting execution`);

    try {
      await this.vendorConfigService.setVendorConfigFromSlug(vendorSlug);
      this.vendorProductServiceProvider.setVendorConfigFromSlug(vendorSlug);

      const vendorId = this.vendorConfigService.getVendorConfig().vendorId;

      const lastLog = await this.prisma.event.findFirst({
        where: {
          aggregateId: vendorId,
          name: EventName.VENDOR_PRODUCTS_UPDATED,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const getInitialDateToSync = () => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!options.days) return lastLog?.createdAt;

        const date = new Date();
        date.setDate(date.getDate() - parseInt(options.days));
        return date;
      };

      const { payload, metadata } =
        await this.productSyncService.syncDatabaseWithVendorProducts(
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          options.force ? null : getInitialDateToSync(),
          options.products,
          options.syncImages,
        );

      const timeExecutionEnd = Date.now();
      this.logger.warn(`Ended execution`);

      await this.prisma.event.create({
        data: {
          name: EventName.VENDOR_PRODUCTS_UPDATED,
          aggregateId: vendorId,
          aggregateName: AggregateName.VENDOR,
          payload,
          metadata: {
            ...metadata,
            executionTime: Math.floor(
              (timeExecutionEnd - timeExecutionStart) / 1000,
            ),
          },
        },
      });
    } catch (e: any) {
      this.logger.error(`Error: ${e.message}`, e);
      Sentry.captureException(e, {
        tags: {
          eventName,
          vendorSlug,
        },
      });
    }
  }

  @CaptureBackgroundTransaction({
    name: 'updateStocks',
    type: BackgroundTask.CLI,
  })
  @Command({
    command: 'updateProductStatuses <vendorSlug>',
    description: 'Update products statuses and variant stocks from vendor',
    alias: 'updateStocks',
  })
  async updateStocks(vendorSlug: SynchronizedProVendor): Promise<void> {
    const eventName = SynchroEvent.ADD_STATUS_UPDATES_TO_QUEUE;
    this.loggerService.setSharedContext({ vendorSlug, eventName });

    try {
      this.logger.debug(`Starting execution`);
      await this.vendorConfigService.setVendorConfigFromSlug(vendorSlug);
      this.vendorProductServiceProvider.setVendorConfigFromSlug(vendorSlug);

      const { metadata } = await this.stockUpdateService.updateStocks();

      const vendorId = this.vendorConfigService.getVendorConfig().vendorId;

      await this.prisma.event.create({
        data: {
          name: EventName.VENDOR_PRODUCTS_STOCK_UPDATE_STARTED,
          aggregateId: vendorId,
          aggregateName: AggregateName.VENDOR,
          metadata,
        },
      });

      this.logger.debug(`Ended execution`);
    } catch (e: any) {
      this.logger.error(`Error: ${e.message}`, e);
      Sentry.captureException(e, {
        tags: {
          eventName,
          vendorSlug,
        },
      });
    }
  }
}
