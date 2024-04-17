import { ExceptionBase } from '@libs/domain/exceptions';
import {
  AggregateName,
  EventName,
  OrderStatus,
  PrismaMainClient,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { IChatService } from '@modules/chat/domain/ports/chat-service';
import { Injectable } from '@nestjs/common';
import { head } from 'lodash';
import { OrderNotificationService } from './order-notification.service';
import { OrderUpdateService } from './order-update.service';
import { UserIsNotOrderCustomerException } from './ports/exceptions';
import { OrderInChat } from './ports/store.client';

export class NotFoundOrderException extends ExceptionBase {
  constructor(productShopifyId: string, userShopifyId: string) {
    super(
      `No order found for productShopifyId: ${productShopifyId} and user with shopifyId: ${userShopifyId}`,
    );
  }

  readonly code = 'HAND_DELIVERY.ORDER_NOT_FOUND';
}

export class OrderStatusNotFoundException extends ExceptionBase {
  constructor(orderShopifyId: string) {
    super(`No order status found for order ${orderShopifyId}`);
  }

  readonly code = 'HAND_DELIVERY.ORDER_STATUS_NOT_FOUND';
}

@Injectable()
export class HandDeliveryService {
  constructor(
    private chatService: IChatService,
    private prisma: PrismaMainClient,
    private orderUpdateService: OrderUpdateService,
    private orderNotificationService: OrderNotificationService,
  ) {}

  async getPaidHandDeliveryOrders(
    userShopifyId: string,
  ): Promise<OrderInChat[]> {
    const orderLines = await this.prisma.orderLines.findMany({
      where: {
        order: {
          customer: {
            shopifyId: Number(userShopifyId),
          },
          status: OrderStatus.PAID,
        },
        shippingSolution: ShippingSolution.HAND_DELIVERY,
      },
      include: {
        order: true,
      },
    });

    const paidHandDeliveryOrdersWithConversationId: OrderInChat[] = [];

    const { authUserId } = await this.prisma.customer.findUniqueOrThrow({
      where: { shopifyId: Number(userShopifyId) },
      select: { authUserId: true },
    });

    for (const {
      productVariantId,
      order: { shopifyId: orderShopifyId },
    } of orderLines) {
      if (!productVariantId) {
        throw new Error(
          `Can't get chat link for HAND_DELIVERY order because productVariantId is not set`,
        );
      }

      const { shopifyId: productShopifyId } =
        await this.prisma.product.findFirstOrThrow({
          where: {
            variants: {
              some: {
                id: productVariantId,
              },
            },
          },
        });

      try {
        const { conversationId: chatConversationId } =
          await this.chatService.getOrCreateConversationFromAuthUserId(
            new UUID({ uuid: authUserId }),
            Number(productShopifyId),
          );
        paidHandDeliveryOrdersWithConversationId.push({
          orderShopifyId,
          chatConversationId,
        });
      } catch (e) {}
    }
    return paidHandDeliveryOrdersWithConversationId;
  }

  async setOrderAsDeliveredIfFound(
    userShopifyId: string,
    orderShopifyId: string,
    conversationId: string,
  ): Promise<void> {
    const { id, customerId } = await this.prisma.order.findUniqueOrThrow({
      where: {
        shopifyId: orderShopifyId,
      },
    });
    const author: Author = {
      type: 'user',
      id: customerId,
    };

    const { customer, orderLines, name } =
      await this.prisma.order.findUniqueOrThrow({
        where: {
          shopifyId: orderShopifyId,
        },
        include: {
          customer: {
            include: {
              user: true,
            },
          },
          orderLines: {
            include: {
              vendor: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

    if (String(customer?.shopifyId) !== userShopifyId) {
      throw new UserIsNotOrderCustomerException(orderShopifyId, userShopifyId);
    }

    const mainOrderLine = head(orderLines);

    await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
      id,
      OrderStatus.DELIVERED,
      author,
      new Date(),
      async () => {
        await this.chatService.writeSupportMessage(
          conversationId,
          `Bonne nouvelle! La commande a été validée par l'acheteur.`,
        );

        await this.orderNotificationService.sendHandDeliveryEmails({
          customer: {
            id: customer?.user?.id,
            email: customer?.user?.email,
            firstName: customer?.firstName ?? '',
            fullName: [customer?.firstName, customer?.lastName]
              .filter(Boolean)
              .join(' '),
          },
          vendor: {
            id: mainOrderLine?.vendor?.user.id,
            email: mainOrderLine?.vendor?.user.email,
            firstName: mainOrderLine?.vendor?.firstName ?? '',
            fullName: [
              mainOrderLine?.vendor?.firstName,
              mainOrderLine?.vendor?.lastName,
            ]
              .filter(Boolean)
              .join(' '),
          },
          orderName: name,
          productName: mainOrderLine?.name ?? '',
        });

        await this.prisma.event.create({
          data: {
            aggregateName: AggregateName.ORDER,
            aggregateId: id,
            name: EventName.ORDER_LINE_RECEIVED,
            payload: {
              userShopifyId,
              conversationId,
            },
            metadata: {
              author,
              type: 'hand-delivery',
            },
          },
        });
      },
    );
  }

  async updateChatConversationAndGetConversationId(
    productId: number,
    customerShopifyId: string,
  ): Promise<string> {
    const { authUserId } = await this.prisma.customer.findUniqueOrThrow({
      where: { shopifyId: Number(customerShopifyId) },
      select: { authUserId: true },
    });

    const { conversationId } =
      await this.chatService.getOrCreateConversationFromAuthUserId(
        new UUID({ uuid: authUserId }),
        productId,
      );

    await this.chatService.writeSupportMessage(
      conversationId,
      `Une commande a été passée pour ce produit. Vous pouvez convenir d'un rendez-vous pour la livraison.`,
    );

    return conversationId;
  }
}
