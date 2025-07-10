import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Sheet, SheetRef } from "react-modal-sheet";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants/baseUrl";
import { formatWithLeadingZero } from "../../libs/dateUtils";
import { encryptData } from "../../libs/encryption";
import showToast from "../../libs/toastUtil";
import { getLoginUser } from "../../libs/userUtils";
import { updateUserSliderValidation } from "../../validations/updateProfileValidation";
import Button from "../Button";
import DOBSelect from "../DOBSelect";
import ImageInput from "../ImageInput";
import Input from "../Input";
import Loading from "../Loading";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

type Inputs = {
  userName: string;
  email: string;
  profileImg?: FileList | null;
};

const UserNameBottomSheet = ({ isOpen, setOpen }: Props) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isDOBError, setIsDOBError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef<SheetRef>(null);
  const userInfo = getLoginUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    resolver: yupResolver(updateUserSliderValidation),
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

      const formData = new FormData();
      formData.append("userId", userInfo._id);
      formData.append("username", data.userName);
      formData.append("secondary_email", data.email);
      formData.append(
        "DOB",
        `${year}-${formatWithLeadingZero(month)}-${formatWithLeadingZero(
          day
        )}T00:00:00.000Z`
      );

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
        setOpen(false);
        navigate("/");
        showToast("Update success");
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
  };

  // const [usernameInput, setUsernameInput] = useState("");
  // const [emailInput, setEmailInput] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState({
  //   username: false,
  //   email: false,
  //   dob: false,
  // });
  // const [day, setDay] = useState("");
  // const [month, setMonth] = useState("");
  // const [year, setYear] = useState("");

  // const handleUpdateUsername = async () => {
  //   if (usernameInput === "") {
  //     setIsError((prev) => ({
  //       ...prev,
  //       username: true,
  //     }));
  //     return;
  //   }

  //   if (emailInput === "") {
  //     setIsError((prev) => ({
  //       ...prev,
  //       email: true,
  //     }));
  //     return;
  //   }

  //   if (day === "" || month === "" || year === "") {
  //     setIsError((prev) => ({
  //       ...prev,
  //       dob: true,
  //     }));
  //     return;
  //   }

  //   setIsError({
  //     username: false,
  //     email: false,
  //     dob: false,
  //   });
  //   setIsLoading(true);
  //   try {
  //     const { data } = await axios.put(`${BASE_URL}/update-profile`, {
  //       userId: userInfo._id,
  //       username: usernameInput,
  //       secondary_email: emailInput,
  //       DOB: `${year}-${formatWithLeadingZero(month)}-${formatWithLeadingZero(
  //         day
  //       )}T00:00:00.000Z`,
  //     });

  //     console.log("updated", data);
  //     localStorage.setItem("userInfo", encryptData(data.user));
  //     showToast(data.message);
  //     setOpen(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setIsLoading(false);
  // };

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[800, 800]}
        initialSnap={1}
        disableDrag
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
            <Sheet.Scroller draggableAt="both" className="mx-7">
              {/* Some content here that makes the sheet content scrollable */}
              <h1 className="text-secondary text-lg font-bold">
                Complete your registration
              </h1>
              <p className="text-xs text-gray-second mt-3">
                You need to provide your own information to be use in
                application.
              </p>

              <form
                className="flex flex-col gap-3 mt-3"
                onSubmit={handleSubmit(onSubmit)}
              >
                <ImageInput onChange={(file) => setValue("profileImg", file)} />

                <Input
                  isBorder
                  label="User Name"
                  type="text"
                  inputProps={{ ...register("userName") }}
                  isBorderRed={errors.userName !== undefined}
                  errorMessage={errors.userName?.message}
                />

                <Input
                  isBorder
                  label="Email"
                  type="email"
                  inputProps={{ ...register("email") }}
                  isBorderRed={errors.email !== undefined}
                  errorMessage={errors.email?.message}
                />

                <div className="flex items-center justify-between">
                  <p className="text-gray">Date of Birth</p>
                  {isDOBError && (
                    <p className="text-xs text-red-500">
                      Date of Birth is required
                    </p>
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
                      Save
                    </Button>
                  </div>
                )}
              </form>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};

export default UserNameBottomSheet;
