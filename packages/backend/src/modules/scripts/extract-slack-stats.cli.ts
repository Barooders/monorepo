import { jsonStringify } from '@libs/helpers/json';
import { getMessagesWithThreadDetails } from '@libs/infrastructure/slack/slack.base.client';
import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

@Console()
export class ExtractSlackStatsCLI {
  private readonly logger: Logger = new Logger(ExtractSlackStatsCLI.name);

  @Command({
    command: 'extract-slack-stats <slackChannelId>',
  })
  async fixProductImages(slackChannelId: string): Promise<void> {
    const messages = await getMessagesWithThreadDetails(slackChannelId);

    this.logger.log(jsonStringify(messages));
  }
}
