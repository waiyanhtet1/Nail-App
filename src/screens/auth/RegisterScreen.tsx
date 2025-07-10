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
import DOBSelect from "../../components/DOBSelect";
import ImageInput from "../../components/ImageInput";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import SocialIconButton from "../../components/SocialIconButton";
import { BASE_URL } from "../../constants/baseUrl";
import { formatWithLeadingZero } from "../../libs/dateUtils";
import { encryptData } from "../../libs/encryption";
import showToast from "../../libs/toastUtil";
import { useAppSelector } from "../../redux/hook";
import { singUpValidation } from "../../validations/signUpValidation";
import appleIcon from "/images/apple.svg";
import googleIcon from "/images/google.svg";

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

type Inputs = {
  userName: string;
  phone: string;
  password: string;
  email: string;
  profileImg?: FileList | null;
};

const RegisterScreen = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { playerId } = useAppSelector((state) => state.token);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<Inputs>({
    resolver: yupResolver(singUpValidation),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);

    const dateProps =
      day && month && year
        ? `${year}-${formatWithLeadingZero(month)}-${formatWithLeadingZero(
            day
          )}T00:00:00.000Z`
        : null;

    const formData = new FormData();
    formData.append("username", data.userName);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("DOB", dateProps as string);
    formData.append("playerId", playerId);

    if (data.profileImg && data.profileImg.length > 0) {
      formData.append("profileImage", data.profileImg[0]);
    }

    try {
      const response = await axios.post(`${BASE_URL}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("userInfo", encryptData(response.data));
      navigate("/");
      showToast("Register success");
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setError("userName", { message: error.response?.data?.msg });
      }
    }
    setIsLoading(false);
  };

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

  // ================ google register ====================
  const handleGoogleRegister = async () => {
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

      try {
        const response = await axios.post(`${BASE_URL}/register/google-sso`, {
          serverAuthCode: serverAuthCode,
          playerId: playerId,
        });

        localStorage.setItem("userInfo", encryptData(response.data));
        navigate("/");
        showToast("Register success");
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

      const formData = new FormData();
      formData.append("username", "AppleUser");
      formData.append("phone", "");
      formData.append("email", email || `${appleUserId}@gmail.com`);
      formData.append("password", appleUserId);
      formData.append("DOB", "");
      formData.append("playerId", playerId);
      formData.append("isIosUser", "true");

      try {
        const response = await axios.post(
          `${BASE_URL}/register/ios`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        localStorage.setItem("userInfo", encryptData(response.data));
        navigate("/");
        showToast("Register success");
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
              "သင့် AppleId  ဖြင့် Account မရှိသေးပါ။ Register Screen တွင် Register with Apple ဖြင့် Account အသစ်ဖွင့်ပါ။",
              {
                duration: 5000,
              }
            );
          }
        }
      }
    } catch (error: any) {
      console.error("[Apple Sign-In Error]:", error);
    }
  };
  // =============== apple login ==========================

  return (
    <div className="flex flex-col gap-3 pt-10 px-5 md:px-52">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <ImageInput onChange={(file) => setValue("profileImg", file)} />
        <Input
          label="User Name"
          type="text"
          inputProps={{ ...register("userName") }}
          isBorderRed={errors.userName !== undefined}
          errorMessage={errors.userName?.message}
        />
        <Input
          label="Phone"
          type="number"
          inputProps={{ ...register("phone") }}
          isBorderRed={errors.phone !== undefined}
          errorMessage={errors.phone?.message}
        />
        <Input
          label="Email"
          type="email"
          inputProps={{ ...register("email") }}
          isBorderRed={errors.email !== undefined}
          errorMessage={errors.email?.message}
        />
        <Input
          type={isPasswordShow ? "text" : "password"}
          label="Password"
          Icon={isPasswordShow ? eyeOutline : eyeOffOutline}
          IconOnClick={() => setIsPasswordShow((prev) => !prev)}
          inputProps={{ ...register("password") }}
          isBorderRed={errors.password !== undefined}
          errorMessage={errors.password?.message}
        />

        <div className="flex items-center justify-between">
          <p className="text-gray">Date of Birth</p>
        </div>
        <DOBSelect
          day={day}
          setDay={setDay}
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
        />

        {isLoading ? (
          <Loading />
        ) : (
          <div className="w-full flex items-center justify-center mt-3">
            <Button type="submit" variant="primary">
              Sign Up
            </Button>
          </div>
        )}
      </form>

      <div className="w-full px-5 my-5 flex items-center justify-center gap-5">
        <p className="w-full border border-gray-second" />
        <p className="whitespace-nowrap text-sm text-gray">Or Signup with</p>
        <p className="w-full border border-gray-second" />
      </div>

      {/* social icon */}
      <div className="flex items-center justify-center gap-5">
        <SocialIconButton icon={googleIcon} onClick={handleGoogleRegister} />
        <SocialIconButton icon={appleIcon} onClick={signInWithApple} />
      </div>

      {/* register route */}
      <p className="my-5 text-center text-gray-second text-sm">
        Already have an account?
        <Link to="/login" className="active:text-red-primary ml-2">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterScreen;
