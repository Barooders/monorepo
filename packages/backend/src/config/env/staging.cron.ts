import { EnvCronConfig } from './types';

const stagingCronConfig: EnvCronConfig = {
  cronJobs: [
    {
      cron: '30 * * * *',
      command: 'yarn console proVendor updateProductStatuses tuvalum',
    },
    {
      cron: '0 3 * * *',
      command: 'yarn console proVendor syncProducts tuvalum',
    },
  ],
};

export default stagingCronConfig;
