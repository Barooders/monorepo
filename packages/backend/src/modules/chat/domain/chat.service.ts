import envConfig from '@config/env/env.config';
import { ExceptionBase } from '@libs/domain/exceptions';
import {
  AggregateName,
  EventName,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { UUID } from '@libs/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { ChatConversationMetadata } from 'shared-types';
import { chatConfig } from '../chat.config';
import { UserRole } from '../types';
import { IChatService } from './ports/chat-service';

const ONE_DAY = 24 * 60 * 60 * 1000;
const BAROODERS_SUPPORT_ACCOUNT_ID = new UUID({
  uuid: envConfig.externalServices.talkjs.baroodersSupportAccountId,
});
const BAROODERS_SUPPORT_DISPLAY_NAME = 'Barooders Bot';

export abstract class ChatRepository {
  abstract createParticipant(
    id: string,
    name: string,
    email: string,
    role: UserRole,
  ): Promise<string>;

  abstract createConversation(
    id: string,
    subject: string,
    participantIds: string[],
    metadata: ChatConversationMetadata,
  ): Promise<string>;

  abstract writeMessage(
    senderChatId: string,
    message: string,
    conversationId: string,
  ): Promise<void>;
}

export class IncompleteUserException extends ExceptionBase {
  constructor(customerId: string, fieldNames: string[]) {
    super(
      `Missing value for ${fieldNames.join(', ')} for customer ${customerId}`,
    );
  }

  readonly code = 'CUSTOMER.INCOMPLETE_USER';
}

export class NewConversationLimitExceededException extends ExceptionBase {
  constructor(customerId: string) {
    super(`The user ${customerId} has opened too many conversations recently`);
  }

  readonly code = 'CHAT.NEW_CONVERSATION_LIMIT_EXCEEDED';
}

type Participant = {
  chatId: string;
  internalId: string;
};

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private chatRepository: ChatRepository,
    private prisma: PrismaMainClient,
    private storePrisma: PrismaStoreClient,
  ) {}

  async getOrCreateConversationFromAuthUserId(
    authUserId: UUID,
    productInternalId: UUID,
  ): Promise<{ conversationId: string; isNewConversation: boolean }> {
    const customerParticipant = await this.createParticipant(
      authUserId,
      UserRole.BUYER,
    );

    return await this.getOrCreateConversation(
      productInternalId,
      customerParticipant,
    );
  }

  writeMessage = this.chatRepository.writeMessage;

  async writeSupportMessage(conversationId: string, message: string) {
    const supportChatId = await this.getSupportChatId();
    await this.writeMessage(supportChatId, message, conversationId);
  }

  async handleNewMessage(
    messageId: string,
    text: string,
    senderId: string,
    conversationId: string,
    hasAttachment: boolean,
  ): Promise<void> {
    await this.prisma.message.create({
      data: {
        id: messageId,
        conversationId,
        senderId,
        text,
        hasAttachment,
      },
    });
  }

  private async getOrCreateConversation(
    productInternalId: UUID,
    { chatId: customerChatId, internalId: customerInternalId }: Participant,
  ) {
    const { vendorId, exposedProduct } =
      await this.storePrisma.storeBaseProduct.findUniqueOrThrow({
        where: { id: productInternalId.uuid },
        include: {
          exposedProduct: true,
        },
      });

    if (!exposedProduct) {
      throw new Error(
        `Product with id ${productInternalId.uuid} not found in store`,
      );
    }

    const { sellerName, authUserId: vendorInternalId } =
      await this.prisma.customer.findFirstOrThrow({
        where: {
          authUserId: vendorId,
        },
      });

    const { chatId: vendorChatId } = await this.createParticipant(
      new UUID({ uuid: vendorId }),
      UserRole.SELLER,
      sellerName ?? '',
    );

    const conversationId = await this.getConversationId(
      customerChatId,
      productInternalId,
    );

    await this.chatRepository.createConversation(
      conversationId,
      this.createConversationSubject(
        exposedProduct.handle,
        exposedProduct.title,
      ),
      [customerChatId, vendorChatId, await this.getSupportChatId()],
      {
        customerChatId,
        customerInternalId,
        vendorChatId,
        vendorInternalId,
        productInternalId: productInternalId.uuid,
        productType: exposedProduct.productType,
      },
    );

    await this.prisma.conversation.upsert({
      where: { id: conversationId },
      create: {
        id: conversationId,
        buyerId: customerInternalId,
        vendorId: vendorInternalId,
        productId: productInternalId.uuid,
      },
      update: {},
    });

    const isNewConversation = await this.isNewConversation(conversationId);

    if (isNewConversation) {
      const numberOfNewConversations =
        await this.countCustomerNewConversation(customerChatId);
      if (numberOfNewConversations >= 10)
        throw new NewConversationLimitExceededException(customerChatId);

      await this.prisma.event.create({
        data: {
          aggregateName: AggregateName.CUSTOMER,
          aggregateId: conversationId,
          name: EventName.CHAT_STARTED,
          payload: {
            senderId: customerChatId,
            simplifiedEmail:
              await this.getSimplifiedCustomerEmail(customerChatId),
          },
          metadata: {
            productType: exposedProduct.productType,
            sellerName,
            handle: exposedProduct.handle,
          },
        },
      });
    }

    return { conversationId, isNewConversation };
  }

  private async getSupportChatId(): Promise<string> {
    const { chatId } = await this.createParticipant(
      BAROODERS_SUPPORT_ACCOUNT_ID,
      UserRole.ADMIN,
      BAROODERS_SUPPORT_DISPLAY_NAME,
    );

    return chatId;
  }

  private async getConversationId(
    customerChatId: string,
    productInternalId: UUID,
  ) {
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        buyer: {
          chatId: customerChatId,
        },
        productId: productInternalId.uuid,
      },
      select: {
        id: true,
      },
    });

    return (
      existingConversation?.id ??
      this.createConversationId(customerChatId, productInternalId)
    );
  }

  private createConversationId(
    customerId: string,
    { uuid: productInternalId }: UUID,
  ) {
    return createHmac('sha256', chatConfig.chatIdEncryptionKey)
      .update(`${customerId}-${productInternalId}`)
      .digest('hex');
  }

  private createConversationSubject(
    productHandle: string,
    productTitle: string,
  ) {
    const frontendBaseUrl = envConfig.frontendBaseUrl;
    return `<${frontendBaseUrl}/products/${productHandle}|${productTitle}>`;
  }

  private async createParticipant(
    authUserId: UUID,
    role: UserRole,
    displayName?: string,
  ): Promise<Participant> {
    const customer = await this.prisma.customer.findUnique({
      where: { authUserId: authUserId.uuid },
      include: {
        user: true,
      },
    });

    if (!customer?.sellerName || !customer?.user.email) {
      const missingFields = [];
      if (!customer?.sellerName) missingFields.push('sellerName');
      if (!customer?.user.email) missingFields.push('email');

      throw new IncompleteUserException(authUserId.uuid, missingFields);
    }

    const chatId = String(customer?.chatId);

    await this.chatRepository.createParticipant(
      chatId,
      displayName ?? customer.sellerName,
      customer?.user.email,
      role,
    );

    return {
      chatId,
      internalId: authUserId.uuid,
    };
  }

  private async isNewConversation(conversationId: string) {
    const newConversationEvent = await this.prisma.event.findFirst({
      where: { aggregateId: conversationId, name: EventName.CHAT_STARTED },
    });

    return !newConversationEvent;
  }

  private async getSimplifiedCustomerEmail(chatId: string) {
    const {
      user: { email: senderEmail },
    } = await this.prisma.customer.findFirstOrThrow({
      where: { chatId },
      select: { user: { select: { email: true } } },
    });
    const simplifiedEmail = senderEmail
      ?.replaceAll('.', '')
      .toLowerCase()
      .replace(/\+(.*)@/, '@');

    return simplifiedEmail;
  }

  private async countCustomerNewConversation(chatId: string) {
    return await this.prisma.event.count({
      where: {
        AND: [
          { name: EventName.CHAT_STARTED },
          {
            payload: {
              path: ['simplifiedEmail'],
              equals: await this.getSimplifiedCustomerEmail(chatId),
            },
          },
          { createdAt: { gte: new Date(new Date(Date.now() - ONE_DAY)) } },
        ],
      },
    });
  }
}
