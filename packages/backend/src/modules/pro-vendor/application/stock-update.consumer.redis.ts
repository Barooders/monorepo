import {
  BackgroundTask,
  CaptureBackgroundTransaction,
} from '@libs/application/decorators/capture-background-transaction';
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

const ONE_HOUR = 1000 * 60 * 60;
const TEN_SECONDS = 1000 * 10;

@Processor(QueueNames.UPDATE_STOCK)
export class StockUpdateConsumer {
  private readonly logger = new Logger(StockUpdateConsumer.name);

  constructor(
    private stockUpdateService: StockUpdateService,
    private readonly vendorConfigService: IVendorConfigService,
    private readonly vendorProductServiceProvider: IVendorProductServiceProvider,
    private readonly loggerService: LoggerService,
  ) {}

  @Process({ concurrency: 1 })
  @CaptureBackgroundTransaction({
    name: QueueNames.UPDATE_STOCK,
    type: BackgroundTask.CONSUMER,
  })
  async transcode(job: Job<QueuePayload[QueueNames.UPDATE_STOCK]>) {
    const { vendorSlug, product } = job.data;
    this.loggerService.setSharedContext({
      vendorSlug,
      eventName: SynchroEvent.PRODUCT_STATUS_UPDATED,
    });

    this.logger.log(
      `Handling job ${job.id} for product ${product.internalProductId} emitted at ${job.timestamp}`,
    );

    const startExecutionTime = Date.now();
    const waitingTime = startExecutionTime - job.timestamp;
    if (waitingTime > ONE_HOUR) {
      this.logger.warn(
        `Job ${job.id} for updating stock of product ${product.internalProductId} was waiting for ${waitingTime}ms`,
      );
    }

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
    } finally {
      const executionTime = Date.now() - startExecutionTime;
      if (executionTime > TEN_SECONDS) {
        this.logger.warn(
          `Job ${job.id} for product ${product.internalProductId} took ${executionTime}ms`,
        );
      }
    }
  }
}
