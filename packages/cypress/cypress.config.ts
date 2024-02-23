import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'qjmk4g',
  e2e: {
    specPattern: 'e2e/**/*.spec.{js,ts}',
    baseUrl: 'https://barooders.com',
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
