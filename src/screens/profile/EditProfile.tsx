import { yupResolver } from "@hookform/resolvers/yup";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import DOBSelect from "../../components/DOBSelect";
import EditImageInput from "../../components/EditImageInput";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { BASE_URL } from "../../constants/baseUrl";
import { formatWithLeadingZero, removeLeadingZero } from "../../libs/dateUtils";
import { encryptData } from "../../libs/encryption";
import showToast from "../../libs/toastUtil";
import { getLoginUser } from "../../libs/userUtils";
import { urlToFile } from "../../libs/utils";
import { updateProfileValidation } from "../../validations/updateProfileValidation";

type Inputs = {
  userName: string;
  phone: string;
  // password: string;
  email: string;
  profileImg?: FileList | null;
};

const EditProfile = () => {
  // const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isDOBError, setIsDOBError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const navigate = useNavigate();

  const userInfo = getLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    resolver: yupResolver(updateProfileValidation),
    // defaultValues: {
    //   profileImg: undefined,
    // },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(day, month, year);
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

      if (userInfo.secondary_email) {
        const formData = new FormData();
        formData.append("userId", userInfo._id);
        formData.append("username", data.userName);
        formData.append("phone", data.phone);
        formData.append("secondary_email", data.email);
        formData.append("DOB", dateProps as string);

        if (data.profileImg && data.profileImg.length > 0) {
          formData.append("profileImage", data.profileImg[0]);
        }

        try {
          const response = await axios.patch(
            `${BASE_URL}/update-profile`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          localStorage.setItem("userInfo", encryptData(response.data.user));
          navigate("/");
          showToast("Update success");
        } catch (error) {
          console.log(error);
        }
      } else {
        const formData = new FormData();
        formData.append("userId", userInfo._id);
        formData.append("username", data.userName);
        formData.append("phone", data.phone);
        formData.append("email", data.email);
        formData.append("DOB", dateProps as string);

        if (data.profileImg && data.profileImg.length > 0) {
          formData.append("profileImage", data.profileImg[0]);
        }

        try {
          const response = await axios.put(
            `${BASE_URL}/update-profile`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

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
      setValue("email", userInfo.secondary_email);
      setValue("phone", userInfo.phone);

      const dobString = userInfo.DOB;

      if (dobString) {
        const dob = dobString.split("T")[0]; // e.g., "1995-08-12"
        const parts = dob.split("-");

        if (parts.length === 3) {
          const [currentYear, monthRaw, dayRaw] = parts;
          const currentDay = removeLeadingZero(dayRaw);
          const currentMonth = removeLeadingZero(monthRaw);

          setDay(currentDay);
          setMonth(currentMonth);
          setYear(currentYear);
        }
      }

      urlToFile(
        `${BASE_URL}${userInfo.profileImage}`,
        `${userInfo.profileImage}`
      ).then((file) => {
        if (file) {
          const reader = new FileReader();
          reader.onload = () => setImage(reader.result as string);
          reader.readAsDataURL(file);

          // Create a DataTransfer object to simulate a FileList
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          setValue("profileImg", dataTransfer.files);
        }
      });
    }
  }, []);

  return (
    <div className="mt-10 mx-5">
      {/* back and title */}
      <div className="flex items-center mb-10">
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
        className="flex flex-col gap-3 mt-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <EditImageInput
          image={image as string}
          setImage={setImage}
          onChange={(file) => setValue("profileImg", file)}
        />

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
        {/* <Input
          type={isPasswordShow ? "text" : "password"}
          label="Password"
          Icon={isPasswordShow ? eyeOutline : eyeOffOutline}
          IconOnClick={() => setIsPasswordShow((prev) => !prev)}
          inputProps={{ ...register("password") }}
          isBorderRed={errors.password !== undefined}
          errorMessage={errors.password?.message}
        /> */}

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
            <Button
              type="button"
              variant="primary"
              className="mt-3"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="mt-3">
              Save
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProfile;
