/* eslint-disable no-console */
import 'dotenv.config';

import envConfig from '@config/env/env.config';
import { runJob } from '@libs/infrastructure/render/run-job';
import { CronJob } from 'cron';

const { cronJobs, envName } = envConfig;

console.log(`Starting ${cronJobs.length} cron jobs`);

cronJobs.forEach(({ command, cron }) => {
  CronJob.from({
    cronTime: cron, // cronTime
    onTick: async () => {
      await runJob(command, envName, cron);
    },
    start: true,
    timeZone: 'Europe/Paris',
  });
});
