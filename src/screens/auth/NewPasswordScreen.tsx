import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";

const NewPasswordScreen = () => {
  const navigate = useNavigate();

  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isError, setIsError] = useState({
    pass: false,
    confirmPass: false,
    equalPass: false,
  });

  const handleSubmitNewPassword = () => {
    if (pass === "") {
      setIsError((prev) => ({ ...prev, pass: true }));
      return;
    } else if (confirmPass === "") {
      setIsError((prev) => ({ ...prev, confirmPass: true }));
      return;
    } else if (pass !== confirmPass) {
      setIsError((prev) => ({ ...prev, equalPass: true }));
      return;
    } else {
      navigate("/new-password");
    }
  };

  return (
    <div className="mx-5 mt-20">
      <IonIcon
        icon={arrowBack}
        className="size-6"
        onClick={() => navigate("/otp")}
      />

      <div className="flex flex-col items-center">
        <p className="font-beauty text-5xl" onClick={() => navigate("/")}>
          Barbie’s Studio
        </p>
        <p className="uppercase text-xl">NAIL BAR</p>
      </div>

      <div className="flex flex-col gap-5 w-full mt-10 px-5 md:px-52">
        <Input
          type="text"
          label="New Password"
          value={pass}
          setValue={setPass}
          isBorderRed={isError.pass}
          errorMessage={isError.pass ? "Password is required" : ""}
        />

        <Input
          type="text"
          label="Confirm New Password"
          value={confirmPass}
          setValue={setConfirmPass}
          isBorderRed={isError.confirmPass}
          errorMessage={
            isError.confirmPass ? "Confirm Password is required" : ""
          }
        />

        {isError.equalPass && (
          <p className="text-red-500 text-sm">
            Password and Confirm Password is required
          </p>
        )}

        <div className="w-full flex items-center justify-center mt-3">
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmitNewPassword}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordScreen;
