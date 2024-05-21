import {
  CommissionRuleType,
  EventName,
  Order,
  OrderLines,
  OrderStatus,
  Prisma,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { CurrencyCode } from '@libs/types/common/money.types';
import { IChatService } from '@modules/chat/domain/ports/chat-service';
import { CommissionService } from '@modules/order/domain/commission.service';
import { Injectable, Logger } from '@nestjs/common';
import { head, last } from 'lodash';
import {
  OrderNotFoundException,
  UserNotConcernedByOrderException,
} from './ports/exceptions';
import { IStoreClient } from './ports/store.client';
import {
  AccountPageOrder,
  PRODUCT_DISCOUNT,
  PRODUCT_PRICE,
} from './ports/types';

export const NEXT_STEP: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.CREATED]: OrderStatus.PAID,
  [OrderStatus.PAID]: OrderStatus.LABELED,
  [OrderStatus.LABELED]: OrderStatus.SHIPPED,
  [OrderStatus.SHIPPED]: OrderStatus.DELIVERED,
};
@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private prisma: PrismaMainClient,
    private chatService: IChatService,
    private commissionService: CommissionService,
    private storeClient: IStoreClient,
  ) {}

  async getAccountPageOrder(
    orderId: string,
    userId: string,
  ): Promise<AccountPageOrder> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderLines: true,
      },
    });

    if (!order) throw new OrderNotFoundException(orderId);

    const firstOrderLine = head(order.orderLines);

    if (!firstOrderLine) {
      throw new Error(`Order ${orderId} has no order lines`);
    }

    const viewer = this.checkIfUserAllowedAndGetViewer(
      order.id,
      order.customerId,
      firstOrderLine.vendorId,
      userId,
    );

    const contactId =
      viewer === 'buyer' ? firstOrderLine?.vendorId : order.customerId;

    const contact = await this.getContactInfo(contactId);
    const chatLink = await this.getChatLink(order.customerId, firstOrderLine);
    const orderHistory = await this.getOrderHistory(order);

    return {
      viewer,
      contact,
      chatLink,
      priceDetail:
        viewer === 'vendor'
          ? await this.getVendorPriceDetail(firstOrderLine.id)
          : await this.storeClient.getOrderPriceItems(
              new UUID({ uuid: order.id }),
            ),
      orderHistory,
    };
  }

  private async getVendorPriceDetail(orderLineId: string) {
    const { vendorCommission, vendorShipping, variantPrice, variantDiscount } =
      await this.commissionService.getCommissionByOrderLine(orderLineId);
    const priceDetails = [
      { type: PRODUCT_PRICE, value: variantPrice },
      { type: PRODUCT_DISCOUNT, value: -variantDiscount },
      { type: CommissionRuleType.VENDOR_COMMISSION, value: vendorCommission },
      { type: CommissionRuleType.VENDOR_SHIPPING, value: vendorShipping },
    ];
    return {
      lines: priceDetails.map(({ type, value }) => ({
        type,
        amount: {
          amountInCents: Math.round(value * 100),
          currency: CurrencyCode.EUR,
        },
      })),
      total: {
        amountInCents: Math.round(
          priceDetails.reduce((acc, { value }) => acc + value, 0) * 100,
        ),
        currency: CurrencyCode.EUR,
      },
    };
  }

  private async getChatLink(
    customerId: string | null,
    orderLine: OrderLines,
  ): Promise<string | null> {
    if (!customerId) return null;
    if (!orderLine.productVariantId) return null;

    try {
      const { product } = await this.prisma.productVariant.findFirstOrThrow({
        where: {
          id: orderLine.productVariantId,
        },
        include: {
          product: true,
        },
      });

      const chatConversationId =
        await this.chatService.getOrCreateConversationFromAuthUserId(
          new UUID({ uuid: customerId }),
          new UUID({ uuid: product.id }),
        );

      return `/pages/chat?conversationId=${chatConversationId}`;
    } catch (error) {
      this.logger.warn(
        `Could not get chat link: ${error} for customer ${customerId}`,
      );
      return null;
    }
  }

  private checkIfUserAllowedAndGetViewer(
    orderId: string,
    customerId: string | null,
    vendorId: string | null | undefined,
    userId: string,
  ): AccountPageOrder['viewer'] {
    if (customerId === userId) return 'buyer';
    if (vendorId === userId) return 'vendor';

    throw new UserNotConcernedByOrderException(orderId, userId);
  }

  private async getContactInfo(contactId: string | null | undefined) {
    if (!contactId) return null;

    const customer = await this.prisma.customer.findUnique({
      where: { authUserId: contactId },
    });

    if (!customer) {
      throw new Error(
        `Customer not found for authUserId ${contactId} in database`,
      );
    }

    const firstDayOfSignedInMonth = new Date(customer.createdAt).setDate(1);

    return {
      name: customer.sellerName,
      signedInAtTimestamp: firstDayOfSignedInMonth,
      imageSrc: customer.profilePictureShopifyCdnUrl,
    };
  }

  private async getOrderHistory(
    order: Order,
  ): Promise<AccountPageOrder['orderHistory']> {
    const completedEvents = await this.getCompletedEvents(order);

    const lastStep = last(completedEvents);

    if (!lastStep) {
      throw new Error(
        `Order history should contain at least one completed event`,
      );
    }

    const nextStatus = NEXT_STEP[lastStep.status];

    if (!nextStatus) return completedEvents;

    return [
      ...completedEvents,
      {
        status: nextStatus,
        updatedAt: null,
        isCompleted: false,
      },
    ];
  }

  private async getCompletedEvents(
    order: Order,
  ): Promise<AccountPageOrder['orderHistory']> {
    const orderHistory: AccountPageOrder['orderHistory'] = [
      {
        status: OrderStatus.CREATED,
        updatedAt: order.createdAt.toISOString(),
        isCompleted: true,
      },
    ];

    const events = await this.prisma.event.findMany({
      where: {
        aggregateId: order.id,
        name: EventName.ORDER_UPDATED,
        payload: {
          path: ['newStatus'],
          not: Prisma.DbNull,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (events.length === 0) {
      orderHistory.push({
        status: order.status,
        updatedAt: null,
        isCompleted: true,
      });
      return orderHistory;
    }

    orderHistory.push(
      ...events
        .map(({ payload, createdAt }) => {
          if (!payload || typeof payload !== 'object' || Array.isArray(payload))
            throw new Error(
              `Could not parse payload for event ${EventName.ORDER_UPDATED} for order ${order.id}. Payload is ${payload}`,
            );

          const { newStatus: status, updatedAt } = payload;

          if (
            !status ||
            typeof status !== 'string' ||
            !(status in OrderStatus)
          ) {
            throw new Error(`Status ${status} is not a valid order status`);
          }

          return {
            status: status as OrderStatus,
            updatedAt:
              typeof updatedAt === 'string'
                ? updatedAt
                : createdAt.toISOString(),
            isCompleted: true,
          };
        })
        .filter(({ status }) => status !== OrderStatus.CREATED)
        .reduce((acc: AccountPageOrder['orderHistory'], current) => {
          const { status } = current;
          if (acc.some((event) => event.status === status)) return acc;

          acc.push(current);

          return acc;
        }, []),
    );

    return orderHistory;
  }
}
