import { Browser } from "@capacitor/browser";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import {
  calendarOutline,
  callOutline,
  chatbubbleOutline,
  chevronForwardOutline,
  locationOutline,
  logoFacebook,
  logoInstagram,
  logoTiktok,
  mailOutline,
  timeOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { BASE_URL } from "../../constants/baseUrl";
import { getLoginUser } from "../../libs/userUtils";
import { BusinessType } from "../../types/businessType";

const ChatHomeScreen = () => {
  const navigate = useNavigate();
  const userInfo = getLoginUser();
  const [businessData, setBusinessData] = useState<BusinessType>();

  const getBusinessData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/business-config`);
      console.log(data);
      setBusinessData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBusinessData();
  }, []);

  return (
    <div className="pt-15 pb-5 mx-5 overflow-y-scroll no-scrollbar">
      <div className="flex items-center gap-3">
        {/* <IonIcon icon={arrowBackOutline} className="size-5" /> */}
        <p className="text-lg font-semibold">Follow Us</p>
      </div>

      {/* open hour */}
      <div className="mt-5 bg-white shadow p-5 rounded-lg flex flex-col gap-3">
        {/* closing hours */}
        <div className="flex items-center gap-3">
          <div className="w-[30px] h-[30px] rounded-full bg-primary-second flex items-center justify-center p-1">
            <IonIcon icon={timeOutline} className="size-5 text-gray" />
          </div>
          <p className="text-sm font-semibold">
            Open Hour : {businessData?.from} - {businessData?.to}
          </p>
        </div>

        {/* closing days */}
        <div className="flex items-center gap-3">
          <div className="w-[30px] h-[30px] rounded-full bg-primary-second flex items-center justify-center p-1">
            <IonIcon icon={calendarOutline} className="size-5 text-gray" />
          </div>
          <p className="text-sm font-semibold">
            Closed in : {businessData?.closingDays.join(", ")}
          </p>
        </div>
      </div>

      {/* social cards */}
      <div className="grid grid-cols-2 gap-5 mt-5">
        <SocialCard
          name="Facebook"
          icon={logoFacebook}
          onClick={() => {
            Browser.open({
              url: "https://www.facebook.com/barbiesstudio24?mibextid=wwXIfr&mibextid=wwXIfr",
            });
          }}
        />
        <SocialCard
          name="Instagram"
          icon={logoInstagram}
          onClick={() => {
            Browser.open({
              url: "https://www.instagram.com/barbiesstudio24?igsh=MW5hdXhkMzV4NTRiNw==",
            });
          }}
        />
        <SocialCard
          name="Tiktok"
          icon={logoTiktok}
          onClick={() => {
            Browser.open({
              url: "https://www.tiktok.com/@barbies.studio?_t=ZS-8wawDHkkfK6&_r=1",
            });
          }}
        />

        <SocialCard
          name="Map"
          icon={locationOutline}
          onClick={() => {
            Browser.open({
              url: "https://maps.app.goo.gl/vmFGiXTosr1jZTTa9",
            });
          }}
        />
        <SocialCard
          name="Phone"
          icon={callOutline}
          onClick={() => {
            window.location.href = "tel:09945566776";
          }}
        />
        <SocialCard
          name="Mail"
          icon={mailOutline}
          onClick={() => {
            window.location.href = "mailto:barbiestudio@gmail.com";
          }}
        />
      </div>

      {/* button */}
      <div className="flex items-center justify-center mt-10">
        <Button
          type="button"
          variant="primary"
          leftIcon={chatbubbleOutline}
          rightIcon={chevronForwardOutline}
          className="mt-10"
          onClick={() => {
            if (userInfo === null) {
              navigate("/login");
            } else {
              navigate("/chat");
            }
          }}
        >
          {userInfo === null ? "Login to Live Chat" : "Contact Live Chat"}
        </Button>
      </div>
    </div>
  );
};

export default ChatHomeScreen;

type SocialCardType = {
  icon: string;
  name: string;
  onClick: () => void;
};
const SocialCard = ({ icon, name, onClick }: SocialCardType) => {
  return (
    <div
      className="bg-white shadow p-3 rounded-lg flex flex-col items-center gap-3"
      onClick={onClick}
    >
      <div className="w-[30px] h-[30px] rounded-full bg-primary-second flex items-center justify-center p-1">
        <IonIcon icon={icon} className="size-5 text-gray" />
      </div>
      <p className="text-sm font-semibold">{name}</p>
    </div>
  );
};
