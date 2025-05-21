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
      androidSplashResourceName: "splash",
      androidScaleType: "FIT_CENTER",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "rgba(157, 48, 32, 1)",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
      scale: "fit",
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId:
        "422262531684-nt83vc99hg47n85jtesq4ktk6ono2e7a.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
