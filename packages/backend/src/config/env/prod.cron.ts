import { EnvCronConfig } from './types';

const productionCronConfig: EnvCronConfig = {
  cronJobs: [
    {
      cron: '10 * * * *',
      command: 'yarn console order checkFulfillmentStatus',
    },
    {
      cron: '0 * * * *',
      command: 'yarn console order sendUnfulfilledOrdersEmails 2',
    },
    {
      cron: '30 * * * *',
      command: 'yarn console order sendUnfulfilledOrdersEmails 5',
    },
    {
      cron: '40 * * * *',
      command: 'yarn console order sendUnfulfilledOrdersEmails 8',
    },
    {
      cron: '0 * * * *',
      command: 'yarn console order refundUnfulfilledOrders',
    },
    {
      cron: '0 16 * * *',
      command: 'yarn console searchAlerts triggerAll',
    },
    {
      cron: '0 15 * * *',
      command: 'yarn console commission cleanOldCommissions',
    },
    {
      cron: '0 8 * * *',
      command: 'yarn console product sendEmailToVendorsWithOldProducts',
    },
  ],
};

export default productionCronConfig;
