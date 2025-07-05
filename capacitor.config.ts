import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.barbiestudio.app",
  appName: "Barbie’s Studio",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // disables automatic splash
      showSplashScreen: false, // disables splash entirely
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId:
        "103072032496-tfrc7vm80sub2t3mrdjkr73sfcihhiil.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
