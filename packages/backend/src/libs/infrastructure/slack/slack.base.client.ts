import envConfig from '@config/env/env.config';
import type { ConversationsHistoryResponse } from '@slack/web-api';
import { WebClient } from '@slack/web-api';

const slackClient = new WebClient(
  envConfig.externalServices.slack.slackBotToken,
);

export const sendSlackMessage = async (
  channelId: string,
  message: string,
): Promise<void> => {
  await slackClient.chat.postMessage({
    channel: channelId,
    text: message,
  });
};

// Function to fetch messages from a channel
export const fetchMessages = async (channelId: string) => {
  let messages: ConversationsHistoryResponse['messages'] = [];
  let cursor: string | undefined;

  do {
    const response = await slackClient.conversations.history({
      channel: channelId,
      cursor: cursor,
    });

    messages = messages.concat(response.messages ?? []);
    cursor = response.response_metadata?.next_cursor;
  } while (cursor);

  return messages;
};

// Function to fetch the last message in a thread
export const fetchLastMessageInThread = async (
  channelId: string,
  threadTs: string,
) => {
  const response = await slackClient.conversations.replies({
    channel: channelId,
    ts: threadTs,
  });

  const threadMessages = response.messages;

  if (!threadMessages) {
    return threadTs;
  }

  const lastMessage = threadMessages[threadMessages.length - 1];

  return lastMessage.ts;
};

// Main function to get messages and their thread details
export const getMessagesWithThreadDetails = async (channelId: string) => {
  const messages = await fetchMessages(channelId);
  const result = [];

  for (const message of messages) {
    if (!message?.ts) continue;
    const messageSentDate = tsToDate(message.ts);
    const lastThreadMessageDate = !message.thread_ts
      ? messageSentDate
      : tsToDate(
          (await fetchLastMessageInThread(channelId, message.thread_ts)) ??
            message.ts,
        );
    const messageDetail = {
      text: message.text,
      sentDate: messageSentDate,
      lastThreadMessageDate,
    };

    result.push(messageDetail);
  }

  return result;
};

const tsToDate = (ts: string) => new Date(parseFloat(ts) * 1000).toISOString();
