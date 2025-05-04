import { Device } from "@capacitor/device";
import { IonIcon } from "@ionic/react";
import {
  arrowBackOutline,
  calendarOutline,
  extensionPuzzleOutline,
  logOutOutline,
  settingsOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmBottomSlider from "../../components/bottomSheets/ConfirmBottomSlider";
import showToast from "../../libs/toastUtil";
import { getLoginUser } from "../../libs/userUtils";
import { UserType } from "../../types/userType";
import profileImg from "/images/stylist.jpeg";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const [isConfirmSliderOpen, setIsConfirmSliderOpen] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);

  // check device platform
  useEffect(() => {
    const fetchPlatform = async () => {
      const info = await Device.getInfo();
      setPlatform(info.platform); // 'ios', 'android', 'web'
    };
    fetchPlatform();

    const user = getLoginUser();
    if (user) {
      setUserInfo(user);
    }
  }, []);

  useEffect(() => {
    const user = getLoginUser();
    if (user) {
      setUserInfo(user);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("userInfo");
    navigate("/");
    showToast("logout success");
    toast.success("logout success");
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
            My Profile
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

      {/* action card list */}
      <div className="grid grid-cols-2 gap-5 m-5">
        <CardItem
          title="My Booking"
          icon={calendarOutline}
          onClick={() => navigate("booking")}
        />
        <CardItem
          title="My Stamps"
          icon={extensionPuzzleOutline}
          onClick={() => navigate("my-stamps")}
        />
        {platform === "ios" && (
          <CardItem
            title="Setting"
            icon={settingsOutline}
            onClick={() => navigate("settings")}
          />
        )}

        {/* <CardItem title="Payment Method" icon={cardOutline} /> */}
        {/* <CardItem title="Notification" icon={notificationsOutline} /> */}
        <CardItem
          title="Logout"
          icon={logOutOutline}
          onClick={() => setIsConfirmSliderOpen(true)}
        />
      </div>

      {isConfirmSliderOpen && (
        <ConfirmBottomSlider
          variant="error"
          isOpen={isConfirmSliderOpen}
          setOpen={(value) => {
            setIsConfirmSliderOpen(value);
          }}
          title="Logout?"
          description="sure to logout?"
          actionButtonText="Logout"
          actionButtonHandler={handleLogout}
        />
      )}
    </>
  );
};

export default ProfileScreen;

interface CardItemProps {
  title: string;
  icon: string;
  onClick?: () => void;
}
export const CardItem = ({ title, icon, onClick }: CardItemProps) => {
  return (
    <div
      className="bg-white flex flex-col items-center justify-center gap-3 p-5 rounded-xl shadow"
      onClick={onClick}
    >
      <div className="w-[45px] h-[45px] rounded-full bg-primary-second flex items-center justify-center">
        <IonIcon icon={icon} className="size-6" />
      </div>
      <p className="text-secondary font-semibold text-sm text-center">
        {title}
      </p>
    </div>
  );
};
