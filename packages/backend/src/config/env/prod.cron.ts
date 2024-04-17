import { EnvCronConfig } from './types';

const productionCronConfig: EnvCronConfig = {
  cronJobs: [
    {
      cron: '10 * * * *',
      command: 'yarn workspace backend console order checkFulfillmentStatus',
    },
    {
      cron: '0 * * * *',
      command: 'yarn workspace backend console order sendUnfulfilledOrdersEmails 2',
    },
    {
      cron: '30 * * * *',
      command: 'yarn workspace backend console order sendUnfulfilledOrdersEmails 5',
    },
    {
      cron: '40 * * * *',
      command: 'yarn workspace backend console order sendUnfulfilledOrdersEmails 8',
    },
    {
      cron: '0 * * * *',
      command: 'yarn workspace backend console order refundUnfulfilledOrders',
    },
    {
      cron: '0 16 * * *',
      command: 'yarn workspace backend console searchAlerts triggerAll',
    },
    {
      cron: '0 15 * * *',
      command: 'yarn workspace backend console commission cleanOldCommissions',
    },
    {
      cron: '0 8 * * *',
      command: 'yarn workspace backend console product sendEmailToVendorsWithOldProducts',
    },
    {
      cron: '0 2 * * 1,4',
      command: 'yarn workspace backend index:all',
    },
  ],
};

export default productionCronConfig;
