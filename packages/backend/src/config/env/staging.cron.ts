import { EnvCronConfig } from './types';

const stagingCronConfig: EnvCronConfig = {
  cronJobs: [
    {
      cron: '0 2 * * *',
      command: 'yarn workspace backend index:all',
    },
  ],
};

export default stagingCronConfig;
