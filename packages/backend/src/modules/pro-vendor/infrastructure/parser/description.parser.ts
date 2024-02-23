import { jsonParse } from '@libs/helpers/json';
import { askChatGPT } from '@libs/infrastructure/chat-gpt/base.client';
import { IDescriptionParser } from '@modules/pro-vendor/domain/ports/description.parser';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatGPTDescriptionParser implements IDescriptionParser {
  private readonly logger = new Logger(ChatGPTDescriptionParser.name);

  async getTechnicalCharacteristicsFromText(
    desiredParsedKeys: string[],
    text: string,
  ): Promise<Record<string, string>> {
    try {
      const chatGPTContent = await askChatGPT(
        `Renvoie uniquement un json avec les clefs (${desiredParsedKeys.join(
          ', ',
        )}) du produit décrit comme ceci: ${text}`,
      );

      this.logger.debug(`Response content from chatgpt: ${chatGPTContent}`);

      return jsonParse(chatGPTContent.replace(',\n}', '\n}'));
    } catch (error: any) {
      this.logger.error(
        `Error while parsing description: ${error.message}.`,
        error,
      );
      return {};
    }
  }
}
