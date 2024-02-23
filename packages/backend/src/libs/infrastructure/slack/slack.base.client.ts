import envConfig from '@config/env/env.config';
import { jsonStringify } from '@libs/helpers/json';

export const sendSlackMessage = async (
  channelId: string,
  message: string,
): Promise<void> => {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${envConfig.externalServices.slack.slackBotToken}`,
    },
    body: jsonStringify({
      channel: channelId,
      text: message,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Cannot send Slack message to (${channelId}): ${response.statusText}`,
    );
  }
};
