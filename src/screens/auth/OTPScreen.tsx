import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import OTPInput from "../../components/OTPInput";

const OTPScreen = () => {
  const navigate = useNavigate();

  const [inputOTPCode, setInputOTPCode] = useState("");
  const [isError, setIsError] = useState(false);

  console.log(inputOTPCode.length);

  const handleOTPVerify = () => {
    if (inputOTPCode.length < 6) setIsError(true);
    else {
      setIsError(false);
      navigate("/new-password");
    }
  };

  return (
    <div className="mx-5 mt-20">
      <IonIcon
        icon={arrowBack}
        className="size-6"
        onClick={() => navigate("/forgot-password")}
      />

      <div className="flex flex-col items-center">
        <p className="font-beauty text-5xl" onClick={() => navigate("/")}>
          Barbie’s Studio
        </p>
        <p className="uppercase text-xl">NAIL BAR</p>
      </div>

      <div className="w-full mt-10 px-5 md:px-52">
        <div className="mb-3 flex items-center justify-between">
          <p className="">OTP Code</p>
          {isError && <p className="text-red-500">OTP Required</p>}
        </div>
        <OTPInput
          length={6}
          onComplete={(value) => console.log(value)}
          onChange={(otp) => setInputOTPCode(otp)}
        />

        <Button
          type="submit"
          variant="primary"
          className="mt-10"
          onClick={handleOTPVerify}
        >
          Verify OTP
        </Button>
      </div>
    </div>
  );
};

export default OTPScreen;
