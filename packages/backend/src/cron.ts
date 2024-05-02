/* eslint-disable no-console */
import 'dotenv.config';

import envConfig from '@config/env/env.config';
import { runJob } from '@libs/infrastructure/render/run-job';
import { schedule } from 'node-cron';

const { cronJobs, envName } = envConfig;

console.log(`Starting ${cronJobs.length} cron jobs`);

cronJobs.forEach(({ command, cron }) => {
  schedule(cron, async () => {
    await runJob(command, envName, cron);
  });
});
