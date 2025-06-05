/* eslint-disable @typescript-eslint/no-explicit-any */
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import SocialIconButton from "../../components/SocialIconButton";
import { BASE_URL } from "../../constants/baseUrl";
import { auth } from "../../firebase";
import { encryptData } from "../../libs/encryption";
import showToast from "../../libs/toastUtil";
import { getLoginUser } from "../../libs/userUtils";
import { useAppSelector } from "../../redux/hook";
import { loginValidationSchema } from "../../validations/loginValidation";
import appleIcon from "/images/apple.svg";
import googleIcon from "/images/google.svg";

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

declare let cordova: any;

type Inputs = {
  userName: string;
  password: string;
};

const LoginScreen = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const [isCordovaReady, setIsCordovaReady] = useState(false);

  const { playerId } = useAppSelector((state) => state.token);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        username: data.userName,
        password: data.password,
        playerId: playerId,
      });

      console.log(response.data);

      localStorage.setItem("userInfo", encryptData(response.data));
      showToast("Login success");
      navigate("/");
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setError("userName", { message: error.response?.data?.msg });
        setError("password", { message: error.response?.data?.msg });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const userInfo = getLoginUser();
    if (userInfo) navigate("/");
  }, [navigate]);

  const loginWithGoogleWeb = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Firebase Web User:", result.user);
      return result.user;
    } catch (err) {
      console.error("Google web sign-in error:", err);
      throw err;
    }
  };

  const loginWithGoogleMobile = async () => {
    try {
      const googleUser = await GoogleAuth.signIn();

      const idToken = googleUser.authentication?.idToken;
      if (!idToken) throw new Error("No ID token found");

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      console.log("Firebase User:", userCredential.user);
      // alert("Firebase User:" + JSON.stringify(userCredential.user));

      return userCredential.user;
    } catch (err) {
      console.error("Google mobile sign-in error:", err);
      alert("Google mobile sign-in error:" + JSON.stringify(err));
      throw err;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = Capacitor.isNativePlatform()
        ? await loginWithGoogleMobile()
        : await loginWithGoogleWeb();

      // Optionally, send user info to your backend here

      if (user) {
        console.log("Signed in user:", user);

        const response = await axios.post(`${BASE_URL}/login`, {
          username: user.email,
          password: user.uid,
          playerId: playerId,
        });

        localStorage.setItem("userInfo", encryptData(response.data));
        showToast("Login success");
        navigate("/");
      }
    } catch (error) {
      // alert("Login failed: " + JSON.stringify(error));
      showToast("Login Fail!");
      toast.error("Login Fail");
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.msg);
      }
    }
  };

  // =============== apple login ==========================

  const signInWithApple = async () => {
    if (!Capacitor.isNativePlatform()) {
      alert("Apple Sign-In is only available on iOS devices.");
      return;
    }

    if (!cordova?.plugins?.SignInWithApple) {
      alert("[Apple Sign-In] Cordova plugin not available.");
      return;
    }

    try {
      console.log("[Apple] Waiting for Apple Sign-In response...");

      const res = await new Promise<AppleSignInResponse>((resolve, reject) => {
        cordova.plugins.SignInWithApple.signin(
          {
            requestedScopes: [0, 1], // 0 = Full Name, 1 = Email
          },
          resolve,
          reject
        );
      });

      console.log("[Apple] Raw response:", res);

      if (!res.identityToken) {
        throw new Error("No identityToken received from Apple.");
      }

      // Decode identityToken to extract sub (Apple user ID) and email
      const decoded: any = jwtDecode(res.identityToken);
      const appleUserId = decoded.sub; // <<< THIS IS YOUR NEW PASSWORD
      const email = decoded.email ?? res.email ?? null;

      const displayName =
        res.fullName?.givenName || res.fullName?.familyName
          ? `${res.fullName?.givenName || ""} ${
              res.fullName?.familyName || ""
            }`.trim()
          : "AppleUser";

      console.log("[Apple] Decoded ID Token:", decoded);
      console.log("[Apple] User ID:", appleUserId);
      console.log("[Apple] Email:", email);
      console.log("[Apple] Display Name:", displayName);

      // Authenticate with Firebase
      // const provider = new OAuthProvider("apple.com");
      // const credential = provider.credential({
      //   idToken: res.identityToken,
      // });

      // const firebaseResult = await signInWithCredential(auth, credential);
      // const firebaseUser = firebaseResult.user;

      const response = await axios.post(`${BASE_URL}/login`, {
        username: email,
        password: appleUserId, // ✅ Use sub as password
        playerId: playerId,
      });

      localStorage.setItem("userInfo", encryptData(response.data));
      showToast("Login success");
      navigate("/");
    } catch (error: any) {
      console.error("[Apple Sign-In Error]:", error);
      alert(
        "[Sign-In Error]:\n" +
          (error?.code || "no-code") +
          " - " +
          (error?.message || JSON.stringify(error))
      );
    }
  };

  // =============== apple login ==========================

  return (
    <div className="flex flex-col items-center justify-center h-screen pt-15">
      <div className="flex flex-col items-center">
        <p className="font-beauty text-5xl" onClick={() => navigate("/")}>
          Barbie’s Studio
        </p>
        <p className="uppercase text-xl">NAIL BAR</p>
      </div>

      <form
        className="w-full mt-10 px-5 md:px-52"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* username input */}
        <Input
          type="text"
          label="User Name (or) Email"
          inputProps={{ ...register("userName") }}
          isBorderRed={errors.userName !== undefined}
          errorMessage={errors.userName?.message}
        />

        {/* password input */}
        <Input
          type={isPasswordShow ? "text" : "password"}
          label="Password"
          Icon={isPasswordShow ? eyeOutline : eyeOffOutline}
          IconOnClick={() => setIsPasswordShow((prev) => !prev)}
          inputProps={{ ...register("password") }}
          isBorderRed={errors.password !== undefined}
          errorMessage={errors.password?.message}
        />

        <div className="flex justify-end">
          <p
            className="my-3 text-gray-second text-sm  w-max"
            onClick={() => navigate("/forgot-password")}
          >
            Forget Password?
          </p>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="w-full flex items-center justify-center mt-3">
            <Button type="submit" variant="primary">
              Sign In
            </Button>
          </div>
        )}
      </form>

      <div className="w-full px-5 md:px-52 my-5 flex items-center justify-center gap-5">
        <p className="w-full border border-gray-second" />
        <p className="whitespace-nowrap text-sm text-gray">Or signin with</p>
        <p className="w-full border border-gray-second" />
      </div>

      {/* social icon */}
      <div className="flex items-center justify-center gap-5">
        <SocialIconButton icon={googleIcon} onClick={handleGoogleLogin} />
        <SocialIconButton icon={appleIcon} onClick={signInWithApple} />
      </div>

      {/* register route */}
      <p className="my-5 text-center text-gray-second text-sm">
        Don’t have an account?
        <Link to="/register" className="active:text-red-primary ml-2">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginScreen;
