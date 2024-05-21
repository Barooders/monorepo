import { UUID } from '@libs/domain/value-objects';

export abstract class IChatService {
  abstract writeSupportMessage(
    message: string,
    conversationId: string,
  ): Promise<void>;

  abstract writeMessage(
    authorInternalId: string,
    message: string,
    conversationId: string,
  ): Promise<void>;

  abstract getOrCreateConversationFromAuthUserId(
    authUserId: UUID,
    productInternalId: UUID,
  ): Promise<{ conversationId: string }>;
}
