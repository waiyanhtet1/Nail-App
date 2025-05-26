/* eslint-disable @typescript-eslint/no-explicit-any */
import { OAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

declare let cordova: any;

type AppleSignInResponse = {
  identityToken: string;
  authorizationCode: string;
  user?: string;
  email?: string;
  fullName?: {
    givenName?: string;
    familyName?: string;
  };
};

export const useAppleSignIn = () => {
  const [isCordovaReady, setIsCordovaReady] = useState(false);

  useEffect(() => {
    document.addEventListener(
      "deviceready",
      () => {
        setIsCordovaReady(true);
      },
      false
    );
  }, []);

  const signInWithApple = async () => {
    if (!isCordovaReady) {
      console.warn("Cordova not ready yet");
      return;
    }

    try {
      const res = await new Promise<AppleSignInResponse>((resolve, reject) => {
        cordova.plugins.SignInWithApple.signin(
          {
            requestedScopes: [0, 1],
          },
          resolve,
          reject
        );
      });

      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: res.identityToken,
        rawNonce: undefined,
      });

      const firebaseResult = await signInWithCredential(auth, credential);
      console.log("Firebase user:", firebaseResult.user);
    } catch (error) {
      console.error("Apple Sign-In error:", error);
    }
  };

  return { signInWithApple, isCordovaReady };
};
