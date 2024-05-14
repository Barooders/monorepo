import { ExceptionBase } from '@libs/domain/exceptions';
import {
  AggregateName,
  EventName,
  OrderStatus,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { IChatService } from '@modules/chat/domain/ports/chat-service';
import { Injectable } from '@nestjs/common';
import { head } from 'lodash';
import { OrderNotificationService } from './order-notification.service';
import { OrderUpdateService } from './order-update.service';
import { UserIsNotOrderCustomerException } from './ports/exceptions';

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
    productInternalId: string,
    customerShopifyId: string,
  ): Promise<string> {
    const { authUserId } = await this.prisma.customer.findUniqueOrThrow({
      where: { shopifyId: Number(customerShopifyId) },
      select: { authUserId: true },
    });

    const { conversationId } =
      await this.chatService.getOrCreateConversationFromAuthUserId(
        new UUID({ uuid: authUserId }),
        productInternalId,
      );

    await this.chatService.writeSupportMessage(
      conversationId,
      `Une commande a été passée pour ce produit. Vous pouvez convenir d'un rendez-vous pour la livraison.`,
    );

    return conversationId;
  }
}
