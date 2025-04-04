import { yupResolver } from "@hookform/resolvers/yup";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline, eyeOffOutline, eyeOutline } from "ionicons/icons";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import DOBSelect from "../../components/DOBSelect";
import Input from "../../components/Input";
import { singUpValidation } from "../../validations/signUpValidation";
import profileImg from "/images/stylist.jpeg";

type Inputs = {
  userName: string;
  phone: string;
  password: string;
  email: string;
};

const EditProfile = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isDOBError, setIsDOBError] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(singUpValidation),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (day === "" || month === "" || year === "") {
      setIsDOBError(true);
      return;
    } else {
      setIsDOBError(false);
      console.log(data);
    }
  };

  return (
    <div className="mt-10 mx-5">
      {/* back and title */}
      <div className="flex items-center">
        <IonIcon
          icon={arrowBackOutline}
          className="size-6"
          onClick={() => navigate(-1)}
        />
        <p className="text-secondary font-bold text-center flex justify-center w-full">
          Edit Profile
        </p>
      </div>

      {/* profile image */}
      <div className="flex items-center justify-center mt-7">
        <img
          src={profileImg}
          alt=""
          className="w-[70px] h-[70px] object-cover rounded-full"
        />
      </div>

      {/* form list */}
      <form
        className="flex flex-col gap-3 mt-3"
        onSubmit={handleSubmit(onSubmit)}
      >
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

        <div className="flex items-center gap-3 mt-5">
          <Button type="submit" variant="primary" className="mt-3">
            Edit
          </Button>
          <Button
            type="button"
            variant="primary"
            className="mt-3"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
