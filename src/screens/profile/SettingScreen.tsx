import { IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import Loading from "../../components/Loading";
import { BASE_URL } from "../../constants/baseUrl";
import showToast from "../../libs/toastUtil";
import { getLoginUser } from "../../libs/userUtils";
import { UserType } from "../../types/userType";
import profileImg from "/images/default-profile.jpg";

const SettingScreen = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const [isDeleteAccountConfirmOpen, setIsDeleteAccountConfirmOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = getLoginUser();
    if (user) {
      setUserInfo(user);
    }
  }, []);

  console.log(userInfo);

  async function handleDeleteAccount() {
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/delete-account`, {
        userId: userInfo?._id,
      });

      localStorage.removeItem("userInfo");
      navigate("/");
      showToast("account deactived");
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <>
      <div className="h-[200px] rounded-b-[2.5rem] bg-primary shadow-lg p-5">
        <div className="flex items-center">
          {/* back and title */}
          <IonIcon
            icon={arrowBackOutline}
            className="size-6"
            onClick={() => navigate(-1)}
          />
          <p className="text-secondary font-bold text-center flex justify-center w-full">
            Settings
          </p>
        </div>

        {/* info */}
        <div className="flex items-center gap-5 m-5">
          <img
            src={profileImg}
            alt=""
            className="w-[80px] h-[80px] object-cover rounded-full"
          />
          <div className="flex flex-col text-secondary">
            <p className="font-semibold text-lg">{userInfo?.username}</p>
            {/* <p className="font-light">{userInfo.phone}</p> */}
            <p className="font-light">{userInfo?.email}</p>
            {/* <p
              className="px-5 py-1 w-max text-white bg-gray text-sm rounded-lg mt-3"
              onClick={() => navigate("edit")}
            >
              Edit
            </p> */}
          </div>
        </div>
      </div>

      {/* action list */}
      <div className="mt-10 mx-5">
        {/* delete account for ios */}
        {isLoading ? (
          <Loading />
        ) : isDeleteAccountConfirmOpen ? (
          <div className="border border-secondary bg-white rounded-xl p-4 flex flex-col gap-3 text-center">
            <p className="font-semibold text-lg">Sure to delete account?</p>
            <p className="font-light">
              Please confirm to delete your account. As a reminder, your data
              can’t be restored once the account is deleted.
            </p>

            <div className="w-full flex items-center gap-3">
              <ActionButton
                variant="outline"
                size="md"
                type="button"
                className="w-full"
                onClick={() => setIsDeleteAccountConfirmOpen(false)}
              >
                Cancel
              </ActionButton>
              <ActionButton
                variant="error"
                size="md"
                type="button"
                className="w-full"
                onClick={handleDeleteAccount}
              >
                Delete
              </ActionButton>
            </div>
          </div>
        ) : (
          <div
            className="border border-secondary rounded-lg p-3 flex items-center justify-between
      text-sm
      "
            onClick={() => setIsDeleteAccountConfirmOpen(true)}
          >
            <p>Delete my account</p>
            <p className="text-red-500 font-semibold">Delete</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SettingScreen;
