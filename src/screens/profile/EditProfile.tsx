import { yupResolver } from "@hookform/resolvers/yup";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import DOBSelect from "../../components/DOBSelect";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { BASE_URL } from "../../constants/baseUrl";
import { formatWithLeadingZero, removeLeadingZero } from "../../libs/dateUtils";
import { encryptData } from "../../libs/encryption";
import showToast from "../../libs/toastUtil";
import { getLoginUser } from "../../libs/userUtils";
import { updateProfileValidation } from "../../validations/updateProfileValidation";

type Inputs = {
  userName: string;
  phone: string;
  email: string;
};

const EditProfile = () => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isDOBError, setIsDOBError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const userInfo = getLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    resolver: yupResolver(updateProfileValidation),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (day === "" || month === "" || year === "") {
      setIsDOBError(true);
      return;
    } else {
      setIsDOBError(false);
      setIsLoading(true);
      if (userInfo.secondary_email) {
        try {
          const response = await axios.put(`${BASE_URL}/update-profile`, {
            userId: userInfo._id,
            username: data.userName,
            phone: data.phone,
            secondary_email: data.email,
            DOB: `${year}-${formatWithLeadingZero(
              month
            )}-${formatWithLeadingZero(day)}T00:00:00.000Z`,
          });

          localStorage.setItem("userInfo", encryptData(response.data.user));
          navigate("/");
          showToast("Update success");
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const response = await axios.put(`${BASE_URL}/update-profile`, {
            userId: userInfo._id,
            username: data.userName,
            phone: data.phone,
            email: data.email,
            DOB: `${year}-${formatWithLeadingZero(
              month
            )}-${formatWithLeadingZero(day)}T00:00:00.000Z`,
          });

          localStorage.setItem("userInfo", encryptData(response.data.user));
          navigate("/");
          showToast("Update success");
        } catch (error) {
          console.log(error);
        }
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      setValue("userName", userInfo.username);
      if (userInfo.secondary_email) {
        setValue("email", userInfo.secondary_email);
      } else {
        setValue("email", userInfo.email);
      }
      setValue("phone", userInfo.phone);

      const dob = userInfo.DOB.split("T")[0];
      const [currentYear, monthRaw, dayRaw] = dob.split("-");
      const currentDay = removeLeadingZero(dayRaw);
      const currentMonth = removeLeadingZero(monthRaw);

      setDay(currentDay);
      setMonth(currentMonth);
      setYear(currentYear);
    }
  }, []);

  return (
    <div className="mt-15 mx-5">
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
      {/* <div className="flex items-center justify-center mt-7">
        <img
          src={profileImg}
          alt=""
          className="w-[70px] h-[70px] object-cover rounded-full"
        />
      </div> */}

      {/* form list */}
      <form
        className="flex flex-col gap-3 mt-5"
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
        )}
      </form>
    </div>
  );
};

export default EditProfile;
