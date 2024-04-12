/* eslint-disable no-console */
import 'dotenv.config';

import envConfig from '@config/env/env.config';
import { schedule } from 'node-cron';

console.log('Starting cron jobs');

envConfig.cronJobs.forEach(({ cron, command }) => {
  schedule(cron, () => {
    console.log(`Running command: ${command} as requested by: ${cron}`);
  });
});
