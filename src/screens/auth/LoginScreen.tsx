import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
import googleIcon from "/images/google.svg";

type Inputs = {
  userName: string;
  password: string;
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
        <div className="my-3">
          <Input
            type={isPasswordShow ? "text" : "password"}
            label="Password"
            Icon={isPasswordShow ? eyeOutline : eyeOffOutline}
            IconOnClick={() => setIsPasswordShow((prev) => !prev)}
            inputProps={{ ...register("password") }}
            isBorderRed={errors.password !== undefined}
            errorMessage={errors.password?.message}
          />
          <p className="mt-2 text-gray-second text-sm flex justify-end">
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
        {/* <SocialIconButton icon={facebookIcon} /> */}
        <SocialIconButton icon={googleIcon} />
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
