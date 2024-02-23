import { UUID } from '@libs/domain/value-objects';

export abstract class IChatService {
  abstract writeSupportMessage(
    message: string,
    conversationId: string,
  ): Promise<void>;

  abstract writeMessage(
    authorShopifyId: string,
    message: string,
    conversationId: string,
  ): Promise<void>;

  abstract getOrCreateConversationFromAuthUserId(
    authUserId: UUID,
    productId: string,
  ): Promise<{ conversationId: string }>;
}
