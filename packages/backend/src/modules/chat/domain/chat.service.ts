import envConfig from '@config/env/env.config';
import { ExceptionBase } from '@libs/domain/exceptions';
import {
  AggregateName,
  EventName,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
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
    metadata: Record<string, string>,
  ): Promise<string>;

  abstract writeMessage(
    participantId: string,
    message: string,
    conversationId: string,
  ): Promise<void>;
}

export abstract class StoreRepository {
  abstract getProductInfo(productId: string): Promise<{
    sellerName: string;
    handle: string;
    productType: string;
    title: string;
  }>;
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

@Injectable()
export class ChatService implements IChatService {
  constructor(
    private chatRepository: ChatRepository,
    private storeRepository: StoreRepository,
    private prisma: PrismaMainClient,
  ) {}

  async getOrCreateConversationFromAuthUserId(
    authUserId: UUID,
    productId: string,
  ): Promise<{ conversationId: string; isNewConversation: boolean }> {
    const { participantId: customerParticipantId } =
      await this.createParticipant(authUserId, UserRole.BUYER);

    return await this.getOrCreateConversation(productId, customerParticipantId);
  }

  async getOrCreateConversationWhenUserNotCreated(
    customerShopifyId: string,
    email: string,
    displayName: string,
    productId: string,
  ): Promise<{ conversationId: string }> {
    const { participantId: customerParticipantId } =
      await this.createParticipantWhenUserNotCreated(
        customerShopifyId,
        email,
        displayName,
        UserRole.BUYER,
      );

    return await this.getOrCreateConversation(productId, customerParticipantId);
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
    productId: string,
    customerParticipantId: string,
  ) {
    const { sellerName, handle, productType, title } =
      await this.storeRepository.getProductInfo(productId);
    const seller = await this.prisma.customer.findFirst({
      where: { sellerName },
      select: { authUserId: true },
    });

    const sellerId = seller
      ? new UUID({ uuid: seller.authUserId })
      : BAROODERS_SUPPORT_ACCOUNT_ID;

    const { participantId: sellerParticipantId } = await this.createParticipant(
      sellerId,
      UserRole.SELLER,
      sellerName,
    );

    const conversationId = await this.chatRepository.createConversation(
      this.createConversationId(customerParticipantId, productId),
      this.createConversationSubject(handle, title),
      [
        customerParticipantId,
        sellerParticipantId,
        await this.getSupportParticipantId(),
      ],
      {
        customerId: customerParticipantId,
        vendorId: sellerParticipantId,
        productId,
        productType,
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
            productType,
            sellerName,
            handle,
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

  private createConversationId(customerId: string, productId: string) {
    return createHmac('sha256', chatConfig.chatIdEncryptionKey)
      .update(`${customerId}-${productId}`)
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
  ): Promise<{ participantId: string }> {
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

    await this.chatRepository.createParticipant(
      String(customer?.shopifyId),
      displayName ?? customer.sellerName,
      customer?.user.email,
      role,
    );

    return { participantId: String(customer?.shopifyId) };
  }

  private async createParticipantWhenUserNotCreated(
    userShopifyId: string,
    email: string,
    displayName: string,
    role: UserRole,
  ): Promise<{ participantId: string }> {
    await this.chatRepository.createParticipant(
      userShopifyId,
      displayName,
      email,
      role,
    );

    return { participantId: userShopifyId };
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
