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
    participantId: string,
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
  participantId: string;
  internalId: string;
  shopifyId: string;
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
    productShopifyId: number,
  ): Promise<{ conversationId: string; isNewConversation: boolean }> {
    const customerParticipant = await this.createParticipant(
      authUserId,
      UserRole.BUYER,
    );

    return await this.getOrCreateConversation(
      productShopifyId,
      customerParticipant,
    );
  }

  writeMessage = this.chatRepository.writeMessage;

  async writeSupportMessage(conversationId: string, message: string) {
    const supportParticipantId = await this.getSupportParticipantId();
    await this.writeMessage(supportParticipantId, message, conversationId);
  }

  async handleNewMessage(
    messageId: string,
    text: string,
    senderId: string,
    conversationId: string,
    hasAttachment: boolean,
    metadata?: Record<string, string>,
  ): Promise<void> {
    await this.prisma.message.create({
      data: {
        id: messageId,
        conversationId,
        senderId,
        text,
        hasAttachment,
        metadata,
      },
    });
  }

  private async getOrCreateConversation(
    productShopifyId: number,
    customerParticipant: Participant,
  ) {
    const customerParticipantId = customerParticipant.participantId;
    const { id, shopifyId, vendorId, exposedProduct } =
      await this.storePrisma.storeBaseProduct.findUniqueOrThrow({
        where: { shopifyId: productShopifyId },
        include: {
          exposedProduct: true,
        },
      });

    if (!exposedProduct) {
      throw new Error(
        `Product with shopifyId ${productShopifyId} not found in store`,
      );
    }

    const {
      sellerName,
      shopifyId: vendorShopifyId,
      authUserId: vendorInternalId,
    } = await this.prisma.customer.findFirstOrThrow({
      where: {
        authUserId: vendorId,
      },
    });

    const { participantId: sellerParticipantId } = await this.createParticipant(
      new UUID({ uuid: vendorId }),
      UserRole.SELLER,
      sellerName ?? '',
    );

    const conversationId = await this.chatRepository.createConversation(
      this.createConversationId(customerParticipantId, productShopifyId),
      this.createConversationSubject(
        exposedProduct.handle,
        exposedProduct.title,
      ),
      [
        customerParticipantId,
        sellerParticipantId,
        await this.getSupportParticipantId(),
      ],
      {
        customerId: customerParticipantId,
        customerInternalId: customerParticipant.internalId,
        customerShopifyId: customerParticipant.shopifyId,
        vendorId: sellerParticipantId,
        vendorInternalId: vendorInternalId,
        vendorShopifyId: vendorShopifyId.toString(),
        productId: productShopifyId.toString(),
        productInternalId: id,
        productShopifyId: shopifyId.toString(),
        productType: exposedProduct.productType,
      },
    );

    const isNewConversation = await this.isNewConversation(conversationId);

    if (isNewConversation) {
      const numberOfNewConversations = await this.countCustomerNewConversation(
        customerParticipantId,
      );
      if (numberOfNewConversations >= 10)
        throw new NewConversationLimitExceededException(customerParticipantId);

      await this.prisma.event.create({
        data: {
          aggregateName: AggregateName.CUSTOMER,
          aggregateId: conversationId,
          name: EventName.CHAT_STARTED,
          payload: {
            senderId: customerParticipantId,
            simplifiedEmail: await this.getSimplifiedCustomerEmail(
              customerParticipantId,
            ),
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

  private async getSupportParticipantId(): Promise<string> {
    const { participantId: supportParticipantId } =
      await this.createParticipant(
        BAROODERS_SUPPORT_ACCOUNT_ID,
        UserRole.ADMIN,
        BAROODERS_SUPPORT_DISPLAY_NAME,
      );

    return supportParticipantId;
  }

  private createConversationId(customerId: string, productShopifyId: number) {
    return createHmac('sha256', chatConfig.chatIdEncryptionKey)
      .update(`${customerId}-${productShopifyId}`)
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

    const participantId = String(customer?.shopifyId);

    await this.chatRepository.createParticipant(
      participantId,
      displayName ?? customer.sellerName,
      customer?.user.email,
      role,
    );

    return {
      participantId,
      internalId: authUserId.uuid,
      shopifyId: String(customer.shopifyId),
    };
  }

  private async isNewConversation(conversationId: string) {
    const newConversationEvent = await this.prisma.event.findFirst({
      where: { aggregateId: conversationId, name: EventName.CHAT_STARTED },
    });

    return !newConversationEvent;
  }

  private async getSimplifiedCustomerEmail(customerId: string) {
    const {
      user: { email: senderEmail },
    } = await this.prisma.customer.findFirstOrThrow({
      where: { shopifyId: Number(customerId) },
      select: { user: { select: { email: true } } },
    });
    const simplifiedEmail = senderEmail
      ?.replaceAll('.', '')
      .toLowerCase()
      .replace(/\+(.*)@/, '@');

    return simplifiedEmail;
  }

  private async countCustomerNewConversation(customerId: string) {
    return await this.prisma.event.count({
      where: {
        AND: [
          { name: EventName.CHAT_STARTED },
          {
            payload: {
              path: ['simplifiedEmail'],
              equals: await this.getSimplifiedCustomerEmail(customerId),
            },
          },
          { createdAt: { gte: new Date(new Date(Date.now() - ONE_DAY)) } },
        ],
      },
    });
  }
}
