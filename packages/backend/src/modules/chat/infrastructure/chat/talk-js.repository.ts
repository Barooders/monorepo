import { TalkJS } from 'talkjs-node';
import { ChatRepository } from '@modules/chat/domain/chat.service';
import { UserRole } from '@modules/chat/types';
import envConfig from '@config/env/env.config';

const talkJs = new TalkJS({
  appId: envConfig.externalServices.talkjs.appId,
  apiKey: envConfig.externalServices.talkjs.apiKey,
});

const enum MessageType {
  UserMessage = 'UserMessage',
  SystemMessage = 'SystemMessage',
}

export class TalkJSChatRepository implements ChatRepository {
  async createParticipant(
    id: string,
    name: string,
    email: string,
    role: UserRole,
  ) {
    await talkJs.users.create(id, {
      name,
      email: [email],
      role,
    });

    return id;
  }

  async createConversation(
    id: string,
    subject: string,
    participantIds: string[],
    metadata: Record<string, string>,
  ) {
    await talkJs.conversations.create(id, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      participants: participantIds,
      subject,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      custom: metadata,
    });

    return id;
  }

  async writeMessage(
    participantId: string,
    message: string,
    conversationId: string,
  ): Promise<void> {
    await talkJs.conversations.messages.send({
      conversationId: conversationId,
      messages: [
        {
          text: message,
          sender: participantId,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type: MessageType.SystemMessage,
        },
      ],
    });
  }
}
