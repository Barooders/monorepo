/* eslint-disable no-console */
import 'dotenv.config';

import envConfig from '@config/env/env.config';
import { schedule } from 'node-cron';

const {
  jobs,
  commandHandler: { bearerToken, endpoint },
} = envConfig.cron;

console.log(`Starting ${jobs.length} cron jobs`);

jobs.forEach(({ command, cron }) => {
  schedule(cron, () => {
    console.log(`Running command: ${command} as requested by: ${cron}`);
  });
});
