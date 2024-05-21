import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { IChatService } from '@modules/chat/domain/ports/chat-service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandDeliveryService {
  constructor(
    private chatService: IChatService,
    private prisma: PrismaMainClient,
  ) {}

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
        new UUID({ uuid: productInternalId }),
      );

    await this.chatService.writeSupportMessage(
      conversationId,
      `Une commande a été passée pour ce produit. Vous pouvez convenir d'un rendez-vous pour la livraison.`,
    );

    return conversationId;
  }
}
