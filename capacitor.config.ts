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
        "422262531684-nt83vc99hg47n85jtesq4ktk6ono2e7a.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
    FacebookConnect: {
      appId: "582047324943302",
      version: "v18.0",
    },
  },
};

export default config;
