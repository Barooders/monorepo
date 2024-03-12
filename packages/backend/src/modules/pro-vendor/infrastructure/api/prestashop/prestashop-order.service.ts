import { TVA_RATIO } from '@modules/pro-vendor/domain/order-sync.service';
import { ProductOutOfStockException } from '@modules/pro-vendor/domain/ports/exceptions';
import { OrderSyncServiceStrategy } from '@modules/pro-vendor/domain/ports/order-sync-service.strategy';
import {
  OrderVendorInput,
  ShippingDetails,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { head } from 'lodash';
import { CarrierDTO } from './dto/prestashop-carrier.dto';

import { PrestashopClient } from './prestashop.client';

const NON_ALPHANUMERIC_REGEX = /[^a-zA-Z\s]/g;
@Injectable()
export class PrestashopOrderService implements OrderSyncServiceStrategy {
  private readonly logger = new Logger(PrestashopOrderService.name);

  constructor(
    private prestashopClient: PrestashopClient,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async createOrder({ products, customer }: OrderVendorInput): Promise<string> {
    if (products.length > 1) {
      throw new Error(
        `Feature not implemented for multiple products. First, we need to compute the shipping cost for multiple products`,
      );
    }

    const product = products[0];
    const combinationId =
      await this.checkProductAvailabilityAndGetCombinationId(product);

    const customerId = await this.prestashopClient.createCustomer(customer);
    this.logger.debug(`Customer created with id ${customerId}`);

    const addressId = await this.prestashopClient.createAddress(customerId, {
      ...customer,
      firstName: customer.firstName.replace(NON_ALPHANUMERIC_REGEX, ''),
      lastName: customer.lastName.replace(NON_ALPHANUMERIC_REGEX, ''),
    });
    this.logger.debug(`Address created with id ${addressId}`);

    const { id: carrierId } = await this.getCarrier();

    const cartId = await this.prestashopClient.createCart(
      customerId,
      String(carrierId),
      addressId,
      {
        ...product,
        externalVariantId: String(combinationId),
      },
    );
    this.logger.debug(`Cart created with id ${cartId}`);

    const orderId = await this.prestashopClient.createOrder(
      product.externalProductId,
      addressId,
      cartId,
      customerId,
      String(carrierId),
      product.price,
      product.price / (1 + TVA_RATIO),
      product.productType,
    );
    this.logger.debug(`Order created with id ${orderId}`);

    return orderId;
  }

  async getShippingDetails(
    externalOrderId: string,
  ): Promise<ShippingDetails | null> {
    const order = await this.prestashopClient.getOrder(externalOrderId);

    if (!order?.shipping_number || !order?.shipping_number.length) {
      return null;
    }

    const trackingUrlBaseUrl =
      this.vendorConfigService.getVendorConfig().order?.prestashop
        ?.trackingUrlBaseUrl;

    return {
      trackingId: order.shipping_number,
      trackingUrl: trackingUrlBaseUrl
        ? `${trackingUrlBaseUrl}${order.shipping_number}`
        : `https://trace.dpd.fr/fr/trace/${order.shipping_number}`,
    };
  }

  private async checkProductAvailabilityAndGetCombinationId({
    externalVariantId,
    quantity,
  }: OrderVendorInput['products'][0]) {
    const combinationData =
      await this.getStockAndCombinationId(externalVariantId);

    const disableStockCheckBeforeOrder =
      this.vendorConfigService.getVendorConfig().order?.prestashop
        ?.disableStockCheckBeforeOrder;

    if (
      !combinationData ||
      (!disableStockCheckBeforeOrder &&
        Number(combinationData.quantity) < quantity)
    ) {
      throw new ProductOutOfStockException(externalVariantId);
    }

    this.logger.debug(
      `Variant ${externalVariantId} has ${combinationData.quantity} stock (> requested ${quantity})`,
    );

    return combinationData.combinationId;
  }

  private async getStockAndCombinationId(externalVariantId: string) {
    const useExternalVariantIdAsCombinationId =
      this.vendorConfigService.getVendorConfig().order?.prestashop
        ?.useExternalVariantIdAsCombinationId;

    if (!useExternalVariantIdAsCombinationId) {
      const stock = await this.prestashopClient.getStockItem(externalVariantId);

      return stock
        ? {
            quantity: stock.quantity,
            combinationId: stock.id_product_attribute,
          }
        : undefined;
    }

    const combination =
      await this.prestashopClient.getCombination(externalVariantId);

    return combination
      ? {
          quantity: combination.quantity,
          combinationId: externalVariantId,
        }
      : undefined;
  }

  private async getCarrier(): Promise<CarrierDTO> {
    const carrierSolution =
      this.vendorConfigService.getVendorConfig().order?.prestashop
        ?.carrierSolution;

    if (!carrierSolution) throw new Error(`carrierSolution is not set`);

    const carrier = head(
      await this.prestashopClient.getCarriers(carrierSolution),
    );

    if (!carrier) throw new Error(`Carrier ${carrierSolution} not found`);

    return carrier;
  }
}
