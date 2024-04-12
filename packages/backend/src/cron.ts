import { schedule } from 'node-cron';

schedule('* * * * *', () => {
  console.log('running a task every minute');
});
