import { envName } from '@config/env/env.config';
import { Environments } from '@config/env/types';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { getValidShopifyId } from '@libs/infrastructure/shopify/validators';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Job } from 'bull';
import { QueueNames, QueuePayload } from '../domain/ports/types';
import { IVendorProductServiceProvider } from '../domain/ports/vendor-product-service.provider';
import { SynchroEvent } from '../domain/product-sync.service';
import { StockUpdateService } from '../domain/stock-update.service';

const MAX_CONCURRENCY = envName === Environments.PRODUCTION ? 10 : 1;

@Processor(QueueNames.UPDATE_STOCK)
export class StockUpdateConsumer {
  private readonly logger = new Logger(StockUpdateConsumer.name);

  constructor(
    private stockUpdateService: StockUpdateService,
    private readonly vendorConfigService: IVendorConfigService,
    private readonly vendorProductServiceProvider: IVendorProductServiceProvider,
    private readonly loggerService: LoggerService,
  ) {}

  @Process({ concurrency: MAX_CONCURRENCY })
  async transcode(job: Job<QueuePayload[QueueNames.UPDATE_STOCK]>) {
    const { vendorSlug, product } = job.data;
    this.loggerService.setSharedContext({
      vendorSlug,
      eventName: SynchroEvent.PRODUCT_STATUS_UPDATED,
    });

    this.logger.warn(
      `Handling job ${job.id} for product ${product.internalProductId}`,
    );

    try {
      await this.vendorConfigService.setVendorConfigFromSlug(vendorSlug);
      this.vendorProductServiceProvider.setVendorConfigFromSlug(vendorSlug);
      await this.stockUpdateService.updateProductStocks({
        ...product,
        internalProductId: getValidShopifyId(
          product.internalProductId,
        ).toString(),
      });
    } catch (e: any) {
      this.logger.error(
        `[${product.internalProductId}] Error: ${e.message}`,
        e,
      );

      Sentry.captureException(e, {
        tags: {
          eventName: SynchroEvent.PRODUCT_STATUS_UPDATED,
          vendorSlug,
        },
      });
    }
  }
}
