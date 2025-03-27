import { IonIcon } from "@ionic/react";
import {
  arrowBackOutline,
  calendarOutline,
  cardOutline,
  extensionPuzzleOutline,
  logOutOutline,
  notificationsOutline,
  settingsOutline,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import showToast from "../libs/toastUtil";
import profileImg from "/images/stylist.jpeg";

const ProfileScreen = () => {
  const navigate = useNavigate();

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
          <div className="flex flex-col gap-2 text-secondary">
            <p className="font-semibold text-lg">Name: Su Mon</p>
            <p className="font-light">0912345678</p>
            <p className="px-5 py-1 w-max text-white bg-gray text-sm rounded-lg">
              Edit
            </p>
          </div>
        </div>
      </div>

      {/* action card list */}
      <div className="grid grid-cols-2 gap-5 m-5">
        <CardItem title="My Booking" icon={calendarOutline} />
        <CardItem title="My Stamps" icon={extensionPuzzleOutline} />
        <CardItem title="Setting" icon={settingsOutline} />
        <CardItem title="Payment Method" icon={cardOutline} />
        <CardItem title="Notification" icon={notificationsOutline} />
        <CardItem
          title="Logout"
          icon={logOutOutline}
          onClick={() => {
            localStorage.removeItem("userInfo");
            navigate("/");
            showToast("logout success");
          }}
        />
      </div>
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
