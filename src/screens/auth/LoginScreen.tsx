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
import googleIcon from "/images/google.svg";

// declare let facebookConnectPlugin: any;

type Inputs = {
  userName: string;
  password: string;
};

const LoginScreen = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { playerId, subsId } = useAppSelector((state) => state.token);

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
        subsId: subsId,
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
    if (Capacitor.getPlatform() === "android") {
      await GoogleAuth.initialize({
        clientId:
          "103072032496-tfrc7vm80sub2t3mrdjkr73sfcihhiil.apps.googleusercontent.com",
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

        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        const userCredential = await signInWithCredential(auth, credential);

        console.log("Firebase User:", userCredential.user);
        return userCredential.user;
      } catch (err) {
        console.error("Google mobile sign-in error:", err);
        throw err;
      }
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
          subsId: subsId,
        });

        localStorage.setItem("userInfo", encryptData(response.data));
        showToast("Login success");
        navigate("/");
      }
    } catch (error) {
      // alert("Login failed: " + JSON.stringify(error));
      // showToast("Login Fail!");
      toast.error("Login Fail");
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
          <Button type="submit" variant="primary" className="mt-3">
            Sign In
          </Button>
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
