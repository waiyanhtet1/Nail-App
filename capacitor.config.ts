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
    SocialLogin: {
      google: {
        // Use the Web Client ID for cross-platform compatibility as recommended by Capgo
        webClientId:
          "785555693645-nkum8i6hg77k0ms3gbvam2ura0618e2d.apps.googleusercontent.com",
        // For iOS, you also need the iOS Client ID
        iOSClientId:
          "785555693645-n4aj6urtbk07jfctdjoenac20k6l2l46.apps.googleusercontent.com",
        // If you need offline access (refresh tokens), you might also set iOSServerClientId
        // iOSServerClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Often the same as webClientId
        mode: "offline", // if you need a refresh token
      },
      // ... other providers like apple, facebook if you use them
    },
  },
};

export default config;
