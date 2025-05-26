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
      console.log("[Apple] Waiting for Apple Sign-In response...");
      alert("[Apple] Waiting for Apple Sign-In response...");

      const res = await new Promise<AppleSignInResponse>((resolve, reject) => {
        cordova.plugins.SignInWithApple.signin(
          {
            requestedScopes: [0, 1],
          },
          resolve,
          reject
        );
      });

      console.log("[Apple] Got Apple Sign-In response:", res);
      alert("[Apple] Got Apple Sign-In response:" + JSON.stringify(res));

      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: res.identityToken,
        rawNonce: undefined,
      });

      console.log("[Firebase] Signing in with credential...");
      alert("[Firebase] Signing in with credential...");

      const firebaseResult = await signInWithCredential(auth, credential);

      console.log("[Firebase] Sign-In success:", firebaseResult.user);
      alert(
        "[Firebase] Sign-In success:" + JSON.stringify(firebaseResult.user)
      );
    } catch (error) {
      console.error("[Apple Sign-In error]:", error);
    }
  };

  return { signInWithApple, isCordovaReady };
};
