import { syncCollectionToDB } from './collections/commands';

const ENV_TO_SYNC = 'staging';

const run = async () => {
  // Run this 3 times to avoid errors
  await syncCollectionToDB(ENV_TO_SYNC);
};

void run();
