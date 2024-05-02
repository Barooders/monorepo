/* eslint-disable no-console */
import { jsonStringify } from '@libs/helpers/json';
import 'dotenv.config';

const run = async () => {
  if (!process.argv) {
    console.error('No arguments provided');
    return;
  }

  const [env, ...command] = process.argv.slice(2);

  console.log(jsonStringify({ env, command: command.join(' ') }));
};

void run();
