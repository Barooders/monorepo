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
import { UUID } from '@libs/domain/value-objects';
import { JwtAuthGuard } from '@modules/auth/domain/strategies/jwt/jwt-auth.guard';
import { ExtractedUser } from '@modules/auth/domain/strategies/jwt/jwt.strategy';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  ChatService,
  NewConversationLimitExceededException,
} from '../domain/chat.service';
import { TalkJSConversation, TalkJSMessage, TalkJSUser } from '../types';

class ConversationInputDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;
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
  constructor(private chatService: ChatService) {}

  @Post(routesV1.chat.conversation)
  @UseGuards(JwtAuthGuard)
  async getOrCreateConversation(
    @User() tokenInfo: ExtractedUser,
    @Body()
    conversationInputDto: ConversationInputDto,
  ) {
    const { productId } = conversationInputDto;

    try {
      const { conversationId, isNewConversation } =
        await this.chatService.getOrCreateConversationFromAuthUserId(
          new UUID({ uuid: tokenInfo.userId }),
          productId,
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
      webhookMessageDTO.data.conversation.custom,
    );
  }
}
