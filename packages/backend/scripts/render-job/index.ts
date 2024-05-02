/* eslint-disable no-console */
import envConfig from '@config/env/env.config';
import { runJob } from '@libs/infrastructure/render/run-job';
import 'dotenv.config';

const { envName } = envConfig;

const run = async () => {
  if (!process.argv) {
    console.error('No arguments provided');
    return;
  }

  const command = `yarn workspace backend console ${process.argv.slice(2).join(' ')}`;

  await runJob(command, envName, 'CLI');
};

void run();
