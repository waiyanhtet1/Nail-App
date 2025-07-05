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
import googleIcon from "/images/google.svg";

// declare let facebookConnectPlugin: any;

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
  const [isDOBError, setIsDOBError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { playerId } = useAppSelector((state) => state.token);

  GoogleAuth.initialize();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<Inputs>({
    resolver: yupResolver(singUpValidation),
    defaultValues: {
      profileImg: null,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (day === "" || month === "" || year === "") {
      setIsDOBError(true);
      return;
    } else {
      setIsDOBError(false);
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
    }
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
      alert("Login failed: " + JSON.stringify(error));
      // showToast("Register Fail!");
      toast.error("Register Fail");
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

  //     const response = await axios.post(`${BASE_URL}/register`, {
  //       username: user.displayName,
  //       email: user.email,
  //       password: user.uid,
  //       DOB: null,
  //       playerId,
  //     });

  //     localStorage.setItem("userInfo", encryptData(response.data.user));
  //     navigate("/");
  //     showToast("Register success");
  //     toast.success("Register success");
  //   } catch (err) {
  //     console.error("Facebook login error", err);
  //     showToast("Facebook Register Fail!");
  //     toast.error("Facebook Register Fail");
  //   }
  // };

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
          {isDOBError && (
            <p className="text-xs text-red-500">Date of Birth is required</p>
          )}
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
          <Button type="submit" variant="primary" className="mt-3">
            Sign Up
          </Button>
        )}
      </form>

      <div className="w-full px-5 my-5 flex items-center justify-center gap-5">
        <p className="w-full border border-gray-second" />
        <p className="whitespace-nowrap text-sm text-gray">Or Signup with</p>
        <p className="w-full border border-gray-second" />
      </div>

      {/* social icon */}
      <div className="flex items-center justify-center gap-5">
        {/* <SocialIconButton
          icon={facebookIcon}
          onClick={handleFacebookRegister}
        /> */}
        <SocialIconButton icon={googleIcon} onClick={handleGoogleRegister} />
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
