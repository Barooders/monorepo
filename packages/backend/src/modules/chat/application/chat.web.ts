import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { routesV1 } from '@config/routes.config';
import { User } from '@libs/application/decorators/user.decorator';
import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import {
  ChatService,
  NewConversationLimitExceededException,
} from '../domain/chat.service';
import { TalkJSConversation, TalkJSMessage, TalkJSUser } from '../types';

class ConversationInputDto {
  @IsNotEmpty()
  @IsNumberString()
  productInternalId!: string;
}

type WebhookMessageDTO = {
  id: string;
  createdAt: number;
  data: {
    sender: TalkJSUser;
    conversation: TalkJSConversation;
    message: TalkJSMessage;
  };
  type: 'message.sent';
};

@Controller(routesV1.version)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private prisma: PrismaMainClient,
  ) {}

  @Post(routesV1.chat.conversation)
  @UseGuards(JwtAuthGuard)
  async getOrCreateConversation(
    @User() tokenInfo: ExtractedUser,
    @Body()
    conversationInputDto: ConversationInputDto,
  ) {
    const { productInternalId } = conversationInputDto;

    try {
      const { conversationId, isNewConversation } =
        await this.chatService.getOrCreateConversationFromAuthUserId(
          new UUID({ uuid: tokenInfo.userId }),
          new UUID({ uuid: productInternalId }),
        );

      return { conversationId, isNewConversation };
    } catch (e) {
      if (e instanceof NewConversationLimitExceededException) {
        throw new HttpException(
          { message: e.message, code: e.code },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw e;
    }
  }

  @Post(routesV1.chat.messageWebhook)
  async handleNewMessageWebhook(
    @Body()
    webhookMessageDTO: WebhookMessageDTO,
  ) {
    const { id, text, senderId, type, attachment, conversationId } =
      webhookMessageDTO.data.message;

    await this.chatService.handleNewMessage(
      id,
      text ?? '',
      type === 'SystemMessage' ? 'system-user' : senderId ?? 'no-user-found',
      conversationId,
      !!attachment,
    );
  }
}
