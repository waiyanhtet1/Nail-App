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

// declare let facebookConnectPlugin: any;
declare let cordova: any;

type Inputs = {
  userName: string;
  password: string;
};

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

const LoginScreen = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

      const { idToken } = googleUser.authentication;
      if (!idToken) throw new Error("No ID token found");

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      console.log("Firebase User:", userCredential.user);
      // alert("Firebase User:" + JSON.stringify(userCredential.user));

      return userCredential.user;
    } catch (err) {
      console.error("Google mobile sign-in error:", err);
      // alert("Google mobile sign-in error:" + JSON.stringify(err));
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
      // showToast("Login Fail!");
      // toast.error("Login Fail");
      if (axios.isAxiosError(error)) {
        // toast.error(error.response?.data.msg);
        if (error.response?.data.msg.includes("Invalid credentials")) {
          toast(
            "သင့် Gmail  ဖြင့် Account မရှိသေးပါ။ Register Screen တွင် Register with Google ဖြင့် Account အသစ်ဖွင့်ပါ။",
            {
              duration: 5000,
            }
          );
        }
      }
    }
  };

  const signInWithApple = async () => {
    if (!Capacitor.isNativePlatform()) {
      toast.error("Apple Sign-In is only available on iOS devices.");
      return;
    }

    if (!cordova?.plugins?.SignInWithApple) {
      toast.error("Apple Sign-In plugin not available.");
      return;
    }

    try {
      const res = await new Promise<AppleSignInResponse>((resolve, reject) => {
        cordova.plugins.SignInWithApple.signin(
          {
            requestedScopes: [0, 1], // Full Name and Email
          },
          resolve,
          reject
        );
      });

      if (!res.identityToken) {
        throw new Error("No identityToken received from Apple.");
      }

      const decoded: any = jwtDecode(res.identityToken);
      const appleUserId = decoded.sub;
      const email = decoded.email || res.email;

      if (!email) {
        toast.error("Email is required for login. Please try another method.");
        return;
      }

      // Use full name if available, fallback to email
      // const displayName =
      //   res.fullName?.givenName || res.fullName?.familyName
      //     ? `${res.fullName?.givenName || ""} ${
      //         res.fullName?.familyName || ""
      //       }`.trim()
      //     : email;

      const payload = {
        username: email,
        password: appleUserId,
        playerId: playerId || null,
      };

      console.log("[Apple Login] Payload:", payload);

      const response = await axios.post(`${BASE_URL}/login`, payload);

      localStorage.setItem("userInfo", encryptData(response.data));
      navigate("/");
      showToast("Login success");
      toast.success("Login success");
    } catch (error: any) {
      console.error("[Apple Sign-In Error]:", error);

      if (axios.isAxiosError(error) && error.response?.data?.msg) {
        const msg = error.response.data.msg;

        if (msg.includes("already registered")) {
          toast(
            "သင့် AppleID ဖြင့် Account မရှိသေးပါ။ Register Screen တွင် Register with Apple ဖြင့် Account အသစ်ဖွင့်ပါ။",
            {
              duration: 5000,
            }
          );
        } else {
          toast.error(msg);
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  // const signInWithFacebookNative = async (): Promise<UserCredential> => {
  //   return new Promise((resolve, reject) => {
  //     facebookConnectPlugin.login(
  //       ["public_profile", "email"],
  //       async (response: any) => {
  //         if (response.authResponse) {
  //           const { accessToken } = response.authResponse;

  //           const credential = FacebookAuthProvider.credential(accessToken);
  //           try {
  //             const userCredential = await signInWithCredential(
  //               auth,
  //               credential
  //             );
  //             resolve(userCredential); // now properly typed
  //           } catch (firebaseError) {
  //             reject(firebaseError);
  //           }
  //         } else {
  //           reject("No auth response");
  //         }
  //       },
  //       (error: any) => reject(error)
  //     );
  //   });
  // };

  // const signInWithFacebookWeb = async () => {
  //   const provider = new FacebookAuthProvider();
  //   const userCredential = await signInWithPopup(auth, provider);
  //   return userCredential;
  // };

  // const handleFacebookRegister = async () => {
  //   try {
  //     const userCredential = Capacitor.isNativePlatform()
  //       ? await signInWithFacebookNative()
  //       : await signInWithFacebookWeb();

  //     const user = userCredential.user;

  //     const response = await axios.post(`${BASE_URL}/login`, {
  //       username: user.email,
  //       password: user.uid,
  //       playerId: playerId,
  //     });

  //     localStorage.setItem("userInfo", encryptData(response.data.user));
  //     navigate("/");
  //     showToast("Login success");
  //     toast.success("Login success");
  //   } catch (err) {
  //     console.error("Facebook login error", err);
  //     showToast("Facebook Login Fail!");
  //     toast.error("Facebook Login Fail");
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center h-screen pt-15">
      <div className="flex flex-col items-center">
        <p className="font-beauty text-5xl" onClick={() => navigate("/")}>
          Barbie’s Studio
        </p>
        <p className="uppercase text-xl">NAIL BAR</p>
      </div>

      {/* <div className="flex justify-center">
        <img src={logo} alt="" className="h-[200px]" />
      </div> */}
      <form
        className="w-full mt-10 px-5 md:px-52"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* username input */}
        <Input
          type="text"
          label="User Name"
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
            <Button type="submit" variant="primary" className="mt-3">
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
        {/* <SocialIconButton
          icon={facebookIcon}
          onClick={handleFacebookRegister}
        /> */}
        <SocialIconButton icon={appleIcon} onClick={signInWithApple} />
        <SocialIconButton icon={googleIcon} onClick={handleGoogleLogin} />
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
