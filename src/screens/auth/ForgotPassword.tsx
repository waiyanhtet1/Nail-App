import { IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBack } from "ionicons/icons";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { BASE_URL } from "../../constants/baseUrl";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOTP = async () => {
    if (email === "") setIsError(true);
    else {
      setIsError(false);
      setIsLoading(true);

      try {
        await axios.post(`${BASE_URL}/request-otp`, {
          email,
        });
        toast.success("Email sent.");
        navigate("/otp");
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-5 mt-20">
      <IonIcon
        icon={arrowBack}
        className="size-6"
        onClick={() => navigate("/login")}
      />

      <div className="flex flex-col items-center">
        <p className="font-beauty text-5xl" onClick={() => navigate("/")}>
          Barbie’s Studio
        </p>
        <p className="uppercase text-xl">NAIL BAR</p>
      </div>

      <div className="w-full mt-10 px-5 md:px-52">
        <Input
          type="text"
          label="Enter Your Registered Email Address"
          value={email}
          setValue={setEmail}
          isBorderRed={isError}
          errorMessage={isError ? "Email is required" : ""}
        />

        {isLoading ? (
          <Loading />
        ) : (
          <Button
            type="submit"
            variant="primary"
            className="mt-10"
            onClick={handleRequestOTP}
          >
            Request OTP
          </Button>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
