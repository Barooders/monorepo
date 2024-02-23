import { ExceptionBase, NotFoundException } from '@libs/domain/exceptions';
import { OrderStatus } from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import { BadRequestException } from '@nestjs/common';

export class VendorNotFoundException extends ExceptionBase {
  constructor(vendorShopifyId: string) {
    super(`Vendor (${vendorShopifyId}) was not found.`);
  }

  readonly code = 'ORDERS.VENDOR_NOT_FOUND';
}

export class UserNotConcernedByOrderException extends ExceptionBase {
  constructor(orderId: string, userId: string) {
    super(`User (${userId}) is not vendor or customer of order ${orderId}`);
  }

  readonly code = 'ORDER.USER_NOT_ALLOWED';
}

export class UserNotOrderLineVendorException extends ExceptionBase {
  constructor(orderLineId: string, userId?: string | null) {
    super(`User (${userId}) is not vendor of order line ${orderLineId}`);
  }

  readonly code = 'ORDER.VENDOR_NOT_ALLOWED';
}

export class OrderNotFoundException extends ExceptionBase {
  constructor(orderId: string) {
    super(`Order (${orderId}) was not found.`);
  }

  readonly code = 'ORDERS.ORDER_NOT_FOUND';
}

export class UserIsNotOrderCustomerException extends ExceptionBase {
  constructor(orderShopifyId: string, userShopifyId: string) {
    super(
      `User (${userShopifyId}) is not the same as in order ${orderShopifyId}`,
    );
  }

  readonly code = 'HAND_DELIVERY.USER_NOT_ALLOWED';
}

export class ProductNotFound extends NotFoundException {
  constructor(productWhereClause: string) {
    super(
      `Could not find product in public.Product table with where clause: ${jsonStringify(
        productWhereClause,
      )}`,
    );
  }
}

export class VariantNotFound extends NotFoundException {
  constructor(productId: string, variantId: string) {
    super(
      `No variant price found for product ${productId} and variant ${variantId}`,
    );
  }
}

export class IncorrectStateOrder extends BadRequestException {
  constructor(orderId: string, stateInfo: Record<string, string> = {}) {
    super(
      `Order (${orderId}) is in incorrect state (${Object.keys(stateInfo)
        .map((key) => `${key}: ${stateInfo[key]}`)
        .join(', ')})`,
    );
  }
}

export class OrderStatusUpdateNotAllowed extends BadRequestException {
  constructor(orderId: string, newStatus: OrderStatus, oldStatus: OrderStatus) {
    super(
      `Cannot update order ${orderId} to status ${newStatus} because it is not allowed. Previous status is ${oldStatus}`,
    );
  }
}
