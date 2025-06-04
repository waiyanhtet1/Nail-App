import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.barbiestudio.app",
  appName: "Barbie’s Studio",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 3000,
      backgroundColor: "rgba(244, 233, 231, 1)",
      showSpinner: true,
      spinnerColor: "rgba(157, 48, 32, 1)",
      iosSpinnerStyle: "small",
      androidSpinnerStyle: "large",
      androidScaleType: "FIT_CENTER",
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
      // scale: "fit",
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
