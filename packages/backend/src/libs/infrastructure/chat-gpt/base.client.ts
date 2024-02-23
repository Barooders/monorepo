import envConfig from '@config/env/env.config';
import { jsonStringify } from '@libs/helpers/json';

export const askChatGPT = async (prompt: string): Promise<string> => {
  const body = jsonStringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${envConfig.externalServices.chatGpt.apiKey}`,
    },
    body,
  });

  if (!response.ok) {
    throw new Error(
      `Could not chatGPT with (${body}) in backend because: ${jsonStringify(
        response,
      )}`,
    );
  }

  try {
    return (await response.json()).choices[0].message.content;
  } catch (e) {
    throw new Error(
      `Could not parse response from chatGPT with (${body}) in backend because: ${jsonStringify(
        response,
      )}`,
    );
  }
};
