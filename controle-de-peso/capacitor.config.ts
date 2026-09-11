import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.controledepeso.app',
  appName: 'Controle de Peso',
  webDir: 'build',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      // O app esconde a splash manualmente (veja src/utils/native.ts),
      // assim que a UI React termina de montar/carregar os dados.
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
