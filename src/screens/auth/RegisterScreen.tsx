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
import { useState } from "react";
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
import { auth } from "../../firebase";
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
    // This is the correct format for the iOS Client ID when provided directly to the plugin.
    const iOS_CLIENT_ID =
      "103072032496-tfrc7vm80sub2t3mrdjkr73sfcihhiil.apps.googleusercontent.com"; // <-- IMPORTANT: This should be the 'Web Client ID' from your Google Cloud Console, not the 'Reversed Client ID' for iOS.

    if (
      Capacitor.getPlatform() === "ios" ||
      Capacitor.getPlatform() === "android"
    ) {
      await GoogleAuth.initialize({
        clientId: iOS_CLIENT_ID, // This 'clientId' param usually expects the "Web Client ID".
        scopes: ["profile", "email"],
        grantOfflineAccess: true,
      });

      try {
        const googleUser = await GoogleAuth.signIn();

        const { authentication } = googleUser;
        const idToken = authentication?.idToken;
        const accessToken = authentication?.accessToken;

        if (!idToken || !accessToken) {
          throw new Error(
            "Missing idToken or accessToken from Google response"
          );
        }

        // Correctly using Firebase's GoogleAuthProvider and signInWithCredential
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        const userCredential = await signInWithCredential(auth, credential);

        console.log("Firebase User:", userCredential.user);
        return userCredential.user;
      } catch (err) {
        console.error("Google mobile sign-in error:", err);
        throw err;
      }
    }
    return null;
  };

  // const loginWithGoogleMobile = async () => {
  //   try {
  //     const googleUser = await GoogleAuth.signIn();

  //     const idToken = googleUser.authentication?.idToken;
  //     if (!idToken) throw new Error("No ID token found");

  //     const credential = GoogleAuthProvider.credential(idToken);
  //     const userCredential = await signInWithCredential(auth, credential);

  //     console.log("Firebase User:", userCredential.user);
  //     // alert("Firebase User:" + JSON.stringify(userCredential.user));

  //     return userCredential.user;
  //   } catch (err) {
  //     console.error("Google mobile sign-in error:", err);
  //     alert("Google mobile sign-in error:" + JSON.stringify(err));
  //     throw err;
  //   }
  // };

  const handleGoogleRegister = async () => {
    try {
      const user = Capacitor.isNativePlatform()
        ? await loginWithGoogleMobile()
        : await loginWithGoogleWeb();

      // Optionally, send user info to your backend here

      if (user) {
        console.log("Signed in user:", user);

        const response = await axios.post(`${BASE_URL}/register`, {
          username: user.displayName,
          // phone: data.phone,
          email: user.email,
          password: user.uid,
          DOB: null,
          playerId: playerId,
        });

        localStorage.setItem("userInfo", encryptData(response.data));
        navigate("/");
        showToast("Register success");
        toast.success("Register success");
      }
    } catch (error) {
      // alert("Login failed: " + JSON.stringify(error));
      // showToast("Register Fail!");
      // toast.error("Register Fail");
      if (axios.isAxiosError(error)) {
        // toast.error(error.response?.data.msg);

        if (
          error.response?.data.msg.includes(
            "This email or secondary email has been already registered"
          )
        ) {
          toast(
            "ဤ Gmail ဖြင့် account ဖွင့်ထားပြီးဖြစ်သည်။ Log In Screen တွင် Log In ဝင်ပါ။",
            {
              duration: 5000,
            }
          );
        }
      }
    }
  };

  // =============== apple login ==========================

  // const signInWithApple = async () => {
  //   if (!Capacitor.isNativePlatform()) {
  //     return;
  //   }

  //   if (!cordova?.plugins?.SignInWithApple) {
  //     return;
  //   }

  //   try {
  //     console.log("[Apple] Waiting for Apple Sign-In response...");

  //     const res = await new Promise<AppleSignInResponse>((resolve, reject) => {
  //       cordova.plugins.SignInWithApple.signin(
  //         {
  //           requestedScopes: [0, 1], // 0 = Full Name, 1 = Email
  //         },
  //         resolve,
  //         reject
  //       );
  //     });

  //     console.log("[Apple] Raw response:", res);

  //     if (!res.identityToken) {
  //       throw new Error("No identityToken received from Apple.");
  //     }

  //     const decoded: any = jwtDecode(res.identityToken);
  //     const appleUserId = decoded.sub; // Treat this as your user's password
  //     const email = decoded.email ?? res.email ?? null;

  //     const displayName =
  //       res.fullName?.givenName || res.fullName?.familyName
  //         ? `${res.fullName?.givenName || ""} ${
  //             res.fullName?.familyName || ""
  //           }`.trim()
  //         : "AppleUser";

  //     console.log("[Apple] Decoded ID Token:", decoded);
  //     console.log("[Apple] User ID:", appleUserId);
  //     console.log("[Apple] Email:", email);
  //     console.log("[Apple] Display Name:", displayName);

  //     const response = await axios.post(`${BASE_URL}/register`, {
  //       username: displayName || email,
  //       email: email,
  //       password: appleUserId, // Using Apple sub as password (or store securely)
  //       DOB: null,
  //       playerId: playerId,
  //     });

  //     localStorage.setItem("userInfo", encryptData(response.data));
  //     navigate("/");
  //     showToast("Register success");
  //     toast.success("Register success");
  //   } catch (error: any) {
  //     console.error("[Apple Sign-In Error]:", error);

  //     if (axios.isAxiosError(error)) {
  //       const msg = error.response?.data?.msg ?? "";

  //       if (
  //         msg.includes(
  //           "This email or secondary email has been already registered"
  //         )
  //       ) {
  //         toast(
  //           "ဤ AppleId ဖြင့် account ဖွင့်ထားပြီးဖြစ်သည်။ Log In Screen တွင် Log In ဝင်ပါ။",
  //           { duration: 5000 }
  //         );
  //       } else {
  //         toast("တစ်စုံတစ်ရာမှားနေပါသည်။ ပြန်စစ်ပါ။", {
  //           duration: 5000,
  //         });
  //       }
  //     }
  //   }
  // };

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
      // const email = decoded.email ?? res.email ?? null;

      // const displayName =
      //   res.fullName?.givenName || res.fullName?.familyName
      //     ? `${res.fullName?.givenName || ""} ${
      //         res.fullName?.familyName || ""
      //       }`.trim()
      //     : "AppleUser";

      console.log("[Apple] Decoded ID Token:", decoded);
      console.log("[Apple] User ID:", appleUserId);
      // console.log("[Apple] Email:", email);
      // console.log("[Apple] Display Name:", displayName);

      const response = await axios.post(`${BASE_URL}/register`, {
        username: "AppleUser",
        email: `${appleUserId}@gmail.com`,
        password: appleUserId,
        DOB: null,
        playerId: playerId,
        isIosUser: true,
      });

      localStorage.setItem("userInfo", encryptData(response.data));
      navigate("/");
      showToast("Register success");
      toast.success("Register success");
    } catch (error: any) {
      console.error("[Apple Sign-In Error]:", error);
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
