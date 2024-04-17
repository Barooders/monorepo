import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';
import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/domain/prisma.module';
import { PostgreSQLSessionStorage } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/postgresql-session-storage.lib';
import { SessionMapper } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/session.mapper';
import { ChatController } from './application/chat.web';
import { ChatRepository, ChatService } from './domain/chat.service';
import { IChatService } from './domain/ports/chat-service';
import { TalkJSChatRepository } from './infrastructure/chat/talk-js.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ShopifyApiBySession,
    SessionMapper,
    PostgreSQLSessionStorage,
    {
      provide: IChatService,
      useClass: ChatService,
    },
    { provide: ChatRepository, useClass: TalkJSChatRepository },
  ],
  exports: [IChatService],
})
export class ChatModule {}
