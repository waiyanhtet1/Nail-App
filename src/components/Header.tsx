import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/baseUrl";
import { getLoginUser } from "../libs/userUtils";
import profileImg from "/images/default-profile.jpg";
import logo from "/images/logo.png";

const Header = () => {
  const userInfo = getLoginUser();
  const navigate = useNavigate();

  return (
    <div className="h-max rounded-b-[2.5rem] bg-primary shadow-lg p-5">
      <div className="flex items-center justify-between mb-1">
        {/* logo and name */}
        <div className="flex items-center">
          <img src={logo} alt="" className="h-[70px]" />
          <div className="text-gray">
            <p className="font-beauty text-2xl">Barbie’s Studio</p>
            <p className="uppercase text-[10px]">nail bar</p>
          </div>
        </div>

        {/* user profile or auth buttons */}
        {userInfo ? (
          <div className="flex items-center gap-3">
            {/* <IonIcon icon={notificationsOutline} className="text-gray size-6" /> */}
            <div
              className="w-[40px] h-[40px] rounded-full bg-gray-third flex items-center justify-center"
              onClick={() => navigate("/profile")}
            >
              {/* <IonIcon icon={personOutline} className="text-white size-5" /> */}
              <img
                src={
                  userInfo && userInfo.profileImage !== null
                    ? `${BASE_URL}${userInfo.profileImage}`
                    : profileImg
                }
                className="w-full h-full object-cover rounded-full"
                alt=""
              />
            </div>
          </div>
        ) : (
          <p
            className="text-xs text-secondary font-semibold border border-secondary px-2 py-1 rounded-lg"
            onClick={() => navigate("/login")}
          >
            Login/Register
          </p>
        )}
      </div>

      {/* <SearchInput /> */}
    </div>
  );
};

export default Header;
