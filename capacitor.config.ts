import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'capacitor-http-tester',
  webDir: 'www',
  plugins: {
      CapacitorHttp: {
          enabled: true,
      },
      CapacitorCookies: {
          enabled: true,
      },
  },
  bundledWebRuntime: false,
};

export default config;
