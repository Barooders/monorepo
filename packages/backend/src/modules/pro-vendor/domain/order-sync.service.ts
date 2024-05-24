import {
  AggregateName,
  EventName,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { Injectable, Logger } from '@nestjs/common';
import { sumBy } from 'lodash';
import { ProductOutOfStockException } from './ports/exceptions';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { IOrderSyncService } from './ports/order-sync.service';
import { FulfillmentOrderToSyncOnVendor, ShippingDetails } from './ports/types';
import { IVendorConfigService } from './ports/vendor-config.service';
import { IVendorOrderServiceProvider } from './ports/vendor-order-service.provider';

export const TVA_RATIO = 0.2;
const DEFAULT_USER_PASSWORD = 'barooders';

@Injectable()
export class OrderSyncService implements IOrderSyncService {
  private readonly logger = new Logger(OrderSyncService.name);

  constructor(
    private vendorConfigService: IVendorConfigService,
    private vendorOrderServiceProvider: IVendorOrderServiceProvider,
    private internalNotificationClient: IInternalNotificationClient,
    private prisma: PrismaMainClient,
  ) {}

  async createOrder({
    name,
    orderName,
    vendorId,
    content,
    orderId,
  }: FulfillmentOrderToSyncOnVendor): Promise<string | null> {
    this.logger.debug(`Creating order for order line ${name} on vendor`);

    try {
      await this.vendorConfigService.setVendorConfigForOrderSyncFromVendorId(
        vendorId,
      );
      this.vendorOrderServiceProvider.setVendorConfigFromVendorId(vendorId);
      const config = this.vendorConfigService.getVendorConfig();

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!config?.order?.common.isSyncActivated) {
        this.logger.debug(
          `Vendor ${vendorId} does not need to sync order. Skipping...`,
        );
        return null;
      }
    } catch (e) {
      this.logger.debug(
        `Vendor ${vendorId} is not synced via API. Skipping...`,
      );
      return null;
    }

    const products = await Promise.all(
      content.products.map(async (product) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!product.variantId) {
          throw new Error(
            `Order line ${name} has no product variant. Can't create external order`,
          );
        }

        const internalVariant =
          await this.prisma.productVariant.findUniqueOrThrow({
            where: {
              id: product.variantId,
            },
            include: { product: true },
          });

        const { externalProductId } =
          await this.prisma.vendorProProduct.findUniqueOrThrow({
            where: {
              internalProductId: String(internalVariant.product.shopifyId),
            },
          });

        const { externalVariantId } =
          await this.prisma.vendorProVariant.findUniqueOrThrow({
            where: {
              internalVariantId: String(internalVariant.shopifyId),
            },
          });

        return {
          ...product,
          externalProductId,
          externalVariantId,
        };
      }),
    );

    try {
      this.logger.debug(`Calling vendor service to create order`);
      const obfuscatedEmail = `notifications+${orderId}@barooders.com`;

      const externalOrderId = await this.vendorOrderServiceProvider
        .getService()
        .createOrder({
          order: {
            discount: sumBy(products, ({ discount }) => discount),
            name: orderName,
          },
          customer: {
            ...content.customer,
            obfuscatedEmail,
            password: DEFAULT_USER_PASSWORD,
          },
          products,
        });

      await this.prisma.event.create({
        data: {
          aggregateName: AggregateName.ORDER,
          aggregateId: orderId,
          name: EventName.ORDER_LINE_CREATED_ON_VENDOR_SHOP,
          payload: {
            externalOrderId,
            obfuscatedEmail,
          },
        },
      });

      return externalOrderId;
    } catch (e: unknown) {
      if (e instanceof ProductOutOfStockException) {
        await this.internalNotificationClient.sendErrorNotification(`
          🚨 La ligne ${name} de la commande ${orderName} n'a pas été créée chez le vendeur.
          Raison: Un des produits est en rupture de stock.`);
        return null;
      }

      throw e;
    }
  }

  async getShippingDetails(
    vendorId: string,
    externalOrderId: string,
  ): Promise<ShippingDetails | null> {
    await this.vendorConfigService.setVendorConfigForOrderSyncFromVendorId(
      vendorId,
    );
    this.vendorOrderServiceProvider.setVendorConfigFromVendorId(vendorId);

    return await this.vendorOrderServiceProvider
      .getService()
      .getShippingDetails(externalOrderId);
  }
}
