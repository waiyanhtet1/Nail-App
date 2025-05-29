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
        console.log("[Cordova] Device is ready.");
      },
      false
    );
  }, []);

  const signInWithApple = async () => {
    if (!isCordovaReady) {
      console.warn("[Cordova] Not ready yet");
      alert("[Cordova] Not ready yet");
      return;
    }

    try {
      console.log("[Apple] Waiting for Apple Sign-In response...");
      alert("[Apple] Waiting for Apple Sign-In response...");

      const res = await new Promise<AppleSignInResponse>((resolve, reject) => {
        cordova.plugins.SignInWithApple.signin(
          {
            requestedScopes: [0, 1], // 0: Full Name, 1: Email
          },
          resolve,
          reject
        );
      });

      console.log("[Apple] Got Apple Sign-In response:", res);
      alert("[Apple] Got Apple Sign-In response:\n" + JSON.stringify(res));

      if (!res.identityToken) {
        throw new Error("No identityToken received from Apple.");
      }

      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: res.identityToken,
        // You can include rawNonce if you're using that for security
        // rawNonce: nonce,
      });

      console.log("[Firebase] OAuth Credential:", credential);
      alert("[Firebase] Signing in with credential...");

      const firebaseResult = await signInWithCredential(auth, credential);
      console.log("[Firebase] Sign-In success:", firebaseResult.user);
      alert(
        "[Firebase] Sign-In success:\n" + JSON.stringify(firebaseResult.user)
      );
    } catch (error: any) {
      console.error("[Apple/Firebase Sign-In error]:", error);
      alert(
        "[Sign-In Error]:\n" +
          (error?.code || "no-code") +
          " - " +
          (error?.message || JSON.stringify(error))
      );
    }
  };

  return { signInWithApple, isCordovaReady };
};
