/* eslint-disable no-console */
import { envConfigs } from '@config/env/env.config';
import { Environments } from '@config/env/types';
import { jsonStringify } from '@libs/helpers/json';

export const runJob = async (
  command: string,
  env: Environments,
  context: string,
) => {
  const {
    externalServices: {
      commandHandler: { bearerToken, endpoint },
    },
  } = envConfigs[env];

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: new Headers([
        ['Content-Type', 'application/json'],
        ['Authorization', `Bearer ${bearerToken}`],
      ]),
      body: jsonStringify({ startCommand: command }),
    });

    if (!result.ok) {
      console.error(
        `Failed create job with command: ${command}. Status: ${result.status}`,
      );
    }

    console.log(`Running command: ${command} as requested by: ${context}`);
  } catch (error) {
    console.error(`An unexpected error occured:`, error);
  }
};
