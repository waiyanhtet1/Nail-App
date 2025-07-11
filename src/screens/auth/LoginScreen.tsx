/* eslint-disable @typescript-eslint/no-explicit-any */
import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  // ================ google register ====================

  useEffect(() => {
    async function initializeSocialLogin() {
      await SocialLogin.initialize({
        google: {
          webClientId:
            "785555693645-nkum8i6hg77k0ms3gbvam2ura0618e2d.apps.googleusercontent.com", // Your Web Client ID from Google Cloud Console
          iOSClientId:
            "785555693645-n4aj6urtbk07jfctdjoenac20k6l2l46.apps.googleusercontent.com", // Your iOS Client ID from Google Cloud Console
          iOSServerClientId:
            "785555693645-n4aj6urtbk07jfctdjoenac20k6l2l46.apps.googleusercontent.com",
          mode: "offline", // Use 'offline' if you need refresh tokens for backend integration
        },
        // You can also add Apple, Facebook, etc. here if needed
      });
    }

    initializeSocialLogin();
  }, []);

  const handleGoogleLogin = async () => {
    if (!Capacitor.isNativePlatform()) {
      toast.error("Google Login only works on mobile apps (iOS/Android).");
      return;
    }

    try {
      const res = await SocialLogin.login({
        provider: "google",
        options: {
          scopes: ["email", "profile"], // Request necessary scopes
          forceRefreshToken: true, // Request a refresh token if you use 'offline' mode
        },
      });
      console.log("Google Login Result:", res);

      const { serverAuthCode }: any = res.result;

      setIsGoogleLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/login/google-sso`, {
          serverAuthCode: serverAuthCode,
          playerId: playerId,
        });

        localStorage.setItem("userInfo", encryptData(response.data));
        navigate("/");
        showToast("Login success");
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.msg);
          // toast.error(error.response?.data.msg);
          if (
            error.response?.data.msg.includes(
              "This email or secondary email has been already registered"
            )
          ) {
            toast(
              "သင့် Gmail  ဖြင့် Account မရှိသေးပါ။ Register Screen တွင် Register with Google ဖြင့် Account အသစ်ဖွင့်ပါ။",
              {
                duration: 5000,
              }
            );
          }
        }
      } finally {
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.log("Google Login Error:", error);
      toast.error(JSON.stringify(error));
    }
  };
  // ================ google register ====================

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

      console.log("[Apple] Decoded ID Token:", decoded);
      console.log("[Apple] User ID:", appleUserId);

      setIsGoogleLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/login`, {
          username: email || `${appleUserId}@gmail.com`,
          password: appleUserId, // ✅ Use sub as password
          playerId: playerId,
          isIosUser: true,
        });

        localStorage.setItem("userInfo", encryptData(response.data));
        showToast("Login success");
        navigate("/");
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.msg);
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
      } finally {
        setIsGoogleLoading(false);
      }
    } catch (error: any) {
      console.error("[Apple Sign-In Error]:", error);
    }
  };

  // =============== apple login ==========================

  return (
    <div className="flex flex-col items-center justify-center h-screen pt-15">
      {isGoogleLoading && (
        <div className="absolute inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[40%]">
            <Loading /> {/* Your existing Loading spinner component */}
          </div>
        </div>
      )}

      <>
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
      </>
    </div>
  );
};

export default LoginScreen;
