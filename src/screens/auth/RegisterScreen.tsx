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

    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        username: data.userName,
        phone: data.phone,
        email: data.email,
        password: data.password,
        DOB: dateProps,
        playerId: playerId,
      });

      localStorage.setItem("userInfo", encryptData(response.data.user));
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

        localStorage.setItem("userInfo", encryptData(response.data.user));
        navigate("/");
        showToast("Register success");
        toast.success("Register success");
      }
    } catch (error) {
      // alert("Login failed: " + JSON.stringify(error));
      showToast("Register Fail!");
      toast.error("Register Fail");
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

      const response = await axios.post(`${BASE_URL}/register`, {
        username: displayName || email,
        // phone: data.phone,
        email: email,
        password: appleUserId,
        DOB: null,
        playerId: playerId,
      });

      localStorage.setItem("userInfo", encryptData(response.data.user));
      navigate("/");
      showToast("Register success");
      toast.success("Register success");
    } catch (error: any) {
      console.error("[Apple Sign-In Error]:", error);
      // alert(
      //   "[Sign-In Error]:\n" +
      //     (error?.code || "no-code") +
      //     " - " +
      //     (error?.message || JSON.stringify(error))
      // );
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.msg);
      }
    }
  };

  // =============== apple login ==========================

  return (
    <div className="flex flex-col gap-3 pt-10 px-5 md:px-52">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
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
