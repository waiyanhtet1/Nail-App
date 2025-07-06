import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.barbiestudio.app",
  appName: "Barbie’s Studio",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchAutoHide: true, // ensures splash screen disappears immediately
      splashFullScreen: false,
      splashImmersive: false,
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
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
