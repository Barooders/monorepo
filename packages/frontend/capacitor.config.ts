import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.barooders.app',
  appName: 'Barooders',
  webDir: 'native/out',
  android: {
    path: 'native/android',
  },
  ios: {
    path: 'native/ios',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
