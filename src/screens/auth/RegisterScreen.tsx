import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import DOBSelect from "../../components/DOBSelect";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import SocialIconButton from "../../components/SocialIconButton";
import { BASE_URL } from "../../constants/baseUrl";
import { encryptData } from "../../libs/encryption";
import { useAppSelector } from "../../redux/hook";
import { singUpValidation } from "../../validations/signUpValidation";
import facebookIcon from "/images/facebook.svg";
import googleIcon from "/images/google.svg";

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
  const [isDOBError, setIsDOBError] = useState(false);
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
    if (day === "" || month === "" || year === "") {
      setIsDOBError(true);
      return;
    } else {
      setIsDOBError(false);
      setIsLoading(true);

      try {
        const response = await axios.post(`${BASE_URL}/register`, {
          username: data.userName,
          phone: data.phone,
          email: data.email,
          password: data.password,
          DOB: `${day}/${month}/${year}`,
          playerId: playerId,
        });

        localStorage.setItem("userInfo", encryptData(response.data));
        navigate("/");
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          setError("userName", { message: error.response?.data?.msg });
        }
      }
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const user = await GoogleAuth.signIn();
      console.log("Native login", JSON.stringify(user));
      alert("Login" + JSON.stringify(user));
    } catch (err) {
      console.error("Native login failed", err);
      alert("Fail" + JSON.stringify(err));
    }
  };

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
        <SocialIconButton icon={facebookIcon} />
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
