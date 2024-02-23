// import { config } from 'dotenv';
import { syncCollectionToStaging } from './collections/commands';

// TODO: Fix this
// const path = require('path');

// config({ path: path.resolve(process.cwd(), 'isomaker', '.env'), debug: true });

const run = async () => {
  await syncCollectionToStaging();
};

void run();
