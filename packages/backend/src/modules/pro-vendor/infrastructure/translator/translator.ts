import { askChatGPT } from '@libs/infrastructure/chat-gpt/base.client';
import { ITranslator } from '@modules/pro-vendor/domain/ports/translator';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatGPTTranslator implements ITranslator {
  private readonly logger = new Logger(ChatGPTTranslator.name);

  async translate(text: string): Promise<string | void> {
    try {
      const chatGPTContent = await askChatGPT(
        `Renvoie uniquement la traduction en français de: ${text}`,
      );

      this.logger.debug(`Response content from chatgpt: ${chatGPTContent}`);

      return chatGPTContent;
    } catch (error: any) {
      this.logger.error(`Error during translation: ${error.message}.`, error);
    }
  }
}
