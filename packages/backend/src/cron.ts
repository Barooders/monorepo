/* eslint-disable no-console */
import 'dotenv.config';

import envConfig from '@config/env/env.config';
import { jsonStringify } from '@libs/helpers/json';
import { schedule } from 'node-cron';

const {
  cronJobs,
  commandHandler: { bearerToken, endpoint },
} = envConfig;

console.log(`Starting ${cronJobs.length} cron jobs`);

cronJobs.forEach(({ command, cron }) => {
  schedule(cron, async () => {
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

      console.log(`Running command: ${command} as requested by: ${cron}`);
    } catch (error) {
      console.error(`An unexpected error occured:`, error);
    }
  });
});
